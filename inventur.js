// =====================================================
// inventur.js - Messen, Zählen, Wiegen Simulation
// Layout: Split Screen (Lager vs. Liste)
// =====================================================

const INVENTUR_ITEMS = [
    { id: 'i1', name: 'Mountainbikes Mod. Alp', type: 'Zählen', unit: 'Stück', icon: '🚲', 
      pricePerUnit: 400, correctQuantity: 12, sollQuantity: 12, expectedWertminderung: 400, rack: 'Fertigerzeugnisse',
      challenge: 'Zähle die fertiggestellten Mountainbikes. Achte auf beschädigte Ware!',
      visual: '🚲🚲🚲🚲<br>🚲🚲🚲🚲<br>🚲🚲🚲🚲<br><br><span style="color:#ef4444">Hinweis: 1 Bike hat einen Kratzer und muss als 2. Wahl verkauft werden (-400€ Wert, komplett abzuschreiben).</span>' },

    { id: 'i2', name: 'Schrauben Typ M8', type: 'Wiegen', unit: 'Stück', icon: '🔩', 
      pricePerUnit: 0.10, correctQuantity: 2500, sollQuantity: 2550, expectedWertminderung: 0, rack: 'Hilfsstoffe',
      challenge: 'Wie viele Schrauben befinden sich in der Kiste?',
      visual: 'Gewicht der vollen Kiste: 26,0 kg<br>Gewicht leere Kiste (Tara): 1,0 kg<br><br>Gewicht pro Schraube: 0,01 kg (10g)<br><br><span style="color:#95a5a6">Buchbestand: 2.550 Stück</span>' },

    { id: 'i3', name: 'Bremszügerolle', type: 'Messen', unit: 'Meter', icon: '📏', 
      pricePerUnit: 1.50, correctQuantity: 150, sollQuantity: 150, expectedWertminderung: 15, rack: 'Hilfsstoffe',
      challenge: 'Wie viele Meter Bremszug sind noch auf der Holz-Kabeltrommel?',
      visual: 'Das Messgerät hat am Anfang 500m angezeigt.<br>Laut Schnittliste wurden dieses Jahr insgesamt 350m abgewickelt und verbaut.<br><br><span style="color:#ef4444">Hinweis: Die letzten 10 Meter der Rolle sind angerostet (-15€).</span>' },

    { id: 'i4', name: 'Kassenguthaben', type: 'Eigene Werte (Schätzen)', unit: 'EUR', icon: '💵', 
      pricePerUnit: 1, correctQuantity: 'any', sollQuantity: 'unbekannt', expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Eigene Werte ausdenken!',
      visual: 'Der Kassenabschluss fehlt heute. Du darfst kreativ sein und dir ausdenken, wie viel Bargeld (in €) sich aktuell in der Kasse befindet. Trage eine beliebige, plausible Zahl über 0 ein.' },

    { id: 'i5', name: 'Bankdarlehen', type: 'Ablesen', unit: 'EUR', icon: '📄', 
      pricePerUnit: 1, correctQuantity: 80000, sollQuantity: 80000, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe den Kontoauszug des Darlehenskontos.',
      visual: 'Die Bank bestätigt eine offene Restschuld für die neuen Maschinen in Höhe von:<br><strong>80.000 EUR</strong>' },

    { id: 'i6', name: 'Rahmen "AlpX"', type: 'Zählen', unit: 'Stück', icon: '🏗️', 
      pricePerUnit: 50, correctQuantity: 150, sollQuantity: 150, expectedWertminderung: 0, rack: 'Rohstoffe',
      challenge: 'Zähle die eingelagerten Rahmenböcke.',
      visual: 'Auf Palette 1: 50 Stück<br>Auf Palette 2: 100 Stück' },

    { id: 'i7', name: 'Reifen 27.5 Zoll', type: 'Zählen', unit: 'Stück', icon: '🛞', 
      pricePerUnit: 15, correctQuantity: 200, sollQuantity: 200, expectedWertminderung: 150, rack: 'Rohstoffe',
      challenge: 'Zähle die verpackten Fahrradreifen.',
      visual: 'Vier große Stapel mit je 50 Reifen.<br><br><span style="color:#ef4444">Hinweis: 10 Reifen liegen schon zu lange und sind porös geworden (-150€ Wertminderung).</span>' },

    { id: 'i8', name: 'Sättel "Comfort"', type: 'Zählen', unit: 'Stück', icon: '💺', 
      pricePerUnit: 25, correctQuantity: 80, sollQuantity: 80, expectedWertminderung: 0, rack: 'Rohstoffe',
      challenge: 'Zähle die gepolsterten Sättel in der Box.',
      visual: 'Ein Karton mit 80 einzeln verpackten Sätteln.' },

    { id: 'i9', name: 'Schaltung 12-fach', type: 'Zählen', unit: 'Stück', icon: '⚙️', 
      pricePerUnit: 40, correctQuantity: 120, sollQuantity: 120, expectedWertminderung: 0, rack: 'Rohstoffe',
      challenge: 'Zähle die Kartons der Schaltungen.',
      visual: '12 Kisten mit je 10 Kettenschaltungen.' },

    { id: 'i10', name: 'Scheibenbremsen', type: 'Zählen', unit: 'Stück', icon: '🛑', 
      pricePerUnit: 30, correctQuantity: 140, sollQuantity: 140, expectedWertminderung: 0, rack: 'Rohstoffe',
      challenge: 'Ermittle den Bestand der Scheibenbremsen.',
      visual: 'Letzte Woche waren es 200 Stück.<br>Laut Materialschein wurden seitdem 60 Stück verbaut.' },

    { id: 'i11', name: 'Speichen', type: 'Wiegen', unit: 'Stück', icon: '🥢', 
      pricePerUnit: 0.50, correctQuantity: 500, sollQuantity: 520, expectedWertminderung: 0, rack: 'Rohstoffe',
      challenge: 'Wie viele Speichen befinden sich in der Kiste?',
      visual: 'Kiste brutto: 12,0 kg<br>Leere Kiste (Tara): 2,0 kg<br><br>Gewicht pro Speiche: 0,02 kg (20g)<br><br><span style="color:#95a5a6">Buchbestand: 520 Stück</span>' },

    { id: 'i12', name: 'Federgabeln', type: 'Zählen', unit: 'Stück', icon: '🪡', 
      pricePerUnit: 120, correctQuantity: 60, sollQuantity: 60, expectedWertminderung: 240, rack: 'Rohstoffe',
      challenge: 'Zähle die hochwertigen Federgabeln.',
      visual: '3 Regalfächer mit jeweils 20 Federgabeln.<br><br><span style="color:#ef4444">Hinweis: 2 Federgabeln haben beim Einlagern Dellen abbekommen (-240€ Wertminderung).</span>' },

    { id: 'i13', name: 'Lack "Titan Schwarz"', type: 'Messen', unit: 'Liter', icon: '🛢️', 
      pricePerUnit: 20, correctQuantity: 60, sollQuantity: 60, expectedWertminderung: 0, rack: 'Hilfsstoffe',
      challenge: 'Bestimme die Restmenge des Lacks im Fass.',
      visual: 'Ein 200-Liter-Fass.<br>Der Messstab zeigt an, dass exakt noch 30 % Füllung übrig sind.' },

    { id: 'i14', name: 'Kettenöl', type: 'Zählen', unit: 'Stück', icon: '💧', 
      pricePerUnit: 5, correctQuantity: 120, sollQuantity: 120, expectedWertminderung: 0, rack: 'Hilfsstoffe',
      challenge: 'Zähle die kleinen Fläschchen Kettenöl.',
      visual: 'Auf dem Europaletten-Auszug liegen 10 Kartons.<br>In jedem Karton sind 12 Fläschchen.' },

    { id: 'i15', name: 'E-Bike Rahmen', type: 'Zählen', unit: 'Stück', icon: '🔋', 
      pricePerUnit: 80, correctQuantity: 40, sollQuantity: 40, expectedWertminderung: 0, rack: 'Unfertige Erzeugnisse',
      challenge: 'Zähle die Rahmen, die noch lackiert werden müssen.',
      visual: 'In der Produktionsstraße stehen 40 Grundrahmen für unsere neuen E-Bikes.' },


    { id: 'i17', name: 'Citybikes "Urban"', type: 'Zählen', unit: 'Stück', icon: '🚲', 
      pricePerUnit: 350, correctQuantity: 14, sollQuantity: 14, expectedWertminderung: 0, rack: 'Fertigerzeugnisse',
      challenge: 'Zähle die versandbereiten Citybikes.',
      visual: 'Reihe 1: 5 Fahrräder<br>Reihe 2: 5 Fahrräder<br>Reihe 3: 4 Fahrräder' },

    { id: 'i18', name: 'Schmierfett', type: 'Wiegen', unit: 'kg', icon: '🧈', 
      pricePerUnit: 5, correctQuantity: 15, sollQuantity: 15, expectedWertminderung: 0, rack: 'Betriebsstoffe',
      challenge: 'Ermittle das Gewicht des Schmierfetts.',
      visual: 'Großer Eimer mit Fett auf der Waage.<br>Bruttogewicht: 18 kg.<br>Gewicht des Leereimers: 3 kg.' },

    { id: 'i19', name: 'Girokonto-Guthaben', type: 'Ablesen', unit: 'EUR', icon: '🏦', 
      pricePerUnit: 1, correctQuantity: 45300, sollQuantity: 45300, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe den Kontoauszug der Hausbank.',
      visual: 'Kontoauszug 12/2026 zeigt einen positiven Saldo von:<br><strong>45.300 EUR</strong>' },

    { id: 'i28', name: 'Ford. Fahrradladen Meyer', type: 'Ablesen', unit: 'EUR', icon: '📄', 
      pricePerUnit: 1, correctQuantity: 4200, sollQuantity: 4200, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe die offene Kundenrechnung.',
      visual: 'Offene Rechnung Nr. 2026-187 an Fahrradladen Meyer:<br>Lieferung von 6 Mountainbikes<br><strong>4.200 EUR</strong><br><small>Zahlungsziel: 30 Tage, noch nicht bezahlt</small>' },

    { id: 'i29', name: 'Ford. Sporthaus König', type: 'Ablesen', unit: 'EUR', icon: '📄', 
      pricePerUnit: 1, correctQuantity: 7350, sollQuantity: 7350, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe die offene Kundenrechnung.',
      visual: 'Offene Rechnung Nr. 2026-203 an Sporthaus König:<br>Lieferung von 10 Citybikes und 5 E-Bikes<br><strong>7.350 EUR</strong><br><small>Zahlungsziel: 14 Tage, noch nicht bezahlt</small>' },

    // --- Anlagevermögen ---
    { id: 'i20', name: 'Grundstück/Gebäude', type: 'Ablesen', unit: 'EUR', icon: '🏢', 
      pricePerUnit: 1, correctQuantity: 250000, sollQuantity: 250000, expectedWertminderung: 0, rack: 'Anlagevermögen',
      challenge: 'Prüfe den Wert des Betriebsgebäudes laut Anlagenkartei.',
      visual: 'Anlagenkartei:<br>Grundstück und Fabrikgebäude Industriestr. 42<br><strong>Buchwert: 250.000 EUR</strong>' },

    { id: 'i21', name: 'Maschinen (CNC-Fräse)', type: 'Ablesen', unit: 'EUR', icon: '⚙️', 
      pricePerUnit: 1, correctQuantity: 90000, sollQuantity: 90000, expectedWertminderung: 0, rack: 'Anlagevermögen',
      challenge: 'Prüfe den Buchwert der Produktionsmaschinen.',
      visual: 'Anlagenkartei:<br>2 CNC-Fräsmaschinen (Baujahr 2024)<br>Anschaffungskosten: 120.000 EUR<br>Bisherige AfA: 30.000 EUR<br><strong>Buchwert: 90.000 EUR</strong>' },

    { id: 'i22', name: 'Fuhrpark (Lieferwagen)', type: 'Ablesen', unit: 'EUR', icon: '🚚', 
      pricePerUnit: 1, correctQuantity: 28000, sollQuantity: 28000, expectedWertminderung: 0, rack: 'Anlagevermögen',
      challenge: 'Welchen Buchwert hat der Lieferwagen?',
      visual: 'Anlagenkartei:<br>VW Crafter Lieferwagen<br>Anschaffungskosten: 40.000 EUR<br>Bisherige AfA: 12.000 EUR<br><strong>Buchwert: 28.000 EUR</strong>' },

    { id: 'i23', name: 'BGA (Büroausstattung)', type: 'Ablesen', unit: 'EUR', icon: '🖥️', 
      pricePerUnit: 1, correctQuantity: 12000, sollQuantity: 12000, expectedWertminderung: 0, rack: 'Anlagevermögen',
      challenge: 'Prüfe den Buchwert der Betriebs- und Geschäftsausstattung.',
      visual: 'Anlagenkartei:<br>Betriebs- und Geschäftsausstattung (Computer, Möbel, Drucker)<br><strong>Buchwert: 12.000 EUR</strong>' },

    // --- Schulden (langfristig) ---
    { id: 'i24', name: 'Hypothekendarlehen', type: 'Ablesen', unit: 'EUR', icon: '🏦', 
      pricePerUnit: 1, correctQuantity: 120000, sollQuantity: 120000, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe den Stand des Hypothekendarlehens.',
      visual: 'Die Sparkasse bestätigt eine Restschuld für das Betriebsgebäude:<br><strong>120.000 EUR</strong><br><small>Laufzeit: noch 15 Jahre</small>' },

    { id: 'i25', name: 'Investitionsdarlehen', type: 'Ablesen', unit: 'EUR', icon: '💳', 
      pricePerUnit: 1, correctQuantity: 45000, sollQuantity: 45000, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe das Investitionsdarlehen für die Maschinen.',
      visual: 'Die KfW-Bank bestätigt eine Restschuld für die CNC-Maschinen:<br><strong>45.000 EUR</strong><br><small>Laufzeit: noch 4 Jahre</small>' },

    // --- Schulden (kurzfristig) ---
    { id: 'i26', name: 'Verb. a. Lief. u. Leist.', type: 'Ablesen', unit: 'EUR', icon: '📦', 
      pricePerUnit: 1, correctQuantity: 8500, sollQuantity: 8500, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe die offenen Lieferantenrechnungen.',
      visual: 'Offene Rechnungen an Lieferanten:<br>Shimano GmbH: 4.200 EUR<br>Schwalbe Reifen: 2.800 EUR<br>Büromaterial Schmidt: 1.500 EUR<br><strong>Gesamt: 8.500 EUR</strong>' },

    { id: 'i27', name: 'Sonst. Verbindlichkeiten', type: 'Ablesen', unit: 'EUR', icon: '📋', 
      pricePerUnit: 1, correctQuantity: 3200, sollQuantity: 3200, expectedWertminderung: 0, rack: 'Büro',
      challenge: 'Prüfe die sonstigen Verbindlichkeiten.',
      visual: 'Sonstige offene Posten:<br>Rückständige Sozialabgaben: 1.800 EUR<br>Umsatzsteuer-Vorauszahlung: 1.400 EUR<br><strong>Gesamt: 3.200 EUR</strong>' }
];

let solvedChallenges = {}; // Track which modals user has opened
let userInputs = {};       // Track user inputs from the table

function renderInventur() {
    const container = document.getElementById('inventur-container');
    if (!container) return;

    // Group items for layout
    const allRacks = ['Anlagevermögen', 'Fertigerzeugnisse', 'Unfertige Erzeugnisse', 'Rohstoffe', 'Hilfsstoffe', 'Betriebsstoffe'];
    const racks = {};
    allRacks.forEach(r => {
        const items = INVENTUR_ITEMS.filter(i => i.rack === r);
        if(items.length > 0) racks[r] = items;
    });
    const officeItems = INVENTUR_ITEMS.filter(i => i.rack === 'Büro');

    let html = `
        <div class="split-layout">
            
            <!-- Linker Bereich: Lager-Visualisierung -->
            <div class="warehouse-view">
                <h3 style="color: white; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem;">Lagerhalle</h3>
                
                <div class="rack-container">
                    ${Object.entries(racks).map(([rackName, items]) => `
                        <div class="rack">
                            <div class="rack-title">${rackName}</div>
                            ${createShelfRows(items)}
                        </div>
                    `).join('')}
                </div>

                <!-- Buchhaltungs-Schreibtisch -->
                <div class="office-desk">
                    <span style="color: #95a5a6; font-size: 0.8rem; position: absolute; left: 1.5rem; margin-top:-0.5rem;">Büro / Buchhaltung</span>
                    ${officeItems.map(item => `
                        <div class="desk-item ${solvedChallenges[item.id] ? 'completed' : ''}" onclick="openChallengeModal('${item.id}')">
                            <span class="bin-icon">${item.icon}</span>
                            <span class="bin-label" style="text-align: center;">${item.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Rechter Bereich: Inventurliste -->
            <div class="inventory-view">
                <h3 style="color: var(--text-main); margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Inventurliste</h3>
                
                <table class="osi-table">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Bezeichnung</th>
                            <th style="text-align: left;">Soll</th>
                            <th style="text-align: left;">Ist</th>
                            <th style="text-align: left;">Einh.</th>
                            <th style="text-align: left;">EP/Eh</th>
                            <th style="text-align: left;">EKW (€)</th>
                            <th style="text-align: left;">Mind. (€)</th>
                            <th style="text-align: left;">Wert (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${INVENTUR_ITEMS.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td style="text-align: left; color: var(--text-muted);">${item.sollQuantity === 'any' ? '-' : item.sollQuantity}</td>
                                <td style="text-align: left;">
                                    <input type="number" step="any" class="inv-input" id="input-menge-${item.id}" value="${userInputs[item.id]?.menge ?? ''}" onchange="saveInput('${item.id}')">
                                </td>
                                <td style="text-align: left; color: var(--text-muted);">${item.unit}</td>
                                <td style="text-align: left; color: var(--text-muted); white-space: nowrap;">${formatEur(item.pricePerUnit)}</td>
                                <td style="text-align: left;">
                                    <input type="number" step="any" class="inv-input" id="input-ekw-${item.id}" value="${userInputs[item.id]?.ekw ?? ''}" onchange="saveInput('${item.id}')">
                                </td>
                                <td style="text-align: left;">
                                    <input type="number" step="any" class="inv-input" id="input-minderung-${item.id}" value="${userInputs[item.id]?.minderung ?? ''}" onchange="saveInput('${item.id}')">
                                </td>
                                <td style="text-align: left;">
                                    <input type="number" step="any" class="inv-input" id="input-wert-${item.id}" value="${userInputs[item.id]?.wert ?? ''}" onchange="saveInput('${item.id}')">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <table style="width: 100%; border-collapse: collapse; font-size: 0.80rem; margin-top: 0.25rem;" class="osi-table">
                    <tfoot>
                        <tr style="background: rgba(0,134,203,0.15); border-top: 2px solid var(--primary);">
                            <td colspan="7" style="padding: 0.4rem 0.3rem; font-weight: bold; text-align: left;">Gesamtinventurwert:</td>
                            <td style="padding: 0.4rem 0.3rem; text-align: left;">
                                <input type="number" step="any" class="inv-input" style="width: 100%; font-weight: bold;" id="input-gesamtwert" value="${userInputs['gesamt']?.wert ?? ''}" onchange="saveGesamtwert()">
                            </td>
                        </tr>
                    </tfoot>
                </table>
                
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.1); border-radius: 4px;">
                    <strong>Legende:</strong> 
                    <span style="margin-right: 10px;"><strong>Soll:</strong> Buchbestand</span>
                    <span style="margin-right: 10px;"><strong>Ist:</strong> Tatsächlicher Bestand</span>
                    <span style="margin-right: 10px;"><strong>Einh:</strong> Einheit</span>
                    <span style="margin-right: 10px;"><strong>EP/Eh:</strong> Einzelpreis pro Einheit</span>
                    <span style="margin-right: 10px;"><strong>EKW:</strong> Einkaufswert</span>
                    <span><strong>Mind:</strong> Wertminderung</span>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.1); width: 100%;">
                    <button class="btn-primary" id="btn-inventur-submit" style="width: 100%; padding: 0.8rem; margin-top: 0;" onclick="validateInventur()">Inventur abschließen / prüfen</button>
                    <div id="validation-feedback" style="margin-top: 0.75rem; font-weight: bold; text-align: center; min-height: 2.5rem;"></div>
                </div>
            </div>

        </div>

        <!-- Modal Container -->
        <div id="challenge-modal" class="inventur-modal-overlay" style="display: none;">
            <div class="inventur-modal">
                <div class="inventur-modal-header">
                    <span id="modal-title">Aufgabe</span>
                    <button class="close-btn" onclick="closeChallengeModal()">×</button>
                </div>
                <div class="inventur-modal-body" id="modal-body">
                    <!-- Injected -->
                </div>
                <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1);">
                    <button class="btn-primary" style="margin: 0; width: 50%;" onclick="closeChallengeModal()">Verstanden</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Doppelklick-Handler für Lehrkraft-Lösung
    const submitBtn = document.getElementById('btn-inventur-submit');
    if (submitBtn) {
        submitBtn.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showPasswordModal();
        });
    }
}

function createShelfRows(items) {
    let rowsHtml = '';
    // Single row or double? Let's just group them automatically into pairs.
    for (let i = 0; i < items.length; i += 2) {
        const item1 = items[i];
        const item2 = items[i + 1];
        
        rowsHtml += `<div class="shelf-row">`;
        
        rowsHtml += `
            <div class="shelf-bin ${solvedChallenges[item1.id] ? 'completed' : ''}" onclick="openChallengeModal('${item1.id}')">
                <span class="bin-icon">${item1.icon}</span>
                <span class="bin-label">${item1.name}</span>
            </div>
        `;
        
        if (item2) {
            rowsHtml += `
                <div class="shelf-bin ${solvedChallenges[item2.id] ? 'completed' : ''}" onclick="openChallengeModal('${item2.id}')">
                    <span class="bin-icon">${item2.icon}</span>
                    <span class="bin-label">${item2.name}</span>
                </div>
            `;
        } else {
            rowsHtml += `<div class="shelf-bin" style="opacity: 0.1; cursor: default; border: none;"></div>`;
        }
        
        rowsHtml += `</div>`;
    }
    return rowsHtml;
}

function toggleInventurItemStatus(itemId, isChecked) {
    solvedChallenges[itemId] = isChecked;
}

function openChallengeModal(itemId) {
    const item = INVENTUR_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (solvedChallenges[itemId] === undefined) {
        solvedChallenges[itemId] = true;
    }

    const modal = document.getElementById('challenge-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.innerText = `${item.type}: ${item.name}`;
    
    modalBody.innerHTML = `
        <span style="font-size: 3rem; margin-bottom: -1rem; display: block;">${item.icon}</span>
        <strong style="color: var(--fly-orange, #F39C12); display: block; margin-bottom: 0.5rem; margin-top: 1rem;">${item.challenge}</strong>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 4px; width: 100%; text-align: left; font-family: monospace; font-size: 1.05rem; margin-top: 1rem; margin-bottom: 1rem;">
            ${item.visual}
        </div>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: var(--text-main); font-size: 0.95rem;">
            <input type="checkbox" id="mark-processed-${itemId}" ${solvedChallenges[itemId] ? 'checked' : ''} onchange="toggleInventurItemStatus('${itemId}', this.checked)" style="margin-right: 0.5rem; width: 18px; height: 18px; cursor: pointer;">
            Als bearbeitet markieren
        </label>
    `;

    modal.style.display = 'flex';
    // NICHT renderInventur() hier aufrufen, da es das DOM überschreibt und das Modal ausblendet!
}

function closeChallengeModal() {
    document.getElementById('challenge-modal').style.display = 'none';
    
    // Eingaben vorher sichern, falls sie gerade getippt wurden
    INVENTUR_ITEMS.forEach(item => saveInput(item.id));
    
    // Jetzt neu rendern, um die Haken (erledigt) links in den Regalen zu zeigen
    renderInventur();
}

function saveInput(itemId) {
    if (!userInputs[itemId]) userInputs[itemId] = {};
    const mengeInput = document.getElementById(`input-menge-${itemId}`);
    const ekwInput = document.getElementById(`input-ekw-${itemId}`);
    const minderungInput = document.getElementById(`input-minderung-${itemId}`);
    const wertInput = document.getElementById(`input-wert-${itemId}`);
    
    if (mengeInput && mengeInput.value !== '') userInputs[itemId].menge = parseFloat(mengeInput.value.replace(',', '.'));
    else if (mengeInput) userInputs[itemId].menge = null;

    if (ekwInput && ekwInput.value !== '') userInputs[itemId].ekw = parseFloat(ekwInput.value.replace(',', '.'));
    else if (ekwInput) userInputs[itemId].ekw = null;

    if (minderungInput && minderungInput.value !== '') userInputs[itemId].minderung = parseFloat(minderungInput.value.replace(',', '.'));
    else if (minderungInput) userInputs[itemId].minderung = null;
    
    if (wertInput && wertInput.value !== '') userInputs[itemId].wert = parseFloat(wertInput.value.replace(',', '.'));
    else if (wertInput) userInputs[itemId].wert = null;
}

function validateInventur() {
    let allValid = true;
    let checkedCount = 0;

    INVENTUR_ITEMS.forEach(item => {
        saveInput(item.id); 
        
        const mengeInput = document.getElementById(`input-menge-${item.id}`);
        const ekwInput = document.getElementById(`input-ekw-${item.id}`);
        const minderungInput = document.getElementById(`input-minderung-${item.id}`);
        const wertInput = document.getElementById(`input-wert-${item.id}`);
        
        const userMenge = userInputs[item.id]?.menge;
        const userEkw = userInputs[item.id]?.ekw;
        const userMinderung = userInputs[item.id]?.minderung;
        const userWert = userInputs[item.id]?.wert;

        mengeInput.classList.remove('valid', 'invalid');
        ekwInput.classList.remove('valid', 'invalid');
        minderungInput.classList.remove('valid', 'invalid');
        wertInput.classList.remove('valid', 'invalid');

        // Validierung Menge
        let isMengeValid = false;
        if (item.correctQuantity === 'any') {
            if (userMenge != null && !isNaN(userMenge) && userMenge > 0) isMengeValid = true;
        } else {
            if (userMenge === item.correctQuantity) isMengeValid = true;
        }

        // Validierung EKW
        const expectedEkw = (userMenge || 0) * item.pricePerUnit;
        let isEkwValid = isMengeValid && userEkw != null && !isNaN(userEkw) && Math.abs(userEkw - expectedEkw) < 0.01;

        // Validierung Minderung
        let isMinderungValid = userMinderung != null && !isNaN(userMinderung) && Math.abs(userMinderung - item.expectedWertminderung) < 0.01;

        // Validierung Wert
        const expectedWert = (userEkw || 0) - (userMinderung || 0);
        let isWertValid = isEkwValid && isMinderungValid && userWert != null && !isNaN(userWert) && Math.abs(userWert - expectedWert) < 0.01;

        if (isMengeValid) mengeInput.classList.add('valid'); else { mengeInput.classList.add('invalid'); allValid = false; }
        if (isEkwValid) ekwInput.classList.add('valid'); else { ekwInput.classList.add('invalid'); allValid = false; }
        if (isMinderungValid) minderungInput.classList.add('valid'); else { minderungInput.classList.add('invalid'); allValid = false; }
        if (isWertValid) wertInput.classList.add('valid'); else { wertInput.classList.add('invalid'); allValid = false; }

        if (isMengeValid && isEkwValid && isMinderungValid && isWertValid) {
            checkedCount++;
        }
    });

    const feedback = document.getElementById('validation-feedback');
    
    if (allValid && checkedCount === INVENTUR_ITEMS.length) {
        feedback.innerHTML = `<span style="color: #10b981;">🎉 Alles korrekt! Die Inventurdaten wurden gespeichert.</span><br>
                              <button class="btn-primary" style="margin-top:0.5rem; padding: 0.6rem;" onclick="finishInventur()">Zum Inventar wechseln →</button>`;
        
        AppState.inventurData = INVENTUR_ITEMS.map(i => {
            const finalQuantity = i.correctQuantity === 'any' ? userInputs[i.id].menge : i.correctQuantity;
            const finalWert = userInputs[i.id].wert;
            return {
                id: i.id,
                name: i.name,
                amount: finalQuantity,
                // pricePerUnit is adjusted so that amount * pricePerUnit = finalWert
                pricePerUnit: (finalQuantity > 0) ? (finalWert / finalQuantity) : i.pricePerUnit,
                totalValue: finalWert
            };
        });
        
    } else {
        feedback.innerHTML = `<span style="color: #ef4444;">❌ Fehler in der Liste. Bitte rot markierte Felder korrigieren!<br><small>Rechnung: Ist-Menge × EP/Eh = EKW. Dann: EKW - Minderung = Gesamt-Wert.</small></span>`;
    }
}

function finishInventur() {
    AppState.onDataUpdate('inventur');
    setMode('inventar');
}

// --- Gesamtinventurwert ---
function saveGesamtwert() {
    if (!userInputs['gesamt']) userInputs['gesamt'] = {};
    const input = document.getElementById('input-gesamtwert');
    if (input && input.value !== '') {
        userInputs['gesamt'].wert = parseFloat(input.value.replace(',', '.'));
    } else {
        userInputs['gesamt'].wert = null;
    }
}

// --- Lehrkraft-Passwort-Popup (Doppelklick) ---
function showPasswordModal() {
    // Remove existing modal if any
    const existing = document.getElementById('password-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'password-modal-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="inventur-modal" style="max-width: 400px;">
            <div class="inventur-modal-header">
                <span>🔒 Lehrkraft-Zugang</span>
                <button class="close-btn" onclick="document.getElementById('password-modal-overlay').remove()">×</button>
            </div>
            <div class="inventur-modal-body">
                <p style="margin-bottom: 0.5rem;">Bitte Passwort eingeben, um die Lösung anzuzeigen:</p>
                <input type="password" id="pw-input" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--card-border); border-radius: 4px; background: rgba(0,0,0,0.2); color: var(--text-main); text-align: center; font-size: 1.1rem;" placeholder="Passwort" onkeydown="if(event.key==='Enter') checkPassword()">
                <div id="pw-error" style="color: #ef4444; font-size: 0.85rem; min-height: 1.2rem; margin-top: 0.25rem;"></div>
            </div>
            <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1);">
                <button class="btn-primary" style="margin: 0; width: 60%;" onclick="checkPassword()">Bestätigen</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('pw-input').focus(), 100);
}

function checkPassword() {
    const input = document.getElementById('pw-input');
    if (!input) return;
    if (input.value === 'BT2026!') {
        document.getElementById('password-modal-overlay').remove();
        showSolutionModal();
    } else {
        document.getElementById('pw-error').textContent = '❌ Falsches Passwort!';
        input.value = '';
        input.focus();
    }
}

function showSolutionModal() {
    const existing = document.getElementById('solution-modal-overlay');
    if (existing) existing.remove();

    // Calculate correct solutions
    let solutionRows = '';
    let gesamtwert = 0;

    INVENTUR_ITEMS.forEach(item => {
        const menge = item.correctQuantity === 'any' ? '(frei wählbar)' : item.correctQuantity;
        const mengeNum = item.correctQuantity === 'any' ? 100 : item.correctQuantity; // Assume 100 for Kasse
        const ekw = mengeNum * item.pricePerUnit;
        const mind = item.expectedWertminderung;
        const wert = ekw - mind;
        
        if (item.correctQuantity !== 'any') {
            gesamtwert += wert;
        }

        solutionRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 0.3rem; font-size: 0.75rem;">${item.name}</td>
                <td style="padding: 0.3rem; text-align: center;">${menge}</td>
                <td style="padding: 0.3rem; text-align: center;">${item.unit}</td>
                <td style="padding: 0.3rem; text-align: right;">${formatEur(item.pricePerUnit)}</td>
                <td style="padding: 0.3rem; text-align: right;">${item.correctQuantity === 'any' ? '—' : formatEur(ekw)}</td>
                <td style="padding: 0.3rem; text-align: right;">${formatEur(mind)}</td>
                <td style="padding: 0.3rem; text-align: right; font-weight: bold;">${item.correctQuantity === 'any' ? '—' : formatEur(wert)}</td>
            </tr>
        `;
    });

    const overlay = document.createElement('div');
    overlay.id = 'solution-modal-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="inventur-modal" style="max-width: 750px; max-height: 85vh; overflow-y: auto;">
            <div class="inventur-modal-header" style="background: #10b981;">
                <span>✅ Lösungsübersicht – Inventur</span>
                <button class="close-btn" onclick="document.getElementById('solution-modal-overlay').remove()">×</button>
            </div>
            <div style="padding: 1rem; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.80rem;">
                    <thead>
                        <tr style="background: rgba(0,0,0,0.2);">
                            <th style="padding: 0.3rem; text-align: left;">Bezeichnung</th>
                            <th style="padding: 0.3rem; text-align: center;">Ist-Menge</th>
                            <th style="padding: 0.3rem; text-align: center;">Einh.</th>
                            <th style="padding: 0.3rem; text-align: right;">EP/Eh</th>
                            <th style="padding: 0.3rem; text-align: right;">EKW (€)</th>
                            <th style="padding: 0.3rem; text-align: right;">Mind. (€)</th>
                            <th style="padding: 0.3rem; text-align: right;">Wert (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${solutionRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: rgba(16,185,129,0.15); border-top: 2px solid #10b981;">
                            <td colspan="6" style="padding: 0.4rem; font-weight: bold; text-align: right;">Gesamtinventurwert (ohne Kasse):</td>
                            <td style="padding: 0.4rem; text-align: right; font-weight: bold;">${formatEur(gesamtwert)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;"><em>Hinweis: Der Kassenwert ist je Schüler individuell festgelegt und im Gesamt nicht berücksichtigt.</em></p>
            </div>
            <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1); display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px;" onclick="autoFillSolution()">📋 Werte in Liste übernehmen</button>
                <button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px; background: #6b7280;" onclick="document.getElementById('solution-modal-overlay').remove()">Schließen</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function autoFillSolution() {
    let gesamtwert = 0;

    INVENTUR_ITEMS.forEach(item => {
        // For "any" items (Kasse), we use 100 as default if not already set
        let menge;
        if (item.correctQuantity === 'any') {
            menge = userInputs[item.id]?.menge || 100;
        } else {
            menge = item.correctQuantity;
        }

        const ekw = menge * item.pricePerUnit;
        const mind = item.expectedWertminderung;
        const wert = ekw - mind;

        gesamtwert += wert;

        // Update the stored values
        if (!userInputs[item.id]) userInputs[item.id] = {};
        userInputs[item.id].menge = menge;
        userInputs[item.id].ekw = ekw;
        userInputs[item.id].minderung = mind;
        userInputs[item.id].wert = wert;

        // Mark as solved
        solvedChallenges[item.id] = true;
    });

    // Save Gesamtwert
    if (!userInputs['gesamt']) userInputs['gesamt'] = {};
    userInputs['gesamt'].wert = gesamtwert;

    // Close modal and re-render
    const overlay = document.getElementById('solution-modal-overlay');
    if (overlay) overlay.remove();

    renderInventur();
}
