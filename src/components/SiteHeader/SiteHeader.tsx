import styles from "./SiteHeader.module.css";

export function SiteHeader() {
	return (
		<header className={styles.header}>
			<div className={styles.brand}>
				<svg
					className={styles.logo}
					viewBox="0 0 32 32"
					fill="none"
					aria-hidden="true"
				>
					<circle
						cx="16"
						cy="16"
						r="15"
						fill="rgba(255,255,255,0.1)"
						stroke="rgba(255,255,255,0.2)"
						strokeWidth="0.5"
					/>
					<path
						d="M16 6 L16 20"
						stroke="rgba(255,255,255,0.6)"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					<path d="M16 6 L21 14 L16 13 L11 14 Z" fill="rgba(255,255,255,0.9)" />
					<path d="M16 13 L21 14 L16 20" fill="rgba(255,255,255,0.4)" />
					<path
						d="M6 23 Q9 20 12 23 Q15 26 18 23 Q21 20 24 23 Q26 24.5 26 26 L6 26 Z"
						fill="rgba(255,255,255,0.25)"
					/>
					<path
						d="M6 25 Q9 22.5 12 25 Q15 27.5 18 25 Q21 22.5 24 25 Q26 26 26 26 L6 26 Z"
						fill="rgba(255,255,255,0.4)"
					/>
				</svg>
				<span className={styles.name}>Harbor Tides</span>
			</div>
			<span className={styles.location}>Eatons Neck, NY</span>
		</header>
	);
}
