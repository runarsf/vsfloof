const vscode = require('vscode');
const https = require('https');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "floof" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  // https://github.com/Microsoft/vscode/issues/12898
  // https://code.visualstudio.com/api/extension-guides/webview
  
  let insertLink = vscode.commands.registerCommand('extension.insertLink', function () {
    getRandomLink.then(function (data) {
      console.log(`Got floof link: ${data}`);
      let textEditor = vscode.window.activeTextEditor;
      textEditor.edit(edit => {
        edit.insert(new vscode.Position(0, 0), data);
      });
    }, error => {
      console.error('onRejected function called: ' + error.message);
    });
  });

  let renderImage = vscode.commands.registerCommand('extension.renderWebview', function () {
    getRandomLink.then(function (data) {
      console.log(`Got floof link: ${data}`);
      const panel = vscode.window.createWebviewPanel(
        'floofImage',
        'Floof',
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = getWebviewContent(data);
    }, error => {
      console.error('onRejected function called: ' + error.message);
    });
  });

	context.subscriptions.push(insertLink, renderImage);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function getWebviewContent(imageUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<meta http-equiv="Content-Security-Policy" content="default-src * gap:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: android-webview-video-poster:; style-src * 'unsafe-inline';">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${imageUrl}" />
</body>
</html>`;
}

var getRandomLink = new Promise(function (resolve, reject) {
  https.get('https://floof.runarsf.dev/random?type=json', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(JSON.parse(data).url);
      resolve(JSON.parse(data).url);
    });
  }).on("error", (err) => {
    reject(err.message);
  });
});

module.exports = {
	activate,
	deactivate
}
