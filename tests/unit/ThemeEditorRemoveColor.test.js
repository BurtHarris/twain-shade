import { render } from '@testing-library/svelte';
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';

describe('ThemeEditor.svelte', () => {
  it('removes a color when Remove button is clicked', async () => {
    let changedTheme = null;
    const initialTheme = ['#abcdef', '#123456'];
  const { getAllByText } = render(ThemeEditor, {
      props: {
        theme: initialTheme,
        themeName: 'Solarized Dark',
        colorCustomizations: {},
        onChange: (theme) => { changedTheme = theme; }
      }
    });
    // Click the first Remove button
    await getAllByText('Remove')[0].click();
    expect(changedTheme).not.toContain('#abcdef');
    expect(changedTheme).toContain('#123456');
  });
});
