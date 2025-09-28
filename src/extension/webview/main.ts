/**
 * VS Code Theme Color API for Webview
 * -----------------------------------
 * - getVscodeThemeColors(): Enumerates all CSS variables prefixed with --vscode- at runtime.
 * - debugLogThemeColors(): Logs all available theme colors to the console for debugging.
 * - Exposed on window for Svelte components and other webview scripts.
 * - Used by ThemeColorSelector.svelte for runtime color selection and preview.
 *
 * Usage:
 *   window.getVscodeThemeColors() // returns { '--vscode-dropdown-background': '#fff', ... }
 *   window.debugLogThemeColors() // logs all theme colors to console
 *
 * See ThemeColorSelector.svelte for UI integration.
 */
import ThemeEditor from "./ThemeEditor.svelte";

/**
 * VS Code webview API global declaration for TypeScript.
 * Suppresses warnings for acquireVsCodeApi and postMessage.
 */
declare let acquireVsCodeApi:
  | (() => { postMessage: (message: unknown) => void })
  | undefined;
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
      postMessage: (message: unknown) => void;
    };
  }
}

const target = document.getElementById("app");
if (!target) {
  throw new Error("Target element #app not found");
}

// Theme color API: enumerate all --vscode-* CSS variables
function getVscodeThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const themeColors: Record<string, string> = {};
  for (let i = 0; i < styles.length; i++) {
    const key = styles.item(i);
    if (key && key.startsWith("--vscode-")) {
      themeColors[key] = styles.getPropertyValue(key).trim();
    }
  }
  return themeColors;
}

// Debugging aid: log theme colors to console
function debugLogThemeColors() {
  const colors = getVscodeThemeColors();
  console.group("VSCode Theme Colors");
  Object.entries(colors).forEach(([k, v]) => console.log(k, v));
  console.groupEnd();
  // Intentionally return void to match the Window augmentation in Svelte components
  // which declare debugLogThemeColors?: () => void;
}

declare global {
  interface Window {
    getVscodeThemeColors?: typeof getVscodeThemeColors;
    debugLogThemeColors?: typeof debugLogThemeColors;
  }
}
window.getVscodeThemeColors = getVscodeThemeColors;
window.debugLogThemeColors = debugLogThemeColors;

const app = new ThemeEditor({
  target,
  props: {
    theme: [],
    themeName: "",
    onChange: (theme: string[]) => {
      // Default handler: can be extended to post message to extension host
      console.log("Theme changed:", theme);
    },
  },
});

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "theme-info") {
    app.$set({
      themeName: event.data.name,
      colorCustomizations: event.data.customizations,
    });
  }
});

// Detect VS Code webview API
function getVsCodeApi() {
  if (window.vscode && typeof window.vscode.postMessage === "function") {
    return window.vscode;
  }
  // VS Code webview API may be injected as acquireVsCodeApi()
  if (typeof acquireVsCodeApi === "function") {
    return acquireVsCodeApi();
  }
  return null;
}

const vscodeApi = getVsCodeApi();

app.$on("ok", (event: CustomEvent<{ theme: unknown[] }>) => {
  const theme = event.detail.theme as unknown[];
  // Send theme to VS Code extension webview
  if (vscodeApi) {
    vscodeApi.postMessage({ type: "theme-ok", theme });
  } else if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage({ type: "theme-ok", theme }, "*");
  }
});

app.$on("cancel", () => {
  // Notify VS Code extension webview of cancel
  if (vscodeApi) {
    vscodeApi.postMessage({ type: "theme-cancel" });
  } else if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage({ type: "theme-cancel" }, "*");
  }
});
