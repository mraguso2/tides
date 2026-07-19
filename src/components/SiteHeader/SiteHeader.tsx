import styles from "./SiteHeader.module.css";

export function SiteHeader() {
	return (
		<header className={styles.header}>
			<span className={styles.name}>Harbor Tides</span>
			<span className={styles.location}>Eatons Neck, NY</span>
		</header>
	);
}
