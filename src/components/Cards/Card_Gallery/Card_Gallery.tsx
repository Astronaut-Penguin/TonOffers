// React
import React from 'react';

// Styles
import styles from './Card_Gallery.module.css';

// ICONS
import Arrow from './assets/arrow.svg';

type CardGalleryProps = {
	style?: React.CSSProperties;

	type: string;
	activity: string;
	name: string;
	min: number;
	max: number;
	coin: string;
	description: string;
	image: string;
};

const Card_Gallery: React.FC<CardGalleryProps> = ({
	style,
	type,
	activity,
	name,
	min,
	max,
	coin,
	description,
	image,
}) => {
	////////////
	// RENDER //
	////////////
	return (
		<button className={styles.Container_Card}>
			<p className={styles.Title_Type}>{type}</p>
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
