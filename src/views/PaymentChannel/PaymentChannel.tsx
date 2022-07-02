// REACT
import React from 'react';

// STYLES
import styles from './PaymentChannel.module.css';

type PaymentChannelProps = {
	style?: React.CSSProperties;
};

////////////////////
// COMPONENT VIEW //
////////////////////
const PaymentChannel: React.FC<PaymentChannelProps> = ({ style }) => {
	////////////
	// RENDER //
	////////////
	return <section style={style}></section>;
};

export default PaymentChannel;
