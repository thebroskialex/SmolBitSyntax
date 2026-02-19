const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

async function getPythonPath() {
    const pythonExtension = vscode.extensions.getExtension('ms-python.python');
    if (!pythonExtension) {
        return 'python';
    }
    if (!pythonExtension.isActive) {
        await pythonExtension.activate();
    }

    const api = pythonExtension.exports;
    const executionDetails = api.settings.getExecutionDetails();
    return executionDetails.execCommand ? executionDetails.execCommand[0] : 'python';
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('smolbit.compileAndRun', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) return;

        const filePath = activeEditor.document.fileName;
        const pythonPath = await getPythonPath();

        let outputPath = context.workspaceState.get(filePath);
        if (!outputPath) {
            const saveUri = await vscode.window.showSaveDialog({
            title: "Choose the location to compile to",
            saveLabel: "Compile"
            });

            if (saveUri) {
                outputPath = saveUri.fsPath;
                await context.workspaceState.update(filePath, outputPath);
            } else {
                return; 
            }
        }

        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal("Smolbit Compiler");
        const shellPath = (terminal.name || vscode.env.shell || "").toLowerCase();
        const isPowerShell = shellPath.includes("pwsh") || shellPath.includes("powershell");
        const prefix = isPowerShell ? "& " : "";

        terminal.show();
        terminal.sendText(`${prefix}"${pythonPath}" -m SmolBit compile "${filePath}" "${outputPath}"`);
        terminal.sendText(`${prefix}"${pythonPath}" -m SmolBit run "${outputPath}"`);
    });

    let disposableDebug = vscode.commands.registerCommand('smolbit.compileAndDebug', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) return;

        const filePath = activeEditor.document.fileName;
        const pythonPath = await getPythonPath();

        let outputPath = context.workspaceState.get(filePath);
        if (!outputPath) {
            const saveUri = await vscode.window.showSaveDialog({
            title: "Choose the location to compile to",
            saveLabel: "Compile"
            });

            if (saveUri) {
                outputPath = saveUri.fsPath;
                await context.workspaceState.update(filePath, outputPath);
            } else {
                return; 
            }
        }

        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal("Smolbit Compiler");
        const shellPath = (terminal.name || vscode.env.shell || "").toLowerCase();
        const isPowerShell = shellPath.includes("pwsh") || shellPath.includes("powershell");
        const prefix = isPowerShell ? "& " : "";

        terminal.show();
        terminal.sendText(`${prefix}"${pythonPath}" -m SmolBit compile "${filePath}" "${outputPath}"`);
        terminal.sendText(`${prefix}"${pythonPath}" -m SmolBit debugrun "${outputPath}"`);
    });

    let disposableCompile = vscode.commands.registerCommand('smolbit.compile', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) return;

        const filePath = activeEditor.document.fileName;
        const pythonPath = await getPythonPath();
        
        const saveUri = await vscode.window.showSaveDialog({
            title: "Choose the location to compile to",
            saveLabel: "Compile"
        });

        if (saveUri) {
            outputPath = saveUri.fsPath;
            await context.workspaceState.update(filePath, outputPath);
        } else {
            return; 
        }
        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal("Smolbit Compiler");
        const shellPath = (terminal.name || vscode.env.shell || "").toLowerCase();
        const isPowerShell = shellPath.includes("pwsh") || shellPath.includes("powershell");
        const prefix = isPowerShell ? "& " : "";

        terminal.show();
        terminal.sendText(`${prefix}"${pythonPath}" -m SmolBit compile "${filePath}" "${outputPath}"`);
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableDebug);
    context.subscriptions.push(disposableCompile);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};