// REACT
import React from 'react';

// STYLES
import styles from './Publication.module.css';

type PublicationProps = {
	style?: React.CSSProperties;
};

const Publication: React.FC<PublicationProps> = ({ style }) => {
	return (
		<section style={style} className={styles.Container}>
			<h2 className={styles.Title}>Publication</h2>

			<div className={styles.Container_Gral}>
				<div className={styles.Container_Profile}>
					<div className={styles.Container_Img}>
						<img src="./assets/images/Pistol.png" alt="User Image" />
					</div>
					<div className={styles.Container_Content}>
						<h3 className={styles.Title}>Pixel Artist</h3>
						<h4 className={styles.Name}>Alejo Viola</h4>
						<h4 className={styles.Title_Price}>Price Range / Day</h4>
						<p className={styles.Price}>100 - 1000 TON</p>
						<a className={styles.Button_Telegram}>Telegram</a>
					</div>
				</div>

				<div className={styles.Container_Description}>
					<h4 className={styles.Title_Description}>Description</h4>
					<p className={styles.Description}>Faso</p>
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
