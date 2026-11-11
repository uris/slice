import { useState } from 'react';
import { FlexBox, Slider, TabBar, type TabOption, TextField } from 'src';
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
		<FlexBox width={'fill'} height={'fit'} align={'start'} justify={'start'}>
			<TabBar tabBarName="Font style" options={tabs} value={style} onChange={setStyle} />
			<div className={css.glyphs} style={{ fontWeight: weight, fontStyle: style }}>
				{`ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö1234567890!"#€%&/()=?*@£<~+>`}
			</div>
			<FlexBox width={'fill'} height={'fit'} direction={'row'} justify={'between'} align={'center'} gap={16}>
				<span>Adjust Font Weight</span>
				<Slider
					aria-label="Font weight"
					value={weight}
					width={'100%'}
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
