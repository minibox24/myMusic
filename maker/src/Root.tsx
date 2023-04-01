import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import rawPlaylist from '../public/sources/playlist.json';
import {Track} from './models';
import {Main} from './Main';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {useState, useEffect} from 'react';

export const RemotionRoot: React.FC = () => {
	const [handle] = useState(() => delayRender());
	const [tracks, setTracks] = useState<Track[]>([]);
	const [duration, setDuration] = useState(1);

	useEffect(() => {
		(async () => {
			let duration = 0;

			const tracks: Track[] = await Promise.all(
				rawPlaylist.map(async (trackId) => {
					const track = require(`../public/sources/${trackId}.json`);
					const dur = await getAudioDurationInSeconds(
						staticFile(`sources/${track.filename}`)
					);

					duration += dur;

					return {
						...track,
						from: Math.ceil((duration - dur) * 60.05),
						durationInFrames: Math.ceil(dur * 60.05),
					};
				})
			);

			setTracks(tracks);
			setDuration(duration);
			continueRender(handle);
		})();
	}, [handle]);

	return (
		<Composition
			id="Main"
			component={Main}
			durationInFrames={Math.ceil(duration * 60.05)}
			fps={60}
			width={1920}
			height={1080}
			defaultProps={{
				tracks,
			}}
		/>
	);
};
