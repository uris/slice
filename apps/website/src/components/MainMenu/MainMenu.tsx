import {menuOptionsReact, menuOptionsReactNative} from '@/docs/registry/menu';
import {usePackageType} from '@/docs/stores/store';
import {Package, surfaceYellow} from '@/src/consts/consts';
import {classNames} from '@/src/utils/misc';
import {usePathname} from 'next/navigation';
import styles from './MainMenu.module.css';

export type MainMenuOption = {
    label: string;
    param: string;
    url: string;
    target?: '_top' | '_blank';
};

export interface MainMenuProps {
    options?: MainMenuOption[];
}

export function MainMenu(props: Readonly<MainMenuProps>) {
    const packageType = usePackageType();
    const isReact = packageType === Package.React;
    const pathname = usePathname();
    const params = new Set(pathname.split('/'));
    const {options = isReact ? menuOptionsReact : menuOptionsReactNative} = props;

    const handleClick = (option: MainMenuOption) => {
        const {url, target} = option;
        console.log(url);
        if (url) window.open(url, target ?? '_top');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.menu}>
                {options.map((option: MainMenuOption, index: number) => {
                    const {label, param} = option;
                    const color = params.has(param) ? surfaceYellow : 'var(--core-text-primary)';
                    return (
                        <input
                            className={classNames(styles.button, styles.type)}
                            style={{color}}
                            key={`main_menu_${label}`}
                            type={'button'}
                            value={label}
                            onClick={() => handleClick(option)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
