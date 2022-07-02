// REACT
import React from 'react';

// STYLES
import styles from './Publication.module.css';

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
}) => {
	return (
		<section style={style} className={styles.Container}>
			<h2 className={styles.Title}>Publication</h2>

			<div className={styles.Container_Gral}>
				<div className={styles.Container_Profile}>
					<div className={styles.Container_Img}>
						<img src={image} alt="User Image" />
					</div>
					<div className={styles.Container_Content}>
						<h3 className={styles.Title}>{activity}</h3>
						<h4 className={styles.Name}>{name}</h4>
						<h4 className={styles.Title_Price}>Price Range / Day</h4>
						<p className={styles.Price}>{min} - {max} {coin}</p>
						<a className={styles.Button_Telegram}>Telegram</a>
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
					<button className={styles.Button_Action}>Create channel</button>
					<button className={styles.Button_Action}>Aprove payment</button>
				</div>
			</div>

			<div className={styles.Container_Cards}></div>
		</section>
	);
};

export default Publication;
