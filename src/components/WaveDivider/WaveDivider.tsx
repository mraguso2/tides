import { Sailboat } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./WaveDivider.module.css";

type WaveDividerProps = {
	/**
	 * `hero` — waves point up out of the hero image (light → navy → sand).
	 * `footer` — waves point down into the footer (white → cyan → navy).
	 */
	variant: "hero" | "footer";
};

/** px per second — constant speed regardless of viewport */
const SPEED = 30;
/** seconds of pre-elapsed time at mount */
const START_OFFSET = -0.25;
/** vertical bob amplitude in px */
const BOB_AMP = 5;
/** bob frequency in radians per second */
const BOB_SPEED = 1.8;
/** tilt amplitude in degrees, synced to the bob */
const TILT_MAX = 4;

export function WaveDivider({ variant }: WaveDividerProps) {
	const boatRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const boat = boatRef.current;
		const track = boat?.parentElement;
		if (!boat || !track) return;

		// hero drifts left→right, footer drifts right→left.
		const direction = variant === "footer" ? -1 : 1;
		const flip = direction === -1 ? " scaleX(-1)" : "";

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			boat.style.transform = `translate(25%, 0)${flip}`;
			return;
		}

		const boatWidth = boat.getBoundingClientRect().width || 22;
		let start: number | null = null;
		let raf = 0;

		const tick = (now: number) => {
			if (start === null) start = now - START_OFFSET * 1000;
			const t = (now - start) / 1000;
			const travel = track.clientWidth + boatWidth;
			const progress = (t * SPEED) % travel;
			const x =
				direction === 1 ? progress - boatWidth : track.clientWidth - progress;
			const bob = Math.sin(t * BOB_SPEED);
			boat.style.transform = `translate(${x}px, ${bob * BOB_AMP}px) rotate(${bob * TILT_MAX}deg)${flip}`;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(raf);
	}, [variant]);

	return (
		<div className={styles.divider} data-variant={variant} aria-hidden>
			<div className={styles.wave} data-layer="1" />
			<div className={styles.wave} data-layer="2" />
			<div className={styles.wave} data-layer="3" />
			<div className={styles.boatTrack}>
				<Sailboat ref={boatRef} className={styles.boat} size={24} />
			</div>
		</div>
	);
}
