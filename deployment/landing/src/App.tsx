import { Button } from '@apple-pie/slice/components/Button';

export function App() {
	return (
		<main className="landing">
			<div className="landing-content">
				<p className="eyebrow">A shared language for your interfaces</p>
				<h1>Slice UIKit</h1>
				<p className="introduction">
					Components, themes, and utilities for building interfaces with React and React Native.
				</p>
				<nav aria-label="Platform documentation" className="platform-links">
					<Button label="React documentation" link="https://react.slice-uikit.com" size="large" variant="solid" />
					<Button
						label="React Native documentation"
						link="https://react-native.slice-uikit.com"
						size="large"
						variant="outline"
					/>
				</nav>
			</div>
		</main>
	);
}
