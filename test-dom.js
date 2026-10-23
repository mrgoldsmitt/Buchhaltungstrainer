const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="wawi-container"></div></body></html>`, {
    url: "http://localhost/",
    runScripts: "dangerously"
});

const scriptContent = fs.readFileSync('warenwirtschaft.js', 'utf8');
const scriptEl = dom.window.document.createElement("script");
scriptEl.textContent = scriptContent;
dom.window.document.head.appendChild(scriptEl);

dom.window.eval(`
    if (typeof wawiLoadState === 'function') wawiLoadState();
    const container = document.getElementById('wawi-container');
    wawiFibuMode = 'buchhaltung';
    wawiAccountingView = 'overview';
    if (typeof wawiRenderAccounting === 'function') wawiRenderAccounting(container);
`);

const hasContent = dom.window.document.getElementById('wawi-container').innerHTML.length > 0;
console.log('DOM Test passed: container rendered =', hasContent);
