// REACT
import React from 'react';

// STYLE
import styles from './Disconnected_Main_View.module.css';

// Bootstrap
import { Button } from 'react-bootstrap';

type Props = {
	style?: React.CSSProperties;
};

const Disconnected_Main_View: React.FC<Props> = () => {
	return (
		<div className={styles.Container}>
			<h2>Please connect your wallet.</h2>
			<Button className={styles.Button}> Connect Wallet </Button>
		</div>
	);
};

export default Disconnected_Main_View;
