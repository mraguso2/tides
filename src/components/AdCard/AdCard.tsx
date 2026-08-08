import styles from "./AdCard.module.css";

type AdCardProps = {
	children: React.ReactNode;
};

/** Slot for future local business ads. Not mounted until sponsors exist. */
export function AdCard({ children }: AdCardProps) {
	return <aside className={styles.card}>{children}</aside>;
}
