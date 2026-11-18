'use client';
import { Avatar, Icon, InfoBox, InfoBoxAction, InfoBoxContent, InfoBoxImage, InfoBoxTitle } from '@apple-pie/slice';
import { useState } from 'react';

export function ProfilePreview() {
	const [details, setDetails] = useState(false);
	const openProfile = () => setDetails((value) => !value);
	return (
		<InfoBox maxWidth={420} style={{ width: '100%' }} onPress={openProfile}>
			<InfoBoxImage>
				<Avatar name="John Wick" image="/images/jw-profile.png" />
			</InfoBoxImage>
			<InfoBoxTitle title="John Wick" />
			<InfoBoxContent text={details ? 'New York · Product designer' : "View John Wick's profile."} />
			<InfoBoxAction>
				<Icon name="arrows.chevron-right" aria-hidden="true" />
			</InfoBoxAction>
		</InfoBox>
	);
}

export function ActionPreview({ compact = false }: { compact?: boolean }) {
	const [details, setDetails] = useState(false);
	return (
		<InfoBox maxWidth={420} style={{ width: '100%' }}>
			<InfoBoxImage>
				<Avatar name="John Wick" image="/images/jw-profile.png" />
			</InfoBoxImage>
			<InfoBoxTitle title="John Wick" />
			{!compact && <InfoBoxContent text={details ? 'New York · Product designer' : "View John Wick's profile."} />}
			<InfoBoxAction
				button={{
					label: details ? 'Hide' : 'View',
					variant: 'secondary',
					onClick: () => setDetails((value) => !value),
				}}
			/>
		</InfoBox>
	);
}

export function SimplePreview() {
	const [following, setFollowing] = useState(false);
	return (
		<InfoBox maxWidth={420} style={{ width: '100%' }}>
			<InfoBoxTitle title="Discover the new features" />
			<InfoBoxContent text="Over 100 features added." />
			<InfoBoxAction
				button={{
					label: following ? 'Following' : 'Follow updates',
					variant: 'outline',
					onClick: () => setFollowing((value) => !value),
				}}
			/>
		</InfoBox>
	);
}

export function SectionPreview({ section }: { section: 'title' | 'content' | 'image' | 'action' }) {
	return (
		<InfoBox maxWidth={420} style={{ width: '100%' }}>
			<InfoBoxImage {...(section === 'image' ? { iconName: 'basic.briefcase' as const, iconSize: 20 } : {})}>
				{section === 'image' ? undefined : <Avatar name="John Wick" image="/images/jw-profile.png" />}
			</InfoBoxImage>
			<InfoBoxTitle title={section === 'image' ? 'Home workspace' : 'John Wick'} />
			<InfoBoxContent
				text={section === 'content' ? 'Account settings and profile details.' : 'Available for new projects.'}
			/>
			{section === 'action' && <InfoBoxAction chip={{ label: 'New', textSize: 's', padding: '3px 12px' }} />}
		</InfoBox>
	);
}
