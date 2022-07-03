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
			<h1>About</h1>
			<p></p>
			<h3>TonOffers</h3>
			<p>
				Platform prototype for the first hack-a-TON. Tonoffers its a platform to
				connect and stablish a proper tonpayments channel with proffesionals
				offering goods and services users would love to buy very frequently.
			</p>
			<h3>Motivation</h3>
			<p>
				Our main reason to build this project for this contest borns from the
				idea of the task itself "think about the most useful way to implement
				tonpayments channels" From our point of view, simply coding a webapp
				menu to build fast channels between already known users won´t be enough,
				we want to show the potential of the payment channels in a the most
				realistic use case possible.
			</p>
			<p>
				That lead us to think about how to connect users that want to sell goods
				or their services to other users, but making the channel creation,
				update and close UX as smoth as possible for them.
			</p>
			<h3>Features</h3>
			<ul>
				<li>
					The best presentational animated video we can made with the limited
					amount of the contest{' '}
				</li>
				<li>A webapp dApp that showcases our programming skills</li>
				<li>
					A few fake profiles inside the offers gallery to explain the potential
					of the marketplace and the options for the users, this emulate our
					backend to display registered offers
				</li>
				<li>
					The payment channel section, that shows the available possibilities
					for the users when they want to interact through it.
				</li>
			</ul>
			<h3>Useful information</h3>
			<p>
				We needed to include a delay line of code inside the tonweb library to
				reach a better flow, because whenever we sended payments transactions,
				the provider rejected us due to the small time between calls ands boc
				transfers
			</p>
			<p>
				The project has all to work properly, the flow of the channel deployment
				- topUps - Init - Sign - Verify - Sign - Close - Final Cooperative Close
				must be polished to have a better UX and to succes with the less
				interactions as possible from the users
			</p>
			<p>
				We created several channels and interacted with this wallet on the
				testnet creating, topUps, Inits, Signs and channel close in the following wallet:
				
			</p>
			<a target="blank"href="https://testnet.tonscan.org/address/EQD9sAd94JljOeOYimRMvH7bVJ3mJpfCY6Nye00u4Ip4lQQI" >
			Link to wallet used to test
			</a>
			<p></p>

			<h3>About the result of the development for this contest</h3>
			<p>
				As a team of 2 people, we are really proud of the result, the idea
				started fuzzy but ended in a nice project with a lot of potential we
				will continue expanding and coding for sure!
			</p>
			<h3>About the future of this project</h3>
			<p>
				Since we are really happy with the idea, we want to develop more
				features for this platform, such as a decentralized backend to host the
				offers users wants us to showcase in our gallery, the active payments
				channels the users have, notification when someone push an updated
				channelState, etc. For this we have a few ideas, like implementing
				gun.js since its decentralized while we wait for TON STORAGE. Any
				feedback or idea its welcome, and we invite you to submit it to our
				telegram accounts or here in the issue section!
			</p>
			<hr />
		</section>
	);
};

export default Docs;
