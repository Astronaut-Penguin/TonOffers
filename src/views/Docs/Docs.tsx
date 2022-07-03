import React from 'react';

import styles from './Docs.module.css';

// SVG
import Back from './assets/back.svg';

import { Route, useNavigate } from 'react-router-dom';

const Docs = () => {
	const navigate = useNavigate();
	return (
		<section className={styles.Container}>
			<button
				className={styles.Back}
				onClick={() => {
					navigate('/');
				}}
			>
				<img src={Back} alt="" />
			</button>
			<h1>Docs</h1>
			<p>Textoasdasdasdasdasdasdas</p>
			<hr />
		</section>
	);
};

export default Docs;
