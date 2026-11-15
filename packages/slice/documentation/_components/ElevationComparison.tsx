import { darkTheme, lightTheme } from '../../src/theme/themes';

const descriptions = ['Flat', 'Slight separation', 'Raised', 'Floating', 'Strong separation', 'Prominent'];

/** Documentation-only comparison; each panel resolves the published CSS tokens. */
export function ElevationComparison() {
	return (
		<div style={{ display: 'grid', gap: 24 }}>
			{(
				[
					['light', lightTheme],
					['dark', darkTheme],
				] as const
			).map(([mode, theme]) => (
				<section
					key={mode}
					aria-label={`${mode} elevation levels`}
					data-slice-theme-scope=""
					data-slice-elevation-theme={mode}
					style={{
						background: theme.colors['core-surface-primary'],
						color: theme.colors['core-text-primary'],
						padding: 32,
						borderRadius: 16,
					}}
				>
					<h2 style={{ margin: '0 0 32px' }}>{mode === 'light' ? 'Light' : 'Dark'} theme</h2>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
						{descriptions.map((description, level) => (
							<figure key={description} style={{ margin: 0 }}>
								<div
									aria-label={`${mode} elevation ${level}`}
									style={{
										height: 112,
										borderRadius: 12,
										background: theme.colors['core-surface-secondary'],
										boxShadow: `var(--elevation-${level})`,
										display: 'grid',
										placeItems: 'center',
										fontSize: 28,
									}}
								>
									{level}
								</div>
								<figcaption style={{ marginTop: 20, lineHeight: 1.6 }}>
									<strong>{description}</strong>
									<br />
									<code>--elevation-{level}</code>
								</figcaption>
							</figure>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
