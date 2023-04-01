import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import React from 'react';
import {AbsoluteFill, Img, staticFile, Audio} from 'remotion';
import {Track} from '../models';
import './font.css';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';

interface PlayerProps {
	track: Track;
}

export const Player: React.FC<PlayerProps> = ({track}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const audioData = useAudioData(staticFile(`sources/${track.filename}`));

	if (!audioData) return null;

	const visualizationWidth = 15;
	const visualizationHeight = 500;
	const visualizationGap = 10;

	const visualization = visualizeAudio({
		audioData,
		fps,
		numberOfSamples: 16,
		frame,
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Audio src={staticFile(`sources/${track.filename}`)} />

			{/* BG */}
			<div
				style={{
					zIndex: -1,
				}}
			>
				<Img
					src={track.thumbnail}
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '150%',
						height: 'auto',
						filter: 'blur(100px)',
					}}
				/>

				<div
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						backgroundColor: 'white',
						opacity: 0.4,
						width: '200vw',
						height: '200vh',
					}}
				/>
			</div>

			{/* Content */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{/* Cover */}
				<Img
					src={track.thumbnail}
					style={{
						width: '600px',
						height: '600px',
						borderRadius: '30px',
					}}
				/>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginLeft: '20px',
					}}
				>
					{/* Visualization */}
					<div
						style={{
							height: (visualizationWidth + visualizationGap) * 16,
							display: 'flex',
							flexDirection: 'column-reverse',
							alignItems: 'flex-start',
							gap: visualizationGap,
							justifyContent: 'space-between',
							width: visualizationHeight,
							overflow: 'hidden',
							marginBottom: '20px',
						}}
					>
						{visualization.map((x, i) => (
							<div
								key={i}
								style={{
									height: visualizationWidth,
									width: Math.max(
										Math.min(
											x * ((i + 1) / 2) * visualizationHeight * 1.5,
											visualizationHeight
										),
										visualizationWidth
									),
									background: '#171717',
									borderRadius: '10px',
								}}
							/>
						))}
					</div>

					{/* Info */}
					<div
						style={{
							width: '70vw',
							fontFamily: "Pretendard, 'Noto Sans JP'",
							display: 'flex',
							flexDirection: 'column',
							color: '#171717',
						}}
					>
						<span
							style={{
								fontSize: '4rem',
								fontWeight: '700',
							}}
						>
							{track.title}
						</span>
						<span
							style={{
								fontSize: '2rem',
								fontWeight: '500',
							}}
						>
							{track.album}
						</span>
						<span
							style={{
								fontSize: '2rem',
								fontWeight: '500',
							}}
						>
							{track.artists.join(', ')}
						</span>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
