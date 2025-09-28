import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemeEditor from '../../../src/extension/webview/ThemeEditor.svelte';

describe('ThemeEditor.svelte', () => {
  it('displays the theme name from props', () => {
    const themeName = 'Solarized Dark';
    const { getByText } = render(ThemeEditor, { props: { themeName } });
    expect(getByText(themeName)).toBeTruthy();
  });
});
