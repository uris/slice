import { useState } from 'react';
import { FlexDiv, Label, Slider, TabBar, type TabOption, TextField } from 'src';
import css from './FunnelSans.module.css';

const tabs: TabOption[] = [
	{ name: 'Normal', value: 'normal' },
	{ name: 'Italic', value: 'italic' },
];

export function FunnelSans() {
	const [weight, setWeight] = useState(400);
	const [style, setStyle] = useState('regular');
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
		<FlexDiv width={'fill'} height={'fit'} align={'start'} justify={'start'}>
			<TabBar options={tabs} selectedValue={style} onTabChange={(option) => setStyle(option.value)} />
			<div className={css.glyphs} style={{ fontWeight: weight, fontStyle: style }}>
				{`ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö1234567890!"#€%&/()=?*@£<~+>`}
			</div>
			<FlexDiv width={'fill'} height={'fit'} direction={'row'} justify={'between'} align={'center'} gap={16}>
				<Label borderSize={0}>Adjust Font Weight</Label>
				<Slider
					value={weight}
					width={'100%'}
					trackHeadSize={16}
					scaleMin={300}
					scaleMax={800}
					onChange={(v, _) => handleWeightChange(v)}
				/>
				<TextField
					value={weight.toString()}
					onBlur={(v) => handleWeightChange(v)}
					placeholder={'400'}
					clearButton={null}
					key={weightKey}
					size={{ width: 75 }}
					textAlign={'center'}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}
