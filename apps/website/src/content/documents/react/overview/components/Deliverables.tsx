import {
	type ButtonProps,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	type FileItem,
	FileList,
	FlexBox,
	Preset,
	UploadArea,
	useTheme,
} from '@apple-pie/slice';
import { classNames, tintFromColor } from '@apple-pie/slice/utils';
import { useCallback, useState } from 'react';
import { useNotice } from '../Shared';

export function Deliverables() {
	const [files, setFiles] = useState<FileItem[]>([]);
	const hasFiles = files && files.length > 0;
	const notice = useNotice();
	const { isDark } = useTheme();
	const bgColor = tintFromColor('core-surface-primary', isDark ? 5 : -2);

	const handleAddUpload = useCallback((uploads: File[]) => {
		const newFiles = uploads.map((file) => {
			return { file, uploading: false, progress: 1 };
		});
		setFiles((prev) => [...prev, ...newFiles]);
	}, []);

	const sendFiles = useCallback(() => {
		notice('Package was sent');
		setFiles([]);
	}, [notice]);

	const actions: ButtonProps[] = [
		{ variant: 'secondary', label: 'Clear', disabled: !hasFiles, onClick: () => setFiles([]) },
		{
			variant: 'primary',
			label: 'Email package',
			iconLeft: 'basic.email',
			onClick: sendFiles,
			disabled: !hasFiles,
			progress: true,
			duration: 1,
		},
	];

	return (
		<Card>
			<CardTitle title="The good stuff goes here" caption="PROJECT FILES" />
			<CardContent>
				<FlexBox preset={Preset.FillStart} gap={16}>
					<UploadArea
						title="Click to upload or drag files here"
						message="Images, documents, and a little inspiration."
						multiple
						onUpload={handleAddUpload}
						backgroundColor={bgColor}
						borderWidth={1}
					/>
					<FlexBox
						preset={Preset.Column}
						gap={16}
						width={'fill'}
						border={'1px dashed var(--core-outline-primary)'}
						padding={16}
						borderRadius={8}
					>
						{hasFiles && (
							<FileList
								attachmentOrientation={'vertical'}
								variant={'attachments'}
								direction={'row'}
								attachmentSize={'m'}
								files={files}
								canRemove={true}
								onChange={(updatedFiles) => setFiles(updatedFiles)}
							/>
						)}
						{!hasFiles && (
							<FlexBox preset={Preset.FillCenter} className={classNames('body-m-regular', 'core-text-tertiary')}>
								Package is empty
							</FlexBox>
						)}
					</FlexBox>
				</FlexBox>
			</CardContent>
			<CardFooter stack={'horizontal'} actionButtons={actions} />
		</Card>
	);
}
