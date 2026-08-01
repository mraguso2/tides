import { Anchor } from "lucide-react";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
	return (
		<header className={styles.header}>
			<div className={styles.wordmark}>
				<Anchor className={styles.logo} aria-hidden />
				<span className={styles.name}>Harbor Tides</span>
			</div>
			<span className={styles.location}>Eatons Neck, NY</span>
		</header>
	);
}
