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

// Data JSON7
import data from "../src/data/data.json"

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
						{data.data.map(function (value, i, a) {
					return (
						<Route path={"/publication/" + value.route} element={
						<Publication 
							profile={value.profile}
							activity={value.activity}
							name={value.name}
							min={value.price.min}
							max={value.price.max}
							coin={value.price.coin}
							description={value.description}
							image={value.images.perfil}
							images={value.images.works}
							/>} />
					);
				})} 
					</Switch>
				</Router>
			</div>
		</>
	);
};

export default App;
