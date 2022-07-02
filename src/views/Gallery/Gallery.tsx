// React
import React from 'react';

// Styles
import styles from './Gallery.module.css';

// COMPONENTS
import { Card_Gallery } from '../../components';

// DATA
import data from '../../data/data.json';

type GalleryProps = {
	style?: React.CSSProperties;
};

// Component
const Gallery: React.FC<GalleryProps> = ({ style }) => {
	return (
		<section style={style} className={styles.Container}>
			<h2 className={styles.Title}>Services Gallery</h2>

			<div className={styles.Container_Cards}>
				{data.data.map(function (value, i, a) {
					return (
						<Card_Gallery
							type={value.type}
							activity={value.activity}
							name={value.name}
							min={value.price.min}
							max={value.price.max}
							coin={value.price.coin}
							description={value.description}
							image={value.images.perfil}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default Gallery;
