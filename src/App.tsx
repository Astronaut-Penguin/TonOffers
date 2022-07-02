// React
import React from 'react';

// Components
import Header from './components/Header/Header';

// Style
import styles from './App.module.css';

// ROUTER DOM
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
} from 'react-router-dom';

// Views
import { Gallery, Publication } from './views';

const App: React.FC = () => {
	return (
		<>
			{/* HEADER */}
			<Header />

			{/* APP CONTAINER */}
			<div className={styles.Container_App}>
				<Router>
					<Switch>
						<Route path="/" element={<Gallery />} />
						<Route path="/publication" element={<Publication />} />
					</Switch>
				</Router>
			</div>
		</>
	);
};

export default App;
