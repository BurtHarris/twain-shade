import { render } from '@testing-library/svelte';
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';

describe('ThemeEditor.svelte', () => {
  it('displays live color customizations when provided', () => {
    const themeName = 'Solarized Dark';
    const colorCustomizations = {
      "editor.background": "#222222",
      "editor.foreground": "#eeeeee"
    };
  const { getByText } = render(ThemeEditor, {
      props: {
        theme: [],
        themeName,
        colorCustomizations,
        onChange: () => {}
      }
    });
    expect(getByText('Live Customizations Active')).toBeInTheDocument();
    expect(getByText('Show Customizations')).toBeInTheDocument();
    // The customizations are rendered inside a <pre> block as JSON; match keys/values separately.
    expect(getByText(/"editor\.background"/)).toBeInTheDocument();
    expect(getByText(/#222222/)).toBeInTheDocument();
    expect(getByText(/"editor\.foreground"/)).toBeInTheDocument();
    expect(getByText(/#eeeeee/)).toBeInTheDocument();
  });
});
