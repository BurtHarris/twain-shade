import { render } from '@testing-library/svelte';
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';

describe('ThemeEditor.svelte', () => {
  it('displays the current base color theme name', () => {
    const themeName = 'Solarized Dark';
    const { getByText } = render(ThemeEditor, {
      props: {
        theme: [],
        themeName,
        colorCustomizations: {},
        onChange: () => {}
      }
    });
    // The DOM splits "Current Theme:" and the theme name into separate nodes.
    // Match the theme name directly instead of the whole phrase.
    expect(getByText(themeName)).toBeInTheDocument();
  });
});
