const fs = require('fs-extra');
const {getDestDir} = require('./paths');

function replace(str, find, replace) {
    return str.split(find).join(replace);
}

async function editFile(path, edit) {
    const content = await fs.readFile(path, 'utf8');
    await fs.outputFile(path, edit(content));
}

async function replaceInFile(path, from, to) {
    return await editFile(path, (content) => {
        content = replace(content, from, to);
        return content;
    });
}

async function edgify({production}) {
    const buildDir = getDestDir({production});
    const edgeDir = getDestDir({production, edge: true});

    // Copy files
    await fs.copy(buildDir, edgeDir);

    // Replace `chrome.` with `browser.`
    await replaceInFile(`${edgeDir}/background/index.js`, 'chrome.', 'browser.');
    await replaceInFile(`${edgeDir}/inject/index.js`, 'chrome.', 'browser.');
    await replaceInFile(`${edgeDir}/ui/devtools/index.js`, 'chrome.', 'browser.');
    await replaceInFile(`${edgeDir}/ui/popup/index.js`, 'chrome.', 'browser.');
    await replaceInFile(`${edgeDir}/ui/stylesheet-editor/index.js`, 'chrome.', 'browser.');
    await replaceInFile(`${edgeDir}/manifest.json`, 'Dark Reader', 'DrkRdr for Edge');
    await replaceInFile(`${edgeDir}/manifest.json`, 'version": "', 'version": "edge-');
    await replaceInFile(`${edgeDir}/background/index.js`, '!browser.browserAction.setIcon', '!browser.browserAction || !browser.browserAction.setIcon');
    await replaceInFile(`${edgeDir}/background/index.js`, 'browser.i18n.getUILanguage()', '"en-US"');
    await replaceInFile(`${edgeDir}/ui/devtools/index.js`, 'browser.i18n.getUILanguage()', '"en-US"');
    await replaceInFile(`${edgeDir}/ui/stylesheet-editor/index.js`, 'browser.i18n.getUILanguage()', '"en-US"');
}

module.exports = edgify;
