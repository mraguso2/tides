import styles from "./WaveDivider.module.css";

export function WaveDivider() {
	return (
		<div className={styles.divider} aria-hidden>
			<div className={styles.wave} data-layer="1" />
			<div className={styles.wave} data-layer="2" />
			<div className={styles.wave} data-layer="3" />
		</div>
	);
}
