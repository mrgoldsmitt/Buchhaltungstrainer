const fs = require('fs');

// We will mock document and window
global.window = {};
global.document = {
    getElementById: () => ({ remove: () => {} }),
    createElement: () => ({}),
    body: { appendChild: () => {} }
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

eval(fs.readFileSync('warenwirtschaft.js', 'utf8'));

if (typeof wawiLoadState === 'function') {
    wawiLoadState();
}

const state = (typeof WaWiState !== 'undefined') ? WaWiState : (global.WaWiState || global.window.WaWiState);
console.log('Test script completed successfully. WaWi State initialized:', Boolean(state));
