import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Track} from './models';
import {Player} from './Player';

interface MainProps {
	tracks: Track[];
}

export const Main: React.FC<MainProps> = ({tracks}) => {
	return (
		<AbsoluteFill>
			{tracks.map((track, index) => (
				<Sequence
					key={index}
					from={track.from}
					durationInFrames={track.durationInFrames}
				>
					<Player track={track} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
