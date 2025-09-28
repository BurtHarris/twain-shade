// Jest + jsdom test for CSS variable extraction in a browser-like environment
// Run with: jest tests/unit/themeDomUtils.test.js

describe('CSS variable extraction in jsdom', () => {
  beforeAll(() => {
    // Inject test CSS variables
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --vscode-editor-background: #fff;
        --vscode-dropdown-background: #eee;
        --other-var: #000;
      }
    `;
    document.head.appendChild(style);
  });

  it('extracts VSCode theme CSS variables from computed style', () => {
    function getVscodeThemeColorsFromDom() {
      const styles = getComputedStyle(document.documentElement);
      const themeColors = {};
      for (let i = 0; i < styles.length; i++) {
        const key = styles.item(i);
        if (key && key.startsWith('--vscode-')) {
          themeColors[key] = styles.getPropertyValue(key).trim();
        }
      }
      return themeColors;
    }

    const result = getVscodeThemeColorsFromDom();
    expect(result).toEqual({
      '--vscode-editor-background': '#fff',
      '--vscode-dropdown-background': '#eee',
    });
  });
});
