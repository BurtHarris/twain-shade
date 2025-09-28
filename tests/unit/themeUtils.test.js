// Unit tests for theme utility functions
// These tests run in Node and do not require VS Code or browser APIs

import assert from 'node:assert/strict';

// Example pure utility: extract VSCode theme CSS variables from a mock style object
function extractVscodeThemeColors(styles) {
  const themeColors = {};
  for (const key in styles) {
    if (key.startsWith('--vscode-')) {
      themeColors[key] = styles[key];
    }
  }
  return themeColors;
}

describe('extractVscodeThemeColors', () => {
  it('returns only --vscode-* variables', () => {
    const mockStyles = {
      '--vscode-editor-background': '#fff',
      '--vscode-dropdown-background': '#eee',
      '--other-var': '#000',
    };
    const result = extractVscodeThemeColors(mockStyles);
    assert.deepStrictEqual(result, {
      '--vscode-editor-background': '#fff',
      '--vscode-dropdown-background': '#eee',
    });
  });

  it('returns empty object if no vscode variables', () => {
    const mockStyles = {
      '--other-var': '#000',
      'color': 'red',
    };
    const result = extractVscodeThemeColors(mockStyles);
    assert.deepStrictEqual(result, {});
  });
});
