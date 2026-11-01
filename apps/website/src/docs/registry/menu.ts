import type {MainMenuOption} from '@/components/MainMenu/MainMenu';

export const menuOptionsReact: MainMenuOption[] = [
    {
        label: 'Docs',
        param: 'docs',
        url: '/docs/react/get-started',
        target: '_top',
    },
    {
        label: 'Figma',
        param: 'figma',
        url: '/figma/',
        target: '_top',
    },
    {
        label: 'AI Kit',
        param: 'ai-kit',
        url: '/ai-kit',
        target: '_top',
    },
];

export const menuOptionsReactNative: MainMenuOption[] = [
    {
        label: 'Docs',
        param: 'docs',
        url: '/docs/react-native/get-started',
        target: '_top',
    },
];
