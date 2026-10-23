// =====================================================
// inventar.js - Inventar erstellen (Gruppieren & Ordnen)
// =====================================================

let inventarMappings = {};
let inventarSubMappings = {};
let inventarSums = {
    sumAnlage: null,
    sumUmlauf: null,
    sumVermoegen: null,
    sumLangSchulden: null,
    sumKurzSchulden: null,
    sumSchulden: null,
    eigenkapital: null
};

function renderInventar() {
    const container = document.getElementById('inventar-container');
    if (!container) return;

    if (!AppState.inventurData || AppState.inventurData.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-muted);">Noch keine Daten vorhanden</h3>
                <p>Bitte schließe zuerst die Inventur ab.</p>
                <button class="btn-primary" id="btn-goto-inventur" onclick="setMode('inventur')">Zur Inventur</button>
            </div>
        `;
        const gotoBtn = document.getElementById('btn-goto-inventur');
        if (gotoBtn) {
            gotoBtn.addEventListener('dblclick', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showInventarPasswordModal(true);
            });
        }
        return;
    }

    // Initialize mappings if empty
    if (Object.keys(inventarMappings).length === 0) {
        AppState.inventurData.forEach(item => {
            inventarMappings[item.id] = 'none';
        });
    }
    if (Object.keys(inventarSubMappings).length === 0) {
        AppState.inventurData.forEach(item => {
            inventarSubMappings[item.id] = 'none';
        });
    }

    // Build the selection list
    let html = `
        <div class="card" style="margin-bottom: 1rem; overflow-x: auto;">
            <p style="margin-bottom: 1rem; font-size: clamp(0.8rem, 2.5vw, 1rem);"><strong>Schritt 1:</strong> Ordne die Posten aus der Inventur in die passenden Kategorien des Inventars ein:</p>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: clamp(0.7rem, 2vw, 0.9rem);" class="osi-table">
                <thead>
                    <tr>
                        <th style="padding: 0.4rem 0.3rem; border-bottom: 2px solid var(--card-border);">Posten</th>
                        <th style="padding: 0.4rem 0.3rem; border-bottom: 2px solid var(--card-border); text-align: right; white-space: nowrap;">Wert</th>
                        <th style="padding: 0.4rem 0.3rem; border-bottom: 2px solid var(--card-border);">Grobe Kategorie</th>
                        <th style="padding: 0.4rem 0.3rem; border-bottom: 2px solid var(--card-border);">Genaueres Konto</th>
                    </tr>
                </thead>
                <tbody>
    `;

    const displayData = AppState.inventurData.slice().sort((a, b) => a.name.localeCompare(b.name, 'de'));
    displayData.forEach(item => {
        const total = item.totalValue != null ? item.totalValue : (item.amount * item.pricePerUnit);
        const currentMapping = inventarMappings[item.id];

        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 0.3rem;">${item.name}</td>
                <td style="padding: 0.3rem; text-align: right; font-family: monospace; white-space: nowrap;">${formatEur(total)}</td>
                <td style="padding: 0.3rem;">
                    <select class="inventar-select" id="inv-map-${item.id}" onchange="updateInventarMapping('${item.id}', this.value)" style="padding: 0.25rem; background: var(--bg-color); color: var(--text-main); border: 1px solid var(--card-border); border-radius: 4px; width: 100%; font-size: clamp(0.65rem, 1.8vw, 0.85rem);">
                        <option value="none" ${currentMapping === 'none' ? 'selected' : ''}>-- Bitte wählen --</option>
                        <optgroup label="A. Vermögen">
                            <option value="anlage" ${currentMapping === 'anlage' ? 'selected' : ''}>Anlagevermögen</option>
                            <option value="umlauf" ${currentMapping === 'umlauf' ? 'selected' : ''}>Umlaufvermögen</option>
                        </optgroup>
                        <optgroup label="B. Schulden">
                            <option value="lang_schuld" ${currentMapping === 'lang_schuld' ? 'selected' : ''}>Langfristige Schulden</option>
                            <option value="kurz_schuld" ${currentMapping === 'kurz_schuld' ? 'selected' : ''}>Kurzfristige Schulden</option>
                        </optgroup>
                    </select>
                </td>
                <td style="padding: 0.3rem;">
                    <select class="inventar-select" id="inv-sub-map-${item.id}" onchange="updateInventarSubMapping('${item.id}', this.value)" style="padding: 0.25rem; background: var(--bg-color); color: var(--text-main); border: 1px solid var(--card-border); border-radius: 4px; width: 100%; font-size: clamp(0.65rem, 1.8vw, 0.85rem);">
                        <option value="none" ${inventarSubMappings[item.id] === 'none' ? 'selected' : ''}>-- Bitte wählen --</option>
                        <optgroup label="Anlagevermögen">
                            <option value="bebaute_grundstuecke" ${inventarSubMappings[item.id] === 'bebaute_grundstuecke' ? 'selected' : ''}>Bebaute Grundstücke</option>
                            <option value="maschinen" ${inventarSubMappings[item.id] === 'maschinen' ? 'selected' : ''}>Techn. Anlagen und Maschinen</option>
                            <option value="fuhrpark" ${inventarSubMappings[item.id] === 'fuhrpark' ? 'selected' : ''}>Fuhrpark</option>
                            <option value="bga" ${inventarSubMappings[item.id] === 'bga' ? 'selected' : ''}>Betriebs- und Geschäftsausstattung</option>
                        </optgroup>
                        <optgroup label="Umlaufvermögen">
                            <option value="rohstoffe" ${inventarSubMappings[item.id] === 'rohstoffe' ? 'selected' : ''}>Rohstoffe</option>
                            <option value="hilfsstoffe" ${inventarSubMappings[item.id] === 'hilfsstoffe' ? 'selected' : ''}>Hilfsstoffe</option>
                            <option value="betriebsstoffe" ${inventarSubMappings[item.id] === 'betriebsstoffe' ? 'selected' : ''}>Betriebsstoffe</option>
                            <option value="unfertige_erzeugnisse" ${inventarSubMappings[item.id] === 'unfertige_erzeugnisse' ? 'selected' : ''}>Unfertige Erzeugnisse</option>
                            <option value="fertige_erzeugnisse" ${inventarSubMappings[item.id] === 'fertige_erzeugnisse' ? 'selected' : ''}>Fertige Erzeugnisse</option>
                            <option value="handelswaren" ${inventarSubMappings[item.id] === 'handelswaren' ? 'selected' : ''}>Handelswaren</option>
                            <option value="forderungen_ll" ${inventarSubMappings[item.id] === 'forderungen_ll' ? 'selected' : ''}>Forderungen a. L. L.</option>
                            <option value="bank" ${inventarSubMappings[item.id] === 'bank' ? 'selected' : ''}>Bankguthaben</option>
                            <option value="kasse" ${inventarSubMappings[item.id] === 'kasse' ? 'selected' : ''}>Kasse</option>
                        </optgroup>
                        <optgroup label="Schulden">
                            <option value="darlehen" ${inventarSubMappings[item.id] === 'darlehen' ? 'selected' : ''}>Verb. gegenüber Kreditinstituten</option>
                            <option value="verbindlichkeiten_ll" ${inventarSubMappings[item.id] === 'verbindlichkeiten_ll' ? 'selected' : ''}>Verbindlichkeiten a. LL.</option>
                            <option value="sonstige_verbindlichkeiten" ${inventarSubMappings[item.id] === 'sonstige_verbindlichkeiten' ? 'selected' : ''}>Sonstige Verbindlichkeiten</option>
                        </optgroup>
                    </select>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Step 2: Summen-Eingabe
    html += `
        <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--secondary);">
            <p style="margin-bottom: 1rem; font-size: clamp(0.8rem, 2.5vw, 1rem);"><strong>Schritt 2:</strong> Berechne die Summen und das Eigenkapital:</p>
            
            <div class="inventar-sum-row">
                <span>Summe Anlagevermögen:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" id="inv-sum-anlage" value="${inventarSums.sumAnlage ?? ''}" onchange="saveInventarSum('sumAnlage', this.value)">
            </div>
            <div class="inventar-sum-row">
                <span>Summe Umlaufvermögen:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" id="inv-sum-umlauf" value="${inventarSums.sumUmlauf ?? ''}" onchange="saveInventarSum('sumUmlauf', this.value)">
            </div>
            <div class="inventar-sum-row inventar-sum-highlight" style="margin-bottom: 1rem; color: #10b981;">
                <span>A. Summe Vermögen:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" style="font-weight: bold; border-color: #10b981;" id="inv-sum-vermoegen" value="${inventarSums.sumVermoegen ?? ''}" onchange="saveInventarSum('sumVermoegen', this.value)">
            </div>

            <div class="inventar-sum-row">
                <span>Summe langfr. Schulden:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" id="inv-sum-lang" value="${inventarSums.sumLangSchulden ?? ''}" onchange="saveInventarSum('sumLangSchulden', this.value)">
            </div>
            <div class="inventar-sum-row">
                <span>Summe kurzfr. Schulden:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" id="inv-sum-kurz" value="${inventarSums.sumKurzSchulden ?? ''}" onchange="saveInventarSum('sumKurzSchulden', this.value)">
            </div>
            <div class="inventar-sum-row inventar-sum-highlight" style="margin-bottom: 1rem; color: #ef4444;">
                <span>B. Summe Schulden:</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" style="font-weight: bold; border-color: #ef4444;" id="inv-sum-schulden" value="${inventarSums.sumSchulden ?? ''}" onchange="saveInventarSum('sumSchulden', this.value)">
            </div>

            <div class="inventar-sum-row inventar-ek-row">
                <span>C. Eigenkapital (A − B):</span>
                <input type="number" step="any" class="inv-input inventar-sum-input" style="font-weight: bold; border-color: var(--primary);" id="inv-eigenkapital" value="${inventarSums.eigenkapital ?? ''}" onchange="saveInventarSum('eigenkapital', this.value)">
            </div>
        </div>
    `;

    // Submit Button
    html += `
        <div style="margin-top: 1rem;">
            <button class="btn-primary" id="btn-inventar-submit" style="width: 100%; padding: 0.8rem;">Inventar abschließen / prüfen</button>
            <div id="inventar-validation-feedback" style="margin-top: 1rem; font-weight: bold; text-align: center; min-height: 2.5rem;"></div>
        </div>
        <div id="inventar-live-container" style="margin-top: 2rem; display: none;"></div>
    `;

    container.innerHTML = html;

    // Single-click handler
    const submitBtn = document.getElementById('btn-inventar-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            validateInventar();
        });
        submitBtn.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showInventarPasswordModal(false);
        });
    }

    if (typeof renderLiveInventarDocument === 'function') {
        setTimeout(renderLiveInventarDocument, 50);
    }
}

function saveInventarSum(key, value) {
    if (value !== '' && value != null) {
        inventarSums[key] = parseFloat(String(value).replace(',', '.'));
    } else {
        inventarSums[key] = null;
    }
    if (typeof renderLiveInventarDocument === 'function') renderLiveInventarDocument();
}

function updateInventarMapping(id, value) {
    inventarMappings[id] = value;
    if (typeof renderLiveInventarDocument === 'function') renderLiveInventarDocument();
}

function updateInventarSubMapping(id, value) {
    inventarSubMappings[id] = value;
    if (typeof renderLiveInventarDocument === 'function') renderLiveInventarDocument();
}

function finishInventar() {
    const correct = getCorrectInventarSums();
    AppState.inventarData = {
        aktiva: [
            { name: "Anlagevermögen", value: correct.sumAnlage },
            { name: "Umlaufvermögen", value: correct.sumUmlauf }
        ],
        passiva: [
            { name: "Eigenkapital", value: correct.eigenkapital },
            { name: "Langfristige Verbindl.", value: correct.sumLangSchulden },
            { name: "Kurzfristige Verbindl.", value: correct.sumKurzSchulden }
        ],
        total: correct.sumVermoegen
    };
    AppState.onDataUpdate('inventar');
    setMode('bilanz');
}

// --- Inventar Validierung ---
function validateInventar() {
    if (!AppState.inventurData || AppState.inventurData.length === 0) return;

    const feedback = document.getElementById('inventar-validation-feedback');
    let errors = [];

    // Step 1: Check all mappings
    let allAssigned = Object.values(inventarMappings).every(val => val !== 'none');
    let allSubAssigned = Object.values(inventarSubMappings).every(val => val !== 'none');
    if (!allAssigned || !allSubAssigned) {
        errors.push('Nicht alle Posten sind zugeordnet.');
    }

    // Check correct mappings
    const correctMappings = getCorrectInventarMappings();
    const correctSubMappings = getCorrectInventarSubMappings();
    let mappingErrors = 0;
    
    // Validate main categories
    AppState.inventurData.forEach(item => {
        const selMap = document.getElementById('inv-map-' + item.id);
        const selSubMap = document.getElementById('inv-sub-map-' + item.id);
        
        if (selMap) {
            selMap.style.borderColor = 'var(--card-border)';
            selMap.style.background = 'var(--bg-color)';
            selMap.style.borderWidth = '1px';
        }
        if (selSubMap) {
            selSubMap.style.borderColor = 'var(--card-border)';
            selSubMap.style.background = 'var(--bg-color)';
            selSubMap.style.borderWidth = '1px';
        }
        
        if (true) {
            let itemCorrect = true;
            if (inventarMappings[item.id] === correctMappings[item.id]) {
                if(selMap) {
                    selMap.style.borderColor = '#10b981';
                    selMap.style.background = 'rgba(16, 185, 129, 0.1)';
                    selMap.style.borderWidth = '2px';
                }
            } else {
                if(selMap) {
                    selMap.style.borderColor = '#ef4444';
                    selMap.style.background = 'rgba(239, 68, 68, 0.1)';
                    selMap.style.borderWidth = '2px';
                }
                itemCorrect = false;
            }
            
            if (inventarSubMappings[item.id] === correctSubMappings[item.id]) {
                if(selSubMap) {
                    selSubMap.style.borderColor = '#10b981';
                    selSubMap.style.background = 'rgba(16, 185, 129, 0.1)';
                    selSubMap.style.borderWidth = '2px';
                }
            } else {
                if(selSubMap) {
                    selSubMap.style.borderColor = '#ef4444';
                    selSubMap.style.background = 'rgba(239, 68, 68, 0.1)';
                    selSubMap.style.borderWidth = '2px';
                }
                itemCorrect = false;
            }
            
            if(!itemCorrect) mappingErrors++;
        }
    });

    if (allAssigned && allSubAssigned && mappingErrors > 0) {
        errors.push(mappingErrors + ' Zuordnungen sind falsch.');
    }

    // Step 2: Check sums
    const correct = getCorrectInventarSums();
    const tolerance = 0.01;

    function checkVal(id, userVal, correctVal, label) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('valid', 'invalid');
        if (userVal == null || isNaN(userVal)) {
            if (el) el.classList.add('invalid');
            errors.push(label + ' fehlt.');
            return;
        }
        if (Math.abs(userVal - correctVal) < tolerance) {
            if (el) el.classList.add('valid');
        } else {
            if (el) el.classList.add('invalid');
            errors.push(label + ' ist falsch.');
        }
    }

    if (true) {
        checkVal('inv-sum-anlage', inventarSums.sumAnlage, correct.sumAnlage, 'Summe Anlagevermögen');
        checkVal('inv-sum-umlauf', inventarSums.sumUmlauf, correct.sumUmlauf, 'Summe Umlaufvermögen');
        checkVal('inv-sum-vermoegen', inventarSums.sumVermoegen, correct.sumVermoegen, 'Summe Vermögen');
        checkVal('inv-sum-lang', inventarSums.sumLangSchulden, correct.sumLangSchulden, 'Summe langfr. Schulden');
        checkVal('inv-sum-kurz', inventarSums.sumKurzSchulden, correct.sumKurzSchulden, 'Summe kurzfr. Schulden');
        checkVal('inv-sum-schulden', inventarSums.sumSchulden, correct.sumSchulden, 'Summe Schulden');
        checkVal('inv-eigenkapital', inventarSums.eigenkapital, correct.eigenkapital, 'Eigenkapital');
    }

    if (errors.length === 0) {
        feedback.innerHTML = `<span style="color: #10b981;">🎉 Alles korrekt!</span><br>
            <button class="btn-primary" style="margin-top:0.5rem; padding: 0.6rem;" onclick="finishInventar()">Zur Bilanz wechseln →</button>`;
    } else {
        feedback.innerHTML = `<span style="color: #ef4444;">❌ ${errors[0]}</span>`;
    }
}

function getCorrectInventarSums() {
    let sumAnlage = 0, sumUmlauf = 0, sumLang = 0, sumKurz = 0;
    const correctMappings = getCorrectInventarMappings();

    AppState.inventurData.forEach(item => {
        const total = item.totalValue != null ? item.totalValue : (item.amount * item.pricePerUnit);
        const cat = correctMappings[item.id];
        if (cat === 'anlage') sumAnlage += total;
        if (cat === 'umlauf') sumUmlauf += total;
        if (cat === 'lang_schuld') sumLang += total;
        if (cat === 'kurz_schuld') sumKurz += total;
    });

    return {
        sumAnlage,
        sumUmlauf,
        sumVermoegen: sumAnlage + sumUmlauf,
        sumLangSchulden: sumLang,
        sumKurzSchulden: sumKurz,
        sumSchulden: sumLang + sumKurz,
        eigenkapital: (sumAnlage + sumUmlauf) - (sumLang + sumKurz)
    };
}

function getCorrectInventarMappings() {
    const correct = {};
    if (!AppState.inventurData) return correct;

    const categoryMap = {
        'Mountainbikes Mod. Alp': 'umlauf',
        'Schrauben Typ M8': 'umlauf',
        'Bremszügerolle': 'umlauf',
        'Kassenguthaben': 'umlauf',
        'Bankdarlehen': 'lang_schuld',
        'Rahmen "AlpX"': 'umlauf',
        'Reifen 27.5 Zoll': 'umlauf',
        'Sättel "Comfort"': 'umlauf',
        'Schaltung 12-fach': 'umlauf',
        'Scheibenbremsen': 'umlauf',
        'Speichen': 'umlauf',
        'Federgabeln': 'umlauf',
        'Lack "Titan Schwarz"': 'umlauf',
        'Kettenöl': 'umlauf',
        'E-Bike Rahmen': 'umlauf',
        'Citybikes "Urban"': 'umlauf',
        'Schmierfett': 'umlauf',
        'Girokonto-Guthaben': 'umlauf',
        'Ford. Fahrradladen Meyer': 'umlauf',
        'Ford. Sporthaus König': 'umlauf',
        'Grundstück/Gebäude': 'anlage',
        'Maschinen (CNC-Fräse)': 'anlage',
        'Fuhrpark (Lieferwagen)': 'anlage',
        'BGA (Büroausstattung)': 'anlage',
        'Hypothekendarlehen': 'lang_schuld',
        'Investitionsdarlehen': 'lang_schuld',
        'Verb. a. Lief. u. Leist.': 'kurz_schuld',
        'Sonst. Verbindlichkeiten': 'kurz_schuld'
    };

    AppState.inventurData.forEach(item => {
        correct[item.id] = categoryMap[item.name] || 'umlauf';
    });

    return correct;
}

function getCorrectInventarSubMappings() {
    const correct = {};
    if (!AppState.inventurData) return correct;

    const subCategoryMap = {
        'Mountainbikes Mod. Alp': 'fertige_erzeugnisse',
        'Schrauben Typ M8': 'hilfsstoffe',
        'Bremszügerolle': 'hilfsstoffe',
        'Kassenguthaben': 'kasse',
        'Bankdarlehen': 'darlehen',
        'Rahmen "AlpX"': 'rohstoffe',
        'Reifen 27.5 Zoll': 'rohstoffe',
        'Sättel "Comfort"': 'rohstoffe',
        'Schaltung 12-fach': 'rohstoffe',
        'Scheibenbremsen': 'rohstoffe',
        'Speichen': 'rohstoffe',
        'Federgabeln': 'rohstoffe',
        'Lack "Titan Schwarz"': 'hilfsstoffe',
        'Kettenöl': 'hilfsstoffe',
        'E-Bike Rahmen': 'rohstoffe',
        'Citybikes "Urban"': 'fertige_erzeugnisse',
        'Schmierfett': 'betriebsstoffe',
        'Girokonto-Guthaben': 'bank',
        'Ford. Fahrradladen Meyer': 'forderungen_ll',
        'Ford. Sporthaus König': 'forderungen_ll',
        'Grundstück/Gebäude': 'bebaute_grundstuecke',
        'Maschinen (CNC-Fräse)': 'maschinen',
        'Fuhrpark (Lieferwagen)': 'fuhrpark',
        'BGA (Büroausstattung)': 'bga',
        'Hypothekendarlehen': 'darlehen',
        'Investitionsdarlehen': 'darlehen',
        'Verb. a. Lief. u. Leist.': 'verbindlichkeiten_ll',
        'Sonst. Verbindlichkeiten': 'sonstige_verbindlichkeiten'
    };

    AppState.inventurData.forEach(item => {
        correct[item.id] = subCategoryMap[item.name] || 'rohstoffe';
    });

    return correct;
}

// --- Lehrkraft-Passwort für Inventar ---
let _inventarLoadDataFirst = false;

function showInventarPasswordModal(loadDataFirst) {
    _inventarLoadDataFirst = !!loadDataFirst;
    const existing = document.getElementById('inventar-pw-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'inventar-pw-modal-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="inventur-modal" style="max-width: 400px;">
            <div class="inventur-modal-header">
                <span>🔒 Lehrkraft-Zugang (Inventar)</span>
                <button class="close-btn" onclick="document.getElementById('inventar-pw-modal-overlay').remove()">×</button>
            </div>
            <div class="inventur-modal-body">
                <p style="margin-bottom: 0.5rem;">Bitte Passwort eingeben:</p>
                <input type="password" id="inventar-pw-input" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--card-border); border-radius: 4px; background: rgba(0,0,0,0.2); color: var(--text-main); text-align: center; font-size: 1.1rem;" placeholder="Passwort" onkeydown="if(event.key==='Enter') checkInventarPassword()">
                <div id="inventar-pw-error" style="color: #ef4444; font-size: 0.85rem; min-height: 1.2rem; margin-top: 0.25rem;"></div>
            </div>
            <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1);">
                <button class="btn-primary" style="margin: 0; width: 60%;" onclick="checkInventarPassword()">Bestätigen</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('inventar-pw-input').focus(), 100);
}

function checkInventarPassword() {
    const input = document.getElementById('inventar-pw-input');
    if (!input) return;
    if (input.value === 'BT2026!') {
        document.getElementById('inventar-pw-modal-overlay').remove();

        if (_inventarLoadDataFirst) {
            if (!AppState.inventurData || AppState.inventurData.length === 0) {
                if (typeof autoFillSolution === 'function') autoFillSolution();
            }
            autoFillInventar();
            _inventarLoadDataFirst = false;
        } else {
            showInventarSolutionModal();
        }
    } else {
        document.getElementById('inventar-pw-error').textContent = '❌ Falsches Passwort!';
        input.value = '';
        input.focus();
    }
}

function showInventarSolutionModal() {
    const existing = document.getElementById('inventar-solution-overlay');
    if (existing) existing.remove();

    if (!AppState.inventurData || AppState.inventurData.length === 0) {
        alert('Bitte zuerst die Inventur abschließen.');
        return;
    }

    const correctMappings = getCorrectInventarMappings();
    const correctSubMappings = getCorrectInventarSubMappings();
    const correct = getCorrectInventarSums();
    const categoryLabels = {
        'anlage': 'Anlagevermögen',
        'umlauf': 'Umlaufvermögen',
        'lang_schuld': 'Langfr. Schulden',
        'kurz_schuld': 'Kurzfr. Schulden'
    };
    const subCategoryLabels = getInventarSubCategoryLabels();

    let rows = '';
    AppState.inventurData.forEach(item => {
        const cat = correctMappings[item.id];
        const subCat = correctSubMappings[item.id];
        const total = item.totalValue != null ? item.totalValue : (item.amount * item.pricePerUnit);
        rows += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">' +
            '<td style="padding: 0.3rem; font-size: 0.8rem;">' + item.name + '</td>' +
            '<td style="padding: 0.3rem; text-align: right; font-family: monospace;">' + formatEur(total) + '</td>' +
            '<td style="padding: 0.3rem; font-weight: bold;">' + categoryLabels[cat] + '<br><span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">' + subCategoryLabels[subCat] + '</span></td>' +
        '</tr>';
    });

    const overlay = document.createElement('div');
    overlay.id = 'inventar-solution-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="inventur-modal" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
            <div class="inventur-modal-header" style="background: #10b981;">
                <span>✅ Lösungsübersicht – Inventar</span>
                <button class="close-btn" onclick="document.getElementById('inventar-solution-overlay').remove()">×</button>
            </div>
            <div style="padding: 1rem; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="background: rgba(0,0,0,0.2);">
                            <th style="padding: 0.4rem; text-align: left;">Posten</th>
                            <th style="padding: 0.4rem; text-align: right;">Wert</th>
                            <th style="padding: 0.4rem; text-align: left;">Kategorie</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                <hr style="margin: 1rem 0; border-color: rgba(255,255,255,0.2);">
                <div style="font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Summe AV:</span><span>${formatEur(correct.sumAnlage)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Summe UV:</span><span>${formatEur(correct.sumUmlauf)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; color: #10b981; font-weight: bold;"><span>A. Summe Vermögen:</span><span>${formatEur(correct.sumVermoegen)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Summe langfr. Schulden:</span><span>${formatEur(correct.sumLangSchulden)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Summe kurzfr. Schulden:</span><span>${formatEur(correct.sumKurzSchulden)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; color: #ef4444; font-weight: bold;"><span>B. Summe Schulden:</span><span>${formatEur(correct.sumSchulden)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(59,130,246,0.2); border-radius: 4px; font-weight: bold; margin-top: 0.5rem; color: var(--primary);"><span>C. Eigenkapital (A−B):</span><span>${formatEur(correct.eigenkapital)}</span></div>
                </div>
            </div>
            <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1); display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px;" onclick="autoFillInventar()">📋 Werte übernehmen</button>
                <button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px; background: #6b7280;" onclick="document.getElementById('inventar-solution-overlay').remove()">Schließen</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function autoFillInventar() {
    const correctMappings = getCorrectInventarMappings();
    const correctSubMappings = getCorrectInventarSubMappings();
    
    Object.keys(correctMappings).forEach(id => {
        inventarMappings[id] = correctMappings[id];
        inventarSubMappings[id] = correctSubMappings[id];
    });

    const correct = getCorrectInventarSums();
    inventarSums.sumAnlage = correct.sumAnlage;
    inventarSums.sumUmlauf = correct.sumUmlauf;
    inventarSums.sumVermoegen = correct.sumVermoegen;
    inventarSums.sumLangSchulden = correct.sumLangSchulden;
    inventarSums.sumKurzSchulden = correct.sumKurzSchulden;
    inventarSums.sumSchulden = correct.sumSchulden;
    inventarSums.eigenkapital = correct.eigenkapital;

    const overlay = document.getElementById('inventar-solution-overlay');
    if (overlay) overlay.remove();

    renderInventar();
}

function getInventarSubCategoryLabels() {
    return {
        'bebaute_grundstuecke': 'Bebaute Grundstücke',
        'maschinen': 'Techn. Anlagen und Maschinen',
        'fuhrpark': 'Fuhrpark',
        'bga': 'Betriebs- und Geschäftsausstattung',
        'rohstoffe': 'Rohstoffe',
        'hilfsstoffe': 'Hilfsstoffe',
        'betriebsstoffe': 'Betriebsstoffe',
        'unfertige_erzeugnisse': 'Unfertige Erzeugnisse',
        'fertige_erzeugnisse': 'Fertige Erzeugnisse',
        'handelswaren': 'Handelswaren',
        'forderungen_ll': 'Forderungen a. L. L.',
        'bank': 'Bankguthaben',
        'kasse': 'Kasse',
        'darlehen': 'Verb. gegenüber Kreditinstituten',
        'verbindlichkeiten_ll': 'Verbindlichkeiten a. LL.',
        'sonstige_verbindlichkeiten': 'Sonstige Verbindlichkeiten'
    };
}

function renderLiveInventarDocument() {
    const container = document.getElementById('inventar-live-container');
    if (!container) return;

    if (!AppState.inventurData || AppState.inventurData.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    const correctMappings = getCorrectInventarMappings();
    const correctSubMappings = getCorrectInventarSubMappings();
    const correctSums = getCorrectInventarSums();
    const subLabels = getInventarSubCategoryLabels();

    let correctItems = [];
    AppState.inventurData.forEach(item => {
        if (inventarMappings[item.id] === correctMappings[item.id] &&
            inventarSubMappings[item.id] === correctSubMappings[item.id] &&
            inventarSubMappings[item.id] !== 'none' && inventarMappings[item.id] !== 'none') {
            correctItems.push(item);
        }
    });

    if (correctItems.length === 0 && !inventarSums.sumAnlage && !inventarSums.sumUmlauf && !inventarSums.sumLangSchulden && !inventarSums.sumKurzSchulden && !inventarSums.eigenkapital) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    let orderAV = ['bebaute_grundstuecke', 'maschinen', 'fuhrpark', 'bga'];
    let orderUV = ['rohstoffe', 'hilfsstoffe', 'betriebsstoffe', 'unfertige_erzeugnisse', 'fertige_erzeugnisse', 'handelswaren', 'forderungen_ll', 'bank', 'kasse'];
    let orderLV = ['darlehen'];
    let orderKV = ['verbindlichkeiten_ll', 'sonstige_verbindlichkeiten'];

    let html = `
    <div style="background: white; color: black; padding: 1.5rem; border-radius: 4px; border: 1px solid #ccc; font-family: 'Arial', sans-serif; font-size: 0.95rem; line-height: 1.4; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.5rem; font-size: 1.1rem; font-weight: bold;">Inventar der Fire Bike GmbH</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 1px solid black; border-top: 1px solid black; background-color: #f3f4f6;">
                    <th style="text-align: left; padding: 0.5rem; width: 60%; font-weight: bold;">Vermögens- und Schuldenarten, Eigenkapital</th>
                    <th style="padding: 0.5rem; text-align: center; border-left: 1px solid black;" colspan="2">
                        <div style="border-bottom: 1px solid black; padding-bottom: 0.3rem; margin-bottom: 0.3rem;">Geschäftsjahr ${new Date().getFullYear()} in €</div>
                        <div style="display: flex;">
                            <div style="flex: 1; text-align: right; padding-right: 0.5rem; font-size: 0.85rem;">Einzelwerte</div>
                            <div style="flex: 1; text-align: right; border-left: 1px solid black; padding-left: 0.5rem; font-size: 0.85rem;">Gesamtwerte</div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
    `;

    function renderSection(items, orderArr, roemischPrefix, title, userSum, correctSum) {
        let sectionHtml = '';
        let hasContent = false;
        let contentHtml = '';
        let listIndex = 1;

        orderArr.forEach(subCat => {
            let subItems = items.filter(i => correctSubMappings[i.id] === subCat);
            if (subItems.length > 0) {
                hasContent = true;
                contentHtml += `
                    <tr>
                        <td style="padding: 0.3rem 0.5rem; padding-left: 2rem; font-weight: bold; font-style: italic;">${listIndex}. ${subLabels[subCat]}</td>
                        <td style="border-left: 1px solid black; width: 20%;"></td>
                        <td style="border-left: 1px solid black; width: 20%;"></td>
                    </tr>
                `;
                
                let subTotal = 0;
                subItems.forEach(i => {
                    let val = i.totalValue != null ? i.totalValue : (i.amount * i.pricePerUnit);
                    subTotal += val;
                    contentHtml += `
                        <tr>
                            <td style="padding: 0.1rem 0.5rem; padding-left: 3.5rem; font-style: italic;">${i.name}</td>
                            <td style="padding: 0.1rem 0.5rem; text-align: right; border-left: 1px solid black;">${formatEur(val)}</td>
                            <td style="border-left: 1px solid black;"></td>
                        </tr>
                    `;
                });

                contentHtml += `
                    <tr>
                        <td style="padding: 0.1rem 0.5rem;"></td>
                        <td style="border-left: 1px solid black; border-bottom: 1px solid black;"></td>
                        <td style="padding: 0.1rem 0.5rem; text-align: right; border-left: 1px solid black;">${formatEur(subTotal)}</td>
                    </tr>
                `;
                listIndex++;
            }
        });

        const isSumCorrect = userSum != null && Math.abs(userSum - correctSum) < 0.01;
        if (hasContent || isSumCorrect) {
            sectionHtml += `
                <tr>
                    <td style="padding: 0.4rem 0.5rem; padding-left: 1rem; font-weight: bold;">${roemischPrefix} ${title}</td>
                    <td style="border-left: 1px solid black;"></td>
                    <td style="border-left: 1px solid black;"></td>
                </tr>
            `;
            sectionHtml += contentHtml;
            
            if (isSumCorrect) {
                sectionHtml += `
                    <tr>
                        <td style="padding: 0.4rem 0.5rem; font-weight: bold; font-style: italic;"></td>
                        <td style="border-left: 1px solid black;"></td>
                        <td style="padding: 0.4rem 0.5rem; text-align: right; border-left: 1px solid black; border-top: 1px solid black;">${formatEur(userSum)}</td>
                    </tr>
                `;
            }
        }
        return sectionHtml;
    }

    let avItems = correctItems.filter(i => correctMappings[i.id] === 'anlage');
    let uvItems = correctItems.filter(i => correctMappings[i.id] === 'umlauf');
    const isSumVermCorrect = (inventarSums.sumVermoegen != null && Math.abs(inventarSums.sumVermoegen - correctSums.sumVermoegen) < 0.01);
    
    // A. Vermögen
    if (avItems.length > 0 || uvItems.length > 0 || isSumVermCorrect) {
        html += `
            <tr>
                <td style="padding: 0.5rem; font-weight: bold; border-bottom: 2px solid black;">A. Vermögen</td>
                <td style="border-left: 1px solid black; border-bottom: 2px solid black;"></td>
                <td style="border-left: 1px solid black; border-bottom: 2px solid black;"></td>
            </tr>
        `;
        
        html += renderSection(avItems, orderAV, 'I.', 'Anlagevermögen', inventarSums.sumAnlage, correctSums.sumAnlage);
        html += renderSection(uvItems, orderUV, 'II.', 'Umlaufvermögen', inventarSums.sumUmlauf, correctSums.sumUmlauf);
        
        if (isSumVermCorrect) {
            html += `
                <tr style="border-top: 2px solid black; border-bottom: 2px solid black; background-color: #f9fafb;">
                    <td style="padding: 0.5rem; font-weight: bold;">Summe des Vermögens</td>
                    <td style="border-left: 1px solid black;"></td>
                    <td style="padding: 0.5rem; text-align: right; font-weight: bold; border-left: 1px solid black;">${formatEur(inventarSums.sumVermoegen)}</td>
                </tr>
            `;
        }
    }

    let lvItems = correctItems.filter(i => correctMappings[i.id] === 'lang_schuld');
    let kvItems = correctItems.filter(i => correctMappings[i.id] === 'kurz_schuld');
    const isSumSchuldCorrect = (inventarSums.sumSchulden != null && Math.abs(inventarSums.sumSchulden - correctSums.sumSchulden) < 0.01);

    // B. Schulden
    if (lvItems.length > 0 || kvItems.length > 0 || isSumSchuldCorrect) {
        html += `
            <tr>
                <td style="padding: 0.5rem; font-weight: bold; border-top: 2px solid black; border-bottom: 2px solid black;">B. Schulden (Verbindlichkeiten)</td>
                <td style="border-left: 1px solid black; border-top: 2px solid black; border-bottom: 2px solid black;"></td>
                <td style="border-left: 1px solid black; border-top: 2px solid black; border-bottom: 2px solid black;"></td>
            </tr>
        `;
        
        html += renderSection(lvItems, orderLV, 'I.', 'Langfristige Schulden', inventarSums.sumLangSchulden, correctSums.sumLangSchulden);
        html += renderSection(kvItems, orderKV, 'II.', 'Kurzfristige Schulden', inventarSums.sumKurzSchulden, correctSums.sumKurzSchulden);
        
        if (isSumSchuldCorrect) {
            html += `
                <tr style="border-top: 2px solid black; border-bottom: 2px solid black; background-color: #f9fafb;">
                    <td style="padding: 0.5rem; font-weight: bold;">Summe der Schulden</td>
                    <td style="border-left: 1px solid black;"></td>
                    <td style="padding: 0.5rem; text-align: right; font-weight: bold; border-left: 1px solid black;">${formatEur(inventarSums.sumSchulden)}</td>
                </tr>
            `;
        }
    }

    const isEKCorrect = (inventarSums.eigenkapital != null && Math.abs(inventarSums.eigenkapital - correctSums.eigenkapital) < 0.01);
    
    // C. Eigenkapital
    if (isEKCorrect) {
        html += `
            <tr style="border-top: 2px solid black;">
                <td style="padding: 0.5rem; font-weight: bold;">C. Ermittlung des Eigenkapitals</td>
                <td style="border-left: 1px solid black;"></td>
                <td style="border-left: 1px solid black;"></td>
            </tr>
            <tr>
                <td style="padding: 0.2rem 0.5rem; padding-left: 2rem; font-style: italic;">Summe des Vermögens</td>
                <td style="border-left: 1px solid black;"></td>
                <td style="padding: 0.2rem 0.5rem; text-align: right; border-left: 1px solid black;">${formatEur(correctSums.sumVermoegen)}</td>
            </tr>
            <tr>
                <td style="padding: 0.2rem 0.5rem; padding-left: 2rem; font-style: italic;">− Summe der Schulden</td>
                <td style="border-left: 1px solid black;"></td>
                <td style="padding: 0.2rem 0.5rem; text-align: right; border-bottom: 1px solid black; border-left: 1px solid black;">${formatEur(correctSums.sumSchulden)}</td>
            </tr>
            <tr style="border-bottom: 3px double black; background-color: #f3f4f6;">
                <td style="padding: 0.5rem; font-weight: bold; font-style: italic;">= Eigenkapital (Reinvermögen)</td>
                <td style="border-left: 1px solid black;"></td>
                <td style="padding: 0.5rem; text-align: right; font-weight: bold; border-left: 1px solid black;">${formatEur(correctSums.eigenkapital)}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}
