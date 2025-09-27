import PaletteEditor from './PaletteEditor.svelte';

/**
 * VS Code webview API global declaration for TypeScript.
 * Suppresses warnings for acquireVsCodeApi and postMessage.
 */
declare var acquireVsCodeApi: (() => { postMessage: (message: any) => void }) | undefined;
/**
 * VS Code webview API injected into the window object.
 * Allows communication from the webview to the extension host.
 * @see https://code.visualstudio.com/api/extension-guides/webview#webview-api
 */
declare global {
  interface Window {
    /**
     * VS Code API for posting messages to the extension host.
     * Only available when running inside a VS Code webview.
     */
    vscode?: {
      /**
       * Post a message to the VS Code extension host.
       * @param message - The message object to send.
       */
      postMessage: (message: any) => void;
    };
  }
}

const target = document.getElementById('app');
if (!target) {
  throw new Error("Target element #app not found");
}
const app = new PaletteEditor({
  target,
  props: {
    palette: []
  }
});

// Detect VS Code webview API
function getVsCodeApi() {
  if (window.vscode && typeof window.vscode.postMessage === 'function') {
    return window.vscode;
  }
  // VS Code webview API may be injected as acquireVsCodeApi()
  if (typeof acquireVsCodeApi === 'function') {
    return acquireVsCodeApi();
  }
  return null;
}

const vscodeApi = getVsCodeApi();

app.$on('ok', (event: CustomEvent<{ palette: any[] }>) => {
  const palette = event.detail.palette;
  // Send palette to VS Code extension webview
  if (vscodeApi) {
    vscodeApi.postMessage({ type: 'palette-ok', palette });
  } else if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage({ type: 'palette-ok', palette }, '*');
  }
});

app.$on('cancel', () => {
  // Notify VS Code extension webview of cancel
  if (vscodeApi) {
    vscodeApi.postMessage({ type: 'palette-cancel' });
  } else if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage({ type: 'palette-cancel' }, '*');
  }
});
