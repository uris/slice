'use client';

import {MainMenu} from '@/components/MainMenu/MainMenu';
import {minScreenSize, surfaceDark} from '@/src/consts/consts';
import {FlexDiv, Preset} from '@apple-pie/slice';

export function Content() {
    return (
        <FlexDiv preset={Preset.FillStart} scrollBox background={surfaceDark} style={{minWidth: minScreenSize}}>
            <MainMenu/>
        </FlexDiv>
    );
}
