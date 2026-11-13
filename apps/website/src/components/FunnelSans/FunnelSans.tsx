import { FlexBox, Preset, Slider, TabBar, type TabOption, TextField } from '@apple-pie/slice';
import { useState } from 'react';
import css from './FunnelSans.module.css';

const tabs: TabOption[] = [
	{ label: 'Normal', value: 'normal' },
	{ label: 'Italic', value: 'italic' },
];

export function FunnelSans() {
	const [weight, setWeight] = useState(400);
	const [style, setStyle] = useState('normal');
	const [weightKey, setWeightKey] = useState<string>(crypto.randomUUID());

	const handleWeightChange = (value: number | string) => {
		// set the weight to the nearest integer value
		const newWeight = Math.round(value === '' ? 400 : Number(value));
		if (newWeight < 300 || newWeight > 800 || newWeight === 400) {
			setWeightKey(crypto.randomUUID());
			setWeight(400);
		} else setWeight(Math.round(newWeight));
	};

	return (
		<FlexBox padding={'0-24'} margin={'32-0-0-0'}>
			<TabBar tabBarName="Font style" options={tabs} value={style} onChange={setStyle} />
			<FlexBox gap={32} padding={'32-0'} className={css.glyphs} style={{ fontWeight: weight, fontStyle: style }}>
				<div>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}</div>
				<div>{'abcdefghijklmnopqrstuvwxyz'}</div>
				<div>{'1234567890'}</div>
				<div>{`!"#€%&/()=?*@£<~+>`}</div>
			</FlexBox>
			<FlexBox preset={Preset.Row} width={'fill'} shrinkChildren={true} gap={32}>
				<span>Adjust Font Weight</span>
				<Slider
					aria-label="Font weight"
					value={weight}
					style={{ flex: 1 }}
					trackHeadSize={16}
					min={300}
					max={800}
					onChange={(v, _) => handleWeightChange(v)}
				/>
				<TextField
					inputName="Font weight"
					defaultValue={weight.toString()}
					onBlur={(v) => handleWeightChange(v)}
					placeholder={'400'}
					clearButton={null}
					key={`${weight}:${weightKey}`}
					width={75}
					textAlign={'center'}
				/>
			</FlexBox>
		</FlexBox>
	);
}
