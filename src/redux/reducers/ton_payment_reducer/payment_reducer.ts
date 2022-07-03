import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Store } from 'react-notifications-component';

const TonWeb = require('tonweb');
const tonMnemonic = require('tonweb-mnemonic');
import { Address } from 'tonweb/dist/types/utils/address';

const BN = TonWeb.utils.BN;
const toNano = TonWeb.utils.toNano;

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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
	async (action, thunkAPI: any) => {
		try {
			const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
			const apiKey = process.env.api_key;
			const tonweb = new TonWeb(
				new TonWeb.HttpProvider(providerUrl, { apiKey }),
			); // Initialize TON SDK
			const balance = await tonweb.getBalance(
				thunkAPI.getState().ton.myWalletAddress,
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
			const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
			const apiKey = process.env.api_key;
			const tonweb = new TonWeb(
				new TonWeb.HttpProvider(providerUrl, { apiKey }),
			); // Initialize TON SDK

			await delay(1000);

			const hisWallet = tonweb.wallet.create({
				publicKey: tonweb.utils.hexToBytes(action.hisPublicKey),
			});

			const hisWalletAddress = await hisWallet.getAddress(); // address of this wallet in blockchain

			console.log('Created wallet');
			const channelInitState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance.toString())
					: toNano('0'),
				balanceB: action.isBuyer
					? toNano('0')
					: toNano(action.hisBalance.toString()),
				seqnoA: new BN(0),
				seqnoB: new BN(0),
			};
			console.log('Created init');
			const channelConfig = {
				channelId: new BN(action.channelNumber),
				addressA: action.isBuyer
					? thunkAPI.getState().ton.myWalletAddress
					: hisWalletAddress,
				addressB: action.isBuyer
					? hisWalletAddress
					: thunkAPI.getState().ton.myWalletAddress,
				initBalanceA: channelInitState.balanceA,
				initBalanceB: channelInitState.balanceB,
			};
			console.log('Created config');
			//isA must be false if user its the invited one to establish the channel, so the buyer its the true state

			const channel = tonweb.payments.createChannel({
				...channelConfig,
				isA: action.isBuyer,
				myKeyPair: thunkAPI.getState().ton.myKeyPair,
				hisPublicKey: tonweb.utils.hexToBytes(action.hisPublicKey),
			});
			console.log('Created channel');
			console.log(channel);

			await delay(1000);

			const mySecretKey = thunkAPI.getState().ton.myKeyPair.secretKey;
			console.log('Got Keys');
			const myWallet = tonweb.wallet.create({
				publicKey: thunkAPI.getState().ton.myKeyPair.publicKey,
			});

			await delay(1000);

			const fromWallet = channel.fromWallet({
				wallet: myWallet,
				secretKey: mySecretKey,
			});
			console.log('Created From wallet');

			try {
				console.log('Adquiring data');
				await delay(1500);
				const data = await channel.getData();
				console.log(data);
			} catch (error: any) {
				if (action.isBuyer) {
					await delay(1500);

					console.log('Deploying');

					await fromWallet.deploy().send(toNano('0.05'));

					await delay(1500);

					console.log(await channel.getChannelState());

					await delay(1500);

					console.log('TopUping');

					await fromWallet
						.topUp({
							coinsA: action.isBuyer ? channelInitState.balanceA : new BN(0),
							coinsB: action.isBuyer ? new BN(0) : channelInitState.balanceA,
						})
						.send(
							action.isBuyer
								? channelInitState.balanceA.add(toNano('0.05'))
								: channelInitState.balanceB.add(toNano('0.05')),
						); // +0.05 TON to network fees

					await delay(1500);

					console.log('Initializing');

					await fromWallet.init(channelInitState);
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
			console.log('starting the channel update');
			const channel = thunkAPI.getState().ton.currentChannel;
			const data = await channel.getData();
			console.log('got data');
			const seqnoA = action.isBuyer
				? action.mySeqno.toString()
				: action.hisSeqno.toString();
			const seqnoB = action.isBuyer
				? action.hisSeqno.toString()
				: action.mySeqno.toString();
			console.log('got seqnos');
			const channelState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance.toString())
					: toNano(action.hisBalance.toString()),
				balanceB: action.isBuyer
					? toNano(action.hisBalance.toString())
					: toNano(action.myBalance.toString()),
				seqnoA: action.isBuyer ? seqnoA : seqnoB,
				seqnoB: action.isBuyer ? seqnoA : seqnoB,
			};

			console.log('signing');
			const newSignature = await channel.signState(channelState);
			console.log(newSignature);
			try {
				await channel.verifyState(channelState, newSignature);
			} catch (error: any) {
				console.error(error);
			}
			console.log('valid signature'); //both users needs to save the signatures whenever the sign, so the channel can be emergency cancelled if they want.
			Store.addNotification({
				title: 'Channel update signed',
				message:
					'Click this notification to copy to clipboard the signature and share it with the another part of the channel',
				type: 'info',
				insert: 'top',
				container: 'top-center',
				animationIn: ['animate__animated', 'animate__fadeIn'],
				animationOut: ['animate__animated', 'animate__fadeOut'],
				dismiss: {
					duration: 10000,
					onScreen: true,
					pauseOnHover: true,
				},
				onRemoval: () => {
					navigator.clipboard.writeText(newSignature);
					Store.addNotification({
						title: 'Signature copied to your clipboard',
						message:
							'Now share it, if its signed then the payment has no way back',
						type: 'success',
						insert: 'top',
						container: 'top-right',
						animationIn: ['animate__animated', 'animate__fadeIn'],
						animationOut: ['animate__animated', 'animate__fadeOut'],
						dismiss: {
							duration: 10000,
							onScreen: true,
							pauseOnHover: true,
						},
						touchSlidingExit: {
							swipe: {
								duration: 400,
								timingFunction: 'ease-out',
								delay: 0,
							},
							fade: {
								duration: 400,
								timingFunction: 'ease-out',
								delay: 0,
							},
						},
					});
				},
				touchSlidingExit: {
					swipe: {
						duration: 400,
						timingFunction: 'ease-out',
						delay: 0,
					},
					fade: {
						duration: 400,
						timingFunction: 'ease-out',
						delay: 0,
					},
				},
			});
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
			console.log('verifying');
			const channel = thunkAPI.getState().ton.currentChannel;

			const signature = new Uint8Array(action.signature);
			console.log('builded signature');
			const data = await channel.getData();

			const seqnoA = action.isBuyer
				? action.mySeqno.toString()
				: action.hisSeqno.toString();
			const seqnoB = action.isBuyer
				? action.hisSeqno.toString()
				: action.mySeqno.toString();
			const channelState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance.toString())
					: toNano(action.hisBalance.toString()),
				balanceB: action.isBuyer
					? toNano(action.hisBalance.toString())
					: toNano(action.myBalance.toString()),
				seqnoA: action.isBuyer ? seqnoA : seqnoB,
				seqnoB: action.isBuyer ? seqnoB : seqnoA,
			};

			console.log('created channel state to verify');

			try {
				await channel.verifyState(channelState, signature);
			} catch (error: any) {
				console.error(error);
			}

			console.log('valid signature');

			return true; // return true if the signature its verified but the user dont want to sign yet
		} catch (error) {
			console.log('Cant Perform Action: ', error);
		}
	},
);

export const closeChannel = createAsyncThunk(
	'Sign payment channel update',
	async (action: any, thunkAPI: any) => {
		try {
			const channel = thunkAPI.getState().ton.currentChannel;
			const fromWallet = thunkAPI.getState().ton.fromWallet;
			const seqnoA = action.isBuyer
				? action.mySeqno.toString()
				: action.hisSeqno.toString();
			const seqnoB = action.isBuyer
				? action.hisSeqno.toString()
				: action.mySeqno.toString();
			const channelState = {
				balanceA: action.isBuyer
					? toNano(action.myBalance.toString())
					: toNano(action.hisBalance.toString()),
				balanceB: action.isBuyer
					? toNano(action.hisBalance.toString())
					: toNano(action.myBalance.toString()),
				seqnoA: action.isBuyer ? seqnoA : seqnoB,
				seqnoB: action.isBuyer ? seqnoB : seqnoA,
			};
			console.log('closing channel');
			const signatureClose = await channel.signClose(channelState);

			try {
				console.log('verifying signature');
				await channel.verifyState(channelState, signatureClose);
			} catch (error: any) {
				console.error(error);
			}
			console.log('sending close');
			await fromWallet
				.close({
					...channelState,
					hisSignature: signatureClose,
				})
				.send(toNano('0.05'));
				console.log('sended');
				Store.addNotification({
					title: 'Channel close request signed',
					message:
						'Click this notification to copy to clipboard the signature and share it with the another part of the channel',
					type: 'info',
					insert: 'top',
					container: 'top-center',
					animationIn: ['animate__animated', 'animate__fadeIn'],
					animationOut: ['animate__animated', 'animate__fadeOut'],
					dismiss: {
						duration: 10000,
						onScreen: true,
						pauseOnHover: true,
					},
					onRemoval: () => {
						navigator.clipboard.writeText(signatureClose);
						Store.addNotification({
							title: 'Signature copied to your clipboard',
							message:
								'Now share it, if its signed then the payment has no way back',
							type: 'success',
							insert: 'top',
							container: 'top-right',
							animationIn: ['animate__animated', 'animate__fadeIn'],
							animationOut: ['animate__animated', 'animate__fadeOut'],
							dismiss: {
								duration: 10000,
								onScreen: true,
								pauseOnHover: true,
							},
							touchSlidingExit: {
								swipe: {
									duration: 400,
									timingFunction: 'ease-out',
									delay: 0,
								},
								fade: {
									duration: 400,
									timingFunction: 'ease-out',
									delay: 0,
								},
							},
						});
					},
					touchSlidingExit: {
						swipe: {
							duration: 400,
							timingFunction: 'ease-out',
							delay: 0,
						},
						fade: {
							duration: 400,
							timingFunction: 'ease-out',
							delay: 0,
						},
					},
				});

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
				console.log('Succesfull connectwallet');
			})
			.addCase(createPaymentChannel.fulfilled, (state: any, action) => {
				state.currentChannel = action.payload?.channel;
				state.fromWallet = action.payload?.fromWallet;
				console.log('Succesfull createPaymentChannel');
			})
			.addCase(fetchBalance.fulfilled, (state: any, action) => {
				state.balance = action.payload?.balance;
				console.log('Succesfull fetchBalance');
			});
	},
});

export const tonReducer = tonSlice.reducer;
export const { disconnectWallet } = tonSlice.actions;
