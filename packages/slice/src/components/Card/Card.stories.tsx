import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import image from '../../../../../apps/website/public/images/flowers-sunflower.png';
import { FlexBox, Preset } from '../FlexBox';
import { TextField } from '../Textfield';
import { Card } from './Card';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { CardImage } from './CardImage';
import { CardTitle } from './CardTitle';

const meta = {
	title: 'Components/Card',
	component: Card,
	subcomponents: { CardTitle, CardContent, FlexBox, CardImage },
	parameters: { layout: 'centered' },
	decorators: [
		(Story) => (
			<FlexBox preset={Preset.FillCenterMiddle}>
				<Story />
			</FlexBox>
		),
	],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		return (
			<Card {...args} maxWidth={375}>
				<CardTitle
					title={'Log in to your account'}
					text={'Use the form below to enter your user name and password.'}
					actionButton={{ label: 'help', iconRight: 'alerts.question', variant: 'text' }}
					onAction={(button) => console.log({ button })}
				/>
				<CardContent>
					<FlexBox preset={Preset.FillStart} gap={8}>
						Email:
						<TextField
							backgroundColorBlurred={'transparent'}
							variant={'simple'}
							name={'email'}
							placeholder={'enter email'}
						/>
						Password:
						<TextField
							backgroundColorBlurred={'transparent'}
							inputType={'password'}
							variant={'simple'}
							name={'password'}
							placeholder={'enter password'}
						/>
					</FlexBox>
				</CardContent>
				<CardFooter
					layout={'fill'}
					stack={'vertical'}
					align={'center'}
					actionButtons={[
						{ label: 'Login', variant: 'primary' },
						{ label: 'Sign Up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
					]}
					onAction={(button) => {
						console.log(button.label);
					}}
				/>
			</Card>
		);
	},
};

export const LargerSpacing: Story = {
	render: (args) => {
		return (
			<Card {...args} maxWidth={375} padding={'var(--spacing-xl)'}>
				<CardTitle
					title={'Log in to your account'}
					text={'Use the form below to enter your user name and password.'}
					actionButton={{ label: 'help', iconRight: 'alerts.question', variant: 'text' }}
					onAction={(button) => console.log({ button })}
				/>
				<CardContent>
					<FlexBox preset={Preset.FillStart} gap={8}>
						Email:
						<TextField
							backgroundColorBlurred={'transparent'}
							variant={'simple'}
							name={'email'}
							placeholder={'enter email'}
						/>
						Password:
						<TextField
							backgroundColorBlurred={'transparent'}
							inputType={'password'}
							variant={'simple'}
							name={'password'}
							placeholder={'enter password'}
						/>
					</FlexBox>
				</CardContent>
				<CardFooter
					layout={'fill'}
					stack={'vertical'}
					align={'center'}
					actionButtons={[
						{ label: 'Login', variant: 'primary' },
						{ label: 'Sign Up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
					]}
					onAction={(button) => {
						console.log(button.label);
					}}
				/>
			</Card>
		);
	},
};

export const WithImage: Story = {
	render: (args) => {
		return (
			<Card {...args} maxWidth={375} padding={'var(--spacing-xl)'}>
				<CardTitle
					title={'Log in to your account'}
					text={'Use the form below to enter your user name and password.'}
					actionButton={{ label: 'help', iconRight: 'alerts.question', variant: 'text' }}
					onAction={(button) => console.log({ button })}
				/>
				<CardImage src={image} height={200} />
				<CardContent>
					<FlexBox preset={Preset.FillStart} gap={8}>
						Email:
						<TextField
							backgroundColorBlurred={'transparent'}
							variant={'simple'}
							name={'email'}
							placeholder={'enter email'}
						/>
						Password:
						<TextField
							backgroundColorBlurred={'transparent'}
							inputType={'password'}
							variant={'simple'}
							name={'password'}
							placeholder={'enter password'}
						/>
					</FlexBox>
				</CardContent>
				<CardFooter
					layout={'fill'}
					stack={'vertical'}
					align={'center'}
					actionButtons={[
						{ label: 'Login', variant: 'primary' },
						{ label: 'Sign Up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
					]}
					onAction={(button) => {
						console.log(button.label);
					}}
				/>
			</Card>
		);
	},
};

export const ImageOnly: Story = {
	render: (args) => {
		return (
			<Card {...args} maxWidth={350} style={{ minWidth: 200, width: 200, height: 200 }}>
				<CardImage alt="Sunflowers" src={image} height={'100%'} />
			</Card>
		);
	},
};

export const NoImage: Story = {
	render: (args) => {
		return (
			<Card {...args} maxWidth={350}>
				<CardTitle
					caption={'Security'}
					title={'Security analysis details'}
					text={'Summary of security analysis and exposure to virus'}
					actionButton={{ label: 'help', iconRight: 'alerts.question', variant: 'text' }}
					onAction={(button) => console.log({ button })}
				/>
				<CardContent>This is the cards content and has and type of children that you might want</CardContent>
				<CardFooter
					layout={'fill'}
					stack={'horizontal'}
					align={'center'}
					actionButtons={[
						{ label: 'Sign Up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
						{ label: 'Login', variant: 'primary' },
					]}
					onAction={(button) => {
						console.log(button.label);
					}}
				/>
			</Card>
		);
	},
};

export const ContentWithoutTitle: Story = {
	tags: ['tests'],
	render: () => (
		<Card padding="8px 16px">
			<>
				<CardContent data-testid="content">Content inside a fragment</CardContent>
				<div>Custom content is preserved</div>
			</>
		</Card>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Custom content is preserved')).toBeVisible();
		await expect(getComputedStyle(canvas.getByTestId('content')).padding).toBe('8px 16px');
	},
};

export const SectionSpacing: Story = {
	tags: ['tests'],
	render: () => (
		<Card padding={16}>
			<CardTitle title="First section" padding="8px 16px" />
			<CardContent data-testid="following">Content after a title</CardContent>
			<CardContent data-testid="repeated">A second content section</CardContent>
			<CardTitle title="Another section" />
			<CardContent data-testid="explicit" padding="8px 12px">
				Explicit padding is preserved
			</CardContent>
			<CardTitle title="Zero padding" />
			<CardContent data-testid="zero" padding={0}>
				No padding
			</CardContent>
		</Card>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(getComputedStyle(canvas.getByTestId('following')).padding).toBe('0px 16px 16px');
		await expect(getComputedStyle(canvas.getByTestId('repeated')).padding).toBe('16px');
		await expect(getComputedStyle(canvas.getByTestId('explicit')).padding).toBe('8px 12px');
		await expect(getComputedStyle(canvas.getByTestId('zero')).padding).toBe('0px');
	},
};

export const NativePropsAndImage: Story = {
	tags: ['tests'],
	args: { onClick: fn() },
	render: (args) => (
		<Card
			{...args}
			id="sample-card"
			role="group"
			aria-label="Sample card"
			className="custom-card"
			style={{ width: 300 }}
		>
			<CardTitle title="Sunflowers" className="custom-title" data-testid="title" style={{ paddingTop: 2 }} />
			<CardImage
				src={image}
				alt="Yellow sunflowers"
				height={100}
				className="custom-image"
				data-testid="image"
				padding={4}
			/>
			<CardContent className="custom-content" data-testid="content" style={{ paddingLeft: 3 }}>
				Card content
			</CardContent>
			<CardFooter className="custom-footer" data-testid="footer" style={{ paddingBottom: 5 }}>
				Footer content
			</CardFooter>
		</Card>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const card = canvas.getByRole('group', { name: 'Sample card' });
		await expect(card).toHaveAttribute('id', 'sample-card');
		await expect(card).toHaveClass('custom-card');
		await expect(card).toHaveStyle({ width: '300px' });
		for (const section of ['title', 'image', 'content', 'footer']) {
			await expect(canvas.getByTestId(section)).toHaveClass(`custom-${section}`);
		}
		await expect(canvas.getByTestId('title')).toHaveStyle({ paddingTop: '2px' });
		await expect(canvas.getByTestId('image')).toHaveStyle({ height: '100px', padding: '4px' });
		await expect(canvas.getByTestId('content')).toHaveStyle({ paddingLeft: '3px' });
		await expect(canvas.getByTestId('footer')).toHaveStyle({ paddingBottom: '5px' });
		await expect(canvas.getByRole('img', { name: 'Yellow sunflowers' })).toBeVisible();
		await userEvent.click(canvas.getByText('Card content'));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

const actionOrder = fn();

export const ActionCallbacks: Story = {
	tags: ['tests'],
	render: () => (
		<Card>
			<CardTitle
				title="Actions"
				actionButton={{ label: 'Help', onClick: () => actionOrder('title-button') }}
				onAction={() => actionOrder('title-action')}
			/>
			<CardFooter
				actionButtons={[
					{ id: 'first', label: 'Save', onClick: () => actionOrder('footer-button') },
					{ id: 'second', label: 'Save' },
				]}
				onAction={() => actionOrder('footer-action')}
			/>
		</Card>
	),
	play: async ({ canvasElement }) => {
		actionOrder.mockClear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Help' }));
		await userEvent.click(canvas.getAllByRole('button', { name: 'Save' })[0]);
		await expect(actionOrder.mock.calls.map(([name]) => name)).toEqual([
			'title-button',
			'title-action',
			'footer-button',
			'footer-action',
		]);
	},
};

export const ImageOverlayAndStyleOverrides: Story = {
	tags: ['tests'],
	args: { onClick: fn() },
	render: (args) => (
		<Card {...args} style={{ width: 300 }}>
			<CardImage
				src={image}
				alt="Sunflower background"
				height={120}
				borderWidth={2}
				borderColor="core-outline-primary"
				style={{ borderColor: '#123456', borderTopWidth: 3 }}
				data-testid="overlay"
			>
				<button type="button">Open image details</button>
			</CardImage>
		</Card>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('img', { name: 'Sunflower background' })).toBeVisible();
		const section = canvas.getByTestId('overlay');
		await expect(section).toHaveStyle({
			borderTopWidth: '3px',
			borderBottomWidth: '2px',
			borderColor: 'rgb(18, 52, 86)',
		});
		await userEvent.click(canvas.getByRole('button', { name: 'Open image details' }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const ImageSeparators: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<Card style={{ width: 200 }}>
				<CardImage src={image} height={80} data-testid="only-image" />
			</Card>
			<Card style={{ width: 200 }}>
				<CardImage src={image} height={80} data-testid="first-image" />
				<CardContent text="Content" />
			</Card>
			<Card style={{ width: 200 }}>
				<CardTitle title="Image separators" />
				<CardImage src={image} height={80} data-testid="middle-image" />
			</Card>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('only-image')).toHaveStyle({ borderTopWidth: '0px', borderBottomWidth: '0px' });
		await expect(canvas.getByTestId('first-image')).toHaveStyle({ borderTopWidth: '0px', borderBottomWidth: '1px' });
		await expect(canvas.getByTestId('middle-image')).toHaveStyle({ borderTopWidth: '1px', borderBottomWidth: '1px' });
	},
};
