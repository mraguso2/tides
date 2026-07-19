import heroSmall from "#/assets/eatons-neck-800.jpg";
import heroLarge from "#/assets/eatons-neck-1600.jpg";
import styles from "./HeroBanner.module.css";

/** Single image for now; structured to grow into a photo/video carousel */
export function HeroBanner() {
	return (
		<div className={styles.hero}>
			<img
				className={styles.image}
				src={heroLarge}
				srcSet={`${heroSmall} 800w, ${heroLarge} 1600w`}
				sizes="100vw"
				alt="Sandy beach and lighthouse at Eatons Neck on Long Island Sound"
				fetchPriority="high"
			/>
			{/* <p className={styles.caption}>Eatons Neck · Long Island Sound</p> */}
		</div>
	);
}
