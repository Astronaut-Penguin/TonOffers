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
	const address = connected ? 	myWalletAddress!.toString(true, true, true).slice(0, 6) +
	"..." +
	myWalletAddress!.toString(true, true, true).slice(42, 48) : "";

	const interval = setInterval(() => {
		const interval = setInterval(() => {
			if (connected) {
					dispatch(fetchBalance({}));
			}
		}, 10000);
		return () => {
			clearInterval(interval);
		};
	}, 5000);

	const balanceFixed = Number(balance)
	const balanceInGrams = balanceFixed / 10**9 

	////////////
	// RENDER //
	////////////
	return (
		<>
		{connected && 
			<Button className={styles.BalanceButton}>
				{'Toncoin balance: ' + balanceInGrams.toString()  }
			</Button>
			}
			<Button
				className={styles.ConnectButton}
				onClick={async () => {
					if (!connected) {
						await dispatch(initSession());
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
