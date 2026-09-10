'use client';

import { useEffect, useState } from 'react';

function getTimeDifference(date: Date | string, labelPrefix: string) {
	const compareDate = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(compareDate.getTime())) return `${labelPrefix}Invalid date`;

	// getTime = milliseconds since Jan 1 1970 UTC
	const secondsDiff = Math.max(0, Math.floor((Date.now() - compareDate.getTime()) / 1000));
	const minutes = Math.floor(secondsDiff / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) return `${labelPrefix}Just now`;
	if (minutes === 1) return `${labelPrefix}1 min. ago`;
	if (minutes < 60) return `${labelPrefix}${minutes} mins. ago`;
	if (hours === 1) return `${labelPrefix}1 hour ago`;
	if (hours < 24) return `${labelPrefix}${hours} hours ago`;
	if (days === 1) return `${labelPrefix}1 day ago`;
	if (days < 15) return `${labelPrefix}${days} days ago`;
	return compareDate.toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

export function useLastUpdated(timestamp: string | undefined, prefix = '', interval = 1) {
	const [lastUpdated, setLastUpdated] = useState<string>(timestamp ? getTimeDifference(timestamp, prefix) : '');
	useEffect(() => {
		if (!timestamp) {
			setLastUpdated('');
			return;
		}
		setLastUpdated(getTimeDifference(timestamp, prefix));
		const refreshMinutes = Math.max(interval, 1);
		const intervalTimer = setInterval(
			() => {
				setLastUpdated(getTimeDifference(timestamp, prefix));
			},
			refreshMinutes * 60 * 1000,
		);
		return () => {
			clearInterval(intervalTimer);
		};
	}, [interval, prefix, timestamp]);

	return { lastUpdated, timer: interval };
}
