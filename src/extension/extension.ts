
import * as vscode from 'vscode';
import { activatePaletteEditorWebview } from '@/extension/webviewPaletteEditor.js';

export function activate(context: vscode.ExtensionContext) {
  // Enhanced logging: activation and configuration
  console.log('[twain-shade] Extension activated');
  console.log('[twain-shade] Expecting activation on command: paletteEditor.show');
  console.log('[twain-shade] Extension configuration:', {
    extensionPath: context.extensionPath,
    workspaceFolders: vscode.workspace.workspaceFolders?.map(f => f.uri.fsPath),
    env: process.env.NODE_ENV,
    version: require('../../package.json').version
  });

  activatePaletteEditorWebview(context);

  // Register command dispatcher for palette picker
  const disposable = vscode.commands.registerCommand('paletteEditor.show', () => {
    console.log('[twain-shade] paletteEditor.show command triggered');
    vscode.commands.executeCommand('paletteEditor.open');
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
