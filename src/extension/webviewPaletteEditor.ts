import * as vscode from 'vscode';
import * as path from 'path';

export function activatePaletteEditorWebview(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('paletteEditor.open', () => {
      const panel = vscode.window.createWebviewPanel(
        'paletteEditor',
        'Palette Editor',
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
        vscode.Uri.file(path.join(context.extensionPath, 'dist', 'PaletteEditor.js'))
      );
      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'dist', 'PaletteEditor.css'))
      );

      panel.webview.html = getWebviewContent(scriptUri, styleUri);
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
      <title>Palette Editor</title>
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
