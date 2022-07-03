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
import { Gallery, Publication, PaymentChannel } from './views';

// Data JSON7
import data from '../src/data/data.json';

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
const App: React.FC = () => {
	return (
		<>
			<Router>
			<ReactNotifications />
				{/* HEADER */}
				<Header />
				{/* APP CONTAINER */}
				<div className={styles.Container_App}>
					<Switch>
						{/* GALLERY VIEW */}
						<Route path="/" element={<Gallery />} />

						{/* PUBLICATION VIEW */}
						{data.data.map(function (value, i, a) {
							return (
								<Route
									path={'/publication/' + value.route}
									element={
										<Publication
											profile={value.profile}
											activity={value.activity}
											name={value.name}
											telegram={value.telegram}
											min={value.price.min}
											max={value.price.max}
											coin={value.price.coin}
											description={value.description}
											image={value.images.perfil}
											images={value.images.works}
											route={value.route}
											publicKey={value.publicKey}
										/>
									}
								/>
							);
						})}

						{/* PAYMENT CHANNEL */}

						{data.data.map(function (value, i, a) {
							return (
								<Route
									path={'/paymentchannel/' + value.route}
									element={
										<PaymentChannel
											hisPublicKey={value.publicKey}
										/>
									}
								/>
							);
						})}
					</Switch>
				</div>
			</Router>
		</>
	);
};

export default App;
