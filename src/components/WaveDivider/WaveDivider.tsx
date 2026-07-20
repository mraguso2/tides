import styles from "./WaveDivider.module.css";

type WaveDividerProps = {
	/**
	 * `hero` — waves point up out of the hero image (light → navy → sand).
	 * `footer` — waves point down into the footer (white → cyan → navy).
	 */
	variant: "hero" | "footer";
};

export function WaveDivider({ variant }: WaveDividerProps) {
	return (
		<div className={styles.divider} data-variant={variant} aria-hidden>
			<div className={styles.wave} data-layer="1" />
			<div className={styles.wave} data-layer="2" />
			<div className={styles.wave} data-layer="3" />
		</div>
	);
}
