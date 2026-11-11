export const usageCode = `
import { PromptInput, type FileItem } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useEffect, useState } from 'react';

export function MessageComposer() {
    const [value, setValue] = useState('');
    const [attachments, setAttachments] = useState<FileItem[]>([
        {id: 'sunflower', file: 'flowers-sunflower.png'},
        {id: 'brief', file: 'Project-brief.pdf'},
    ]);
    useEffect(() => {
        const controller = new AbortController();
        void fetch('/images/flowers-sunflower.png', {signal: controller.signal})
            .then((response) => {
                if (!response.ok) throw new Error('Image preview unavailable');
                return response.blob();
            })
            .then((blob) => {
                if (controller.signal.aborted) return;
                const file = new File([blob], 'flowers-sunflower.png', {type: blob.type});
                setAttachments((files) => files.map((item) => (item.id === 'sunflower' ? {...item, file} : item)));
            })
            .catch(() => {
                /* Keep the filename fallback if the image is unavailable. */
            });
        return () => controller.abort();
    }, []);
    const [sent, setSent] = useState('');
    return (
        <div style={{width: '100%', display: 'grid', gap: 12}}>
            <PromptInput
                fileListProps={{variant: 'attachments', attachmentSize: 's'}}
                value={value}
                onChange={setValue}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                onToolTip={tipActions.push}
                onSubmit={(message, files) => {
                    setSent(message || \`Sent \${files.length} attachment(s)\`);
                    setAttachments([]);
                }}
            />
            {sent && <output>{sent}</output>}
        </div>
    );
}
`;

export const actionsCode = `
import { PromptInput, type FileItem } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useState } from 'react';

export function PasteComposer() {
    const [value, setValue] = useState('');
    const [attachments, setAttachments] = useState<FileItem[]>([]);
    const [sent, setSent] = useState('');
    return (
        <div style={{width: '100%', display: 'grid', gap: 12}}>
            <PromptInput
                value={value}
                onChange={setValue}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                pasteAttachmentThreshold={200}
                fileListProps={{variant: 'attachments', attachmentSize: 's'}}
                onToolTip={tipActions.push}
                onSubmit={(message, files) => {
                    setSent(message || \`Sent \${files.length} attachment(s)\`);
                    setAttachments([]);
                }}
            />
            {sent && <output>{sent}</output>}
        </div>
    );
}
`;

export const workingCode = `
import { PromptInput } from '@apple-pie/slice';
import { useState } from 'react';

export function WorkingPrompt() {
    const [working, setWorking] = useState(true);
    return (
        <PromptInput
            fileListProps={{variant: 'attachments', attachmentSize: 's'}}
            defaultValue="Summarize the attached report"
            working={working}
            stopEnabled={working}
            onStop={() => setWorking(false)}
            onSubmit={() => setWorking(true)}
        />
    );
}
`;

export const modelsCode = `
import { FlexBox, Preset, Button, PopMenu, PopMenuItem, PromptInput, ToggleButton } from '@apple-pie/slice';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { useState } from 'react';

const models = ['GPT-6.1 Terra', 'GPT-6.1 Sol', 'GPT-6 Astra', 'GPT-6 Luna'];

export function ModelsComposer() {
    const [model, setModel] = useState(models[0]);
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const close = () => setCaller(undefined);
    
    const Models = (caller:HTMLDivElement) => {
        return (
            <PopMenu caller={caller} name="Models" dismissAll={close} onDismiss={close}>
                {models.map((name) => {
                    return <PopMenuItem key={name}  id={name} label={name} toggle toggled={model === name} autoDismiss onClick={() => setModel(name)} />
                })}
            </PopMenu>
        );
    }
    
    return (
        <PromptInput
            fileListProps={{variant: 'attachments', attachmentSize: 's'}}
            onToolTip={tipActions.push}
            onSubmit={(message) => console.log(model, message)}
        >
            <FlexBox preset={Preset.ButtonBar} flex={1} justify={'end'} padding={"0-8"}>
                <Button
                    label={model}
                    variant="outline"
                    backgroundColor={'core-fill-primary'}
                    iconRight={'arrows.chevron-down'}
                    aria-haspopup="menu"
                    borderWidth={0}
                    aria-expanded={Boolean(caller)}
                    onClick={(event) => {
                        if (event) setCaller(event.currentTarget);
                    }}
                />
                <ToggleButton icon={'media.mic'} backgroundColor={'core-fill-primary'} borderRadius={100}/>
                {caller && <Models caller={caller} />}
            </FlexBox>
        </PromptInput>
    );
}
`;
