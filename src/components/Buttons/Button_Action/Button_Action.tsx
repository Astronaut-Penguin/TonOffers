// REACT
import React from 'react';

// STYLES
import styles from './Button_Action.module.css';

type ButtonProps = {
	style?: React.CSSProperties;
	icon?: any;
	text: string;
	onClick: () => void;
};

const Button_Action: React.FC<ButtonProps> = ({
	style,
	icon,
	text,
	onClick,
}) => {
	return (
		<button className={styles.Button_Action} onClick={onClick}>
			{icon}
			{text}
		</button>
	);
};

export default Button_Action;
