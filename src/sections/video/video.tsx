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
			<iframe width="1920" height="1080" src="https://www.youtube.com/embed/" />
		</div>
	);
};

export default Video;
