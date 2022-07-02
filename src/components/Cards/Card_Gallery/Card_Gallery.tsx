// React
import React from 'react';

// Styles
import styles from './Card_Gallery.module.css';

// ICONS
import Arrow from './assets/arrow.svg';

// REAC ROUTER DOM
import { useNavigate } from 'react-router-dom';

type CardGalleryProps = {
	style?: React.CSSProperties;

	profile: string;
	activity: string;
	name: string;
	min: number;
	max: number;
	coin: string;
	description: string;
	image: string;

	router: string;
};

const Card_Gallery: React.FC<CardGalleryProps> = ({
	style,
	profile,
	activity,
	name,
	min,
	max,
	coin,
	description,
	image,
	router,
}) => {
	const navigate = useNavigate();

	////////////
	// RENDER //
	////////////
	return (
		<button
			className={styles.Container_Card}
			onClick={() => {
				navigate('/publication/' + router);
			}}
		>
			<p className={styles.Title_Type}>{profile}</p>
			<div className={styles.Container_First}>
				<div className={styles.Container_Img}>
					<img src={image} alt="User Image" />
				</div>
				<div className={styles.Container_Content}>
					<h3 className={styles.Title}>{activity}</h3>
					<h4 className={styles.Name}>{name}</h4>
					<h4 className={styles.Title_Price}>Price Range / Day</h4>
					<p className={styles.Price}>
						{min} - {max} {coin}
					</p>
				</div>
				<img className={styles.Arrow} src={Arrow} alt="Arrow" />
			</div>
			<h4 className={styles.Title_Description}>Description</h4>
			<p className={styles.Description}>{description}</p>
		</button>
	);
};

export default Card_Gallery;
