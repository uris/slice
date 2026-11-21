import { Button, Card, CardContent, CardTitle, Chip, TextArea, Video } from '@apple-pie/slice';
import { type VideoDescriptor, getVideo, videoActions } from '@apple-pie/slice/stores/video';
import { useEffect, useRef, useState } from 'react';
import css from '../Overview.module.css';
import { Row, useNotice } from '../Shared';

const clip = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export function VideoReview() {
	const [notes, setNotes] = useState('Love the opening. Let’s hold on that first shot a little longer.');
	const owned = useRef<VideoDescriptor | null>(null);
	const notice = useNotice();
	useEffect(
		() => () => {
			if (owned.current && getVideo() === owned.current) videoActions.clear();
		},
		[],
	);
	return (
		<Card className={css.card} padding={20} style={{ width: '100%' }}>
			<CardTitle title="A fresh perspective" caption="VIDEO REVIEW" />
			<CardContent>
				<div className={css.stack}>
					<Video
						src={clip}
						videoName="Flower study"
						muted
						width="100%"
						height={180}
						customControls={{ play: true, progress: true, volume: true }}
						poster="/images/flowers-sunflower.png"
						videoAttributes={{ preload: 'none' }}
					/>
					<Row>
						<Chip label="Version 03" />
						<Button
							label="Expand video"
							variant="text"
							onClick={() => {
								const descriptor: VideoDescriptor = {
									component: Video,
									props: { src: clip, videoName: 'Flower study expanded', width: '100%', playing: true, muted: true },
								};
								owned.current = descriptor;
								videoActions.show(descriptor);
							}}
						/>
					</Row>
					<TextArea label="Review notes" value={notes} onChange={setNotes} rows={2} />
					<Button
						label="Send feedback"
						variant="secondary"
						disabled={!notes.trim()}
						onClick={() => notice('Feedback shared in this preview.')}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
