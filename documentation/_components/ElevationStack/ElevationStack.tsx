import { elevationTokens } from '../../_data/otherStyleData';

const CARD_WIDTH = 220;
const CARD_HEIGHT = 84;
const STEP_X = 44;
const STEP_Y = 38;

// A staggered pile of cards, each one using the real elevation token as its z-index,
// so you can see which level sits above which. Isolated so negative z-index still paints
// inside the demo instead of vanishing behind the page.
export function ElevationStack() {
	const count = elevationTokens.length;
	return (
		<div
			role="img"
			aria-label="Elevation levels stacked from below-surface at the back to confirm at the front"
			style={{
				position: 'relative',
				isolation: 'isolate',
				width: '100%',
				maxWidth: CARD_WIDTH + STEP_X * (count - 1),
				height: CARD_HEIGHT + STEP_Y * (count - 1),
				margin: '24px 0',
			}}
		>
			{elevationTokens.map((token, i) => (
				<div
					key={token.name}
					style={{
						position: 'absolute',
						left: i * STEP_X,
						top: i * STEP_Y,
						width: CARD_WIDTH,
						height: CARD_HEIGHT,
						boxSizing: 'border-box',
						padding: 12,
						borderRadius: 'var(--corner-m)',
						background: 'var(--core-surface-secondary)',
						border: '1px solid var(--core-outline-primary)',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
						zIndex: `var(--${token.name})`,
						fontFamily: 'monospace',
						fontSize: '0.8125rem',
						color: 'var(--core-text-primary)',
					}}
				>
					<div style={{ color: 'var(--core-text-special)' }}>{token.name}</div>
					<div>z-index: {token.raw}</div>
				</div>
			))}
		</div>
	);
}
