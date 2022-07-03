// React
import React, { useState } from 'react';

// Styles
import styles from './Gallery.module.css';

// COMPONENTS
import { Card_Gallery } from '../../components';

// DATA
import data from '../../data/data.json';
import { Store } from 'react-notifications-component';
import Video from '../../sections/video/video';

type GalleryProps = {
	style?: React.CSSProperties;
};

// Component
const Gallery: React.FC<GalleryProps> = ({ style }) => {
	const [selectedFilter, useSelectedFilter] = useState('');
	setTimeout(()=> {
		Store.addNotification({
			title: "Welcome to the gallery section",
			message: "Here you can test a use case of tonpayments channels, search wich offer its of your interest and click it",
			type: "info",
			insert: "top",
			container: "top-center",
			animationIn: ["animate__animated", "animate__fadeIn"],
			animationOut: ["animate__animated", "animate__fadeOut"],
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

	// useSelectedFilter("Vendor") provoca que solo se renderizen los vendor
	return (
		
		<section style={style} className={styles.Container}>
							<Video />
			<h2 className={styles.Title}>Services Gallery</h2>

			<div className={styles.Container_Cards}>
				{data.data.map(function (value, i, a) {
					if (value.profile != selectedFilter && selectedFilter != '') return;
					return (
						<Card_Gallery
							profile={value.profile}
							activity={value.activity}
							name={value.name}
							min={value.price.min}
							max={value.price.max}
							coin={value.price.coin}
							description={value.description}
							image={value.images.perfil}
							router={value.route}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default Gallery;
