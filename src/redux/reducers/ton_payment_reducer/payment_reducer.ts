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
		//const mnemonic = await tonMnemonic.generateMnemonic();
		const mnemonic = [
			'type',
			'vacuum',
			'fine',
			'spider',
			'jaguar',
			'daring',
			'noodle',
			'traffic',
			'broken',
			'main',
			'pottery',
			'seven',
			'kiss',
			'abuse',
			'athlete',
			'duty',
			'machine',
			'fabric',
			'arrange',
			'purchase',
			'wrap',
			'gauge',
			'sheriff',
			'innocent',
		];
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

export const fetchBalance = createAsyncThunk(
	'Fetch toncoins',
	async (thunkAPI: any) => {
		try {
			const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
			const apiKey = process.env.api_key;
			const tonweb = new TonWeb(
				new TonWeb.HttpProvider(providerUrl, { apiKey }),
			); // Initialize TON SDK
			const balance = await tonweb.getBalance(
				thunkAPI.getState().myWalletAddress,
			);
			console.log(balance);
			return {
				balance,
			};
		} catch (error) {
			console.log('Cant fetch balance: ', error);
		}
	},
);

export const createPaymentChannel = createAsyncThunk(
	'Create Payment Channel',
	async (action: any, thunkAPI: any) => {
		try {
			console.log('Creating channel');
			console.log(action);
			const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
			const apiKey = process.env.api_key;
			const tonweb = new TonWeb(
				new TonWeb.HttpProvider(providerUrl, { apiKey }),
			); // Initialize TON SDK

			const hisWallet = tonweb.wallet.create({
				publicKey: action.hisPublicKey,
			});

			const hisWalletAddress = await hisWallet.getAddress(); // address of this wallet in blockchain

			const channelInitState = {
				balanceA: action.isBuyer ? toNano(action.myBalance) : toNano(0),
				balanceB: action.isBuyer ? toNano(0) : toNano(action.hisBalance),
				seqnoA: new BN(0),
				seqnoB: new BN(0),
			};

			const channelConfig = {
				channelId: new BN(action.channelNumber),
				addressA: action.isBuyer
					? thunkAPI.getState().tonweb.myWalletAddress
					: hisWalletAddress,
				addressB: action.isBuyer
					? hisWalletAddress
					: thunkAPI.getState().tonweb.myWalletAddress,
				initBalanceA: channelInitState.balanceA,
				initBalanceB: channelInitState.balanceB,
			};

			//isA must be false if user its the invited one to establish the channel, so the buyer its the true state

			const channel = tonweb.payments.createChannel({
				...channelConfig,
				isA: action.isBuyer,
				myKeyPair: thunkAPI.getState().tonweb.myKeyPair,
				hisPublicKey: action.hisPublicKey,
			});

			console.log('Created channel');
			console.log(channel);

			const mySecretKey = thunkAPI.getState().myKeyPair.secretKey;
			const myWallet = tonweb.wallet.create({
				publicKey: thunkAPI.getState().myKeyPair.publicKey,
			});

			const fromWallet = channel.fromWallet({
				wallet: myWallet,
				secretKey: mySecretKey,
			});

			const data = await channel.getData();

			console.log('Adquired data');
			console.log(data);

			if (action.isBuyer) {
				if (!data.publicKeyA) {
					console.log('Deploy');
					await fromWallet.deploy().send(toNano('0.05'));
					console.log('TopUp');
					await fromWallet
						.topUp({ coinsA: channelInitState.balanceA, coinsB: new BN(0) })
						.send(channelInitState.balanceA.add(toNano('0.05'))); // +0.05 TON to network fees
					console.log('Initialization');
					await fromWallet.init(channelInitState).send(toNano('0.05'));
				}
			}

			return {
				channel,
				fromWallet,
			};
		} catch (error) {
			console.log('Cant Perform Action: ', error);
		}
	},
);

export const updateChannel = createAsyncThunk(
	'Update payment channel and sign',
	async (action: any, thunkAPI: any) => {
		try {
			console.log(action);
			const channel = thunkAPI.getState().currentChannel;

			const signature = action.signature;

			const data = await channel.getData();

			const seqnoA = await data.seqnoA.toString();
			const seqnoB = await data.seqnoB.toString();

			const mySeqno = action.isBuyer ? new BN(seqnoA) : new BN(seqnoB);
			const hisSeqno = action.isBuyer ? seqnoB : seqnoA;
			const hisSeqnoString = hisSeqno.toString();
			const hisSeqnoNumber = (await hisSeqnoString.toNumber()) + 1;
			const hisSeqnoFinal = new BN(hisSeqnoNumber.toString()); //the one that sends payment requests is the invited not the buyer, and its always the userB

			const channelState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance)
					: toNano(action.hisBalance),
				balanceB: action.isBuyer
					? toNano(action.hisBalance)
					: toNano(action.myBalance),
				seqnoA: action.isBuyer ? mySeqno : hisSeqnoFinal,
				seqnoB: action.isBuyer ? hisSeqnoFinal : mySeqno,
			};

			if (!(await channel.verifyState(channelState, signature))) {
				throw new Error('Invalid A signature');
			}

			console.log('valid signature');

			const newSignature = await channel.signState(channelState);
			return newSignature; //both users needs to save the signatures whenever the sign, so the channel can be emergency cancelled if they want.
		} catch (error) {
			console.log('Cant Perform Action: ', error);
		}
	},
);

//The hackaton specifies that the users have good intentions, so only in this case the users wont need to check the updates of the channel they will sign.
export const verifyState = createAsyncThunk(
	'Sign payment channel update',
	async (action: any, thunkAPI: any) => {
		try {
			console.log(action);
			const channel = thunkAPI.getState().currentChannel;

			const signature = action.signature;

			const data = await channel.getData();

			const seqnoA = await data.seqnoA.toString();
			const seqnoB = await data.seqnoB.toString();

			const mySeqno = action.isBuyer ? new BN(seqnoA) : new BN(seqnoB);
			const hisSeqno = action.isBuyer ? seqnoB : seqnoA;
			const hisSeqnoString = hisSeqno.toString();
			const hisSeqnoNumber = (await hisSeqnoString.toNumber()) + 1;
			const hisSeqnoFinal = new BN(hisSeqnoNumber.toString()); //the one that sends payment requests is the invited not the buyer, and its always the userB

			const channelState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance)
					: toNano(action.hisBalance),
				balanceB: action.isBuyer
					? toNano(action.hisBalance)
					: toNano(action.myBalance),
				seqnoA: action.isBuyer ? mySeqno : hisSeqnoFinal,
				seqnoB: action.isBuyer ? hisSeqnoFinal : mySeqno,
			};

			if (!(await channel.verifyState(channelState, signature))) {
				throw new Error('Invalid A signature');
			}

			console.log('valid signature');

			return true; // return true if the signature its verified but the user dont want to sign yet
		} catch (error) {
			console.log('Cant Perform Action: ', error);
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
				state.currentChannel = action.payload?.channel;
				state.fromWallet = action.payload?.fromWallet;
			})
			.addCase(fetchBalance.fulfilled, (state: any, action) => {
				state.balance = action.payload?.balance;
			});
	},
});

export const tonReducer = tonSlice.reducer;
export const { disconnectWallet } = tonSlice.actions;
