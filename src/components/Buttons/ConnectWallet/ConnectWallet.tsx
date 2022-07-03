// REACT
import React from 'react';

// STYLE
import styles from './ConnectWallet.module.css';

// BOOTSTRAP COMPONENTS
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
	disconnectWallet,
	fetchBalance,
	initSession,
} from '../../../redux/reducers/ton_payment_reducer/payment_reducer';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Store } from 'react-notifications-component';

// Props
type ConnectWalletProps = {
	style?: React.CSSProperties;
	open: boolean;
};

const ConnectWallet: React.FC<ConnectWalletProps> = ({ open }) => {
	///////////////
	// FUNCTIONS //
	///////////////
	const { connected, balance, myWalletAddress } = useAppSelector(
		(state) => state.ton,
	);
	const dispatch = useAppDispatch();

	const buttonText = 'Connect Wallet';
	const address = connected
		? myWalletAddress!.toString(true, true, true).slice(0, 6) +
		  '...' +
		  myWalletAddress!.toString(true, true, true).slice(42, 48)
		: '';

	const balanceFixed = Number(balance);
	const balanceInGrams = balanceFixed / 10 ** 9;


	const interval = setInterval(async ()=>{
		if(connected){
			await dispatch(fetchBalance())
		}
		return () => {
			clearInterval(interval);
		};
	},15000)

	////////////
	// RENDER //
	////////////
	return (
		<>
			{connected && (
				<Button className={styles.BalanceButton}>
					{'Toncoin balance: ' + balanceInGrams.toString()}
				</Button>
			)}
			<Button
				className={styles.ConnectButton}
				onClick={async () => {
					if (!connected) {
						await dispatch(initSession());
						setTimeout(()=> {
							Store.addNotification({
								title: 'We created a wallet for you.',
								message:
									'Please send funds to this wallet so you can test our dApp',
								type: 'info',
								insert: 'top',
								container: 'top-center',
								animationIn: ['animate__animated', 'animate__fadeIn'],
								animationOut: ['animate__animated', 'animate__fadeOut'],
								dismiss: {
									duration: 10000,
									onScreen: true,
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
						},500)
					} else {
						dispatch(disconnectWallet());
					}
				}}
				aria-expanded={open}
			>
				{connected ? address : buttonText}
			</Button>
		</>
	);
};

export default ConnectWallet;
