// REACT
import React from 'react';

// STYLE
import styles from './ConnectWallet.module.css';

// BOOTSTRAP COMPONENTS
import { Button } from 'react-bootstrap';

// Props
type ConnectWalletProps = {
	style?: React.CSSProperties;
	open: boolean;
};

const ConnectWallet: React.FC<ConnectWalletProps> = ({ open }) => {
	///////////////
	// FUNCTIONS //
	///////////////
	const connected = false;

	////////////
	// RENDER //
	////////////
	return (
		<>
			<Button
				className={styles.ConnectButton}
				onClick={() => {
					// if (!connected) {
					// 	dispatch(connectWallet());
					// } else {
					// 	dispatch(disconnectWallet());
					// }
				}}
				aria-expanded={open}
			>
				{connected ? '0xoasdoasodpasdpaspd' : 'Connect Wallet'}
			</Button>
		</>
	);
};

export default ConnectWallet;
