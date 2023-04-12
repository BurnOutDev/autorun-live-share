import * as vscode from 'vscode';
import * as clipboard from 'copy-paste';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.startLiveShare', async () => {
      // Check if the Live Share extension is available
      const liveShareExtension = vscode.extensions.getExtension('ms-vsliveshare.vsliveshare');
      if (liveShareExtension) {
        // Save the current clipboard content
        const previousClipboardContent = clipboard.paste();

        // Start a new Live Share session
        await vscode.commands.executeCommand('liveshare.start');

        // Wait for the clipboard content to change (collaboration link is copied)
        let newClipboardContent = clipboard.paste();
        while (newClipboardContent === previousClipboardContent) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          newClipboardContent = clipboard.paste();
        }

        // The new clipboard content should be the collaboration link
        const collaborationLink = newClipboardContent;
        console.log('Collaboration Link:', collaborationLink);

        // Restore the previous clipboard content
        clipboard.copy(previousClipboardContent);
      } else {
        vscode.window.showErrorMessage('The Live Share extension is not installed. Please install it and try again.');
      }
    })
  );

  // Automatically start a Live Share session when the extension is activated
  vscode.commands.executeCommand('extension.startLiveShare');
}

export function deactivate() {}
