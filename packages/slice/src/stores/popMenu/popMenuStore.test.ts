import { act, cleanup, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PopMenu } from '../../components/PopMenu';
import { getPopMenu, popMenuActions, usePopMenu, usePopMenuActions, usePopMenuStore } from './popMenuStore';

beforeEach(() => popMenuActions.clear());
afterEach(cleanup);

describe('popMenuStore', () => {
    it('holds one menu and replaces it on push', () => {
        const first = { options: [{ label: 'First' }] };
        const second = { options: [{ label: 'Second' }] };
        popMenuActions.push(first);
        expect(getPopMenu()).toBe(first);
        popMenuActions.push(second);
        expect(getPopMenu()).toBe(second);
    });

    it('accepts a composed menu unchanged', () => {
        const menu = createElement(PopMenu, { options: [{ label: 'Edit' }] });
        popMenuActions.push(menu);
        expect(getPopMenu()).toBe(menu);
    });

    it.each(['push null', 'clear'])('%s removes the active menu', (action) => {
        popMenuActions.push({ options: [{ label: 'Edit' }] });
        if (action === 'push null') popMenuActions.push(null);
        else popMenuActions.clear();
        expect(getPopMenu()).toBeNull();
    });

    it('starts a fresh instance when the same menu is pushed again', () => {
        const menu = { options: [{ label: 'Edit' }] };
        popMenuActions.push(menu);
        const version = usePopMenuStore.getState().version;
        popMenuActions.push(menu);
        expect(usePopMenuStore.getState().version).toBeGreaterThan(version);
    });

    it('exposes reactive selectors and stable actions', () => {
        const { result: menu } = renderHook(usePopMenu);
        const { result: actions } = renderHook(usePopMenuActions);
        expect(menu.current).toBeNull();
        const pushed = { options: [{ label: 'Edit' }] };
        act(() => actions.current.push(pushed));
        expect(menu.current).toBe(pushed);
        expect(actions.current).toBe(popMenuActions);
        act(() => actions.current.clear());
        expect(menu.current).toBeNull();
    });
});
