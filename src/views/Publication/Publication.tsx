// REACT
import React from 'react';

// STYLES
import styles from './Publication.module.css';

// SVG
import Back from './assets/back.svg';

// Components
import { Button_Action } from '../../components';

import { Route, useNavigate } from 'react-router-dom';

import Flicking from '@egjs/react-flicking';
import { Store } from 'react-notifications-component';

type PublicationProps = {
	style?: React.CSSProperties;
	profile: string;
	activity: string;
	name: string;
	min: number;
	max: number;
	coin: string;
	description: string;
	image: string;
	images: string[];
	telegram: string;
	route: string;
	publicKey: string;
};

const Publication: React.FC<PublicationProps> = ({
	style,
	profile,
	activity,
	name,
	min,
	max,
	coin,
	description,
	image,
	images,
	telegram,
	route,
	publicKey,
}) => {
	const navigate = useNavigate();
	setTimeout(()=> {
	Store.addNotification({
		title: 'Welcome to the offer section',
		message:
			'Here you can learn about the offer and who offers the product or service, please contact him on telegram and go to tonpayments whenever you want',
		type: 'info',
		insert: 'top',
		container: 'top-center',
		animationIn: ['animate__animated', 'animate__fadeIn'],
		animationOut: ['animate__animated', 'animate__fadeOut'],
		dismiss: {
			duration: 10000,
			onScreen: true,
			pauseOnHover: true,
		},
		touchSlidingExit: {
			swipe: {
				duration: 400,
				timingFunction: 'ease-out',
				delay: 0,
			},
			fade: {
				duration: 400,
				timingFunction: 'ease-out',
				delay: 0,
			},
		},
	});
},500)
	return (
		<section style={style} className={styles.Container}>
			<button
				className={styles.Back}
				onClick={() => {
					navigate('/');
				}}
			>
				<img src={Back} alt="" />
			</button>
			<h2 className={styles.Title}>Publication</h2>
			<div className={styles.Container_Gral}>
				<div className={styles.Container_Profile}>
					<div className={styles.Container_Img}>
						<img src={'.' + image} alt="User Image" />
					</div>
					<div className={styles.Container_Content}>
						<h3 className={styles.Title}>{activity}</h3>
						<h4 className={styles.Name}>{name}</h4>
						<h4 className={styles.Title_Price}>Price Range / Day</h4>
						<p className={styles.Price}>
							{min} - {max} {coin}
						</p>
						<a
							className={styles.Button_Telegram}
							href={telegram}
							target="_blank"
						>
							<i className="bi bi-send" style={{ marginRight: '5px' }} />{' '}
							Telegram
						</a>
					</div>
				</div>

				<div className={styles.Container_Description}>
					<h4 className={styles.Title_Description}>Description</h4>
					<p className={styles.Description}>{description}</p>
				</div>
			</div>
			<div className={styles.Container_Description}>
				<h4 className={styles.Title_Description}>Actions</h4>
				<div className={styles.Container_Button}>
					<Button_Action
						text={'Payment Channels'}
						onClick={() => {
							const navigationRoute = '/paymentchannel/' + route;
							navigate(navigationRoute);
						}}
					/>
				</div>
			</div>
			<div className={styles.Container_Gallery}>
				<h4
					className={styles.Title_Description}
					style={{ marginBottom: '10px' }}
				>
					Image Gallery
				</h4>
				<Flicking circular={true} autoResize={true}>
					{images.map(function (value, i, a) {
						return <img className={styles.Image} src={'.' + value} alt="" />;
					})}
				</Flicking>
			</div>
		</section>
	);
};

export default Publication;
