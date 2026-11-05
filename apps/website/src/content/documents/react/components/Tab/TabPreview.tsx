'use client';
import { Tab, TabBar } from '@apple-pie/slice';
export function TabPreview({ variant = 'default' }: { variant?: 'default' | 'extras' | 'custom' | 'disabled' }) {
	return (
		<TabBar tabBarName="Project views" width={360} defaultValue="overview">
			<Tab value="overview" label="Overview" />
			<Tab
				value="details"
				label={variant === 'custom' ? undefined : 'Details'}
				icon={variant === 'extras' ? 'home' : undefined}
				count={variant === 'extras' ? 12 : undefined}
				disabled={variant === 'disabled'}
			>
				<span>
					Details <em>Live</em>
				</span>
			</Tab>
		</TabBar>
	);
}
