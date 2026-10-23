const fs = require('fs');

global.window = {};
global.document = {
    getElementById: () => ({ remove: () => {}, innerHTML: '' }),
    createElement: () => ({}),
    body: { appendChild: () => {} }
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

const script = fs.readFileSync('warenwirtschaft.js', 'utf8');
eval(script);

wawiLoadState();

const container = { innerHTML: '' };
wawiSetAccountingView('overview');
wawiRenderAccounting(container);

const lines = container.innerHTML.split('\n');
const idx = lines.findIndex(l => l.includes('Maschinen') && l.includes('wawi-tkonto-entry-label'));
if(idx !== -1) {
    console.log(lines.slice(idx - 6, idx + 6).join('\n'));
} else {
    console.log('Not found');
}
