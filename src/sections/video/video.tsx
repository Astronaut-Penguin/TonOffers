import styles from './video.module.css';

// Props
type VideoProps = {
	style?: React.CSSProperties;
};

const Video: React.FC<VideoProps> = ({}) => {
	//STATE

	////////////
	// RENDER //
	////////////
	return (
		<div className={styles.Video}>
			<iframe width="1689" height="678" src="https://www.youtube.com/embed/L7R0u6a-P8U" title="TON Offers Presentation - Hack-A-TON 2022"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
		</div>
	);
};

export default Video;
