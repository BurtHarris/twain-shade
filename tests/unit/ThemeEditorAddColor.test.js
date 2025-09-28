import { render } from '@testing-library/svelte';
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';

describe('ThemeEditor.svelte', () => {
  it('calls onChange when a color is added', async () => {
    let changedTheme = null;
    const { getByPlaceholderText, getByText } = render(ThemeEditor, {
      props: {
        theme: [],
        themeName: 'Solarized Dark',
        colorCustomizations: {},
        onChange: (theme) => { changedTheme = theme; }
      }
    });
    const input = getByPlaceholderText('New Color');
    input.value = '#123456';
    await input.dispatchEvent(new Event('input'));
    await getByText('Add Color').click();
    expect(changedTheme).toContain('#123456');
  });
});
