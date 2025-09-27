
import * as vscode from 'vscode';
import { activateThemeEditorWebview } from '@/extension/themeEditorWebview.js';

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

  activateThemeEditorWebview(context);

  // Register command dispatcher for theme picker
  const disposable = vscode.commands.registerCommand('themeEditor.show', () => {
    console.log('[twain-shade] themeEditor.show command triggered');
    vscode.commands.executeCommand('themeEditor.open');
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
