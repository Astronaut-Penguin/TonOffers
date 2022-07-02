// REACT
import React from 'react';

// STYLES
import styles from './Button_Action.module.css';

type ButtonProps = {
	style?: React.CSSProperties;
	text: string;
	onClick: () => void;
};

const Button_Action: React.FC<ButtonProps> = ({ style, text, onClick }) => {
	return (
		<button className={styles.Button_Action} onClick={onClick}>
			{text}
		</button>
	);
};

export default Button_Action;
