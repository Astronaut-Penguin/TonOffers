import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import TonWeb from 'tonweb';
import tonMnemonic from 'tonweb-mnemonic';

const BN = TonWeb.utils.BN;
const toNano = TonWeb.utils.toNano;

export const initTon = createAsyncThunk(
	'Init Tonweb',
	async (action, thunkAPI) => {
		const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
		const apiKey = process.env.api_key;
		const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, { apiKey })); // Initialize TON SDK
		return {
			tonweb: tonweb,
		};
	},
);

export const connectWallet = createAsyncThunk(
	'Connect Wallet',
	async (action, thunkAPI: any) => {
		const tonweb = thunkAPI.getState().tonweb;
		const mnemonic = await tonMnemonic.generateMnemonic();
		const myKeyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
		const publicKey = myKeyPair.publicKey;

		const myWallet = tonweb.wallet.create({
			publicKey: publicKey,
		});

		const myWalletAddress = await myWallet.getAddress(); // address of this wallet in blockchain
		console.log('walletAddress = ', myWalletAddress.toString(true, true, true));

        const balance = await tonweb.getBalance(myWalletAddress)

		return {
			myWalletAddress: myWalletAddress,
			myKeyPair: myKeyPair,
            balance: balance
		};
	},
);

export const createPaymentChannel = createAsyncThunk(
	'Create Payment Channel',
	async (action: any, thunkAPI: any) => {
		const tonweb = thunkAPI.getState().tonweb;

		const hisWallet = tonweb.wallet.create({
			publicKey: action.payload.hisPublicKey,
		});

		const hisWalletAddress = await hisWallet.getAddress(); // address of this wallet in blockchain

		const channelInitState = {
			balanceA: action.payload.isContractor ? toNano(action.payload.myBalance) : toNano(0),
			balanceB: action.payload.isContractor ? toNano(0) : toNano(action.payload.hisBalance),
			seqnoA: new BN(0),
			seqnoB: new BN(0),
		};

		const channelConfig = {
			channelId: new BN(action.payload.channelNumber),
			addressA: action.payload.isContractor ? thunkAPI.getState().tonweb.myWalletAddress : hisWalletAddress,
			addressB: action.payload.isContractor ? hisWalletAddress : thunkAPI.getState().tonweb.myWalletAddress,
			initBalanceA: channelInitState.balanceA,
			initBalanceB: channelInitState.balanceB,
		};

		//isA must be false if user its the invited one to establish the channel, so the contractor its the true state

		const channel = tonweb.payments.createChannel({
			...channelConfig,
			isA: action.payload.isContractor,
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

        if(action.payload.isContractor){
            if(!data.publicKeyA){
                await fromWallet.deploy().send(toNano('0.05'));
                await fromWallet
                .topUp({coinsA: channelInitState.balanceA, coinsB: new BN(0)})
                .send(channelInitState.balanceA.add(toNano('0.05'))); // +0.05 TON to network fees
                await fromWallet.init(channelInitState).send(toNano('0.05'));
            }
        }

		return {
			currentChannel: channel,
            fromWallet: fromWallet,
		};
	},
);

export const updateChannel = createAsyncThunk(
	'Update payment channel and sign',
	async (action: any, thunkAPI: any) => {
		const channel = thunkAPI.getState().currentChannel;

        const data = await channel.getData();

        const seqnoBString = await data.seqnoB.toString();
        const seqnoBNumber = await seqnoBString.toNumber() + 1;
        const seqnoA = new BN(data.seqnoA.toString());
        const seqnoB = new BN(seqnoBNumber.toString()); //the one that sends payment requests is the invited not the contractor, and its always the userB

		const channelState = {
			balanceA: toNano(action.payload.contractorBalance),
			balanceB: toNano(action.payload.invitedBalance),
			seqnoA: seqnoA,
			seqnoB: seqnoB,
		};

		const signature = await channel.signState(channelState);

        return signature;
	},
);

//The hackaton specifies that the users have good intentions, so only in this case the users wont need to check the updates of the channel they will sign.
export const verifyState = createAsyncThunk(
	'Sign payment channel update',
	async (action: any, thunkAPI: any) => {
		const channel = thunkAPI.getState().currentChannel;

		const signature = action.payload.signature;

        const data = await channel.getData();

        const seqnoBString = await data.seqnoB.toString();
        const seqnoBNumber = await seqnoBString.toNumber() + 1;
        const seqnoA = new BN(data.seqnoA.toString());
        const seqnoB = new BN(seqnoBNumber.toString()); //the one that sends payment requests is the invited not the contractor, and its always the userB

		const channelState = {
			balanceA: toNano(action.payload.contractorBalance),
			balanceB: toNano(action.payload.invitedBalance),
			seqnoA: seqnoA,
			seqnoB: seqnoB,
		};

		
        if (!(await channel.verifyState(channelState, signature))) {
            throw new Error('Invalid A signature');
        }

        if(action.payload.needSign){
            const newSignature = await channel.signState(channelState);
            return  newSignature; //both users needs to save the signatures whenever the sign, so the channel can be emergency cancelled if they want.
        }else{
            return true; // return true if the signature its verified but the user dont want to sign yet
        } 
	},
);

const tonSlice = createSlice({
	name: 'tonReducer',
	initialState: {
		balance: 0,
		enabled: <null | boolean> null,
		myWalletAddress: <null | string> null,
		myKeyPair: <null | any> null,
		tonweb: <null | TonWeb> null,
        fromWallet: <null | any> null,
        currentChannel: <null | any> null,
	},
	reducers: {
		disconnectWallet: (state: any) => {
			state.connected = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(initTon.rejected, (state: any) => {
				state.tonWeb = null;
			})
			.addCase(initTon.fulfilled, (state: any, action: any) => {
				state.tonWeb = action.payload.ton;
			})
			.addCase(connectWallet.fulfilled, (state, action) => {
				state.myKeyPair = action.payload.myKeyPair;
				state.myWalletAddress = action.payload.myWalletAddress;
                state.balance = action.payload.balance;
			})
			.addCase(createPaymentChannel.fulfilled, (state: any, action) => {
				state.currentChannel = action.payload.currentChannel;
                state.fromWallet = action.payload.fromWallet;
			});
	},
});

export const tonReducer = tonSlice.reducer;
export const { disconnectWallet } = tonSlice.actions;
