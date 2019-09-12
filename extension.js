const vscode = require('vscode');
const https = require('https');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "floof" is now active!');
  
  let insertRandomLink = vscode.commands.registerCommand('extension.insertRandomLink', function () {
    getRandomLink().then(function(data) {
      console.log(`Got floof link: ${data}`);
      let textEditor = vscode.window.activeTextEditor;
      const line = textEditor.selection.active.line;
      const char = textEditor.selection.active.character;
      textEditor.edit(edit => {
        edit.insert(new vscode.Position(line, char), String(data));
      });
    });
  });

  let renderRandomImage = vscode.commands.registerCommand('extension.renderRandomImage', function () {
    getRandomLink().then(function (data) {
      console.log(`Got floof link: ${data}`);
      const panel = vscode.window.createWebviewPanel(
        'floofImage',
        'Floof',
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = getWebviewContent(data);
    });
  });

  let renderImageById = vscode.commands.registerCommand('extension.renderImageById', function () {
    vscode.window.showInformationMessage('album/image.jpg');
    userInput().then(function (data) {
      const panel = vscode.window.createWebviewPanel(
        'floofImage',
        'Floof',
        vscode.ViewColumn.One,
        {}
      );

      if (String(data).startsWith('http')) {
        panel.webview.html = getWebviewContent(data);
      } else {
        panel.webview.html = getWebviewContent('https://floof.runarsf.dev/' + data);
      }
    }, error => {
      vscode.window.showErrorMessage(error);
    });
  });

  context.subscriptions.push(insertRandomLink, renderRandomImage, renderImageById);
}
exports.activate = activate;
function deactivate () {}

function getWebviewContent (imageUrl) {
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
    <p>${imageUrl}</p>
</body>
</html>`;
}

function userInput () {
  return new Promise(function (resolve, reject) {
    let userResponse = vscode.window.showInputBox();
    if (userResponse) resolve(userResponse);
    else reject('Input cancelled.');
  });
}

function getRandomLink () {
  return new Promise(function(resolve, reject) {
    https.get('https://floof.runarsf.dev/random?type=json', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(JSON.parse(data).url);
      });
    }).on('error', (err) => {
      console.error(err.message);
      vscode.window.showErrorMessage('Failed to get link, see console for more details.')
      reject(err.message);
    });
  });
}

module.exports = {
	activate,
	deactivate
}
