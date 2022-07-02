import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const TonWeb = require('tonweb');
const tonMnemonic = require('tonweb-mnemonic');
import { Address } from 'tonweb/dist/types/utils/address';

const BN = TonWeb.utils.BN;
const toNano = TonWeb.utils.toNano;

export function toHexString(byteArray: any) {
	return Array.prototype.map
		.call(byteArray, function (byte) {
			return ('0' + (byte & 0xff).toString(16)).slice(-2);
		})
		.join('');
}

export const initSession = createAsyncThunk(
	'Init Tonweb',
	async (action, thunkAPI) => {
		await thunkAPI.dispatch(connectWallet());
	},
);

export const connectWallet = createAsyncThunk(
	'Connect Wallet',
	async (action, thunkAPI: any) => {
		const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
		const apiKey = process.env.api_key;
		const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, { apiKey })); // Initialize TON SDK

		console.log('creating mnemonic');
		const mnemonic = await tonMnemonic.generateMnemonic();
		console.log(mnemonic);
		const myKeyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
		console.log('your public key');
		console.log(toHexString(myKeyPair.publicKey));
		console.log('your private key');
		console.log(toHexString(myKeyPair.secretKey));
		const publicKey = myKeyPair.publicKey;

		const myWallet = tonweb.wallet.create({
			publicKey: publicKey,
		});
		try {
			const myWalletAddress = await myWallet.getAddress(); // address of this wallet in blockchain
			console.log('your address');
			console.log(myWalletAddress.toString(true, true, true));
			console.log('your Toncoin balance:');
			const balance = await tonweb.getBalance(myWalletAddress);
			console.log(balance);

			return {
				myWalletAddress,
				myKeyPair,
				balance,
			};
		} catch (error: any) {
			console.log('Error initializing ton wallet', error);
			throw error;
		}
	},
);

export const createPaymentChannel = createAsyncThunk(
	'Create Payment Channel',
	async (action: any, thunkAPI: any) => {
		console.log(action)
		const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
		const apiKey = process.env.api_key;
		const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, { apiKey })); // Initialize TON SDK

		const hisWallet = tonweb.wallet.create({
			publicKey: action.payload.hisPublicKey,
		});

		const hisWalletAddress = await hisWallet.getAddress(); // address of this wallet in blockchain

		const channelInitState = {
			balanceA: action.payload.isBuyer
				? toNano(action.payload.myBalance)
				: toNano(0),
			balanceB: action.payload.isBuyer
				? toNano(0)
				: toNano(action.payload.hisBalance),
			seqnoA: new BN(0),
			seqnoB: new BN(0),
		};

		const channelConfig = {
			channelId: new BN(action.payload.channelNumber),
			addressA: action.payload.isBuyer
				? thunkAPI.getState().tonweb.myWalletAddress
				: hisWalletAddress,
			addressB: action.payload.isBuyer
				? hisWalletAddress
				: thunkAPI.getState().tonweb.myWalletAddress,
			initBalanceA: channelInitState.balanceA,
			initBalanceB: channelInitState.balanceB,
		};

		//isA must be false if user its the invited one to establish the channel, so the buyer its the true state

		const channel = tonweb.payments.createChannel({
			...channelConfig,
			isA: action.payload.isBuyer,
			myKeyPair: thunkAPI.getState().tonweb.myKeyPair,
			hisPublicKey: action.payload.hisPublicKey,
		});

		const mySecretKey = thunkAPI.getState().myKeyPair.secretKey;
		const myWallet = tonweb.wallet.create({
			publicKey: thunkAPI.getState().myKeyPair.publicKey,
		});

		const fromWallet = channel.fromWallet({
			wallet: myWallet,
			secretKey: mySecretKey,
		});

		const data = await channel.getData();

		if (action.payload.isBuyer) {
			if (!data.publicKeyA) {
				await fromWallet.deploy().send(toNano('0.05'));
				await fromWallet
					.topUp({ coinsA: channelInitState.balanceA, coinsB: new BN(0) })
					.send(channelInitState.balanceA.add(toNano('0.05'))); // +0.05 TON to network fees
				await fromWallet.init(channelInitState).send(toNano('0.05'));
			}
		}

		return {
			channel,
			fromWallet,
		};
	},
);

export const updateChannel = createAsyncThunk(
	'Update payment channel and sign',
	async (action: any, thunkAPI: any) => {
		console.log(action)
		const channel = thunkAPI.getState().currentChannel;

		const data = await channel.getData();

		const hisSeqnoString = await data.hisSeqno.toString();
		const hisSeqnoNumber = (await hisSeqnoString.toNumber()) + 1;
		const mySeqno = new BN(data.mySeqno.toString());
		const hisSeqno = new BN(hisSeqnoNumber.toString()); //the one that sends payment requests is the invited not the buyer, and its always the userB

		const channelState = {
			balanceA: action.payload.isBuyer
				? toNano(action.payload.myBalance)
				: toNano(0),
			balanceB: action.payload.isBuyer
				? toNano(0)
				: toNano(action.payload.hisBalance),
			seqnoA: action.payload.isBuyer ? mySeqno : hisSeqno,
			seqnoB: action.payload.isBuyer ? hisSeqno : mySeqno,
		};

		const signature = await channel.signState(channelState);

		return signature;
	},
);

//The hackaton specifies that the users have good intentions, so only in this case the users wont need to check the updates of the channel they will sign.
export const verifyState = createAsyncThunk(
	'Sign payment channel update',
	async (action: any, thunkAPI: any) => {
		console.log(action)
		const channel = thunkAPI.getState().currentChannel;

		const signature = action.payload.signature;

		const data = await channel.getData();

		const seqnoA = await data.seqnoA.toString();
		const seqnoB = await data.seqnoB.toString();

		const mySeqno = action.payload.isBuyer ? new BN(seqnoA) : new BN(seqnoB);
		const hisSeqno = action.payload.isBuyer ? seqnoB : seqnoA;
		const hisSeqnoString = hisSeqno.toString();
		const hisSeqnoNumber = (await hisSeqnoString.toNumber()) + 1;
		const hisSeqnoFinal = new BN(hisSeqnoNumber.toString()); //the one that sends payment requests is the invited not the buyer, and its always the userB

		const channelState = {
			balanceA: action.payload.isBuyer
				? toNano(action.payload.myBalance)
				: toNano(action.payload.hisBalance),
			balanceB: action.payload.isBuyer
				? toNano(action.payload.hisBalance)
				: toNano(action.payload.myBalance),
			seqnoA: action.payload.isBuyer ? mySeqno : hisSeqnoFinal,
			seqnoB: action.payload.isBuyer ? hisSeqnoFinal : mySeqno,
		};

		if (!(await channel.verifyState(channelState, signature))) {
			throw new Error('Invalid A signature');
		}

		if (action.payload.needSign) {
			const newSignature = await channel.signState(channelState);
			return newSignature; //both users needs to save the signatures whenever the sign, so the channel can be emergency cancelled if they want.
		} else {
			return true; // return true if the signature its verified but the user dont want to sign yet
		}
	},
);

const tonSlice = createSlice({
	name: 'tonReducer',
	initialState: {
		balance: <null | string>null,
		connected: <null | boolean>false,
		myWalletAddress: <null | Address>null,
		myKeyPair: <null | any>null,
		fromWallet: <null | any>null,
		currentChannel: <null | any>null,
	},
	reducers: {
		disconnectWallet: (state: any) => {
			state.connected = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(connectWallet.fulfilled, (state, action) => {
				state.myKeyPair = action.payload.myKeyPair;
				state.myWalletAddress = action.payload.myWalletAddress;
				state.balance = action.payload.balance;
				state.connected = true;
			})
			.addCase(createPaymentChannel.fulfilled, (state: any, action) => {
				state.currentChannel = action.payload.channel;
				state.fromWallet = action.payload.fromWallet;
			});
	},
});

export const tonReducer = tonSlice.reducer;
export const { disconnectWallet } = tonSlice.actions;
