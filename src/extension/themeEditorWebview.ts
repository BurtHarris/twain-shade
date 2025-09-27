import * as vscode from 'vscode';
import * as path from 'path';

export function activateThemeEditorWebview(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('themeEditor.open', () => {
      const panel = vscode.window.createWebviewPanel(
        'themeEditor',
        'Theme Editor',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'dist')),
            vscode.Uri.file(path.join(context.extensionPath, 'src', 'components'))
          ]
        }
      );

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'dist', 'ThemeEditor.js'))
      );
      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'dist', 'ThemeEditor.css'))
      );

      panel.webview.html = getWebviewContent(scriptUri, styleUri);

      // --- Theme & Customization Integration ---
      // Systematic accessibility: Send both the current base color theme name and any live color customizations to the webview.
      // - themeName: from workbench.colorTheme (the selected core theme)
      // - colorCustomizations: from workbench.colorCustomizations (user/extension tweaks)
      // See ThemeEditor.svelte and main.ts for runtime handling and display.
      const sendThemeInfo = () => {
        const config = vscode.workspace.getConfiguration('workbench');
        const themeName = config.get('colorTheme') || 'Default';
        const colorCustomizations = config.get('colorCustomizations') || {};
        panel.webview.postMessage({ type: 'theme-info', name: themeName, customizations: colorCustomizations });
      };
      // Send theme info after a short delay to ensure webview is ready
      setTimeout(sendThemeInfo, 300);
    })
  );
}

function getWebviewContent(scriptUri: vscode.Uri, styleUri: vscode.Uri) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${styleUri}">
      <title>Theme Editor</title>
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
