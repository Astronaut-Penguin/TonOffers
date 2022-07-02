// React
import React from 'react';

// Components
import Header from './components/Header/Header';

// Style
import styles from './App.module.css';

// Views
import { Gallery } from './views';

const App: React.FC = () => {
	return (
		<>
			{/* HEADER */}
			<Header />

			{/* APP CONTAINER */}
			<div className={styles.Container_App}>
				<Gallery />
			</div>
		</>
	);
};

export default App;
