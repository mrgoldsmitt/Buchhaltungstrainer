// =====================================================
// warenwirtschaft.js - Warenwirtschaftssimulation (ERP-Simulator)
// Autarke, datengetriebene Produktions- & Buchhaltungssimulation
// =====================================================

// =============================================================================
// SECTION 1: SZENARIO-DEFINITIONEN (DATA-DRIVEN)
// =============================================================================

const WAWI_SCENARIOS = [
    {
        id: 'fahrrad',
        name: 'Fahrrad-Montage',
        company: 'Fire Bike GmbH',
        description: 'Montiere hochwertige Fahrräder aus Einzelteilen. Verwalte dein Lager, bestelle Material nach und verfolge jede Buchung in Echtzeit.',
        icon: '🚲',
        product: {
            name: 'Fahrrad',
            icon: '🚲',
            sellPrice: 899.00,
            maxProducts: 20
        },
        bom: [
            { id: 'rahmen', name: 'Rahmen', qty: 1, unitPrice: 120.00, icon: '🔩', unit: 'Stk.' },
            { id: 'rad', name: 'Laufrad', qty: 2, unitPrice: 45.00, icon: '⚙️', unit: 'Stk.' },
            { id: 'lenker', name: 'Lenker', qty: 1, unitPrice: 35.00, icon: '🔧', unit: 'Stk.' },
            { id: 'sattel', name: 'Sattel', qty: 1, unitPrice: 25.00, icon: '🪑', unit: 'Stk.' },
            { id: 'kette', name: 'Kette', qty: 1, unitPrice: 15.00, icon: '⛓️', unit: 'Stk.' },
            { id: 'bremse', name: 'Bremse', qty: 2, unitPrice: 30.00, icon: '🛑', unit: 'Stk.' },
            { id: 'pedal', name: 'Pedal', qty: 2, unitPrice: 12.00, icon: '🦶', unit: 'Stk.' }
        ],
        initialStock: {
            rahmen: 10, rad: 20, lenker: 15, sattel: 12,
            kette: 15, bremse: 20, pedal: 24,
            schrauben: 100, lack: 10, strom: 50, schmier: 20
        },
        reorderPoints: {
            rahmen: 3, rad: 6, lenker: 4, sattel: 3,
            kette: 4, bremse: 5, pedal: 5,
            schrauben: 20, lack: 3, strom: 10, schmier: 5
        },
        orderQuantities: {
            rahmen: 10, rad: 20, lenker: 10, sattel: 10,
            kette: 15, bremse: 15, pedal: 20,
            schrauben: 100, lack: 10, strom: 50, schmier: 20
        },
        maxOrderQuantities: {
            rahmen: 50, rad: 100, lenker: 50, sattel: 50,
            kette: 50, bremse: 80, pedal: 80,
            schrauben: 500, lack: 100, strom: 200, schmier: 200
        },
        maxStock: {
            rahmen: 50, rad: 100, lenker: 50, sattel: 50,
            kette: 50, bremse: 100, pedal: 100,
            schrauben: 500, lack: 100, strom: 500, schmier: 200
        },
        hilfsstoffe: [
            { id: 'schrauben', name: 'Schraubenset', qtyPerProduct: 1, unitPrice: 2.50, icon: '🔩', unit: 'Set' },
            { id: 'lack', name: 'Lacksprayer', qtyPerProduct: 1, unitPrice: 8.00, icon: '🎨', unit: 'Stk.' }
        ],
        betriebsstoffe: [
            { id: 'strom', name: 'Energiepauschale', qtyPerProduct: 1, unitPrice: 12.00, icon: '⚡', unit: 'Pausch.' },
            { id: 'schmier', name: 'Schmiermittel', qtyPerProduct: 1, unitPrice: 3.00, icon: '💧', unit: 'Dose' }
        ],
        accounts: [
            { id: '1200', name: 'Bank', type: 'aktiv' },
            { id: '1000', name: 'Kasse', type: 'aktiv' },
            { id: '0510', name: 'Gebäude', type: 'aktiv' },
            { id: '0700', name: 'Technische Anlagen und Maschinen', type: 'aktiv' },
            { id: '0840', name: 'Fuhrpark', type: 'aktiv' },
            { id: '0860', name: 'Betriebs- und Geschäftsausstattung', type: 'aktiv' },
            { id: '2000', name: 'Rohstoffe', type: 'aktiv' },
            { id: '2010', name: 'Hilfsstoffe', type: 'aktiv' },
            { id: '2020', name: 'Betriebsstoffe', type: 'aktiv' },
            { id: '2400', name: 'Forderungen a.L.L.', type: 'aktiv' },
            { id: '2800', name: 'Fertigerzeugnisse', type: 'aktiv' },
            { id: '3000', name: 'Eigenkapital', type: 'passiv' },
            { id: '4250', name: 'Bankdarlehen', type: 'passiv' },
            { id: '4400', name: 'Verbindlichkeiten a.L.L.', type: 'passiv' },
            { id: '5000', name: 'Umsatzerlöse f. eig. Erzeugnisse', type: 'ertrag' },
            { id: '5200', name: 'Bestandsveränderung FE', type: 'ertrag' },
            { id: '5460', name: 'Erträge aus dem Abgang von Gegenständen des AV', type: 'ertrag' },
            { id: "2600", name: "Vorsteuer", type: "aktiv" },
            { id: "4800", name: "Umsatzsteuer", type: "passiv" },
            { id: '6000', name: 'Aufwendungen f. Rohstoffe', type: 'aufwand' },
            { id: '6010', name: 'Aufwendungen f. Hilfsstoffe', type: 'aufwand' },
            { id: '6020', name: 'Aufwendungen f. Betriebsstoffe', type: 'aufwand' },
            { id: '6520', name: 'Abschreibungen auf Sachanlagen', type: 'aufwand' },
            { id: '6960', name: 'Verluste aus dem Abgang von Gegenständen des AV', type: 'aufwand' },
            { id: '8020', name: 'GuV-Konto', type: 'passiv' }
        ],
        startCapital: { bank: 50000, kasse: 10000, gebaeude: 150000, maschinen: 73000, fuhrpark: 30000, bga: 15000 }
    },
    {
        id: 'pc',
        name: 'PC-Zusammenbau',
        company: 'FireComputer GmbH',
        description: 'Baue leistungsstarke PCs aus Komponenten zusammen. Überwache Bestände, Buchungen und Liquidität.',
        icon: '💻',
        product: {
            name: 'Gaming-PC',
            icon: '💻',
            sellPrice: 1299.00,
            maxProducts: 15
        },
        bom: [
            { id: 'mainboard', name: 'Mainboard', qty: 1, unitPrice: 85.00, icon: '🟩', unit: 'Stk.' },
            { id: 'cpu', name: 'Prozessor (CPU)', qty: 1, unitPrice: 150.00, icon: '🧠', unit: 'Stk.' },
            { id: 'ram', name: 'Arbeitsspeicher (RAM)', qty: 2, unitPrice: 40.00, icon: '📏', unit: 'Stk.' },
            { id: 'ssd', name: 'SSD-Festplatte', qty: 1, unitPrice: 55.00, icon: '💾', unit: 'Stk.' },
            { id: 'gehaeuse', name: 'Gehäuse', qty: 1, unitPrice: 45.00, icon: '🖥️', unit: 'Stk.' },
            { id: 'netzteil', name: 'Netzteil', qty: 1, unitPrice: 60.00, icon: '🔌', unit: 'Stk.' },
            { id: 'gpu', name: 'Grafikkarte (GPU)', qty: 1, unitPrice: 200.00, icon: '🎮', unit: 'Stk.' },
            { id: 'luefter', name: 'Gehäuselüfter', qty: 2, unitPrice: 15.00, icon: '🌀', unit: 'Stk.' }
        ],
        initialStock: {
            mainboard: 8, cpu: 8, ram: 16, ssd: 10,
            gehaeuse: 8, netzteil: 10, gpu: 6, luefter: 16,
            schraube_pc: 100, paste: 20, strom_pc: 50, test: 50
        },
        reorderPoints: {
            mainboard: 3, cpu: 3, ram: 5, ssd: 3,
            gehaeuse: 3, netzteil: 3, gpu: 2, luefter: 4,
            schraube_pc: 20, paste: 5, strom_pc: 10, test: 10
        },
        orderQuantities: {
            mainboard: 8, cpu: 8, ram: 16, ssd: 10,
            gehaeuse: 8, netzteil: 10, gpu: 6, luefter: 16,
            schraube_pc: 100, paste: 20, strom_pc: 50, test: 50
        },
        maxOrderQuantities: {
            mainboard: 50, cpu: 50, ram: 100, ssd: 50,
            gehaeuse: 50, netzteil: 50, gpu: 30, luefter: 100,
            schraube_pc: 500, paste: 500, strom_pc: 200, test: 200
        },
        maxStock: {
            mainboard: 40, cpu: 40, ram: 100, ssd: 60,
            gehaeuse: 30, netzteil: 40, gpu: 25, luefter: 80,
            schraube_pc: 500, paste: 200, strom_pc: 500, test: 500
        },
        hilfsstoffe: [
            { id: 'schraube_pc', name: 'Gehäuseschrauben', qtyPerProduct: 1, unitPrice: 1.50, icon: '🔩', unit: 'Set' },
            { id: 'paste', name: 'Wärmeleitpaste', qtyPerProduct: 1, unitPrice: 4.00, icon: '🧪', unit: 'Port.' }
        ],
        betriebsstoffe: [
            { id: 'strom_pc', name: 'Energiepauschale', qtyPerProduct: 1, unitPrice: 8.00, icon: '⚡', unit: 'Pausch.' },
            { id: 'test', name: 'Software-Lizenz/Test', qtyPerProduct: 1, unitPrice: 15.00, icon: '✅', unit: 'Liz.' }
        ],
        accounts: [
            { id: '1200', name: 'Bank', type: 'aktiv' },
            { id: '1000', name: 'Kasse', type: 'aktiv' },
            { id: '0510', name: 'Gebäude', type: 'aktiv' },
            { id: '0700', name: 'Technische Anlagen und Maschinen', type: 'aktiv' },
            { id: '0840', name: 'Fuhrpark', type: 'aktiv' },
            { id: '0860', name: 'Betriebs- und Geschäftsausstattung', type: 'aktiv' },
            { id: '2000', name: 'Rohstoffe', type: 'aktiv' },
            { id: '2010', name: 'Hilfsstoffe', type: 'aktiv' },
            { id: '2020', name: 'Betriebsstoffe', type: 'aktiv' },
            { id: '2400', name: 'Forderungen a.L.L.', type: 'aktiv' },
            { id: '2800', name: 'Fertigerzeugnisse', type: 'aktiv' },
            { id: '3000', name: 'Eigenkapital', type: 'passiv' },
            { id: '4250', name: 'Bankdarlehen', type: 'passiv' },
            { id: '4400', name: 'Verbindlichkeiten a.L.L.', type: 'passiv' },
            { id: '5000', name: 'Umsatzerlöse f. eig. Erzeugnisse', type: 'ertrag' },
            { id: '5200', name: 'Bestandsveränderung FE', type: 'ertrag' },
            { id: '5460', name: 'Erträge aus dem Abgang von Gegenständen des AV', type: 'ertrag' },
            { id: '6000', name: 'Aufwendungen f. Rohstoffe', type: 'aufwand' },
            { id: '6010', name: 'Aufwendungen f. Hilfsstoffe', type: 'aufwand' },
            { id: '6020', name: 'Aufwendungen f. Betriebsstoffe', type: 'aufwand' },
            { id: '6520', name: 'Abschreibungen auf Sachanlagen', type: 'aufwand' },
            { id: '6960', name: 'Verluste aus dem Abgang von Gegenständen des AV', type: 'aufwand' },
            { id: '8020', name: 'GuV-Konto', type: 'passiv' },
            { id: "2600", name: "Vorsteuer", type: "aktiv" },
            { id: "4800", name: "Umsatzsteuer", type: "passiv" },
        ],
        startCapital: { bank: 40000, kasse: 5000, gebaeude: 120000, maschinen: 73000, fuhrpark: 30000, bga: 15000 }
    }
];

function wawiGetSharedDataManagementHTML() {
    return `
        <!-- Data Management -->
        <div class="wawi-dashboard-section wawi-data-mgmt-section" 
             ondragover="wawiHandleDragOver(event)" 
             ondragleave="wawiHandleDragLeave(event)" 
             ondrop="wawiHandleDrop(event)">
            <h4>Daten-Management (Sicherung)</h4>
            <div class="wawi-data-grid">
                <button class="wawi-btn wawi-btn-outline" onclick="wawiExportXML()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.4rem;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Arbeitsstand speichern
                </button>
                <button class="wawi-btn wawi-btn-outline" onclick="document.getElementById('wawi-import-file').click()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.4rem;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Arbeitsstand laden
                </button>
                <input type="file" id="wawi-import-file" style="display: none" accept=".xml" onchange="wawiHandleImport(event)">
            </div>
            <div class="wawi-section-sub" style="margin-top: 0.5rem;">Sichere deinen aktuellen Fortschritt oder lade einen externen Stand (auch via Drag & Drop).</div>
        </div>
    `;
}


// =============================================================================
// SECTION 2: STATE MANAGEMENT + LOCALSTORAGE PERSISTENZ
// =============================================================================

const WAWI_STORAGE_KEY = 'wawi_erp_state';

// Global State Object
let WaWiState = null;

function wawiCalculateMaterialsValue(scenario, listName) {
    let total = 0;
    const list = scenario[listName] || [];
    for (const item of list) {
        const stockQty = scenario.initialStock[item.id] || 0;
        total += stockQty * item.unitPrice;
    }
    return total;
}

function wawiCreateFreshState(scenarioId) {
    const scenario = WAWI_SCENARIOS.find(s => s.id === scenarioId) || WAWI_SCENARIOS[0];

    const rValue = wawiCalculateMaterialsValue(scenario, 'bom');
    const hsValue = wawiCalculateMaterialsValue(scenario, 'hilfsstoffe');
    const bsValue = wawiCalculateMaterialsValue(scenario, 'betriebsstoffe');

    const avValue = (scenario.startCapital.gebaeude || 0) + (scenario.startCapital.maschinen || 0) + (scenario.startCapital.fuhrpark || 0) + (scenario.startCapital.bga || 0);
    const eigenkapital = scenario.startCapital.bank + scenario.startCapital.kasse + rValue + hsValue + bsValue + avValue;

    // Initialize stock from scenario (Main BOM + HS + BS)
    const stock = {};
    const allMaterials = [...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe];
    for (const item of allMaterials) {
        stock[item.id] = scenario.initialStock[item.id] || 0;
    }

    // Initialize accounts
    const accounts = {};
    for (const acc of scenario.accounts) {
        accounts[acc.id] = 0;
    }
    accounts['1200'] = scenario.startCapital.bank;
    accounts['1000'] = scenario.startCapital.kasse;
    accounts['0510'] = scenario.startCapital.gebaeude || 0;
    accounts['0700'] = scenario.startCapital.maschinen || 0;
    accounts['0840'] = scenario.startCapital.fuhrpark || 0;
    accounts['0860'] = scenario.startCapital.bga || 0;
    accounts['2000'] = rValue;
    accounts['2010'] = hsValue;
    accounts['2020'] = bsValue;
    accounts['3000'] = -eigenkapital;

    // Initialize partsUsed for current production
    const partsUsed = {};
    for (const part of scenario.bom) {
        partsUsed[part.id] = 0;
    }

    return {
        activeScenario: scenario.id,
        activeTab: 'dashboard',
        simMode: 'simulation',
        pendingBookings: [],
        stock: stock,
        accounts: accounts,
        journal: [],
        production: {
            inProgress: false,
            partsUsed: partsUsed,
            completedProducts: 0,
            totalProduced: 0,
            totalSold: 0
        },
        orders: [
            { id: 'ORD-101', customer: 'Radsport Schuberth', qty: 1, status: 'open', price: scenario.product.sellPrice },
            { id: 'ORD-102', customer: 'Zweirad-Center Meyer', qty: 2, status: 'open', price: scenario.product.sellPrice * 0.95 } // Rabatt
        ],
        journalIdCounter: 1,
        financeTransactions: [], // Tracks specific open invoices/liabilities
        difficulty: localStorage.getItem('bt_wawi_pref_difficulty') || 'advanced', // Persist preference
        isClosed: false,
        lastClosingProfit: 0,
        assets: [
            {
                id: 'AST-100',
                name: 'Betriebsgebäude',
                category: '0510',
                purchaseCost: scenario.startCapital.gebaeude || 150000,
                purchaseDate: '2023-01-02',
                usefulLife: 33,
                currentBookValue: scenario.startCapital.gebaeude || 150000,
                isSold: false
            },
            {
                id: 'AST-101',
                name: 'CNC-Fräsmaschine',
                category: '0700',
                purchaseCost: 45000,
                purchaseDate: '2024-03-10',
                usefulLife: 10,
                currentBookValue: 45000,
                isSold: false
            },
            {
                id: 'AST-102',
                name: 'Industrieroboter-Arm',
                category: '0700',
                purchaseCost: 28000,
                purchaseDate: '2025-02-01',
                usefulLife: 8,
                currentBookValue: 28000,
                isSold: false
            },
            {
                id: 'AST-103',
                name: 'Lieferwagen VW Crafter',
                category: '0840',
                purchaseCost: 18000,
                purchaseDate: '2024-06-15',
                usefulLife: 6,
                currentBookValue: 18000,
                isSold: false
            },
            {
                id: 'AST-104',
                name: 'Kleintransporter Mercedes Sprinter',
                category: '0840',
                purchaseCost: 12000,
                purchaseDate: '2025-01-20',
                usefulLife: 6,
                currentBookValue: 12000,
                isSold: false
            },
            {
                id: 'AST-105',
                name: 'Büroausstattung Premium',
                category: '0860',
                purchaseCost: 8000,
                purchaseDate: '2024-01-15',
                usefulLife: 10,
                currentBookValue: 8000,
                isSold: false
            },
            {
                id: 'AST-106',
                name: 'EDV-Anlage & Server',
                category: '0860',
                purchaseCost: 7000,
                purchaseDate: '2025-04-01',
                usefulLife: 5,
                currentBookValue: 7000,
                isSold: false
            }
        ],
        depreciationBooked: false,
        createdAt: new Date().toISOString()
    };
}

function wawiLoadState() {
    try {
        const saved = localStorage.getItem(WAWI_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);

            // Deep Validation: Check if it's an object and has essential keys
            if (parsed && typeof parsed === 'object' && parsed.activeScenario) {
                // Check if scenario still exists
                const scenarioExists = WAWI_SCENARIOS.some(s => s.id === parsed.activeScenario);
                if (scenarioExists) {
                    WaWiState = parsed;
                    WaWiState.activeTab = 'dashboard'; // Force dashboard on start

                    // Sanitize sub-objects
                    if (!WaWiState.stock) WaWiState.stock = {};
                    if (!WaWiState.accounts) WaWiState.accounts = {};
                    if (!WaWiState.journal) WaWiState.journal = [];
                    if (!WaWiState.production) WaWiState.production = { inProgress: false, partsUsed: {}, completedProducts: 0, totalProduced: 0, totalSold: 0 };
                    if (!WaWiState.orders) WaWiState.orders = [];
                    if (!WaWiState.financeTransactions) WaWiState.financeTransactions = [];
                    if (!WaWiState.difficulty) WaWiState.difficulty = localStorage.getItem('bt_wawi_pref_difficulty') || 'advanced';
                    if (!WaWiState.assets) {
                        const scenario = WAWI_SCENARIOS.find(s => s.id === WaWiState.activeScenario) || WAWI_SCENARIOS[0];
                        WaWiState.assets = [
                            {
                                id: 'AST-100',
                                name: 'Betriebsgebäude',
                                category: '0510',
                                purchaseCost: scenario.startCapital.gebaeude || 150000,
                                purchaseDate: '2023-01-02',
                                usefulLife: 33,
                                currentBookValue: scenario.startCapital.gebaeude || 150000,
                                isSold: false
                            },
                            {
                                id: 'AST-101',
                                name: 'CNC-Fräsmaschine',
                                category: '0700',
                                purchaseCost: 45000,
                                purchaseDate: '2024-03-10',
                                usefulLife: 10,
                                currentBookValue: 45000,
                                isSold: false
                            },
                            {
                                id: 'AST-102',
                                name: 'Industrieroboter-Arm',
                                category: '0700',
                                purchaseCost: 28000,
                                purchaseDate: '2025-02-01',
                                usefulLife: 8,
                                currentBookValue: 28000,
                                isSold: false
                            },
                            {
                                id: 'AST-103',
                                name: 'Lieferwagen VW Crafter',
                                category: '0840',
                                purchaseCost: 18000,
                                purchaseDate: '2024-06-15',
                                usefulLife: 6,
                                currentBookValue: 18000,
                                isSold: false
                            },
                            {
                                id: 'AST-104',
                                name: 'Kleintransporter Mercedes Sprinter',
                                category: '0840',
                                purchaseCost: 12000,
                                purchaseDate: '2025-01-20',
                                usefulLife: 6,
                                currentBookValue: 12000,
                                isSold: false
                            },
                            {
                                id: 'AST-105',
                                name: 'Büroausstattung Premium',
                                category: '0860',
                                purchaseCost: 8000,
                                purchaseDate: '2024-01-15',
                                usefulLife: 10,
                                currentBookValue: 8000,
                                isSold: false
                            },
                            {
                                id: 'AST-106',
                                name: 'EDV-Anlage & Server',
                                category: '0860',
                                purchaseCost: 7000,
                                purchaseDate: '2025-04-01',
                                usefulLife: 5,
                                currentBookValue: 7000,
                                isSold: false
                            }
                        ];
                    }
                    if (WaWiState.depreciationBooked === undefined) {
                        WaWiState.depreciationBooked = false;
                    }

                    // MIGRATION: Fix Eigenkapital sign bug or missing TAM account from older versions
                    const scenarioForMig = WAWI_SCENARIOS.find(s => s.id === WaWiState.activeScenario) || WAWI_SCENARIOS[0];
                    const expectedTAM = scenarioForMig.startCapital.maschinen || 0;
                    const needsTAMFix = expectedTAM > 0 && (!WaWiState.accounts['0700'] || WaWiState.accounts['0700'] === 0);

                    if (WaWiState.accounts['3000'] > 0 || needsTAMFix) {
                        console.log('WaWi: Migration needed (Sign Bug or missing 0700). Recalculating balances...');
                        // WaWiState reference must be maintained, so we just run recalculation.
                        // However, wawiRecalculateBalances operates on WaWiState itself.
                        setTimeout(() => {
                            wawiRecalculateBalances();
                            wawiSaveState();
                            renderWarenwirtschaft();
                        }, 100);
                    }

                    console.log('WaWi: State erfolgreich geladen und validiert.');
                    return;
                }
            }
            console.warn('WaWi: Gespeicherter State ist inkompatibel oder beschädigt. Setze zurück...');
        }
    } catch (e) {
        console.error('WaWi: Kritischer Fehler beim Laden des States:', e);
    }

    // Fallback: Fresh Start
    WaWiState = wawiCreateFreshState(WAWI_SCENARIOS[0].id);
    wawiSaveState();
}

function wawiSaveState() {
    try {
        localStorage.setItem(WAWI_STORAGE_KEY, JSON.stringify(WaWiState));
    } catch (e) {
        console.warn('WaWi: Fehler beim Speichern:', e);
    }
}

function wawiResetState() {
    WaWiState = wawiCreateFreshState(WaWiState.activeScenario);
    wawiSaveState();
}

function wawiSwitchScenario(scenarioId) {
    const oldDiff = WaWiState ? WaWiState.difficulty : 'advanced';
    const oldMode = WaWiState && WaWiState.simMode ? WaWiState.simMode : 'simulation';
    WaWiState = wawiCreateFreshState(scenarioId);
    WaWiState.difficulty = oldDiff;
    WaWiState.simMode = oldMode;
    wawiSaveState();
}

function wawiTransformState(newDiff, keepData) {
    const oldMode = WaWiState && WaWiState.simMode ? WaWiState.simMode : 'simulation';
    if (!keepData) {
        const scenarioId = WaWiState.activeScenario;
        WaWiState = wawiCreateFreshState(scenarioId);
        WaWiState.difficulty = newDiff;
        WaWiState.simMode = oldMode;
        wawiSaveState();
        renderWarenwirtschaft();
        wawiShowToast(`Simulation auf ${newDiff} zurückgesetzt.`, 'info');
        return;
    }

    const scenario = wawiGetScenario();
    const oldDiff = WaWiState.difficulty;

    // Allowed accounts per mode
    const allowedMap = {
        'beginner': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400'],
        'advanced': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400', '5000', '6010', '6020', '6000', '8020', '6520', '5460', '6960'],
        'pro': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400', '5000', '5200', '6000', '6010', '6020', '2600', '4800', '8020', '6520', '5460', '6960']
    };
    const allowed = allowedMap[newDiff];

    let logs = [];
    logs.push(`Umstellung des Lern-Modus von <b>${oldDiff.toUpperCase()}</b> auf <b>${newDiff.toUpperCase()}</b>.`);

    // --- Special Tax Handling ---
    const TAX_RATE = 0.19;

    // A: Shifting to PRO (Extract Taxes from Gross)
    if (newDiff === 'pro' && oldDiff !== 'pro') {
        logs.push('<b>Umsatsteuer-Automatik:</b> Steueranteile werden aus den Bruttobeträgen herausgerechnet.');

        // 1. Vorsteuer (2600) extraction from Inventory (2000, 2010, 2020)
        let totalVorsteuer = 0;
        ['2000', '2010', '2020'].forEach(accId => {
            const balance = WaWiState.accounts[accId] || 0;
            if (balance > 0) {
                const taxPart = balance - (balance / (1 + TAX_RATE));
                WaWiState.accounts[accId] -= taxPart;
                totalVorsteuer += taxPart;
                logs.push(`- Vorsteuer-Abzug bei <i>${wawiGetAccountName(accId)}</i>: ${wawiFormatCurrency(taxPart)}`);
            }
        });
        if (totalVorsteuer > 0) {
            WaWiState.accounts['2600'] = (WaWiState.accounts['2600'] || 0) + totalVorsteuer;
            logs.push(`- Konto <i>2600 Vorsteuer</i> wurde mit ${wawiFormatCurrency(totalVorsteuer)} bebucht.`);
        }

        // 2. Umsatzsteuer (4800) extraction from Sales (5000)
        const salesBalance = WaWiState.accounts['5000'] || 0;
        if (salesBalance !== 0) {
            const taxPart = salesBalance - (salesBalance / (1 + TAX_RATE));
            WaWiState.accounts['5000'] -= taxPart;
            WaWiState.accounts['4800'] = (WaWiState.accounts['4800'] || 0) + taxPart;
            logs.push(`- Umsatzsteuer-Abzug bei <i>5000 Umsatzerlöse</i>: ${wawiFormatCurrency(Math.abs(taxPart))}`);
        }
    }

    // B: Shifting AWAY from PRO (Merge Taxes back to Gross)
    if (oldDiff === 'pro' && newDiff !== 'pro') {
        logs.push('<b>Brutto-Vereinfachung:</b> Steuerkonten werden aufgelöst und in die Bruttobeträge integriert.');

        // 1. Merge Vorsteuer (2600) back into Rohstoffe (2000)
        const vStBalance = WaWiState.accounts['2600'] || 0;
        if (vStBalance > 0) {
            WaWiState.accounts['2000'] = (WaWiState.accounts['2000'] || 0) + vStBalance;
            WaWiState.accounts['2600'] = 0;
            logs.push(`- Vorsteuer (${wawiFormatCurrency(vStBalance)}) wurde in das Konto <i>2000 Rohstoffe</i> integriert.`);
        }

        // 2. Merge Umsatzsteuer (4800) back into Sales (5000)
        const uStBalance = WaWiState.accounts['4800'] || 0;
        if (uStBalance !== 0) {
            WaWiState.accounts['5000'] = (WaWiState.accounts['5000'] || 0) + uStBalance;
            WaWiState.accounts['4800'] = 0;
            logs.push(`- Umsatzsteuer (${wawiFormatCurrency(Math.abs(uStBalance))}) wurde in das Konto <i>5000 Umsatzerlöse</i> integriert.`);
        }
    }

    // Transformation: Close now disallowed accounts into Eigenkapital
    for (const [id, balance] of Object.entries(WaWiState.accounts)) {
        if (!allowed.includes(id) && balance !== 0) {
            const accName = wawiGetAccountName(id);
            const amtLabel = wawiFormatCurrency(Math.abs(balance));

            // System-level direct balance adjustment to keep it consistent
            const accDef = scenario.accounts.find(a => a.id === id);
            if (!accDef) continue;

            const isSollAccount = (accDef.type === 'aktiv' || accDef.type === 'aufwand');

            // Adjust Eigenkapital (Basic accounting logic: illegal assets/expenses reduce EK, incomes/liab increase it)
            // Since we remove the balance from the account (setting it to 0), 
            // we must add it to EK to keep the total trial balance at zero.
            WaWiState.accounts['3000'] += balance;

            if (isSollAccount) {
                logs.push(`Soll-Konto <i>${id} ${accName}</i> (${amtLabel}) wurde mit Eigenkapital verrechnet.`);
            } else {
                logs.push(`Haben-Konto <i>${id} ${accName}</i> (${amtLabel}) wurde dem Eigenkapital gutgeschrieben.`);
            }
            WaWiState.accounts[id] = 0;
        }
    }

    WaWiState.difficulty = newDiff;
    wawiSaveState();
    renderWarenwirtschaft();
    wawiShowTransformationReport(logs, oldDiff, newDiff);
}

function wawiShowTransformationReport(logs, oldDiff, newDiff) {
    const container = document.body;
    const modalId = 'wawi-report-modal';

    // Remove if exists
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modeLabels = { beginner: 'Anfänger', advanced: 'Fortgeschritten', pro: 'Profi' };

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'wawi-modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';

    modal.innerHTML = `
        <div class="wawi-modal-content" style="background:var(--bg-color); color:var(--text-main); padding:2.5rem; border-radius:1.5rem; max-width:700px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); border:2px solid var(--primary); max-height:90vh; overflow-y:auto; position:relative;">
            <div id="wawi-printable-report">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; border-bottom:2px solid var(--primary); padding-bottom:1rem;">
                    <h2 style="margin:0;">Lern-Modus Transformation</h2>
                    <span style="font-size:0.9rem; color:var(--text-muted);">${new Date().toLocaleDateString('de-DE')}</span>
                </div>
                
                <p>Der Übungsmodus wurde erfolgreich angepasst. Hier ist eine Zusammenfassung der durchgeführten Systemanpassungen:</p>
                
                <div style="background:rgba(0,134,203,0.1); padding:1.5rem; border-radius:1rem; margin-bottom:2rem;">
                    <div style="font-size:0.8rem; text-transform:uppercase; color:var(--primary); font-weight:700; margin-bottom:0.5rem;">Status-Wechsel</div>
                    <div style="font-size:1.2rem; font-weight:700;">${modeLabels[oldDiff]} → ${modeLabels[newDiff]}</div>
                </div>

                <h3 style="font-size:1rem; margin-bottom:1rem;">Protokoll der Anpassungen:</h3>
                <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.8rem;">
                    ${logs.map(log => `
                        <li style="padding:0.8rem; background:rgba(255,255,255,0.03); border-radius:0.5rem; border-left:4px solid var(--primary); font-size:0.9rem;">
                            ${log}
                        </li>
                    `).join('')}
                    ${logs.length === 1 ? '<li style="padding:0.8rem; color:var(--text-muted);">Keine Bilanzanpassungen notwendig.</li>' : ''}
                </ul>

                <div style="margin-top:2.5rem; padding:1.5rem; border-top:1px dashed var(--card-border); font-size:0.85rem; color:var(--text-muted);">
                    <strong>Hinweis für Schüler:</strong> In deinem neuen Modus gelten veränderte Buchungskreis-Regeln. Bitte prüfe deine T-Konten und das Journal auf die neuen System-Buchungen.
                </div>
            </div>

            <div style="margin-top:2.5rem; display:flex; gap:1rem; justify-content:flex-end;" class="no-print">
                <button class="wawi-btn wawi-btn-outline" onclick="window.print()">
                    🖨️ Als PDF speichern / Drucken
                </button>
                <button class="wawi-btn" onclick="document.getElementById('${modalId}').remove()">
                    Verstanden & Schließen
                </button>
            </div>
        </div>
        <style>
            @media print {
                body * { visibility: hidden; }
                #wawi-printable-report, #wawi-printable-report * { visibility: visible; }
                #wawi-printable-report { position: absolute; left: 0; top: 0; width:100%; }
                .no-print { display: none !important; }
            }
        </style>
    `;

    container.appendChild(modal);
}

function wawiGetScenario() {
    return WAWI_SCENARIOS.find(s => s.id === WaWiState.activeScenario) || WAWI_SCENARIOS[0];
}


// --- XML Data Management (Export/Import) ---

function wawiEscapeXML(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

function wawiExportXML() {
    const scenario = wawiGetScenario();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `wawi_stand_${scenario.id}_${timestamp}.xml`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<WarenwirtschaftState>\n`;
    xml += `  <Metadata>\n`;
    xml += `    <Version>0.5.0</Version>\n`;
    xml += `    <Scenario>${wawiEscapeXML(WaWiState.activeScenario)}</Scenario>\n`;
    xml += `    <CreatedAt>${WaWiState.createdAt}</CreatedAt>\n`;
    xml += `    <ExportedAt>${new Date().toISOString()}</ExportedAt>\n`;
    xml += `  </Metadata>\n`;

    xml += `  <Stock>\n`;
    for (const [id, qty] of Object.entries(WaWiState.stock)) {
        xml += `    <Item id="${wawiEscapeXML(id)}">${qty}</Item>\n`;
    }
    xml += `  </Stock>\n`;

    xml += `  <Accounts>\n`;
    for (const [id, balance] of Object.entries(WaWiState.accounts)) {
        xml += `    <Account id="${wawiEscapeXML(id)}">${balance.toFixed(2)}</Account>\n`;
    }
    xml += `  </Accounts>\n`;

    xml += `  <Journal>\n`;
    [...WaWiState.journal].reverse().forEach(entry => {
        if (entry.isDeleted) return;
        xml += `    <Entry id="${entry.id}">\n`;
        xml += `      <Timestamp>${entry.timestamp}</Timestamp>\n`;
        xml += `      <Description>${wawiEscapeXML(entry.description)}</Description>\n`;
        if (entry.isCompound && entry.entries) {
            xml += `      <IsCompound>true</IsCompound>\n`;
            entry.entries.forEach(e => {
                xml += `      <BookingEntry side="${e.side}" accountId="${wawiEscapeXML(e.accountId)}" amount="${e.amount.toFixed(2)}" />\n`;
            });
        } else if (entry.debit && typeof entry.debit === 'object') {
            xml += `      <Debit accountId="${wawiEscapeXML(entry.debit.accountId)}" amount="${entry.debit.amount.toFixed(2)}" />\n`;
            xml += `      <Credit accountId="${wawiEscapeXML(entry.credit.accountId)}" amount="${entry.credit.amount.toFixed(2)}" />\n`;
        } else {
            xml += `      <Debit accountId="${wawiEscapeXML(entry.debitAccountId || '')}" amount="${(entry.amount || 0).toFixed(2)}" />\n`;
            xml += `      <Credit accountId="${wawiEscapeXML(entry.creditAccountId || '')}" amount="${(entry.amount || 0).toFixed(2)}" />\n`;
        }
        xml += `      <Mode>${entry.mode || 'simulation'}</Mode>\n`;
        xml += `      <UsedSolution>${entry.usedSolution || false}</UsedSolution>\n`;
        xml += `    </Entry>\n`;
    });
    xml += `  </Journal>\n`;

    xml += `  <Production>\n`;
    xml += `    <InProgress>${WaWiState.production.inProgress}</InProgress>\n`;
    xml += `    <CompletedProducts>${WaWiState.production.completedProducts}</CompletedProducts>\n`;
    xml += `    <TotalProduced>${WaWiState.production.totalProduced}</TotalProduced>\n`;
    xml += `    <TotalSold>${WaWiState.production.totalSold}</TotalSold>\n`;
    xml += `    <PartsUsed>\n`;
    for (const [id, qty] of Object.entries(WaWiState.production.partsUsed)) {
        xml += `      <Part id="${wawiEscapeXML(id)}">${qty}</Part>\n`;
    }
    xml += `    </PartsUsed>\n`;

    xml += `    <Orders>\n`;
    WaWiState.orders.forEach(ord => {
        xml += `      <Order id="${wawiEscapeXML(ord.id)}">\n`;
        xml += `        <Customer>${wawiEscapeXML(ord.customer)}</Customer>\n`;
        xml += `        <Qty>${ord.qty}</Qty>\n`;
        xml += `        <Status>${ord.status}</Status>\n`;
        xml += `        <Price>${ord.price.toFixed(2)}</Price>\n`;
        xml += `      </Order>\n`;
    });
    xml += `    </Orders>\n`;

    xml += `  </Production>\n`;

    // Assets
    if (WaWiState.assets && WaWiState.assets.length > 0) {
        xml += `  <Assets>\n`;
        WaWiState.assets.forEach(a => {
            xml += `    <Asset id="${wawiEscapeXML(a.id)}">\n`;
            xml += `      <Name>${wawiEscapeXML(a.name)}</Name>\n`;
            xml += `      <Category>${wawiEscapeXML(a.category)}</Category>\n`;
            xml += `      <PurchaseCost>${a.purchaseCost.toFixed(2)}</PurchaseCost>\n`;
            xml += `      <PurchaseDate>${a.purchaseDate}</PurchaseDate>\n`;
            xml += `      <UsefulLife>${a.usefulLife}</UsefulLife>\n`;
            xml += `      <CurrentBookValue>${a.currentBookValue.toFixed(2)}</CurrentBookValue>\n`;
            xml += `      <IsSold>${a.isSold}</IsSold>\n`;
            if (a.isSold) {
                xml += `      <SellPrice>${(a.sellPrice || 0).toFixed(2)}</SellPrice>\n`;
                xml += `      <SellDate>${a.sellDate || ''}</SellDate>\n`;
            }
            xml += `    </Asset>\n`;
        });
        xml += `  </Assets>\n`;
    }

    // Finance Transactions
    if (WaWiState.financeTransactions && WaWiState.financeTransactions.length > 0) {
        xml += `  <FinanceTransactions>\n`;
        WaWiState.financeTransactions.forEach(ft => {
            xml += `    <Transaction id="${wawiEscapeXML(ft.id)}" type="${wawiEscapeXML(ft.type)}">\n`;
            xml += `      <Date>${ft.date}</Date>\n`;
            xml += `      <Description>${wawiEscapeXML(ft.description)}</Description>\n`;
            xml += `      <OriginalAmount>${ft.originalAmount.toFixed(2)}</OriginalAmount>\n`;
            xml += `      <RemainingAmount>${ft.remainingAmount.toFixed(2)}</RemainingAmount>\n`;
            xml += `    </Transaction>\n`;
        });
        xml += `  </FinanceTransactions>\n`;
    }

    // Settings
    xml += `  <Settings>\n`;
    xml += `    <Difficulty>${WaWiState.difficulty || 'advanced'}</Difficulty>\n`;
    xml += `    <SimMode>${WaWiState.simMode || 'simulation'}</SimMode>\n`;
    xml += `    <DepreciationBooked>${WaWiState.depreciationBooked || false}</DepreciationBooked>\n`;
    xml += `  </Settings>\n`;

    xml += `  <JournalIdCounter>${WaWiState.journalIdCounter}</JournalIdCounter>\n`;
    xml += `</WarenwirtschaftState>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    wawiShowToast('Arbeitsstand erfolgreich gespeichert', 'success');
}

function wawiHandleImport(event) {
    const file = event.target.files[0];
    if (file) wawiProcessImportFile(file);
    event.target.value = ''; // Reset input
}

function wawiHandleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function wawiHandleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function wawiHandleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/xml' || file.name.endsWith('.xml')) {
        wawiProcessImportFile(file);
    } else {
        wawiShowToast('Bitte nur XML-Dateien hochladen', 'danger');
    }
}

function wawiProcessImportFile(file) {
    if (!confirm('Möchtest du den aktuellen Stand wirklich überschreiben? Alle nicht gespeicherten Fortschritte gehen verloren.')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            // Pre-clean the XML to handle unescaped ampersands (common bug in previous exports)
            let xmlString = e.target.result;
            xmlString = xmlString.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            // Check for parse errors
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Ungültiges XML-Format");
            }

            const newState = {};

            // Parse Metadata
            newState.activeScenario = xmlDoc.getElementsByTagName("Scenario")[0]?.textContent;
            newState.createdAt = xmlDoc.getElementsByTagName("CreatedAt")[0]?.textContent || new Date().toISOString();

            // Validate Scenario
            if (!WAWI_SCENARIOS.find(s => s.id === newState.activeScenario)) {
                throw new Error(`Unbekanntes Szenario im XML: ${newState.activeScenario}`);
            }

            // Parse Stock
            newState.stock = {};
            const stockItems = xmlDoc.querySelectorAll("Stock > Item");
            stockItems.forEach(item => {
                newState.stock[item.getAttribute("id")] = parseInt(item.textContent, 10) || 0;
            });

            // Parse Accounts
            newState.accounts = {};
            const accounts = xmlDoc.querySelectorAll("Accounts > Account");
            accounts.forEach(acc => {
                newState.accounts[acc.getAttribute("id")] = parseFloat(acc.textContent) || 0;
            });

            // Parse Journal
            newState.journal = [];
            const journalEntries = xmlDoc.querySelectorAll("Journal > Entry");
            journalEntries.forEach(entry => {
                const modeNode = entry.querySelector("Mode");
                const usedSolutionNode = entry.querySelector("UsedSolution");
                const isCompoundNode = entry.querySelector("IsCompound");
                
                const baseEntry = {
                    id: parseInt(entry.getAttribute("id"), 10),
                    timestamp: entry.querySelector("Timestamp")?.textContent,
                    description: entry.querySelector("Description")?.textContent,
                    mode: modeNode ? modeNode.textContent : 'simulation',
                    usedSolution: usedSolutionNode ? (usedSolutionNode.textContent === 'true') : false,
                    isDeleted: false,
                    isEdited: false
                };

                if (isCompoundNode && isCompoundNode.textContent === 'true') {
                    baseEntry.isCompound = true;
                    baseEntry.entries = [];
                    const bookingEntries = entry.querySelectorAll("BookingEntry");
                    bookingEntries.forEach(be => {
                        baseEntry.entries.push({
                            side: be.getAttribute("side"),
                            accountId: be.getAttribute("accountId"),
                            accountName: wawiGetAccountName(be.getAttribute("accountId")),
                            amount: parseFloat(be.getAttribute("amount"))
                        });
                    });
                    newState.journal.unshift(baseEntry);
                } else {
                    const debit = entry.querySelector("Debit");
                    const credit = entry.querySelector("Credit");
                    if (debit && credit) {
                        baseEntry.debit = {
                            accountId: debit.getAttribute("accountId"),
                            accountName: wawiGetAccountName(debit.getAttribute("accountId")),
                            amount: parseFloat(debit.getAttribute("amount"))
                        };
                        baseEntry.credit = {
                            accountId: credit.getAttribute("accountId"),
                            accountName: wawiGetAccountName(credit.getAttribute("accountId")),
                            amount: parseFloat(credit.getAttribute("amount"))
                        };
                    }
                    newState.journal.unshift(baseEntry);
                }
            });

            // Parse Production
            const prodNode = xmlDoc.querySelector("Production");
            newState.production = {
                inProgress: prodNode.querySelector("InProgress")?.textContent === 'true',
                completedProducts: parseInt(prodNode.querySelector("CompletedProducts")?.textContent, 10) || 0,
                totalProduced: parseInt(prodNode.querySelector("TotalProduced")?.textContent, 10) || 0,
                totalSold: parseInt(prodNode.querySelector("TotalSold")?.textContent, 10) || 0,
                partsUsed: {}
            };
            const partNodes = prodNode.querySelectorAll("PartsUsed > Part");
            partNodes.forEach(part => {
                newState.production.partsUsed[part.getAttribute("id")] = parseInt(part.textContent, 10) || 0;
            });

            // Parse Orders (optional for older versions)
            newState.orders = [];
            const orderNodes = xmlDoc.querySelectorAll("Production > Orders > Order");
            if (orderNodes.length > 0) {
                orderNodes.forEach(ord => {
                    newState.orders.push({
                        id: ord.getAttribute("id"),
                        customer: ord.querySelector("Customer")?.textContent || "Kunde",
                        qty: parseInt(ord.querySelector("Qty")?.textContent, 10) || 1,
                        status: ord.querySelector("Status")?.textContent || 'open',
                        price: parseFloat(ord.querySelector("Price")?.textContent) || 0
                    });
                });
            } else {
                // Initialize default orders if missing (Compatibility for old XMLs)
                const scenario = WAWI_SCENARIOS.find(s => s.id === newState.activeScenario);
                newState.orders = [
                    { id: 'ORD-101', customer: 'Radsport Schuberth', qty: 1, status: 'open', price: scenario?.product.sellPrice || 0 },
                    { id: 'ORD-102', customer: 'Zweirad-Center Meyer', qty: 2, status: 'open', price: (scenario?.product.sellPrice || 0) * 0.95 }
                ];
            }

            // Parse Assets
            newState.assets = [];
            const assetNodes = xmlDoc.querySelectorAll("Assets > Asset");
            assetNodes.forEach(a => {
                const asset = {
                    id: a.getAttribute("id"),
                    name: a.querySelector("Name")?.textContent,
                    category: a.querySelector("Category")?.textContent,
                    purchaseCost: parseFloat(a.querySelector("PurchaseCost")?.textContent) || 0,
                    purchaseDate: a.querySelector("PurchaseDate")?.textContent,
                    usefulLife: parseInt(a.querySelector("UsefulLife")?.textContent, 10) || 1,
                    currentBookValue: parseFloat(a.querySelector("CurrentBookValue")?.textContent) || 0,
                    isSold: a.querySelector("IsSold")?.textContent === 'true'
                };
                if (asset.isSold) {
                    asset.sellPrice = parseFloat(a.querySelector("SellPrice")?.textContent) || 0;
                    asset.sellDate = a.querySelector("SellDate")?.textContent || '';
                }
                newState.assets.push(asset);
            });

            // Parse Finance Transactions
            newState.financeTransactions = [];
            const ftNodes = xmlDoc.querySelectorAll("FinanceTransactions > Transaction");
            ftNodes.forEach(ft => {
                newState.financeTransactions.push({
                    id: ft.getAttribute("id"),
                    type: ft.getAttribute("type"),
                    date: ft.querySelector("Date")?.textContent,
                    description: ft.querySelector("Description")?.textContent,
                    originalAmount: parseFloat(ft.querySelector("OriginalAmount")?.textContent) || 0,
                    remainingAmount: parseFloat(ft.querySelector("RemainingAmount")?.textContent) || 0
                });
            });

            // Parse Settings
            const diffNode = xmlDoc.querySelector("Settings > Difficulty");
            const simNode = xmlDoc.querySelector("Settings > SimMode");
            const depNode = xmlDoc.querySelector("Settings > DepreciationBooked");
            
            newState.difficulty = diffNode ? diffNode.textContent : 'advanced';
            newState.simMode = simNode ? simNode.textContent : 'simulation';
            newState.depreciationBooked = depNode ? (depNode.textContent === 'true') : false;

            newState.journalIdCounter = parseInt(xmlDoc.getElementsByTagName("JournalIdCounter")[0]?.textContent, 10) || (newState.journal.length + 1);
            
            // Apply state
            const oldTab = WaWiState.activeTab;
            WaWiState = newState;

            // Try to preserve tab if it exists in the new state, otherwise go to dashboard
            const validTabs = ['dashboard', 'production', 'sales', 'inventory', 'accounting', 'procurement', 'assets'];
            WaWiState.activeTab = validTabs.includes(oldTab) ? oldTab : 'dashboard';

            wawiSaveState();
            renderWarenwirtschaft();
            wawiShowToast('Arbeitsstand erfolgreich geladen', 'success');

        } catch (error) {
            console.error("WaWi Import Error:", error);
            wawiShowToast(`Fehler beim Import: ${error.message}`, 'danger');
        }
    };
    reader.readAsText(file);
}


// =============================================================================
// SECTION 3: ECHTZEIT-BUCHUNGS-ENGINE (DOPPELTE BUCHFÜHRUNG)
// =============================================================================

function wawiPostBooking(description, debitAccountId, creditAccountId, amount) {
    if (amount <= 0) return false;
    
    if (WaWiState.simMode === 'practice') {
        WaWiState.pendingBookings.push({
            description, debitAccountId, creditAccountId, amount,
            fails: 0
        });
        wawiSaveState();
        wawiProcessNextPracticeBooking();
    } else {
        wawiExecuteBooking(description, debitAccountId, creditAccountId, amount, { mode: 'simulation' });
    }
}

/**
 * Post a compound booking with multiple soll/haben entries.
 * entries: [{side:'soll'|'haben', accountId, amount}]
 */
function wawiPostCompoundBooking(description, entries, flags = {}) {
    if (!entries || entries.length === 0) return false;
    
    if (WaWiState.simMode === 'practice') {
        WaWiState.pendingBookings.push({
            description, entries, isCompound: true,
            fails: 0
        });
        wawiSaveState();
        wawiProcessNextPracticeBooking();
    } else {
        wawiExecuteCompoundBooking(description, entries, { mode: 'simulation', ...flags });
    }
}

let wawiIsPracticeModalOpen = false;

function wawiProcessNextPracticeBooking() {
    if (wawiIsPracticeModalOpen || !WaWiState.pendingBookings || WaWiState.pendingBookings.length === 0) {
        return;
    }
    const booking = WaWiState.pendingBookings[0];
    wawiRenderPracticeModal(booking);
}

function wawiRenderPracticeModal(booking) {
    wawiIsPracticeModalOpen = true;
    const scenario = wawiGetScenario();
    
    const mode = WaWiState.difficulty || 'advanced';
    const allowedMap = {
        'beginner': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400', '4250', '2400'],
        'advanced': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400', '4250', '5000', '6010', '6020', '6000', '8020', '2400', '6520', '5460', '6960'],
        'pro': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '3000', '4400', '4250', '5000', '5200', '6000', '6010', '6020', '2600', '4800', '8020', '2400', '6520', '5460', '6960']
    };
    const allowed = allowedMap[mode] || allowedMap['advanced'];
    
    const accOptions = scenario.accounts
        .filter(a => allowed.includes(a.id))
        .map(a => `<option value="${a.id}">${a.id} ${a.name}</option>`)
        .join('');
    
    let overlay = document.getElementById('wawi-practice-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'wawi-practice-overlay';
        overlay.className = 'wawi-practice-overlay';
        document.body.appendChild(overlay);
    }

    // Determine number of soll/haben fields
    let sollCount = 1, habenCount = 1;
    if (booking.isCompound && booking.entries) {
        sollCount = booking.entries.filter(e => e.side === 'soll').length;
        habenCount = booking.entries.filter(e => e.side === 'haben').length;
    }

    const isCompound = sollCount > 1 || habenCount > 1;

    let sollFields = '';
    for (let i = 0; i < sollCount; i++) {
        sollFields += `
            <div style="display:flex; gap:0.5rem; align-items:center; ${i > 0 ? 'margin-top:0.4rem;' : ''}">
                <select id="wawi-practice-soll-${i}" class="wawi-practice-select" style="flex:1; min-width:0;">
                    <option value="">-- Soll-Konto ${sollCount > 1 ? (i + 1) : ''} --</option>
                    ${accOptions}
                </select>
                <input type="number" id="wawi-practice-soll-amt-${i}" class="wawi-practice-input" placeholder="Betrag" step="0.01" min="0" style="flex:0 0 110px; max-width:110px;">
            </div>
        `;
    }

    let habenFields = '';
    for (let i = 0; i < habenCount; i++) {
        habenFields += `
            <div style="display:flex; gap:0.5rem; align-items:center; ${i > 0 ? 'margin-top:0.4rem;' : ''}">
                <select id="wawi-practice-haben-${i}" class="wawi-practice-select" style="flex:1; min-width:0;">
                    <option value="">-- Haben-Konto ${habenCount > 1 ? (i + 1) : ''} --</option>
                    ${accOptions}
                </select>
                <input type="number" id="wawi-practice-haben-amt-${i}" class="wawi-practice-input" placeholder="Betrag" step="0.01" min="0" style="flex:0 0 110px; max-width:110px;">
            </div>
        `;
    }
    
    overlay.innerHTML = `
        <div class="wawi-practice-modal">
            <div class="wawi-practice-header">
                <div class="wawi-practice-title">Übungsmodus: ${isCompound ? 'Zusammengesetzter ' : ''}Buchungssatz</div>
                <button class="wawi-help-btn" onclick="wawiShowPracticeHelp()" title="Hilfe zur Kontoart">?</button>
            </div>
            <div class="wawi-practice-desc">
                <strong>Geschäftsvorfall:</strong><br>
                ${booking.description}
            </div>
            ${isCompound ? '<div style="margin-bottom:0.75rem; padding:0.5rem 0.75rem; background:rgba(139,92,246,0.1); border-radius:6px; border-left:3px solid #8b5cf6; font-size:0.8rem;">💡 Dies ist ein zusammengesetzter Buchungssatz mit mehreren Konten.</div>' : ''}
            ${(() => {
                let amountHTML = '';
                if (booking.isCompound && booking.entries) {
                    const sollEntries = booking.entries.filter(e => e.side === 'soll');
                    const habenEntries = booking.entries.filter(e => e.side === 'haben');
                    const total = sollEntries.reduce((s, e) => s + e.amount, 0);
                    amountHTML = '<div style="margin-bottom:0.75rem; padding:0.6rem 0.75rem; background:rgba(0,200,150,0.08); border-radius:6px; border-left:3px solid hsl(140,60%,50%); font-size:0.85rem;">';
                    amountHTML += '<strong style="display:block; margin-bottom:0.4rem;">📊 Zu verbuchende Beträge:</strong>';
                    amountHTML += '<div style="display:flex; flex-direction:column; gap:0.2rem;">';
                    for (const e of sollEntries) {
                        amountHTML += `<div style="display:flex; justify-content:space-between;"><span>Soll:</span><span style="font-weight:600;">${wawiFormatCurrency(e.amount)}</span></div>`;
                    }
                    for (const e of habenEntries) {
                        amountHTML += `<div style="display:flex; justify-content:space-between;"><span>Haben:</span><span style="font-weight:600;">${wawiFormatCurrency(e.amount)}</span></div>`;
                    }
                    amountHTML += '</div>';
                    amountHTML += `<div style="margin-top:0.4rem; padding-top:0.4rem; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; font-weight:700;"><span>Gesamtbetrag:</span><span>${wawiFormatCurrency(total)}</span></div>`;
                    amountHTML += '</div>';
                } else if (booking.amount) {
                    amountHTML = `<div style="margin-bottom:0.75rem; padding:0.5rem 0.75rem; background:rgba(0,200,150,0.08); border-radius:6px; border-left:3px solid hsl(140,60%,50%); font-size:0.85rem;"><strong>📊 Zu verbuchender Betrag:</strong> <span style="font-weight:700;">${wawiFormatCurrency(booking.amount)}</span></div>`;
                }
                return amountHTML;
            })()}
            <div class="wawi-practice-form" style="flex-direction:column; gap:0.75rem;">
                <div>
                    <label style="display:block; margin-bottom:0.3rem; font-weight:600; font-size:0.85rem;">Soll-Seite</label>
                    ${sollFields}
                </div>
                <div style="text-align:center; font-weight:bold; font-size:1rem; color:var(--primary);">an</div>
                <div>
                    <label style="display:block; margin-bottom:0.3rem; font-weight:600; font-size:0.85rem;">Haben-Seite</label>
                    ${habenFields}
                </div>
            </div>
            <div id="wawi-practice-help-box" class="wawi-practice-help"></div>
            <div id="wawi-practice-error" class="wawi-practice-error"></div>
            <div class="wawi-practice-actions" style="display: flex; justify-content: space-between; width: 100%; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--card-border);">
                <button class="wawi-btn wawi-btn-secondary" style="background: transparent; border: 1px solid var(--text-muted); color: var(--text-muted);" onclick="wawiCancelPracticeBooking()">Abbrechen</button>
                <button class="wawi-btn wawi-btn-primary" onclick="wawiCheckPracticeBooking()">Buchen</button>
            </div>
        </div>
    `;
    overlay.style.display = 'flex';
}

let WaWiStateBackup = null;

function wawiBackupState() {
    if (!WaWiState || !WaWiState.pendingBookings || WaWiState.pendingBookings.length === 0) {
        WaWiStateBackup = JSON.stringify(WaWiState);
    }
}

function wawiRestoreBackup() {
    if (WaWiStateBackup) {
        WaWiState = JSON.parse(WaWiStateBackup);
        wawiSaveState();
    }
}

function wawiCancelPracticeBooking() {
    wawiRestoreBackup();
    
    wawiShowToast('Geschäftsvorfall abgebrochen. Alle Änderungen wurden rückgängig gemacht.', 'info');
    
    wawiIsPracticeModalOpen = false;
    document.getElementById('wawi-practice-overlay').style.display = 'none';
    renderWarenwirtschaft();
}

function wawiShowPracticeHelp() {
    const booking = WaWiState.pendingBookings[0];
    if (!booking) return;
    
    const scenario = wawiGetScenario();
    const getTypeLabel = (acc) => {
        if (!acc) return 'Unbekannt';
        if (acc.type === 'aktiv') return 'Aktives Bestandskonto';
        if (acc.type === 'passiv') return 'Passives Bestandskonto';
        if (acc.type === 'aufwand') return 'Aufwandskonto';
        if (acc.type === 'ertrag') return 'Ertragskonto';
        if (acc.type === 'eigenkapital') return 'Eigenkapitalkonto';
        return acc.type;
    };

    let helpText = '';
    if (booking.isCompound && booking.entries) {
        const sollEntries = booking.entries.filter(e => e.side === 'soll');
        const habenEntries = booking.entries.filter(e => e.side === 'haben');
        helpText = '<strong>Tipp:</strong><br>';
        helpText += 'Soll: ' + sollEntries.map(e => getTypeLabel(scenario.accounts.find(a => a.id === e.accountId))).join(', ') + '<br>';
        helpText += 'Haben: ' + habenEntries.map(e => getTypeLabel(scenario.accounts.find(a => a.id === e.accountId))).join(', ');
    } else {
        const sollAcc = scenario.accounts.find(a => a.id === booking.debitAccountId);
        const habenAcc = scenario.accounts.find(a => a.id === booking.creditAccountId);
        helpText = `<strong>Tipp:</strong><br>Soll: ${getTypeLabel(sollAcc)}<br>Haben: ${getTypeLabel(habenAcc)}`;
    }
    
    const helpBox = document.getElementById('wawi-practice-help-box');
    helpBox.innerHTML = helpText;
    helpBox.style.display = 'block';
}

function wawiCheckPracticeBooking() {
    const booking = WaWiState.pendingBookings[0];
    if (!booking) return;
    
    const errorBox = document.getElementById('wawi-practice-error');
    errorBox.style.display = 'none';

    if (booking.isCompound && booking.entries) {
        // Compound check
        const sollExpected = booking.entries.filter(e => e.side === 'soll');
        const habenExpected = booking.entries.filter(e => e.side === 'haben');

        let correct = true;
        for (let i = 0; i < sollExpected.length; i++) {
            const userAcc = document.getElementById(`wawi-practice-soll-${i}`)?.value;
            const userAmt = parseFloat((document.getElementById(`wawi-practice-soll-amt-${i}`)?.value || '').replace(',', '.'));
            if (!userAcc || isNaN(userAmt)) { correct = false; break; }
            if (userAcc !== sollExpected[i].accountId || Math.abs(userAmt - sollExpected[i].amount) > 0.02) { correct = false; break; }
        }
        if (correct) {
            for (let i = 0; i < habenExpected.length; i++) {
                const userAcc = document.getElementById(`wawi-practice-haben-${i}`)?.value;
                const userAmt = parseFloat((document.getElementById(`wawi-practice-haben-amt-${i}`)?.value || '').replace(',', '.'));
                if (!userAcc || isNaN(userAmt)) { correct = false; break; }
                if (userAcc !== habenExpected[i].accountId || Math.abs(userAmt - habenExpected[i].amount) > 0.02) { correct = false; break; }
            }
        }

        if (!correct) {
            booking.fails = (booking.fails || 0) + 1;
            errorBox.innerHTML = 'Der Buchungssatz oder die Beträge sind leider falsch.';
            if (booking.fails >= 2) {
                errorBox.innerHTML += '<br><button class="wawi-btn wawi-btn-sm" style="margin-top: 10px; background: var(--fly-orange); color: white; border: none;" onclick="wawiAcceptSolution()">Lösung übernehmen</button>';
            }
            errorBox.style.display = 'block';
            return;
        }

        wawiShowToast('Richtig! Zusammengesetzter Buchungssatz korrekt.', 'success');
        WaWiState.pendingBookings.shift();
        wawiExecuteCompoundBooking(booking.description, booking.entries, { mode: 'practice', usedSolution: false });
        wawiSaveState();
    } else {
        // Simple check
        const sollId = document.getElementById('wawi-practice-soll-0')?.value;
        const habenId = document.getElementById('wawi-practice-haben-0')?.value;
        const amountVal = document.getElementById('wawi-practice-soll-amt-0')?.value;

        if (!sollId || !habenId || !amountVal) {
            errorBox.textContent = 'Bitte fülle alle Felder aus.';
            errorBox.style.display = 'block';
            return;
        }

        const parsedAmount = parseFloat(amountVal.replace(',', '.'));

        if (sollId !== booking.debitAccountId || habenId !== booking.creditAccountId || Math.abs(parsedAmount - booking.amount) > 0.02) {
            booking.fails = (booking.fails || 0) + 1;
            errorBox.innerHTML = 'Der Buchungssatz oder der Betrag ist leider falsch.';
            if (booking.fails >= 2) {
                errorBox.innerHTML += '<br><button class="wawi-btn wawi-btn-sm" style="margin-top: 10px; background: var(--fly-orange); color: white; border: none;" onclick="wawiAcceptSolution()">Lösung übernehmen</button>';
            }
            errorBox.style.display = 'block';
            return;
        }

        wawiShowToast('Richtig! Buchung ausgeführt.', 'success');
        WaWiState.pendingBookings.shift();
        wawiExecuteBooking(booking.description, booking.debitAccountId, booking.creditAccountId, booking.amount, { mode: 'practice', usedSolution: false });
        wawiSaveState();
    }
    
    if (WaWiState.pendingBookings.length > 0) {
        wawiRenderPracticeModal(WaWiState.pendingBookings[0]);
    } else {
        wawiIsPracticeModalOpen = false;
        document.getElementById('wawi-practice-overlay').style.display = 'none';
        renderWarenwirtschaft();
    }
}

function wawiAcceptSolution() {
    const booking = WaWiState.pendingBookings[0];
    if (!booking) return;

    WaWiState.pendingBookings.shift();

    if (booking.isCompound && booking.entries) {
        wawiExecuteCompoundBooking(booking.description, booking.entries, { mode: 'practice', usedSolution: true });
    } else {
        wawiExecuteBooking(booking.description, booking.debitAccountId, booking.creditAccountId, booking.amount, { mode: 'practice', usedSolution: true });
    }
    wawiSaveState();
    wawiShowToast('Lösung übernommen. Buchung ausgeführt.', 'info');
    
    if (WaWiState.pendingBookings.length > 0) {
        wawiRenderPracticeModal(WaWiState.pendingBookings[0]);
    } else {
        wawiIsPracticeModalOpen = false;
        document.getElementById('wawi-practice-overlay').style.display = 'none';
        renderWarenwirtschaft(); // Refresh UI
    }
}

function wawiExecuteBooking(description, debitAccountId, creditAccountId, amount, flags = {}) {
    const scenario = wawiGetScenario();
    const debitAcc = scenario.accounts.find(a => a.id === debitAccountId);
    const creditAcc = scenario.accounts.find(a => a.id === creditAccountId);

    if (!debitAcc || !creditAcc || amount <= 0) return false;

    if (amount === 0) return;

    const debitAccount = wawiGetAccountName(debitAccountId);
    const creditAccount = wawiGetAccountName(creditAccountId);

    const entry = {
        id: WaWiState.journalIdCounter++,
        timestamp: new Date().toISOString(),
        description: description,
        debit: { accountId: debitAccountId, accountName: debitAccount, amount: amount },
        credit: { accountId: creditAccountId, accountName: creditAccount, amount: amount },
        mode: flags.mode || WaWiState.simMode || 'simulation',
        usedSolution: flags.usedSolution || false,
        isDeleted: false,
        isEdited: false
    };

    WaWiState.journal.unshift(entry);

    WaWiState.accounts[debitAccountId] = (WaWiState.accounts[debitAccountId] || 0) + amount;
    WaWiState.accounts[creditAccountId] = (WaWiState.accounts[creditAccountId] || 0) - amount;

    if (!flags.isClosing) {
        WaWiState.isClosed = false;
    }

    wawiSaveState();
}

/**
 * Execute a compound booking with multiple soll/haben entries.
 * entries: [{side:'soll'|'haben', accountId, amount}]
 */
function wawiExecuteCompoundBooking(description, entries, flags = {}) {
    const enriched = entries.map(e => ({
        ...e,
        accountName: wawiGetAccountName(e.accountId)
    }));

    const journalEntry = {
        id: WaWiState.journalIdCounter++,
        timestamp: new Date().toISOString(),
        description: description,
        entries: enriched,
        isCompound: true,
        mode: flags.mode || WaWiState.simMode || 'simulation',
        usedSolution: flags.usedSolution || false,
        isDeleted: false,
        isEdited: false
    };

    WaWiState.journal.unshift(journalEntry);

    // Update account balances
    for (const e of entries) {
        if (e.side === 'soll') {
            WaWiState.accounts[e.accountId] = (WaWiState.accounts[e.accountId] || 0) + e.amount;
        } else {
            WaWiState.accounts[e.accountId] = (WaWiState.accounts[e.accountId] || 0) - e.amount;
        }
    }

    if (!flags.isClosing) {
        WaWiState.isClosed = false;
    }

    wawiSaveState();
}

/**
 * Re-calculates all account balances from the journal.
 * Essential for parity after deletions or edits.
 */
function wawiRecalculateBalances() {
    const scenario = wawiGetScenario();
    const freshState = wawiCreateFreshState(scenario.id);

    // Reset balances to starting values
    WaWiState.accounts = { ...freshState.accounts };

    // Apply all non-deleted journal entries (reverse chronological to apply in order)
    const journalEntries = [...WaWiState.journal].reverse();
    for (const entry of journalEntries) {
        if (entry.isDeleted) continue;

        // Compound entry
        if (entry.isCompound && entry.entries) {
            for (const e of entry.entries) {
                if (e.side === 'soll') {
                    WaWiState.accounts[e.accountId] = (WaWiState.accounts[e.accountId] || 0) + e.amount;
                } else {
                    WaWiState.accounts[e.accountId] = (WaWiState.accounts[e.accountId] || 0) - e.amount;
                }
            }
            continue;
        }

        let dId, cId, amt;

        // Backward compatibility for old journal structure
        if (entry.debit && typeof entry.debit === 'object') {
            dId = entry.debit.accountId;
            cId = entry.credit.accountId;
            amt = entry.debit.amount;
        } else {
            dId = entry.debitAccountId;
            cId = entry.creditAccountId;
            amt = entry.amount;
        }

        if (!dId || !cId || isNaN(amt)) continue;

        WaWiState.accounts[dId] = (WaWiState.accounts[dId] || 0) + amt;
        WaWiState.accounts[cId] = (WaWiState.accounts[cId] || 0) - amt;
    }
}

function wawiStornoBooking(id) {
    wawiBackupState();
    const entry = WaWiState.journal.find(e => e.id === id);
    if (!entry) return;

    if (confirm('Diesen Buchungssatz wirklich stornieren? (Der Eintrag bleibt durchgestrichen im Journal erhalten)')) {
        entry.isDeleted = true;
        wawiRecalculateBalances();
        wawiSaveState();
        renderWarenwirtschaft();
        wawiShowToast('Buchung storniert und Kontostände angepasst.', 'info');
    }
}

function wawiCorrectBooking(id, newData) {
    wawiBackupState();
    const entry = WaWiState.journal.find(e => e.id === id);
    if (!entry) return;

    // Audit Trail: Archive original data if not already done
    if (!entry.originalData) {
        entry.originalData = {
            description: entry.description,
            debit: { ...entry.debit },
            credit: { ...entry.credit }
        };
    }

    entry.description = newData.description;
    entry.debit.accountId = newData.debitAccountId;
    entry.debit.accountName = wawiGetAccountName(newData.debitAccountId);
    entry.credit.accountId = newData.creditAccountId;
    entry.credit.accountName = wawiGetAccountName(newData.creditAccountId);
    entry.debit.amount = newData.amount;
    entry.credit.amount = newData.amount;
    entry.isEdited = true;

    wawiRecalculateBalances();
    wawiSaveState();
    renderWarenwirtschaft();
    wawiShowToast('Buchungssatz wurde korrigiert.', 'success');
}

function wawiGetAccountBalance(accountId) {
    return WaWiState.accounts[accountId] || 0;
}

function wawiGetAccountName(accountId) {
    const scenario = wawiGetScenario();
    const acc = scenario.accounts.find(a => a.id === accountId);
    return acc ? acc.name : accountId;
}

function wawiFormatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount || 0);
}

function wawiFormatTimestamp(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}


// =============================================================================
// SECTION 4: BUSINESS LOGIC
// =============================================================================

function wawiAssemblePart(partId) {
    wawiBackupState();
    const scenario = wawiGetScenario();
    const part = scenario.bom.find(p => p.id === partId);
    if (!part) return { success: false, message: 'Teil nicht gefunden.' };

    const alreadyUsed = WaWiState.production.partsUsed[partId] || 0;
    const needed = part.qty - alreadyUsed;

    if (needed <= 0) return { success: false, message: 'Dieses Teil ist bereits vollständig verbaut.' };
    if ((WaWiState.stock[partId] || 0) < 1) return { success: false, message: `Kein ${part.name} auf Lager! Bitte nachbestellen.` };

    // Deduct from stock
    WaWiState.stock[partId]--;
    WaWiState.production.partsUsed[partId] = alreadyUsed + 1;

    // Start production if not already
    if (!WaWiState.production.inProgress) {
        WaWiState.production.inProgress = true;
    }

    // Post booking: Materialaufwand (6000) an Rohstoffe (2000)
    const mode = WaWiState.difficulty || 'advanced';
    if (mode !== 'beginner') {
        wawiPostBooking(
            `${part.name} verbaut (1× ${wawiFormatCurrency(part.unitPrice)})`,
            '6000', '2000', part.unitPrice
        );
    }

    return { success: true, message: `${part.name} erfolgreich verbaut!` };
}

function wawiFinishProduct() {
    wawiBackupState();
    const scenario = wawiGetScenario();

    // Check finished goods capacity
    const maxProducts = scenario.product.maxProducts || 99;
    if (WaWiState.production.completedProducts >= maxProducts) {
        return { success: false, message: `Lager für Fertigerzeugnisse voll! Maximal ${maxProducts} ${scenario.product.name} möglich. Bitte verkaufe erst Produkte.` };
    }

    // Check if all primary parts assembled
    for (const part of scenario.bom) {
        const used = WaWiState.production.partsUsed[part.id] || 0;
        if (used < part.qty) {
            return { success: false, message: `Es fehlen noch Bauteile! ${part.name}: ${used}/${part.qty}` };
        }
    }

    // Check availability of automatic materials (HS/BS)
    const hsList = scenario.hilfsstoffe || [];
    const bsList = scenario.betriebsstoffe || [];
    for (const item of [...hsList, ...bsList]) {
        if ((WaWiState.stock[item.id] || 0) < item.qtyPerProduct) {
            return { success: false, message: `Nicht genügend ${item.name} auf Lager! (Benötigt: ${item.qtyPerProduct})` };
        }
    }

    // 2. Calculate production costs
    let rCost = 0;
    for (const part of scenario.bom) rCost += part.qty * part.unitPrice;

    let hsCost = 0;
    for (const hs of hsList) hsCost += hs.qtyPerProduct * hs.unitPrice;

    let bsCost = 0;
    for (const bs of bsList) bsCost += bs.qtyPerProduct * bs.unitPrice;

    const totalProductCost = rCost + hsCost + bsCost;

    // 3. Consume HS/BS from stock
    for (const item of [...hsList, ...bsList]) {
        WaWiState.stock[item.id] -= item.qtyPerProduct;
    }

    // DIFF MODE BRANCHING
    const mode = WaWiState.difficulty || 'advanced';

    if (mode === 'beginner') {
        // Beginner: Asset swap ONLY (FE an R, HS, BS)
        wawiPostBooking(`${scenario.product.name} fertiggestellt (Rohstoffe, ${wawiFormatCurrency(rCost)})`, '2800', '2000', rCost);
        if (hsCost > 0) wawiPostBooking(`${scenario.product.name} fertiggestellt (Hilfsstoffe, ${wawiFormatCurrency(hsCost)})`, '2800', '2010', hsCost);
        if (bsCost > 0) wawiPostBooking(`${scenario.product.name} fertiggestellt (Betriebsstoffe, ${wawiFormatCurrency(bsCost)})`, '2800', '2020', bsCost);
    } else if (mode === 'advanced') {
        // Advanced: Success booking (Aufwand already happened for R in wawiAssemblePart)
        // Now book HS and BS success
        if (hsCost > 0) wawiPostBooking(`Verbrauch Hilfsstoffe (${scenario.product.name}, ${wawiFormatCurrency(hsCost)})`, '6010', '2010', hsCost);
        if (bsCost > 0) wawiPostBooking(`Verbrauch Betriebsstoffe (${scenario.product.name}, ${wawiFormatCurrency(bsCost)})`, '6020', '2020', bsCost);
        
        // Populate FE in Advanced mode to avoid negative balance upon sale
        wawiPostBooking(
            `${scenario.product.name} fertiggestellt (Bestandserhöhung, ${wawiFormatCurrency(totalProductCost)})`,
            '2800', '5200', totalProductCost
        );
    } else {
        // Profi: FE an Bestandsveränderung (Total Cost), and HS/BS success
        if (hsCost > 0) wawiPostBooking(`Verbrauch Hilfsstoffe (${scenario.product.name}, ${wawiFormatCurrency(hsCost)})`, '6010', '2010', hsCost);
        if (bsCost > 0) wawiPostBooking(`Verbrauch Betriebsstoffe (${scenario.product.name}, ${wawiFormatCurrency(bsCost)})`, '6020', '2020', bsCost);

        wawiPostBooking(
            `${scenario.product.name} fertiggestellt (Herstellkosten gesamt, ${wawiFormatCurrency(totalProductCost)})`,
            '2800', '5200', totalProductCost
        );
    }

    // Reset production state
    WaWiState.production.completedProducts++;
    WaWiState.production.totalProduced++;
    WaWiState.production.inProgress = false;
    for (const part of scenario.bom) {
        WaWiState.production.partsUsed[part.id] = 0;
    }

    wawiSaveState();
    return { success: true, message: `${scenario.product.icon} ${scenario.product.name} wurde erfolgreich fertiggestellt!` };
}

function wawiGetProductionCostPerUnit() {
    const scenario = wawiGetScenario();
    const rCost = scenario.bom.reduce((sum, p) => sum + (p.qty * p.unitPrice), 0);
    const hsCost = (scenario.hilfsstoffe || []).reduce((sum, h) => sum + (h.qtyPerProduct * h.unitPrice), 0);
    const bsCost = (scenario.betriebsstoffe || []).reduce((sum, b) => sum + (b.qtyPerProduct * b.unitPrice), 0);
    return rCost + hsCost + bsCost;
}

/**
 * Sell product with mixed payments.
 * paymentMethodOrPayments: string or [{method: 'bank'|'kasse'|'kredit', amount}]
 */
function wawiSellProduct(paymentMethodOrPayments, orderId = null) {
    wawiBackupState();
    const scenario = wawiGetScenario();
    const order = orderId ? WaWiState.orders.find(o => o.id === orderId) : null;
    const qty = order ? order.qty : 1;

    if (WaWiState.production.completedProducts < qty) {
        return { success: false, message: 'Nicht genügend fertige Produkte vorhanden!' };
    }

    const sellPrice = order ? order.price : scenario.product.sellPrice;
    const totalAmount = sellPrice * qty;
    const totalProductionCost = wawiGetProductionCostPerUnit() * qty;
    const mode = WaWiState.difficulty || 'advanced';

    // Normalize payments
    let payments;
    if (typeof paymentMethodOrPayments === 'string') {
        const amt = mode === 'beginner' ? totalProductionCost : totalAmount;
        payments = [{ method: paymentMethodOrPayments, amount: amt }];
    } else {
        payments = paymentMethodOrPayments;
    }

    const methodToAccount = { bank: '1200', kasse: '1000', kredit: '2400' };
    const methodLabels = { bank: 'Banküberweisung', kasse: 'Barzahlung', kredit: 'auf Ziel' };
    const payLabels = payments.map(p => `${wawiFormatCurrency(p.amount)} ${methodLabels[p.method] || p.method}`).join(', ');

    if (mode === 'beginner') {
        const beginnerDesc = order
            ? `Auftrag ${order.id} erfüllt (${order.customer}, ${qty} Stk., HK: ${wawiFormatCurrency(totalProductionCost)})`
            : `${scenario.product.name} verkauft (${payLabels})`;

        const entries = [];
        for (const p of payments) {
            entries.push({ side: 'soll', accountId: methodToAccount[p.method], amount: p.amount });
        }
        entries.push({ side: 'haben', accountId: '2800', amount: totalProductionCost });

        if (entries.filter(e => e.side === 'soll').length > 1) {
            wawiPostCompoundBooking(beginnerDesc, entries);
        } else {
            wawiPostBooking(beginnerDesc, entries[0].accountId, '2800', totalProductionCost);
        }
    } else if (mode === 'advanced') {
        const desc = order
            ? `Auftrag ${order.id} erfüllt (${order.customer}, ${qty} Stk., ${wawiFormatCurrency(totalAmount)})`
            : `${scenario.product.name} verkauft (${payLabels})`;

        const entries = [];
        for (const p of payments) {
            entries.push({ side: 'soll', accountId: methodToAccount[p.method], amount: p.amount });
        }
        entries.push({ side: 'haben', accountId: '5000', amount: totalAmount });

        if (entries.filter(e => e.side === 'soll').length > 1) {
            wawiPostCompoundBooking(desc, entries);
        } else {
            wawiPostBooking(desc, entries[0].accountId, '5000', totalAmount);
        }

        wawiPostBooking(
            `Bestandsminderung: ${qty}× ${scenario.product.name} aus Lager entnommen (${wawiFormatCurrency(totalProductionCost)})`,
            '5200', '2800', totalProductionCost
        );
    } else {
        // Profi: One compound booking with USt
        const desc = order
            ? `Auftrag ${order.id} erfüllt (${order.customer}, ${qty} Stk., ${wawiFormatCurrency(totalAmount)})`
            : `${scenario.product.name} verkauft (${payLabels})`;

        const net = totalAmount / 1.19;
        const tax = totalAmount - net;

        const entries = [];
        for (const p of payments) {
            entries.push({ side: 'soll', accountId: methodToAccount[p.method], amount: p.amount });
        }
        entries.push({ side: 'haben', accountId: '5000', amount: net });
        entries.push({ side: 'haben', accountId: '4800', amount: tax });

        wawiPostCompoundBooking(desc, entries);

        wawiPostBooking(
            `Bestandsminderung: ${qty}× ${scenario.product.name} aus Lager entnommen (${wawiFormatCurrency(totalProductionCost)})`,
            '5200', '2800', totalProductionCost
        );
    }

    // Track finance transactions for credit payments
    for (const p of payments) {
        if (p.method === 'kredit') {
            WaWiState.financeTransactions.push({
                id: 'FT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'forderung',
                date: new Date().toISOString(),
                description: order ? `Kundenrechnung (${order.customer})` : `Kundenrechnung (${qty}× ${scenario.product.name})`,
                originalAmount: p.amount,
                remainingAmount: p.amount
            });
        }
    }

    WaWiState.production.completedProducts -= qty;
    WaWiState.production.totalSold += qty;

    if (order) {
        order.status = 'closed';
    }

    wawiSaveState();

    return {
        success: true,
        message: order
            ? `Auftrag ${order.id} für ${wawiFormatCurrency(totalAmount)} abgeschlossen!`
            : `${scenario.product.icon} ${scenario.product.name} für ${wawiFormatCurrency(totalAmount)} verkauft!`
    };
}

function wawiGetDiscountedPrice(qty) {
    const scenario = wawiGetScenario();
    const basePrice = scenario.product.sellPrice;
    let factor = 1.0;

    if (qty >= 5) factor = 0.90; // 10% discount from 5 pcs
    else if (qty >= 2) factor = 0.95; // 5% discount for 2-4 pcs

    return basePrice * factor;
}

function wawiGenerateNewOrder() {
    const scenario = wawiGetScenario();
    const customers = ['Velomarkt GmbH', 'E-Bike Center Nord', 'City-Bikes Rostock', 'Zweirad-Profi', 'Sport-Welt', 'Bike-King 24', 'Cycle-Passion'];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const qty = Math.floor(Math.random() * 3) + 1; // 1-3 pcs
    const price = wawiGetDiscountedPrice(qty);
    const id = `ORD-${100 + WaWiState.orders.length + 1}`;

    // Add a bit of random variation for non-manual orders (+/- 1% fluff)
    const randomizedPrice = price * (0.99 + Math.random() * 0.02);

    WaWiState.orders.push({ id, customer, qty: qty, status: 'open', price: randomizedPrice });
    wawiSaveState();
    renderWarenwirtschaft();
    wawiShowToast(`Neuer Auftrag von ${customer} eingegangen!`, 'info');
}

/**
 * Order material with mixed payments.
 * payments: [{method: 'bank'|'kasse'|'kredit', amount: number}]
 * For backward compat, also accepts single paymentMethod string.
 */
function wawiOrderMaterial(partId, qty, paymentMethodOrPayments) {
    wawiBackupState();
    const scenario = wawiGetScenario();

    const allMaterials = [...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe];
    const part = allMaterials.find(p => p.id === partId);

    if (!part) return { success: false, message: 'Material nicht gefunden.' };
    if (qty <= 0) return { success: false, message: 'Bestellmenge muss größer als 0 sein.' };

    const maxQty = scenario.maxOrderQuantities ? (scenario.maxOrderQuantities[partId] || 999) : 999;
    if (qty > maxQty) return { success: false, message: `Bestellmenge zu hoch! Maximal ${maxQty} ${part.unit} pro Bestellung erlaubt.` };

    const currentStock = WaWiState.stock[partId] || 0;
    const maxStock = scenario.maxStock ? (scenario.maxStock[partId] || 9999) : 9999;
    if (currentStock + qty > maxStock) {
        return { success: false, message: `Lagerkapazität überschritten! Höchstbestand für ${part.name} ist ${maxStock} ${part.unit} (Aktuell: ${currentStock}).` };
    }

    // Normalize payments
    let payments;
    if (typeof paymentMethodOrPayments === 'string') {
        const totalCost = qty * part.unitPrice;
        payments = [{ method: paymentMethodOrPayments, amount: totalCost }];
    } else {
        payments = paymentMethodOrPayments;
    }

    const totalCost = qty * part.unitPrice;
    const paymentSum = payments.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(paymentSum - totalCost) > 0.02) {
        return { success: false, message: `Die Summe der Zahlungen (${wawiFormatCurrency(paymentSum)}) stimmt nicht mit dem Gesamtbetrag (${wawiFormatCurrency(totalCost)}) überein.` };
    }

    // Determine target account
    let debitAccountId = '2000';
    if (scenario.hilfsstoffe.find(h => h.id === partId)) debitAccountId = '2010';
    if (scenario.betriebsstoffe.find(b => b.id === partId)) debitAccountId = '2020';

    // Check liquidity for bank/kasse
    for (const p of payments) {
        if (p.method === 'bank' && wawiGetAccountBalance('1200') < p.amount) {
            return { success: false, message: `Nicht genügend Bankguthaben! Verfügbar: ${wawiFormatCurrency(wawiGetAccountBalance('1200'))}, benötigt: ${wawiFormatCurrency(p.amount)}` };
        }
        if (p.method === 'kasse' && wawiGetAccountBalance('1000') < p.amount) {
            return { success: false, message: `Nicht genügend Kassenbestand! Verfügbar: ${wawiFormatCurrency(wawiGetAccountBalance('1000'))}, benötigt: ${wawiFormatCurrency(p.amount)}` };
        }
    }

    const mode = WaWiState.difficulty || 'advanced';
    const methodLabels = { bank: 'Banküberweisung', kasse: 'Barzahlung', kredit: 'auf Ziel' };
    const payLabels = payments.map(p => `${wawiFormatCurrency(p.amount)} ${methodLabels[p.method] || p.method}`).join(', ');
    const desc = `${qty}× ${part.name} bestellt (${payLabels})`;

    const methodToAccount = { bank: '1200', kasse: '1000', kredit: '4400' };

    // Build compound entry
    const entries = [];
    if (mode === 'pro') {
        const net = totalCost / 1.19;
        const tax = totalCost - net;
        entries.push({ side: 'soll', accountId: debitAccountId, amount: net });
        entries.push({ side: 'soll', accountId: '2600', amount: tax });
    } else {
        entries.push({ side: 'soll', accountId: debitAccountId, amount: totalCost });
    }

    for (const p of payments) {
        entries.push({ side: 'haben', accountId: methodToAccount[p.method], amount: p.amount });
    }

    // Use compound booking if multiple entries on either side, else simple
    const sollCount = entries.filter(e => e.side === 'soll').length;
    const habenCount = entries.filter(e => e.side === 'haben').length;

    if (sollCount > 1 || habenCount > 1) {
        wawiPostCompoundBooking(desc, entries);
    } else {
        wawiPostBooking(desc, entries[0].accountId, entries[1].accountId, entries[0].amount);
    }

    // Track finance transactions for credit payments
    for (const p of payments) {
        if (p.method === 'kredit') {
            WaWiState.financeTransactions.push({
                id: 'FT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'verbindlichkeit',
                date: new Date().toISOString(),
                description: `${qty}× ${part.name} (Materialeinkauf)`,
                originalAmount: p.amount,
                remainingAmount: p.amount
            });
        }
    }

    // Add to stock
    WaWiState.stock[partId] = (WaWiState.stock[partId] || 0) + qty;
    wawiSaveState();

    return { success: true, message: `${qty}× ${part.name} erfolgreich bestellt für ${wawiFormatCurrency(totalCost)}!` };
}

function wawiPayLiabilities() {
    wawiBackupState();
    const debt = Math.abs(wawiGetAccountBalance('4400'));
    if (debt <= 0) return { success: false, message: 'Keine offenen Verbindlichkeiten.' };
    if (wawiGetAccountBalance('1200') < debt) {
        return { success: false, message: `Nicht genügend Bankguthaben! Benötigt: ${wawiFormatCurrency(debt)}` };
    }

    wawiPostBooking(
        `Verbindlichkeiten beglichen (${wawiFormatCurrency(debt)})`,
        '4400', '1200', debt
    );

    return { success: true, message: `Verbindlichkeiten von ${wawiFormatCurrency(debt)} beglichen!` };
}

function wawiHandleYearEndClosing() {
    wawiBackupState();
    const scenario = wawiGetScenario();
    const mode = WaWiState.difficulty || 'advanced';
    const allowedMap = {
        'beginner': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400'],
        'advanced': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400', '5000', '6010', '6020', '6000', '8020', '6520', '5460', '6960'],
        'pro': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400', '5000', '5200', '6000', '6010', '6020', '2600', '4800', '8020', '6520', '5460', '6960']
    };
    const allowed = allowedMap[mode];

    const ertragAccounts = scenario.accounts.filter(a => a.type === 'ertrag' && allowed.includes(a.id));
    const aufwandAccounts = scenario.accounts.filter(a => a.type === 'aufwand' && allowed.includes(a.id));

    const revenue = ertragAccounts.reduce((sum, acc) => sum + Math.abs(wawiGetAccountBalance(acc.id)), 0);
    const expenses = aufwandAccounts.reduce((sum, acc) => sum + wawiGetAccountBalance(acc.id), 0);
    const profit = revenue - expenses;

    if (revenue === 0 && expenses === 0) {
        wawiShowToast('Keine Erträge oder Aufwendungen vorhanden. Abschluss nicht notwendig.', 'info');
        return;
    }

    if (!confirm(`Möchtest du den Jahresabschluss wirklich durchführen?\n\nAlle Erfolgskonten (GuV) werden abgeschlossen und der Saldo (${wawiFormatCurrency(profit)}) wird in das Eigenkapital übertragen.`)) {
        return;
    }

    // 1. Close Revenue Accounts to GuV
    ertragAccounts.forEach(acc => {
        const balance = wawiGetAccountBalance(acc.id);
        if (balance !== 0) {
            wawiPostBooking(`Abschluss: ${acc.name} an GuV (${wawiFormatCurrency(Math.abs(balance))})`, acc.id, '8020', Math.abs(balance));
        }
    });

    // 2. Close Expense Accounts to GuV
    aufwandAccounts.forEach(acc => {
        const balance = wawiGetAccountBalance(acc.id);
        if (balance !== 0) {
            wawiPostBooking(`Abschluss: GuV an ${acc.name} (${wawiFormatCurrency(Math.abs(balance))})`, '8020', acc.id, Math.abs(balance));
        }
    });

    // 3. Final Profit/Loss to Eigenkapital
    const guvBalance = wawiGetAccountBalance('8020');
    if (guvBalance < 0) {
        // Profit (Haben-Saldo)
        wawiExecuteBooking(`Gewinnübertrag: GuV an Eigenkapital (${wawiFormatCurrency(Math.abs(guvBalance))})`, '8020', '3000', Math.abs(guvBalance), { isClosing: true });
        wawiShowToast(`Jahresabschluss abgeschlossen: Gewinn von ${wawiFormatCurrency(Math.abs(guvBalance))} erzielt!`, 'success');
    } else if (guvBalance > 0) {
        // Loss (Soll-Saldo)
        wawiExecuteBooking(`Verlustübertrag: Eigenkapital an GuV (${wawiFormatCurrency(guvBalance)})`, '3000', '8020', guvBalance, { isClosing: true });
        wawiShowToast(`Jahresabschluss abgeschlossen: Verlust von ${wawiFormatCurrency(guvBalance)} verbucht.`, 'warning');
    }

    WaWiState.isClosed = true;
    WaWiState.lastClosingProfit = profit;
    WaWiState.depreciationBooked = false;

    wawiSaveState();
    renderWarenwirtschaft();
}

// Helper: Count materials below reorder point
function wawiGetLowStockCount() {
    const scenario = wawiGetScenario();
    let count = 0;
    const allMaterials = [...scenario.bom, ...(scenario.hilfsstoffe || []), ...(scenario.betriebsstoffe || [])];
    for (const mat of allMaterials) {
        const stock = WaWiState.stock[mat.id] || 0;
        const reorder = scenario.reorderPoints[mat.id] || 0;
        if (stock < reorder) count++;
    }
    return count;
}

// Helper: Stock status
function wawiGetStockStatus(partId) {
    const scenario = wawiGetScenario();
    const stock = WaWiState.stock[partId] || 0;
    const reorder = scenario.reorderPoints[partId] || 0;
    if (stock <= reorder) return 'danger';
    if (stock <= reorder * 2) return 'warning';
    return 'ok';
}

// Helper: Production progress percentage
function wawiGetProductionProgress() {
    const scenario = wawiGetScenario();
    let totalNeeded = 0;
    let totalUsed = 0;
    for (const part of scenario.bom) {
        totalNeeded += part.qty;
        totalUsed += Math.min(WaWiState.production.partsUsed[part.id] || 0, part.qty);
    }
    return totalNeeded > 0 ? Math.round((totalUsed / totalNeeded) * 100) : 0;
}

// Helper: Check if production is complete
function wawiIsProductionComplete() {
    const scenario = wawiGetScenario();
    for (const part of scenario.bom) {
        const used = WaWiState.production.partsUsed[part.id] || 0;
        if (used < part.qty) return false;
    }
    return true;
}


// =============================================================================
// SECTION 5: UI RENDERING (MOBILE FIRST)
// =============================================================================

// Toast notification system
let wawiToastTimeout = null;

function wawiShowToast(message, type = 'info') {
    let toast = document.getElementById('wawi-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wawi-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `wawi-toast wawi-toast-${type} wawi-toast-visible`;
    clearTimeout(wawiToastTimeout);
    wawiToastTimeout = setTimeout(() => {
        toast.classList.remove('wawi-toast-visible');
    }, 3000);
}

// --- Main Render Entry Point ---
function renderWarenwirtschaft() {
    const container = document.getElementById('warenwirtschaft-container');
    if (!container) return;

    // Capture current scroll position to prevent jumping
    const contentArea = document.getElementById('wawi-content');
    const savedScrollTop = contentArea ? contentArea.scrollTop : 0;
    const savedTab = WaWiState ? WaWiState.activeTab : null;

    try {
        if (!WaWiState) wawiLoadState();

        // Safety check for scenario
        const scenario = wawiGetScenario();
        if (!scenario) throw new Error("Szenario konnte nicht ermittelt werden.");

        const lowStock = wawiGetLowStockCount();

        container.innerHTML = `
        <div class="wawi-container">
            <!-- Header with Scenario Selector -->
            <div class="wawi-app-header">
                <div class="wawi-header-left">
                    <span class="wawi-company-icon">${scenario.icon}</span>
                    <div>
                        <div class="wawi-company-name">${scenario.company}</div>
                        <div class="wawi-module-label">ERP-Simulator</div>
                    </div>
                </div>
                <div class="wawi-header-right">
                    <select id="wawi-scenario-select" class="wawi-scenario-select" onchange="wawiHandleScenarioChange(this.value)">
                        ${WAWI_SCENARIOS.map(s =>
            `<option value="${s.id}" ${s.id === WaWiState.activeScenario ? 'selected' : ''}>${s.icon} ${s.name}</option>`
        ).join('')}
                    </select>
                    <button class="wawi-reset-btn" onclick="wawiHandleReset()" title="Szenario zurücksetzen">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="wawi-content" id="wawi-content">
                <!-- Filled by tab renderer -->
            </div>

            <!-- Bottom Navigation -->
            <nav class="wawi-bottom-nav">
                <button class="wawi-nav-item ${WaWiState.activeTab === 'dashboard' ? 'active' : ''}" onclick="wawiSetTab('dashboard')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>
                    <span>Dashboard</span>
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'procurement' ? 'active' : ''}" onclick="wawiSetTab('procurement')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path><path d="M2 2l4 4m0 0V2m0 4H2" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Beschaffung</span>
                    ${lowStock > 0 ? `<span class="wawi-badge-alert">${lowStock}</span>` : ''}
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'inventory' ? 'active' : ''}" onclick="wawiSetTab('inventory')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Lager</span>
                    ${lowStock > 0 ? `<span class="wawi-badge-alert">${lowStock}</span>` : ''}
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'production' ? 'active' : ''} ${WaWiState.difficulty === 'beginner' ? 'wawi-nav-muted' : ''}" onclick="wawiSetTab('production')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    <span>Produktion</span>
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'sales' ? 'active' : ''} ${WaWiState.difficulty === 'beginner' ? 'wawi-nav-muted' : ''}" onclick="wawiSetTab('sales')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.12"></path><path d="M6 6L2 2m0 0v4m0-4h4" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Vertrieb</span>
                    ${WaWiState.orders.filter(o => o.status === 'open').length > 0 ? `<span class="wawi-badge-alert">${WaWiState.orders.filter(o => o.status === 'open').length}</span>` : ''}
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'assets' ? 'active' : ''}" onclick="wawiSetTab('assets')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path></svg>
                    <span>Anlagen</span>
                </button>
                <button class="wawi-nav-item ${WaWiState.activeTab === 'accounting' ? 'active' : ''}" onclick="wawiSetTab('accounting')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="12" y2="15"></line></svg>
                    <span>Buchhaltung</span>
                </button>
            </nav>
        </div>
    `;

        // Render the active tab content
        wawiRenderActiveTab();

        // Restore scroll position only if staying on the same tab
        const newContentArea = document.getElementById('wawi-content');
        if (newContentArea && WaWiState && WaWiState.activeTab === savedTab) {
            newContentArea.scrollTop = savedScrollTop;
        }

    } catch (error) {
        console.error("WaWi Render Error:", error);
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 1rem; padding-top: 90px; padding-bottom: 3rem; font-size: 0.95rem;">
                <h3 style="margin-bottom: 1rem;">⚠️ Fehler beim Laden der Simulation</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem;">Ein technisches Problem verhindert das Laden der Warenwirtschaft. Dies liegt meist an veralteten oder beschädigten Daten im Browser-Speicher.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="wawi-btn" onclick="location.reload()" style="background: #ef4444;">Seite neu laden</button>
                    <button class="wawi-btn wawi-btn-outline" onclick="if(confirm('Achtung: Alle lokalen Daten der Warenwirtschaft werden gelöscht! Fortfahren?')){ localStorage.removeItem('wawi_erp_state'); location.reload(); }" style="color: #ef4444; border-color: #ef4444;">Simulation hart zurücksetzen</button>
                </div>
                <div style="margin-top: 1.5rem; font-family: monospace; font-size: 0.75rem; color: #999;">
                    Fehler-Details: ${error.message}
                </div>
            </div>
        `;
    }
}

function wawiSetTab(tab) {
    WaWiState.activeTab = tab;
    if (tab === 'accounting' && typeof wawiAccountingView !== 'undefined') {
        wawiAccountingView = 'overview';
    }
    wawiSaveState();
    renderWarenwirtschaft();
}

function wawiRenderActiveTab() {
    const content = document.getElementById('wawi-content');
    if (!content) return;

    switch (WaWiState.activeTab) {
        case 'dashboard': wawiRenderDashboard(content); break;
        case 'production': wawiRenderProduction(content); break;
        case 'sales': wawiRenderSales(content); break;
        case 'inventory': wawiRenderInventory(content); break;
        case 'accounting': wawiRenderAccounting(content); break;
        case 'procurement': wawiRenderProcurement(content); break;
        case 'assets': wawiRenderAssets(content); break;
        default: wawiRenderDashboard(content);
    }
}


// --- Sales (Vertrieb) Module ---
function wawiRenderSales(container) {
    const scenario = wawiGetScenario();
    const mode = WaWiState.difficulty;

    // Beginner mode: show disabled notice
    if (mode === 'beginner') {
        container.innerHTML = `
            <div class="wawi-sales wawi-module-disabled">
                <div class="wawi-section-header">
                    <h3>🛒 Vertrieb & Kundenaufträge</h3>
                </div>
                <div class="wawi-beginner-notice">
                    <div class="wawi-beginner-notice-icon">🔒</div>
                    <h4>Vertrieb im Anfängermodus nicht verfügbar</h4>
                    <p>Im Anfängermodus ist weder ein <strong>Verkauf</strong>, noch eine <strong>Produktion</strong> oder <strong>AfA</strong> möglich.</p>
                    <p>Diese Funktionen sind erst ab dem Modus <strong>Fortgeschritten</strong> verfügbar.</p>
                    <button class="wawi-btn wawi-btn-outline" onclick="wawiSetTab('procurement')">
                        🛒 Zur Beschaffung wechseln
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const completedProducts = WaWiState.production.completedProducts;
    const openOrders = WaWiState.orders.filter(o => o.status === 'open');
    const closedOrders = WaWiState.orders.filter(o => o.status === 'closed').reverse();

    container.innerHTML = `
        <div class="wawi-sales">
            <div class="wawi-section-header">
                <h3>🛒 Vertrieb & Kundenaufträge</h3>
                <div class="wawi-section-sub">Abwicklung von Kundenbestellungen zur Umsatzgenerierung.</div>
            </div>

            <!-- Inventory Status -->
            <div class="wawi-sales-inventory-card">
                <div class="wawi-sales-inv-header">
                    <span class="wawi-sales-inv-icon">${scenario.product.icon}</span>
                    <div>
                        <div class="wawi-sales-inv-label">Verfügbare Fertigerzeugnisse</div>
                        <div class="wawi-sales-inv-val">${completedProducts} Stk.</div>
                    </div>
                </div>
                ${completedProducts === 0 ? `
                <div class="wawi-sales-inv-alert">
                    ⚠️ Lager leer! Gehe zur <strong>Produktion</strong>, um neue Ware herzustellen.
                </div>
                ` : ''}
            </div>

            <!-- Order Creator -->
            <div class="wawi-sales-creator">
                <h4 class="wawi-sales-title">Eigenen Auftrag anlegen</h4>
                <div class="wawi-creator-card">
                    <div class="wawi-creator-form">
                        <div class="wawi-creator-field">
                            <label>Kunde</label>
                            <input type="text" id="wawi-manual-customer" placeholder="Z.B. Rad-Haus KG" class="wawi-input">
                        </div>
                        <div class="wawi-creator-field">
                            <label>Menge (Stk.)</label>
                            <input type="number" id="wawi-manual-qty" value="1" min="1" max="50" class="wawi-input">
                        </div>
                    </div>
                    <button class="wawi-btn wawi-btn-primary" onclick="wawiHandleCreateManualOrder()">
                        ➕ Auftrag erstellen
                    </button>
                    <div class="wawi-creator-hint">
                        Preis wird automatisch berechnet.
                    </div>
                </div>
            </div>

            <!-- Open Orders -->
            <div class="wawi-sales-orders">
                <div class="wawi-sales-orders-header">
                    <h4 class="wawi-sales-title">Offene Kundenaufträge (${openOrders.length})</h4>
                    <!-- Discount Tooltip -->
                    <div class="wawi-discount-info">
                        <span class="wawi-tooltip-container">
                            <span class="wawi-info-icon">i</span>
                            <div class="wawi-tooltip">
                                <strong>Unsere Mengenstaffel:</strong><br>
                                • 1 Stk: Listenpreis (100%)<br>
                                • 2-4 Stk: 5% Rabatt<br>
                                • Ab 5 Stk: 10% Rabatt
                            </div>
                        </span>
                        Mengenrabatt verfügbar
                    </div>
                </div>
                ${openOrders.length === 0 ? `
                <div class="wawi-empty-state">
                    <span class="wawi-empty-icon">📈</span>
                    <p>Alle Aufträge wurden bearbeitet!</p>
                    <button class="wawi-btn wawi-btn-sm wawi-btn-outline" onclick="wawiGenerateNewOrder()">Neuen Auftrag akquirieren</button>
                </div>
                ` : `
                <div class="wawi-sales-grid">
                    ${openOrders.map(order => `
                    <div class="wawi-sales-card">
                        <div class="wawi-sales-header">
                            <span class="wawi-sales-id">${order.id}</span>
                            <span class="wawi-sales-status-badge">Offen</span>
                        </div>
                        <div class="wawi-sales-customer">${order.customer}</div>
                        <div class="wawi-sales-details">
                            Bestellmenge: <strong>${order.qty} Stk.</strong><br>
                            Einzelpreis: ${wawiFormatCurrency(mode === 'beginner' ? wawiGetProductionCostPerUnit() : order.price)} 
                            ${order.qty > 1 && mode !== 'beginner' ? `<span class="wawi-discount-tag">Rabattiert</span>` : ''}<br>
                            Gesamtwert: <strong>${wawiFormatCurrency((mode === 'beginner' ? wawiGetProductionCostPerUnit() : order.price) * order.qty)}</strong>
                        </div>
                        <div class="wawi-sales-actions">
                            <button class="wawi-btn wawi-btn-primary wawi-btn-sm" 
                                onclick="wawiHandleFulfillOrder('${order.id}', 'bank')"
                                ${completedProducts >= order.qty ? '' : 'disabled'}>
                                🏦 Bank
                            </button>
                            <button class="wawi-btn wawi-btn-outline wawi-btn-sm" 
                                onclick="wawiHandleFulfillOrder('${order.id}', 'kasse')"
                                ${completedProducts >= order.qty ? '' : 'disabled'}>
                                💵 Bar
                            </button>
                            <button class="wawi-btn wawi-btn-outline wawi-btn-sm" 
                                onclick="wawiHandleFulfillOrder('${order.id}', 'kredit')"
                                ${completedProducts >= order.qty ? '' : 'disabled'}>
                                💳 Ziel
                            </button>
                        </div>
                        ${completedProducts < order.qty ? `<div class="wawi-sales-warning">⚠️ Nicht genügend Bestand</div>` : ''}
                    </div>
                    `).join('')}
                </div>
                `}
            </div>

            <!-- History -->
            ${closedOrders.length > 0 ? `
            <div class="wawi-sales-history">
                <h4 class="wawi-sales-title">Abgeschlossene Verkäufe</h4>
                <div class="wawi-sales-history-list">
                    ${closedOrders.map(order => `
                    <div class="wawi-sales-history-item">
                        <div class="wawi-sales-history-info">
                            <strong>${order.id}</strong> · ${order.customer} 
                            <span class="wawi-sales-history-meta">${order.qty} × ${wawiFormatCurrency(mode === 'beginner' ? wawiGetProductionCostPerUnit() : order.price)}</span>
                        </div>
                        <div class="wawi-sales-history-total">${wawiFormatCurrency((mode === 'beginner' ? wawiGetProductionCostPerUnit() : order.price) * order.qty)}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Order Import Section -->
            <div class="wawi-order-import-section">
                <h4 class="wawi-sales-title" style="margin-bottom: 0.5rem;">Externe Aufträge importieren</h4>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <button class="wawi-btn wawi-btn-outline wawi-btn-sm" onclick="document.getElementById('wawi-order-import-file').click()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.3rem;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        Aufträge laden (.xml)
                    </button>
                    <input type="file" id="wawi-order-import-file" style="display: none" accept=".xml" onchange="wawiHandleOrderImport(event)">
                </div>
                <div class="wawi-creator-hint" style="margin-top: 0.5rem;">Importiere eine XML-Datei mit neuen Kundenaufträgen.</div>
            </div>
        </div>
    `;
}


// --- Dashboard ---
function wawiRenderDashboard(container) {
    const scenario = wawiGetScenario();
    const lowStock = wawiGetLowStockCount();
    const bankBalance = wawiGetAccountBalance('1200');
    const kasseBalance = wawiGetAccountBalance('1000');
    const totalLiquidity = bankBalance + kasseBalance;
    const completedProducts = WaWiState.production.completedProducts;
    const totalProduced = WaWiState.production.totalProduced;
    const totalSold = WaWiState.production.totalSold;
    const journalCount = WaWiState.journal.length;
    const progress = wawiGetProductionProgress();
    const debt = wawiGetAccountBalance('4400');

    // Revenue & Expense calculation (GuV logic)
    const mode = WaWiState.difficulty || 'advanced';
    const isBeginner = mode === 'beginner';
    const revenue = isBeginner ? 0 : (wawiGetAccountBalance('5000') + wawiGetAccountBalance('5200'));
    const expenses = isBeginner ? 0 : (wawiGetAccountBalance('6000') + wawiGetAccountBalance('6010') + wawiGetAccountBalance('6020'));
    const profit = revenue - expenses;
    const openOrders = WaWiState.orders.filter(o => o.status === 'open');

    container.innerHTML = `
        <div class="wawi-dashboard">
            <!-- Welcome Banner -->
            <div class="wawi-welcome-banner">
                <div class="wawi-welcome-icon">${scenario.icon}</div>
                <div class="wawi-welcome-text">
                    <h3>${scenario.company}</h3>
                    <p>${scenario.description}</p>
                </div>
            </div>

            <!-- Enhanced Difficulty Selector -->
            <div class="wawi-dashboard-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="margin-bottom: 0;">Schwierigkeitsgrad</h4>
                    <div class="wawi-mode-toggle">
                        <span class="${(!WaWiState.simMode || WaWiState.simMode === 'simulation') ? 'active' : ''}">Simulation</span>
                        <label class="wawi-switch">
                            <input type="checkbox" id="wawi-mode-checkbox" ${WaWiState.simMode === 'practice' ? 'checked' : ''} onchange="wawiToggleSimMode(this)">
                            <span class="wawi-slider round"></span>
                        </label>
                        <span class="${WaWiState.simMode === 'practice' ? 'active' : ''}">Übung</span>
                    </div>
                </div>
                <div class="wawi-difficulty-selector">
                    <div style="display:flex; gap:0.5rem; margin-bottom:0.75rem; flex-wrap: wrap;">
                        <button class="wawi-diff-btn ${WaWiState.difficulty === 'beginner' ? 'active' : ''}" onclick="wawiConfirmDifficulty('beginner')">Anfänger</button>
                        <button class="wawi-diff-btn ${WaWiState.difficulty === 'advanced' ? 'active' : ''}" onclick="wawiConfirmDifficulty('advanced')">Fortgeschritten</button>
                        <button class="wawi-diff-btn ${WaWiState.difficulty === 'pro' ? 'active' : ''}" onclick="wawiConfirmDifficulty('pro')">Profi</button>
                    </div>
                    <p class="wawi-creator-hint" style="min-height: 4em;">
                        ${WaWiState.difficulty === 'beginner' ? '🎯 <b>Anfänger:</b> Nur Bestandskonten (Aktivtausch, Passivtausch, Bilanzveränderungen).<br><span style="font-size:0.8rem; opacity:0.8;"><i>Didaktische Reduktion:</i> Weder Verkauf, noch Produktion oder AfA möglich. Diese Funktionen sind erst ab dem Modus <b>Fortgeschritten</b> verfügbar.</span>' : ''}
                        ${WaWiState.difficulty === 'advanced' ? '🚀 <b>Fortgeschritten:</b> Buchungen mit Erfolgskonten (Umsatzerlöse/Aufwand).<br><span style="font-size:0.8rem; opacity:0.8;"><i>Didaktische Erweiterung:</i> Realistische Abbildung von Geschäftsprozessen mit Gewinnauswirkung (GuV). <b>Inkl. Abschreibungen (AfA)</b> auf Anlagevermögen.</span>' : ''}
                        ${WaWiState.difficulty === 'pro' ? '🏆 <b>Profi:</b> Inkl. Bestandsveränderungen, Vor- und Umsatzsteuer.<br><span style="font-size:0.8rem; opacity:0.8;"><i>Vollständigkeit:</i> Industrieller Standard inkl. Steuerautomatik, <b>Abschreibungen (AfA)</b> und Lagerwertkorrekturen am Jahresende.</span>' : ''}
                    </p>
                </div>
            </div>

            <!-- KPI Grid -->
            <div class="wawi-kpi-grid">
                <div class="wawi-kpi-card wawi-kpi-bank" onclick="wawiSetTab('accounting')">
                    <div class="wawi-kpi-icon">🏦</div>
                    <div class="wawi-kpi-value">${wawiFormatCurrency(totalLiquidity)}</div>
                    <div class="wawi-kpi-label">Liquide Mittel</div>
                    <div class="wawi-kpi-sub">Bank: ${wawiFormatCurrency(bankBalance)} · Kasse: ${wawiFormatCurrency(kasseBalance)}</div>
                </div>

                <div class="wawi-kpi-card wawi-kpi-stock ${lowStock > 0 ? 'wawi-kpi-alert' : ''}" onclick="wawiSetTab('inventory')">
                    <div class="wawi-kpi-icon">${lowStock > 0 ? '⚠️' : '📦'}</div>
                    <div class="wawi-kpi-value">${lowStock > 0 ? lowStock + ' Engpässe' : 'Alles OK'}</div>
                    <div class="wawi-kpi-label">Materialversorgung</div>
                    <div class="wawi-kpi-sub">${lowStock > 0 ? 'Nachbestellen empfohlen!' : 'Alle Bestände über Meldebestand'}</div>
                </div>

                <div class="wawi-kpi-card wawi-kpi-products" onclick="wawiSetTab('sales')">
                    <div class="wawi-kpi-icon">${scenario.product.icon}</div>
                    <div class="wawi-kpi-value">${completedProducts} auf Lager</div>
                    <div class="wawi-kpi-label">Absatz & Vertrieb</div>
                    <div class="wawi-kpi-sub">Produziert: ${totalProduced} · Verkauft: ${totalSold}</div>
                </div>

                <div class="wawi-kpi-card wawi-kpi-journal" onclick="wawiSetTab('accounting')">
                    <div class="wawi-kpi-icon">📒</div>
                    <div class="wawi-kpi-value">${journalCount} Buchungen</div>
                    <div class="wawi-kpi-label">Buchungsjournal</div>
                    <div class="wawi-kpi-sub">${profit >= 0 ? '📈' : '📉'} Ergebnis: ${wawiFormatCurrency(profit)}</div>
                </div>
            </div>

            ${debt > 0 ? `
            <div class="wawi-alert-card wawi-alert-warning">
                <span class="wawi-alert-icon">💳</span>
                <div>
                    <strong>Offene Verbindlichkeiten</strong><br>
                    <span>${wawiFormatCurrency(debt)} ausstehend</span>
                </div>
                <button class="wawi-btn wawi-btn-sm" onclick="wawiHandlePayLiabilities()">Begleichen</button>
            </div>
            ` : ''}

            <!-- Production Preview -->
            ${WaWiState.difficulty !== 'beginner' && progress > 0 ? `
            <div class="wawi-dashboard-section">
                <h4>Laufende Produktion</h4>
                <div class="wawi-progress-card" onclick="wawiSetTab('production')">
                    <div class="wawi-progress-header">
                        <span>${scenario.product.icon} ${scenario.product.name}</span>
                        <span class="wawi-progress-pct">${progress}%</span>
                    </div>
                    <div class="wawi-progress-bar-track">
                        <div class="wawi-progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Quick Actions -->
            <div class="wawi-dashboard-section">
                <h4>Schnellaktionen</h4>
                <div class="wawi-quick-actions">
                    ${WaWiState.difficulty !== 'beginner' ? `
                    <button class="wawi-quick-btn" onclick="wawiSetTab('production')">
                        <span class="wawi-quick-icon">🏭</span>
                        <span>Produktion starten</span>
                    </button>
                    ` : ''}
                    <button class="wawi-quick-btn" onclick="wawiSetTab('procurement')">
                        <span class="wawi-quick-icon">🛒</span>
                        <span>Material bestellen</span>
                    </button>
                    ${WaWiState.difficulty !== 'beginner' && (completedProducts > 0 || openOrders.length > 0) ? `
                    <button class="wawi-quick-btn" onclick="wawiSetTab('sales')">
                        <span class="wawi-quick-icon">💰</span>
                        <span>Produkte verkaufen</span>
                    </button>
                    ` : ''}
                </div>
            </div>

            <!-- Recent Journal -->
            ${WaWiState.journal.length > 0 ? `
            <div class="wawi-dashboard-section">
                <h4>Letzte Buchungen</h4>
                <div class="wawi-journal-feed">
                    ${WaWiState.journal.slice(0, 3).map(e => wawiRenderJournalCard(e)).join('')}
                </div>
                <button class="wawi-link-btn" onclick="wawiSetTab('accounting')">Alle Buchungen anzeigen →</button>
            </div>
            ` : ''}

            ${wawiGetSharedDataManagementHTML()}
        </div>
    `;
}

function wawiConfirmDifficulty(newDiff) {
    if (WaWiState.difficulty === newDiff) return;

    const modeLabels = { beginner: 'Anfänger', advanced: 'Fortgeschritten', pro: 'Profi' };
    localStorage.setItem('bt_wawi_pref_difficulty', newDiff);

    // Step 1: Confirm the mode switch and warn about reset
    const shouldReset = confirm(`Achtung: Beim Wechsel des Schwierigkeitsgrads in den Modus "${modeLabels[newDiff]}" wird die gesamte Warenwirtschaft zurückgesetzt!\n\nAlle bisherigen Buchungen, Bestände und Fortschritte gehen verloren.\n\nFortfahren?`);
    
    if (shouldReset) {
        wawiTransformState(newDiff, false); // false = force reset
    }
}

function wawiToggleSimMode(checkbox) {
    WaWiState.simMode = checkbox.checked ? 'practice' : 'simulation';
    wawiSaveState();
    renderWarenwirtschaft();
    wawiShowToast(`Modus gewechselt: ${WaWiState.simMode === 'practice' ? 'Übungsmodus' : 'Simulation'}`, 'info');
}


// --- Production Module ---
function wawiRenderProduction(container) {
    const scenario = wawiGetScenario();
    const mode = WaWiState.difficulty || 'advanced';

    // Beginner mode: show disabled notice
    if (mode === 'beginner') {
        container.innerHTML = `
            <div class="wawi-production wawi-module-disabled">
                <div class="wawi-section-header">
                    <h3>🏭 Produktion: ${scenario.product.icon} ${scenario.product.name}</h3>
                </div>
                <div class="wawi-beginner-notice">
                    <div class="wawi-beginner-notice-icon">🔒</div>
                    <h4>Produktion im Anfängermodus nicht verfügbar</h4>
                    <p>Im Anfängermodus ist weder ein <strong>Verkauf</strong>, noch eine <strong>Produktion</strong> oder <strong>AfA</strong> möglich.</p>
                    <p>Diese Funktionen sind erst ab dem Modus <strong>Fortgeschritten</strong> verfügbar.</p>
                    <button class="wawi-btn wawi-btn-outline" onclick="wawiSetTab('procurement')">
                        🛒 Zur Beschaffung wechseln
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const progress = wawiGetProductionProgress();
    const isComplete = wawiIsProductionComplete();
    const completedProducts = WaWiState.production.completedProducts;

    // Calculate production cost
    let productionCost = 0;
    for (const part of scenario.bom) {
        productionCost += part.qty * part.unitPrice;
    }

    container.innerHTML = `
        <div class="wawi-production">
            <!-- Production Header -->
            <div class="wawi-section-header">
                <h3>🏭 Produktion: ${scenario.product.icon} ${scenario.product.name}</h3>
                <div class="wawi-section-sub">
                    Herstellkosten: ${wawiFormatCurrency(productionCost)} · Verkaufspreis: ${wawiFormatCurrency(scenario.product.sellPrice)}
                </div>
            </div>

            <!-- Progress Ring -->
            <div class="wawi-production-progress">
                <div class="wawi-ring-container">
                    <svg class="wawi-progress-ring" viewBox="0 0 120 120">
                        <circle class="wawi-ring-bg" cx="60" cy="60" r="52" />
                        <circle class="wawi-ring-fill" cx="60" cy="60" r="52"
                            stroke-dasharray="${2 * Math.PI * 52}"
                            stroke-dashoffset="${2 * Math.PI * 52 * (1 - progress / 100)}" />
                    </svg>
                    <div class="wawi-ring-text">
                        <span class="wawi-ring-pct">${progress}%</span>
                        <span class="wawi-ring-label">Fortschritt</span>
                    </div>
                </div>
            </div>

            <!-- BOM List -->
            <div class="wawi-bom-list">
                <h4 class="wawi-bom-title">Stückliste (Bill of Materials)</h4>
                ${scenario.bom.map(part => {
        const used = WaWiState.production.partsUsed[part.id] || 0;
        const stock = WaWiState.stock[part.id] || 0;
        const isDone = used >= part.qty;
        const canAssemble = stock > 0 && !isDone;
        return `
                    <div class="wawi-bom-item ${isDone ? 'wawi-bom-done' : ''} ${!canAssemble && !isDone ? 'wawi-bom-blocked' : ''}">
                        <div class="wawi-bom-icon">${part.icon}</div>
                        <div class="wawi-bom-info">
                            <div class="wawi-bom-name">${part.name}</div>
                            <div class="wawi-bom-detail">
                                ${used}/${part.qty} verbaut · ${stock} auf Lager · ${wawiFormatCurrency(part.unitPrice)}/${part.unit}
                            </div>
                            <div class="wawi-bom-bar-track">
                                <div class="wawi-bom-bar-fill ${isDone ? 'done' : ''}" style="width: ${(used / part.qty) * 100}%"></div>
                            </div>
                        </div>
                        <button class="wawi-assemble-btn ${isDone ? 'done' : ''} ${!canAssemble && !isDone ? 'blocked' : ''}"
                            onclick="wawiHandleAssemble('${part.id}')"
                            ${canAssemble ? '' : 'disabled'}>
                            ${isDone ? '✓' : (canAssemble ? '+ Verbauen' : '✗ Fehlt')}
                        </button>
                    </div>`;
    }).join('')}
            </div>

            <!-- Finish / Sell Actions -->
            <div class="wawi-production-actions">
                ${isComplete ? `
                <button class="wawi-btn wawi-btn-success wawi-btn-lg" onclick="wawiHandleFinishProduct()">
                    ${scenario.product.icon} ${scenario.product.name} fertigstellen
                </button>
                ` : (progress > 0 ? `
                <div class="wawi-info-note">
                    Verbaue alle Teile, um das ${scenario.product.name} fertigzustellen.
                </div>
                ` : `
                <div class="wawi-info-note">
                    Tippe auf „+ Verbauen", um mit der Montage zu beginnen.
                </div>
                `)}

                ${completedProducts > 0 ? `
                <div class="wawi-info-note">
                    Du hast fertige Produkte auf Lager. Gehe zum <strong>Vertrieb</strong>, um sie zu verkaufen.
                </div>
                ` : ''}
            </div>
        </div>
    `;
}


// --- Inventory Module ---
function wawiRenderInventory(container) {
    const scenario = wawiGetScenario();

    container.innerHTML = `
        <div class="wawi-inventory">
            <div class="wawi-section-header">
                <h3>📦 Lagerübersicht</h3>
                <div class="wawi-section-sub">Bestandsampel: 🟢 OK · 🟡 Knapp · 🔴 Kritisch (unter Meldebestand)</div>
            </div>

            <div class="wawi-stock-grid">
                ${[...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe].map(part => {
        const stock = WaWiState.stock[part.id] || 0;
        const reorder = scenario.reorderPoints[part.id] || 0;
        const status = wawiGetStockStatus(part.id);
        const maxStock = (scenario.initialStock[part.id] || 10) * 2;
        const fillPct = Math.min(100, (stock / maxStock) * 100);

        const isHS = scenario.hilfsstoffe.some(h => h.id === part.id);
        const isBS = scenario.betriebsstoffe.some(b => b.id === part.id);
        const typeLabel = isHS ? 'Hilfsstoff' : (isBS ? 'Betriebsstoff' : 'Rohstoff');

        return `
                    <div class="wawi-stock-card wawi-stock-${status}">
                        <div class="wawi-stock-header">
                            <span class="wawi-stock-icon">${part.icon}</span>
                            <span class="wawi-stock-label" style="font-size:0.65rem; padding:1px 4px; background: rgba(56, 189, 248, 0.1); color: var(--primary); border-radius:3px; font-weight:700;">${typeLabel}</span>
                            <span class="wawi-stock-status-dot wawi-dot-${status}"></span>
                        </div>
                        <div class="wawi-stock-name">${part.name}</div>
                        <div class="wawi-stock-amount">${stock} ${part.unit}</div>
                        <div class="wawi-stock-bar-track">
                            <div class="wawi-stock-bar-fill wawi-bar-${status}" style="width: ${fillPct}%"></div>
                        </div>
                        <div class="wawi-stock-meta">
                            <span>Meldebestand: ${reorder}</span>
                            <span>${wawiFormatCurrency(part.unitPrice)}/${part.unit}</span>
                        </div>
                        <div class="wawi-stock-value">Wert: ${wawiFormatCurrency(stock * part.unitPrice)}</div>
                        ${status === 'danger' ? `
                        <button class="wawi-btn wawi-btn-sm wawi-btn-danger" onclick="wawiSetTab('procurement')">
                            🛒 Nachbestellen
                        </button>
                        ` : ''}
                    </div>`;
    }).join('')}
            </div>

            <!-- Fertigerzeugnisse -->
            <div class="wawi-finished-stock">
                <div class="wawi-stock-card wawi-stock-finished">
                    <div class="wawi-stock-header">
                        <span class="wawi-stock-icon">${scenario.product.icon}</span>
                        <span class="wawi-stock-label-fe">Fertigerzeugnisse</span>
                    </div>
                    <div class="wawi-stock-name">${scenario.product.name}</div>
                    <div class="wawi-stock-amount wawi-stock-amount-lg">${WaWiState.production.completedProducts} Stk.</div>
                    <div class="wawi-stock-meta">
                        <span>Gesamt produziert: ${WaWiState.production.totalProduced}</span>
                        <span>Gesamt verkauft: ${WaWiState.production.totalSold}</span>
                    </div>
                </div>
            </div>

            <!-- Total Inventory Value -->
            <div class="wawi-inventory-summary">
                <div class="wawi-summary-row">
                    <span>Rohstoffwert gesamt:</span>
                    <span class="wawi-summary-value">${wawiFormatCurrency(wawiGetAccountBalance('2000'))}</span>
                </div>
                <div class="wawi-summary-row">
                    <span>Fertigerzeugnisse Wert:</span>
                    <span class="wawi-summary-value">${wawiFormatCurrency(wawiGetAccountBalance('2800'))}</span>
                </div>
                <div class="wawi-summary-row">
                    <span>Hilfs- & Betriebsstoffe:</span>
                    <span class="wawi-summary-value">${wawiFormatCurrency(wawiGetAccountBalance('2010') + wawiGetAccountBalance('2020'))}</span>
                </div>
                <div class="wawi-summary-row wawi-summary-total">
                    <span>Gesamtbestandswert:</span>
                    <span class="wawi-summary-value">${wawiFormatCurrency(wawiGetAccountBalance('2000') + wawiGetAccountBalance('2010') + wawiGetAccountBalance('2020') + wawiGetAccountBalance('2800'))}</span>
                </div>
            </div>
        </div>
    `;
}


// --- Accounting Module ---

// Sub-view state for accounting (not persisted)
let wawiAccountingView = 'tkonten'; // 'overview', 'tkonten', 'journal'
let wawiFibuMode = 'buchhaltung'; // 'buchhaltung', 'finanzen'

// Helper: Collect all journal entries for a specific account
function wawiGetAccountEntries(accountId) {
    const scenario = wawiGetScenario();
    const accDef = scenario.accounts.find(a => a.id === accountId);
    if (!accDef) return { sollEntries: [], habenEntries: [], sollTotal: 0, habenTotal: 0 };

    const sollEntries = [];
    const habenEntries = [];
    let sollTotal = 0;
    let habenTotal = 0;

    // Add Anfangsbestand (opening balance) for Bestandskonten
    const isBestandskonto = (accDef.type === 'aktiv' || accDef.type === 'passiv');
    const freshState = wawiCreateFreshState(WaWiState.activeScenario);
    const anfangsbestand = Math.abs(freshState.accounts[accountId] || 0);

    if (isBestandskonto && anfangsbestand > 0) {
        if (accDef.type === 'aktiv') {
            sollEntries.push({ label: 'AB (Anfangsbestand)', amount: anfangsbestand, isAB: true });
            sollTotal += anfangsbestand;
        } else {
            habenEntries.push({ label: 'AB (Anfangsbestand)', amount: anfangsbestand, isAB: true });
            habenTotal += anfangsbestand;
        }
    }

    // Iterate journal in chronological order (journal is newest-first, so reverse)
    const journalEntries = [...WaWiState.journal].reverse();
    for (const entry of journalEntries) {
        if (entry.isDeleted) continue;

        // Compound entry
        if (entry.isCompound && entry.entries) {
            let involvesSoll = false;
            let involvesHaben = false;
            for (const e of entry.entries) {
                if (e.accountId === accountId && e.side === 'soll') involvesSoll = true;
                if (e.accountId === accountId && e.side === 'haben') involvesHaben = true;
            }
            if (involvesSoll) {
                // Collect all counterpart accounts
                const counterparts = entry.entries.filter(e => e.accountId !== accountId || e.side !== 'soll');
                const myAmount = entry.entries.filter(e => e.accountId === accountId && e.side === 'soll').reduce((s, e) => s + e.amount, 0);
                const label = counterparts.map(e => e.accountName || wawiGetAccountName(e.accountId)).join(', ');
                sollEntries.push({ label: label, amount: myAmount, id: entry.id });
                sollTotal += myAmount;
            }
            if (involvesHaben) {
                const counterparts = entry.entries.filter(e => e.accountId !== accountId || e.side !== 'haben');
                const myAmount = entry.entries.filter(e => e.accountId === accountId && e.side === 'haben').reduce((s, e) => s + e.amount, 0);
                const label = counterparts.map(e => e.accountName || wawiGetAccountName(e.accountId)).join(', ');
                habenEntries.push({ label: label, amount: myAmount, id: entry.id });
                habenTotal += myAmount;
            }
            continue;
        }

        let dId, cId, amt, dName, cName;

        // Compatibility check
        if (entry.debit && typeof entry.debit === 'object') {
            dId = entry.debit.accountId;
            cId = entry.credit.accountId;
            amt = entry.debit.amount;
            dName = entry.debit.accountName || wawiGetAccountName(dId);
            cName = entry.credit.accountName || wawiGetAccountName(cId);
        } else {
            dId = entry.debitAccountId;
            cId = entry.creditAccountId;
            amt = entry.amount;
            dName = wawiGetAccountName(dId);
            cName = wawiGetAccountName(cId);
        }

        if (dId === accountId) {
            sollEntries.push({ label: `${cName}`, amount: amt, id: entry.id });
            sollTotal += amt;
        }
        if (cId === accountId) {
            habenEntries.push({ label: `${dName}`, amount: amt, id: entry.id });
            habenTotal += amt;
        }
    }

    return { sollEntries, habenEntries, sollTotal, habenTotal };
}

// Render a single T-Konto
function wawiRenderTKonto(acc) {
    const { sollEntries, habenEntries, sollTotal, habenTotal } = wawiGetAccountEntries(acc.id);
    const saldo = Math.abs(sollTotal - habenTotal);
    const saldoOnSoll = habenTotal > sollTotal;
    const saldoOnHaben = sollTotal > habenTotal;
    const maxRows = Math.max(sollEntries.length, habenEntries.length);
    const hasEntries = sollEntries.length > 0 || habenEntries.length > 0;

    // Determine category label
    let categoryLabel = '';
    let categoryClass = '';
    if (acc.type === 'aktiv') { categoryLabel = 'Aktiv'; categoryClass = 'wawi-tk-cat-aktiv'; }
    else if (acc.type === 'passiv') { categoryLabel = 'Passiv'; categoryClass = 'wawi-tk-cat-passiv'; }
    else if (acc.type === 'ertrag') { categoryLabel = 'Ertrag'; categoryClass = 'wawi-tk-cat-ertrag'; }
    else if (acc.type === 'aufwand') { categoryLabel = 'Aufwand'; categoryClass = 'wawi-tk-cat-aufwand'; }

    return `
        <div class="wawi-tkonto">
            <div class="wawi-tkonto-header">
                <span class="wawi-tkonto-id">${acc.id}</span>
                <span class="wawi-tkonto-name">${acc.name}</span>
                <span class="wawi-tkonto-cat ${categoryClass}">${categoryLabel}</span>
            </div>
            <div class="wawi-tkonto-body">
                <div class="wawi-tkonto-col wawi-tkonto-soll">
                    <div class="wawi-tkonto-col-header">Soll</div>
                    ${!hasEntries ? '<div class="wawi-tkonto-empty">—</div>' : ''}
                    ${sollEntries.map(e => `
                        <div class="wawi-tkonto-entry ${e.isAB ? 'wawi-tkonto-ab' : ''}">
                            <span class="wawi-tkonto-entry-label">${e.label}</span>
                            <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(e.amount)}</span>
                        </div>
                    `).join('')}
                    ${saldoOnSoll && hasEntries ? `
                        <div class="wawi-tkonto-saldo-row">
                            <span class="wawi-tkonto-entry-label">Saldo</span>
                            <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(saldo)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="wawi-tkonto-divider"></div>
                <div class="wawi-tkonto-col wawi-tkonto-haben">
                    <div class="wawi-tkonto-col-header">Haben</div>
                    ${!hasEntries ? '<div class="wawi-tkonto-empty">—</div>' : ''}
                    ${habenEntries.map(e => `
                        <div class="wawi-tkonto-entry ${e.isAB ? 'wawi-tkonto-ab' : ''}">
                            <span class="wawi-tkonto-entry-label">${e.label}</span>
                            <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(e.amount)}</span>
                        </div>
                    `).join('')}
                    ${saldoOnHaben && hasEntries ? `
                        <div class="wawi-tkonto-saldo-row">
                            <span class="wawi-tkonto-entry-label">Saldo</span>
                            <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(saldo)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${hasEntries ? `
            <div class="wawi-tkonto-footer">
                <span>${wawiFormatCurrency(sollTotal + (saldoOnSoll ? saldo : 0))}</span>
                <span>${wawiFormatCurrency(habenTotal + (saldoOnHaben ? saldo : 0))}</span>
            </div>
            ` : ''}
        </div>
    `;
}

function wawiRenderAccounting(container) {
    const scenario = wawiGetScenario();

    const mode = WaWiState.difficulty || 'advanced';
    const allowedMap = {
        'beginner': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400'],
        'advanced': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400', '5000', '6010', '6020', '6000', '8020', '6520', '5460', '6960'],
        'pro': ['1000', '1200', '0510', '0700', '0840', '0860', '2000', '2010', '2020', '2400', '2800', '3000', '4250', '4400', '5000', '5200', '6000', '6010', '6020', '2600', '4800', '8020', '6520', '5460', '6960']
    };
    const allowed = allowedMap[mode];

    const getAktivaOrder = (id) => ['0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '2600', '2400', '1200', '1000'].indexOf(id) === -1 ? 99 : ['0510', '0700', '0840', '0860', '2000', '2010', '2020', '2800', '2600', '2400', '1200', '1000'].indexOf(id);
    const getPassivaOrder = (id) => ['3000', '4250', '4400', '4800', '8020'].indexOf(id) === -1 ? 99 : ['3000', '4250', '4400', '4800', '8020'].indexOf(id);

    // Separate accounts by type, filtered by mode
    const aktivAccounts = scenario.accounts.filter(a => a.type === 'aktiv' && allowed.includes(a.id)).sort((a, b) => getAktivaOrder(a.id) - getAktivaOrder(b.id));
    const passivAccounts = scenario.accounts.filter(a => a.type === 'passiv' && allowed.includes(a.id)).sort((a, b) => getPassivaOrder(a.id) - getPassivaOrder(b.id));
    const ertragAccounts = scenario.accounts.filter(a => a.type === 'ertrag' && allowed.includes(a.id));
    const aufwandAccounts = scenario.accounts.filter(a => a.type === 'aufwand' && allowed.includes(a.id));
    const bestandskonten = [...aktivAccounts, ...passivAccounts];
    const erfolgskonten = [...aufwandAccounts, ...ertragAccounts];

    // GuV
    const revenue = ertragAccounts.reduce((sum, acc) => sum + Math.abs(wawiGetAccountBalance(acc.id)), 0);
    const expenses = aufwandAccounts.reduce((sum, acc) => sum + wawiGetAccountBalance(acc.id), 0);
    const profit = revenue - expenses;

    const sumAktiva = aktivAccounts.reduce((sum, acc) => sum + wawiGetAccountBalance(acc.id), 0);
    const sumPassivaNominal = Math.abs(passivAccounts.reduce((sum, acc) => sum + wawiGetAccountBalance(acc.id), 0));
    const totalPassiva = sumPassivaNominal + (!WaWiState.isClosed ? profit : 0);
    const isBalanced = Math.abs(sumAktiva - totalPassiva) < 0.01;

    container.innerHTML = `
        <div class="wawi-accounting">
            <div class="wawi-section-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>📒 FiBu</h3>
                <div class="wawi-view-toggle" style="margin-bottom: 0;">
                    <button class="wawi-btn wawi-btn-pdf wawi-toggle-btn" onclick="wawiExportToPDF()" title="PDF Export (Bilanz, T-Konten, Journal)" style="padding: 0.5rem; height: auto; font-size: 0.85rem; margin-right: 0.5rem; border-radius: 6px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </button>
                    <button class="wawi-toggle-btn ${wawiFibuMode === 'buchhaltung' ? 'active' : ''}" onclick="wawiSetFibuMode('buchhaltung')">
                        Buchhaltung
                    </button>
                    <button class="wawi-toggle-btn ${wawiFibuMode === 'finanzen' ? 'active' : ''}" onclick="wawiSetFibuMode('finanzen')">
                        Finanzen
                    </button>
                </div>
            </div>

            ${wawiFibuMode === 'buchhaltung' ? `
            <!-- View Toggle for Buchhaltung -->
            <div class="wawi-view-toggle">
                <button class="wawi-toggle-btn ${wawiAccountingView === 'overview' ? 'active' : ''}" onclick="wawiSetAccountingView('overview')">
                    📊 Übersicht
                </button>
                <button class="wawi-toggle-btn ${wawiAccountingView === 'tkonten' ? 'active' : ''}" onclick="wawiSetAccountingView('tkonten')">
                    📋 T-Konten (Hauptbuch)
                </button>
                <button class="wawi-toggle-btn ${wawiAccountingView === 'journal' ? 'active' : ''}" onclick="wawiSetAccountingView('journal')">
                    📒 Journal (Grundbuch)
                </button>
            </div>

            <!-- VIEW: Overview -->
            ${wawiAccountingView === 'overview' ? `
            <div class="wawi-accounts-section wawi-overview-aggregate">
                
                <!-- Bilanz-T-Konto -->
                <div class="wawi-tkonto wawi-tkonto-aggregate">
                    <div class="wawi-tkonto-header">
                        <span class="wawi-tkonto-name">Bilanz-T-Konto (Hauptbuch)</span>
                        <span class="wawi-tkonto-cat wawi-tk-cat-aktiv">${WaWiState.isClosed ? 'Schlussbilanz' : (WaWiState.journal.length === 0 ? 'Eröffnungsbilanz' : 'Laufendes Geschäftsjahr')}</span>
                    </div>
                    <div class="wawi-tkonto-body">
                        <div class="wawi-tkonto-col wawi-tkonto-soll">
                            <div class="wawi-tkonto-col-header">Aktiva</div>
                            ${aktivAccounts.filter(a => ['0510', '0700', '0840', '0860'].includes(a.id)).length > 0 ? `<div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin: 0.5rem 0 0.2rem 0; padding-bottom: 2px; border-bottom: 1px dashed rgba(255,255,255,0.1);">Anlagevermögen</div>` : ''}
                            ${aktivAccounts.filter(a => ['0510', '0700', '0840', '0860'].includes(a.id)).map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(wawiGetAccountBalance(acc.id))}</span>
                                </div>
                            `).join('')}
                            ${aktivAccounts.filter(a => !['0510', '0700', '0840', '0860'].includes(a.id)).length > 0 ? `<div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin: 0.5rem 0 0.2rem 0; padding-bottom: 2px; border-bottom: 1px dashed rgba(255,255,255,0.1);">Umlaufvermögen</div>` : ''}
                            ${aktivAccounts.filter(a => !['0510', '0700', '0840', '0860'].includes(a.id)).map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(wawiGetAccountBalance(acc.id))}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="wawi-tkonto-divider"></div>
                        <div class="wawi-tkonto-col wawi-tkonto-haben">
                            <div class="wawi-tkonto-col-header">Passiva</div>
                            ${passivAccounts.filter(a => a.id === '3000').length > 0 ? `<div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin: 0.5rem 0 0.2rem 0; padding-bottom: 2px; border-bottom: 1px dashed rgba(255,255,255,0.1);">Eigenkapital</div>` : ''}
                            ${passivAccounts.filter(a => a.id === '3000').map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.id === '3000' && WaWiState.isClosed && WaWiState.lastClosingProfit !== 0 ? 'Eigenkapital (vor Ergebnis)' : acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(Math.abs(wawiGetAccountBalance(acc.id)))}</span>
                                </div>
                            `).join('')}
                            ${WaWiState.isClosed && WaWiState.lastClosingProfit !== 0 ? `
                                <div class="wawi-tkonto-entry" style="color:var(--success); font-weight:700; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px;">
                                    <span class="wawi-tkonto-entry-label">${WaWiState.lastClosingProfit > 0 ? 'Jahresüberschuss' : 'Jahresfehlbetrag'}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(Math.abs(WaWiState.lastClosingProfit))}</span>
                                </div>
                            ` : ''}
                            ${passivAccounts.filter(a => a.id !== '3000').length > 0 ? `<div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin: 0.5rem 0 0.2rem 0; padding-bottom: 2px; border-bottom: 1px dashed rgba(255,255,255,0.1);">Fremdkapital</div>` : ''}
                            ${passivAccounts.filter(a => a.id !== '3000').map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(Math.abs(wawiGetAccountBalance(acc.id)))}</span>
                                </div>
                            `).join('')}
                            ${!WaWiState.isClosed && profit !== 0 ? `
                                <div class="wawi-tkonto-entry" style="font-weight: bold; color: var(--primary); border-top: 1px dashed var(--primary); margin-top: 4px; padding-top: 4px;">
                                    <span class="wawi-tkonto-entry-label">Laufendes Ergebnis (Jahresüberschuss/-fehlbetrag)</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(profit)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="wawi-tkonto-footer" style="${isBalanced ? '' : 'border-color: #ef4444; background: rgba(239, 68, 68, 0.05);'}">
                        <span style="display: flex; align-items: center; gap: 0.4rem; justify-content: flex-end; padding: 0.5rem 0.75rem;">
                            ${isBalanced ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                            ${wawiFormatCurrency(sumAktiva)}
                        </span>
                        <span style="display: flex; align-items: center; gap: 0.4rem; justify-content: flex-end; padding: 0.5rem 0.75rem;">
                            ${wawiFormatCurrency(totalPassiva)}
                            ${isBalanced ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'}
                        </span>
                    </div>
                </div>

                <!-- GuV-T-Konto -->
                <div class="wawi-tkonto wawi-tkonto-aggregate" style="margin-top: 1.5rem;">
                    <div class="wawi-tkonto-header">
                        <span class="wawi-tkonto-name">GuV-T-Konto (Hauptbuch)</span>
                        <span class="wawi-tkonto-cat wawi-tk-cat-ertrag">Ergebnisrechnung</span>
                    </div>
                    <div class="wawi-tkonto-body">
                        <div class="wawi-tkonto-col wawi-tkonto-soll">
                            <div class="wawi-tkonto-col-header">Aufwendungen</div>
                            ${aufwandAccounts.map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(wawiGetAccountBalance(acc.id))}</span>
                                </div>
                            `).join('')}
                            ${profit > 0 ? `
                                <div class="wawi-tkonto-saldo-row">
                                    <span class="wawi-tkonto-entry-label">Gewinn (Betriebsergebnis)</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(profit)}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="wawi-tkonto-divider"></div>
                        <div class="wawi-tkonto-col wawi-tkonto-haben">
                            <div class="wawi-tkonto-col-header">Erträge</div>
                            ${ertragAccounts.map(acc => `
                                <div class="wawi-tkonto-entry">
                                    <span class="wawi-tkonto-entry-label">${acc.name}</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(Math.abs(wawiGetAccountBalance(acc.id)))}</span>
                                </div>
                            `).join('')}
                            ${profit < 0 ? `
                                <div class="wawi-tkonto-saldo-row">
                                    <span class="wawi-tkonto-entry-label">Verlust</span>
                                    <span class="wawi-tkonto-entry-amount">${wawiFormatCurrency(Math.abs(profit))}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="wawi-tkonto-footer">
                        <span>${wawiFormatCurrency(Math.max(expenses + (profit > 0 ? profit : 0), revenue + (profit < 0 ? Math.abs(profit) : 0)))}</span>
                        <span>${wawiFormatCurrency(Math.max(expenses + (profit > 0 ? profit : 0), revenue + (profit < 0 ? Math.abs(profit) : 0)))}</span>
                    </div>
                </div>

                <!-- Summary Status -->
                <div class="wawi-guv-card ${profit >= 0 ? 'wawi-guv-positive' : 'wawi-guv-negative'}" style="margin-top: 1.5rem;">
                    <div class="wawi-guv-label">Netto-Ergebnis</div>
                    <div class="wawi-guv-value">${wawiFormatCurrency(profit)}</div>
                    <div class="wawi-guv-sub">Bilanzsumme: ${wawiFormatCurrency(aktivAccounts.reduce((sum, acc) => sum + wawiGetAccountBalance(acc.id), 0))}</div>
                </div>

                <!-- Annual Closing Action -->
                <div class="wawi-closing-actions">
                    <button class="wawi-btn wawi-btn-lg wawi-btn-closing" onclick="wawiHandleYearEndClosing()">
                        🏁 Jahresabschluss durchführen
                    </button>
                </div>
            </div>
            </div>
            ` : ''}

            <!-- VIEW: T-Konten -->
            ${wawiAccountingView === 'tkonten' ? `
            <div class="wawi-tkonten-section">
                <div class="wawi-tkonten-group">
                    <h4 class="wawi-group-title wawi-group-aktiv">Bestandskonten (Hauptbuch)</h4>
                    <div class="wawi-tkonten-grid">
                        ${bestandskonten.map(acc => wawiRenderTKonto(acc)).join('')}
                    </div>
                </div>

                <div class="wawi-tkonten-group">
                    <h4 class="wawi-group-title wawi-group-aufwand">Erfolgskonten (Hauptbuch)</h4>
                    <div class="wawi-tkonten-grid">
                        ${erfolgskonten.map(acc => wawiRenderTKonto(acc)).join('')}
                    </div>
                </div>

                <!-- Profit card -->
                <div class="wawi-guv-card ${profit >= 0 ? 'wawi-guv-positive' : 'wawi-guv-negative'}">
                    <div class="wawi-guv-label">Betriebsergebnis (GuV)</div>
                    <div class="wawi-guv-value">${wawiFormatCurrency(profit)}</div>
                    <div class="wawi-guv-sub">Erträge: ${wawiFormatCurrency(revenue)} · Aufwendungen: ${wawiFormatCurrency(expenses)}</div>
                </div>
            </div>
            ` : ''}

            <!-- VIEW: Journal -->
            ${wawiAccountingView === 'journal' ? `
            <div class="wawi-journal-section">
                <h4>Buchungsjournal (Grundbuch) — ${WaWiState.journal.length} Einträge</h4>
                <div style="font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 12px; align-items: center; background: rgba(0,0,0,0.03); padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                    <strong style="margin-right: 4px;">Legende:</strong> 
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="color: #6b7280; background: rgba(107, 114, 128, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(107, 114, 128, 0.3); font-size: 0.7rem;">🤖 Simulation</span> <span style="font-size: 0.75rem;">Systembuchung</span></span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); font-size: 0.7rem;">📝 Übung</span> <span style="font-size: 0.75rem;">Eigenbuchung</span></span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem;">🔓 Mit Lösung</span> <span style="font-size: 0.75rem;">Hilfe genutzt</span></span>
                </div>
                ${WaWiState.journal.length === 0 ? `
                    <div class="wawi-empty-state">
                        <span class="wawi-empty-icon">📭</span>
                        <p>Noch keine Buchungen vorhanden.</p>
                        <p>Starte die Produktion oder bestelle Material, um die erste Buchung auszulösen.</p>
                    </div>
                ` : `
                    <div class="wawi-journal-feed">
                        ${WaWiState.journal.map(e => wawiRenderJournalCard(e)).join('')}
                    </div>
                `}
            </div>
            </div>
            ` : ''}
            ` : ''}

            <!-- VIEW: Finanzen -->
            ${wawiFibuMode === 'finanzen' ? wawiRenderFinanzen() : ''}
        </div>
    `;
}

function wawiSetAccountingView(view) {
    wawiAccountingView = view;
    const content = document.getElementById('wawi-content');
    if (content) wawiRenderAccounting(content);
}

function wawiSetFibuMode(mode) {
    wawiFibuMode = mode;
    const content = document.getElementById('wawi-content');
    if (content) wawiRenderAccounting(content);
}

// Render Finanzen View
function wawiRenderFinanzen() {
    const bankBalance = wawiGetAccountBalance('1200');
    const kasseBalance = wawiGetAccountBalance('1000');
    const verbindlichkeiten = wawiGetAccountBalance('4400');
    const forderungen = wawiGetAccountBalance('2400');
    const darlehen = wawiGetAccountBalance('4250');

    const mode = WaWiState.difficulty || 'advanced';
    const isBeginner = mode === 'beginner';

    const openForderungen = WaWiState.financeTransactions.filter(t => t.type === 'forderung' && t.remainingAmount > 0);
    const openVerbindlichkeiten = WaWiState.financeTransactions.filter(t => t.type === 'verbindlichkeit' && t.remainingAmount > 0);

    return `
        <div class="wawi-finanzen-section" style="margin-top: 1rem;">
            <!-- Übersicht Liquidität & Schulden -->
            <div class="wawi-liquidity-card" style="margin-bottom: 1.5rem;">
                <div class="wawi-liquidity-row">
                    <span>🏦 Bankbestand:</span>
                    <span class="wawi-liquidity-val">${wawiFormatCurrency(bankBalance)}</span>
                </div>
                <div class="wawi-liquidity-row">
                    <span>💵 Kassenbestand:</span>
                    <span class="wawi-liquidity-val">${wawiFormatCurrency(kasseBalance)}</span>
                </div>
                <div class="wawi-liquidity-row">
                    <span>📈 Forderungen (Kunden):</span>
                    <span class="wawi-liquidity-val" style="color: var(--success);">${wawiFormatCurrency(forderungen)}</span>
                </div>
                <div class="wawi-liquidity-row">
                    <span>📉 Verbindlichkeiten (Lieferanten):</span>
                    <span class="wawi-liquidity-val ${verbindlichkeiten < 0 ? 'wawi-debt' : ''}">${wawiFormatCurrency(verbindlichkeiten)}</span>
                </div>
                <div class="wawi-liquidity-row">
                    <span>🏦 Bankdarlehen:</span>
                    <span class="wawi-liquidity-val ${darlehen < 0 ? 'wawi-debt' : ''}">${wawiFormatCurrency(darlehen)}</span>
                </div>
            </div>

            <!-- Aktionen -->
            <div class="wawi-tkonten-grid" style="align-items: start;">
                
                <!-- Offene Forderungen (Kundenrechnungen) -->
                <div class="wawi-finance-col">
                    <h4 style="margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Kundenrechnungen (Forderungen)</h4>
                    ${openForderungen.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.9rem;">Keine offenen Kundenrechnungen.</p>' : ''}
                    ${openForderungen.map(t => `
                        <div class="wawi-order-card" style="margin-bottom: 1rem;">
                            <h5 style="margin-bottom: 0.25rem;">${t.description}</h5>
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Datum: ${new Date(t.date).toLocaleDateString('de-DE')}</div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.9rem;">
                                <span>Rechnungsbetrag ${isBeginner ? '(HK)' : ''}:</span>
                                <span>${wawiFormatCurrency(t.originalAmount)}</span>
                            </div>
                            <div class="wawi-order-form-row">
                                <label class="wawi-order-label">Zahlbetrag:</label>
                                <input type="number" id="wawi-finance-amt-${t.id}" class="wawi-input" style="width: 100px;" value="${t.remainingAmount}" max="${t.remainingAmount}" min="1">
                            </div>
                            <div class="wawi-order-actions" style="margin-top: 1rem;">
                                <button class="wawi-btn wawi-btn-primary wawi-btn-sm" onclick="wawiHandleFinancePayment('${t.id}', 'bank')">Per Bank</button>
                                <button class="wawi-btn wawi-btn-outline wawi-btn-sm" onclick="wawiHandleFinancePayment('${t.id}', 'kasse')">Per Kasse</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Offene Verbindlichkeiten (Lieferantenrechnungen) -->
                <div class="wawi-finance-col">
                    <h4 style="margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Lieferantenrechnungen (Verbindlichkeiten)</h4>
                    ${openVerbindlichkeiten.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.9rem;">Keine offenen Lieferantenrechnungen.</p>' : ''}
                    ${openVerbindlichkeiten.map(t => `
                        <div class="wawi-order-card" style="margin-bottom: 1rem;">
                            <h5 style="margin-bottom: 0.25rem;">${t.description}</h5>
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Datum: ${new Date(t.date).toLocaleDateString('de-DE')}</div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.9rem;">
                                <span>Rechnungsbetrag ${isBeginner ? '(HK)' : ''}:</span>
                                <span>${wawiFormatCurrency(t.originalAmount)}</span>
                            </div>
                            <div class="wawi-order-form-row">
                                <label class="wawi-order-label">Zahlbetrag:</label>
                                <input type="number" id="wawi-finance-amt-${t.id}" class="wawi-input" style="width: 100px;" value="${t.remainingAmount}" max="${t.remainingAmount}" min="1">
                            </div>
                            <div class="wawi-order-actions" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                <button class="wawi-btn wawi-btn-primary wawi-btn-sm" onclick="wawiHandleFinancePayment('${t.id}', 'bank')">Per Bank</button>
                                <button class="wawi-btn wawi-btn-outline wawi-btn-sm" onclick="wawiHandleFinancePayment('${t.id}', 'kasse')">Per Kasse</button>
                                <button class="wawi-btn wawi-btn-outline wawi-btn-sm" onclick="wawiHandleFinancePayment('${t.id}', 'darlehen')" style="border-color: var(--fly-orange); color: var(--fly-orange);">In Darlehen</button>
                            </div>
                            ${bankBalance < t.remainingAmount && kasseBalance < t.remainingAmount ? '<div style="margin-top: 0.5rem; color: var(--danger); font-size: 0.8rem;">⚠️ Nicht genug Liquidität für Vollzahlung</div>' : ''}
                        </div>
                    `).join('')}
                </div>

            </div>
        </div>
    `;
}

// Journal card (used in dashboard + accounting)
function wawiRenderJournalCard(entry) {
    const isDeleted = entry.isDeleted || false;
    const isEdited = entry.isEdited || false;

    const modeBadge = entry.mode === 'practice' 
        ? `<span style="font-size: 0.7rem; color: #3b82f6; margin-left: 0.5rem; background: rgba(59, 130, 246, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3);">📝 Übung</span>`
        : `<span style="font-size: 0.7rem; color: #6b7280; margin-left: 0.5rem; background: rgba(107, 114, 128, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(107, 114, 128, 0.3);">🤖 Simulation</span>`;

    const solutionBadge = entry.usedSolution 
        ? `<span style="font-size: 0.7rem; color: #f59e0b; margin-left: 0.5rem; background: rgba(245, 158, 11, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3);">🔓 Mit Lösung</span>`
        : '';

    // Compound entry rendering
    if (entry.isCompound && entry.entries) {
        const sollEntries = entry.entries.filter(e => e.side === 'soll');
        const habenEntries = entry.entries.filter(e => e.side === 'haben');
        const compoundBadge = `<span style="font-size: 0.7rem; color: #8b5cf6; margin-left: 0.5rem; background: rgba(139, 92, 246, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.3);">Zusammengesetzt</span>`;

        return `
            <div class="wawi-journal-card ${isDeleted ? 'wawi-journal-card-storniert' : ''}">
                <div class="wawi-journal-header">
                    <div class="wawi-journal-id">#${entry.id}</div>
                    <div class="wawi-journal-time">
                        ${new Date(entry.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div class="wawi-journal-desc">
                    ${entry.description} 
                    ${isDeleted ? '<span class="wawi-storno-label">(Storniert)</span>' : ''}
                    ${compoundBadge}
                    ${modeBadge}
                    ${solutionBadge}
                </div>
                <div class="wawi-journal-booking" style="display: flex; flex-direction: row; align-items: flex-start; gap: 1rem; width: 100%;">
                    <div style="display:flex; flex-direction:column; gap:2px; flex: 1;">
                        ${sollEntries.map(e => `
                            <div class="wawi-journal-side wawi-journal-soll">
                                <span class="wawi-journal-acc">${e.accountId} ${e.accountName || wawiGetAccountName(e.accountId)}</span>
                                <span class="wawi-journal-amt">${wawiFormatCurrency(e.amount)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="wawi-journal-divider" style="padding-top: 0.5rem;">an</div>
                    <div style="display:flex; flex-direction:column; gap:2px; flex: 1;">
                        ${habenEntries.map(e => `
                            <div class="wawi-journal-side wawi-journal-haben">
                                <span class="wawi-journal-acc">${e.accountId} ${e.accountName || wawiGetAccountName(e.accountId)}</span>
                                <span class="wawi-journal-amt">${wawiFormatCurrency(e.amount)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${!isDeleted ? `
                <div class="wawi-journal-actions no-print">
                    <button class="wawi-journal-action-btn wawi-storno-btn" onclick="wawiStornoBooking(${entry.id})" title="Stornieren">🗑️</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Simple entry rendering (backward compatible)
    let dId, cId, amt, dName, cName;
    if (entry.debit && typeof entry.debit === 'object') {
        dId = entry.debit.accountId;
        cId = entry.credit.accountId;
        amt = entry.debit.amount;
        dName = entry.debit.accountName || wawiGetAccountName(dId);
        cName = entry.credit.accountName || wawiGetAccountName(cId);
    } else {
        dId = entry.debitAccountId || '?';
        cId = entry.creditAccountId || '?';
        amt = entry.amount || 0;
        dName = wawiGetAccountName(dId);
        cName = wawiGetAccountName(cId);
    }

    let txTypeStr = '';
    const scenario = wawiGetScenario();
    const debitAcc = scenario.accounts.find(a => a.id === dId);
    const creditAcc = scenario.accounts.find(a => a.id === cId);

    if (debitAcc && creditAcc) {
        if (debitAcc.type === 'aktiv' && creditAcc.type === 'aktiv') txTypeStr = 'Aktivtausch';
        else if (debitAcc.type === 'passiv' && creditAcc.type === 'passiv') txTypeStr = 'Passivtausch';
        else if (debitAcc.type === 'aktiv' && creditAcc.type === 'passiv') txTypeStr = 'Aktiv-Passiv-Mehrung';
        else if (debitAcc.type === 'passiv' && creditAcc.type === 'aktiv') txTypeStr = 'Aktiv-Passiv-Minderung';
    }

    return `
        <div class="wawi-journal-card ${isDeleted ? 'wawi-journal-card-storniert' : ''}">
            <div class="wawi-journal-header">
                <div class="wawi-journal-id">#${entry.id}</div>
                <div class="wawi-journal-time">
                    ${new Date(entry.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    ${isEdited ? `
                        <span class="wawi-audit-icon" title="Ursprüngliche Buchung anzeigen" onclick="wawiShowHistoryPopup(${entry.id})">
                            ⚠️
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="wawi-journal-desc">
                ${entry.description} 
                ${isDeleted ? '<span class="wawi-storno-label">(Storniert)</span>' : ''}
                ${txTypeStr ? `<span style="font-size: 0.7rem; color: var(--fly-orange); margin-left: 0.5rem; background: rgba(243, 156, 18, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(243, 156, 18, 0.3);">${txTypeStr}</span>` : ''}
                ${modeBadge}
                ${solutionBadge}
            </div>
            <div class="wawi-journal-booking" style="display: flex; flex-direction: row; align-items: flex-start; gap: 1rem; width: 100%;">
                <div style="display:flex; flex-direction:column; gap:2px; flex: 1;">
                    <div class="wawi-journal-side wawi-journal-soll">
                        <span class="wawi-journal-acc">${dId} ${dName}</span>
                        <span class="wawi-journal-amt">${wawiFormatCurrency(amt)}</span>
                    </div>
                </div>
                <div class="wawi-journal-divider" style="padding-top: 0.5rem;">an</div>
                <div style="display:flex; flex-direction:column; gap:2px; flex: 1;">
                    <div class="wawi-journal-side wawi-journal-haben">
                        <span class="wawi-journal-acc">${cId} ${cName}</span>
                        <span class="wawi-journal-amt">${wawiFormatCurrency(amt)}</span>
                    </div>
                </div>
            </div>
            
            ${!isDeleted ? `
            <div class="wawi-journal-actions no-print">
                <button class="wawi-journal-action-btn wawi-edit-btn" onclick="wawiShowEditBookingModal(${entry.id})" title="Bearbeiten">✎</button>
                <button class="wawi-journal-action-btn wawi-storno-btn" onclick="wawiStornoBooking(${entry.id})" title="Stornieren">🗑️</button>
            </div>
            ` : ''}
        </div>
    `;
}


// --- Procurement Module ---
function wawiRenderProcurement(container) {
    const scenario = wawiGetScenario();
    const bankBalance = wawiGetAccountBalance('1200');
    const debt = wawiGetAccountBalance('4400');

    container.innerHTML = `
        <div class="wawi-procurement">
            <div class="wawi-section-header">
                <h3>🛒 Beschaffung & Nachbestellung</h3>
                <div class="wawi-section-sub">Bestelle Material nach, um die Produktion am Laufen zu halten.</div>
            </div>

            <!-- Liquidity Info -->
            <div class="wawi-liquidity-card">
                <div class="wawi-liquidity-row">
                    <span>🏦 Bankbestand:</span>
                    <span class="wawi-liquidity-val">${wawiFormatCurrency(bankBalance)}</span>
                </div>
                <div class="wawi-liquidity-row">
                    <span>💳 Offene Verbindlichkeiten:</span>
                    <span class="wawi-liquidity-val ${debt > 0 ? 'wawi-debt' : ''}">${wawiFormatCurrency(debt)}</span>
                </div>
                ${debt > 0 ? `
                <button class="wawi-btn wawi-btn-sm wawi-btn-outline" onclick="wawiHandlePayLiabilities()" style="margin-top: 0.75rem; width: 100%;">
                    💳 Verbindlichkeiten begleichen
                </button>
                ` : ''}
            </div>

            <!-- Order Cards -->
            <div class="wawi-order-grid">
                ${[...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe].map(part => {
        const stock = WaWiState.stock[part.id] || 0;
        const reorder = scenario.reorderPoints[part.id] || 0;
        const suggestedQty = scenario.orderQuantities[part.id] || 10;
        const status = wawiGetStockStatus(part.id);
        const totalCost = suggestedQty * part.unitPrice;
        const kasseBalance = wawiGetAccountBalance('1000');

        return `
                    <div class="wawi-order-card wawi-stock-${status}">
                        <div class="wawi-order-header">
                            <span class="wawi-order-icon">${part.icon}</span>
                            <span class="wawi-order-name">${part.name}</span>
                            <span class="wawi-stock-status-dot wawi-dot-${status}"></span>
                        </div>
                        <div class="wawi-order-stock">
                            Bestand: <strong>${stock}</strong> / ${scenario.maxStock ? (scenario.maxStock[part.id] || '∞') : '∞'} ${part.unit}
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                                Meldebestand: ${reorder} · Kapazität frei: ${Math.max(0, (scenario.maxStock ? scenario.maxStock[part.id] : 9999) - stock)}
                            </div>
                        </div>
                        <div class="wawi-order-form-row">
                            <label class="wawi-order-label">Menge:</label>
                            <div class="wawi-qty-control">
                                <button class="wawi-qty-btn" onclick="wawiAdjustQty('${part.id}', -1)">−</button>
                                <input type="number" id="wawi-qty-${part.id}" class="wawi-qty-input"
                                    value="${suggestedQty}" min="1" 
                                    max="${Math.min(
                                        scenario.maxOrderQuantities ? (scenario.maxOrderQuantities[part.id] || 999) : 999,
                                        Math.max(0, (scenario.maxStock ? scenario.maxStock[part.id] : 9999) - stock)
                                    )}" 
                                    step="1"
                                    onchange="wawiUpdateOrderPreview('${part.id}')">
                                <button class="wawi-qty-btn" onclick="wawiAdjustQty('${part.id}', 1)">+</button>
                            </div>
                        </div>
                        <div class="wawi-order-preview" id="wawi-preview-${part.id}">
                            Preis: ${wawiFormatCurrency(part.unitPrice)}/${part.unit} ·
                            Gesamt: <strong>${wawiFormatCurrency(totalCost)}</strong>
                        </div>

                        <!-- Payment toggles -->
                        <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.8rem; color:var(--text-muted); font-weight:600;">Zahlungsart wählen:</label>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                                <button class="wawi-btn wawi-btn-sm wawi-btn-outline wawi-pay-toggle" id="wawi-pay-bank-${part.id}" 
                                    onclick="wawiTogglePayMethod('${part.id}', 'bank')"
                                    style="flex:1; min-width:60px;">🏦 Bank</button>
                                <button class="wawi-btn wawi-btn-sm wawi-btn-outline wawi-pay-toggle" id="wawi-pay-kasse-${part.id}" 
                                    onclick="wawiTogglePayMethod('${part.id}', 'kasse')"
                                    style="flex:1; min-width:60px;">💵 Bar</button>
                                <button class="wawi-btn wawi-btn-sm wawi-btn-outline wawi-pay-toggle" id="wawi-pay-kredit-${part.id}" 
                                    onclick="wawiTogglePayMethod('${part.id}', 'kredit')"
                                    style="flex:1; min-width:60px;">💳 Ziel</button>
                            </div>
                            <div id="wawi-pay-amounts-${part.id}" style="display:flex; flex-direction:column; gap:0.4rem;"></div>
                            <div id="wawi-pay-rest-${part.id}" style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;"></div>
                        </div>

                        <div class="wawi-order-actions" style="margin-top: 0.75rem;">
                            <button class="wawi-btn wawi-btn-primary wawi-btn-sm" style="width:100%;"
                                onclick="wawiHandleOrder('${part.id}')">
                                🛒 Kaufen
                            </button>
                        </div>
                    </div>`;
    }).join('')}
             </div>


         </div>
     `;
}


// =============================================================================
// SECTION 6: EVENT HANDLERS
// =============================================================================

function wawiExportToPDF() {
    wawiShowToast('Druckdialog wird vorbereitet...', 'info');
    
    const scenario = wawiGetScenario();
    
    // 1. Prepare print container
    let printContainer = document.getElementById('wawi-print-container');
    if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'wawi-print-container';
        document.body.appendChild(printContainer);
    }
    
    // 2. Generate Content
    const originalFibuMode = wawiFibuMode;
    const originalAccountingView = wawiAccountingView;
    const tempDiv = document.createElement('div');
    
    const getSnapshot = (mode, view) => {
        wawiFibuMode = mode;
        wawiAccountingView = view;
        wawiRenderAccounting(tempDiv);
        const section = tempDiv.querySelector('.wawi-accounts-section, .wawi-tkonten-section, .wawi-journal-section');
        return section ? section.outerHTML : '';
    };

    let html = `
        <div class="wawi-print-header">
            <h1>${scenario.company} - Buchhaltungsabschluss</h1>
            <p>Berichtsdatum: ${new Date().toLocaleDateString('de-DE')} | ${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        
        <div class="wawi-print-section">
            <h2>1. Bilanz & Übersicht</h2>
            ${getSnapshot('buchhaltung', 'overview')}
        </div>
        
        <div class="wawi-print-section" style="page-break-before: always;">
            <h2>2. T-Konten</h2>
            ${getSnapshot('buchhaltung', 'tkonten')}
        </div>
        
        <div class="wawi-print-section" style="page-break-before: always;">
            <h2>3. Buchungsjournal</h2>
            ${getSnapshot('buchhaltung', 'journal')}
        </div>
    `;

    printContainer.innerHTML = html;
    
    // Restore state
    wawiFibuMode = originalFibuMode;
    wawiAccountingView = originalAccountingView;
    renderWarenwirtschaft();
    
    // 3. Trigger Print
    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
                    String(now.getMonth() + 1).padStart(2, '0') + "-" + 
                    String(now.getDate()).padStart(2, '0') + "_" + 
                    String(now.getHours()).padStart(2, '0') + "-" + 
                    String(now.getMinutes()).padStart(2, '0');
    
    const originalTitle = document.title;
    document.title = `Buchhaltungstrainer_${timestamp}`;
    
    setTimeout(() => {
        window.print();
        // Restore title after a short delay to ensure print dialog picked it up
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    }, 500);
}



function wawiHandleOrderImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Ungültiges XML Format");
            }

            const orders = xmlDoc.querySelectorAll("Order");
            if (orders.length === 0) {
                throw new Error("Keine Aufträge im XML gefunden (Tag <Order> fehlt)");
            }

            let importedCount = 0;
            orders.forEach(orderNode => {
                const id = orderNode.getAttribute("id") || `IMP-${Date.now()}-${importedCount}`;
                const customer = orderNode.querySelector("Customer")?.textContent || "Externer Kunde";
                const qty = parseInt(orderNode.querySelector("Quantity")?.textContent || "1", 10);
                const price = parseFloat(orderNode.querySelector("Price")?.textContent || "0");
                
                if (!WaWiState.orders.find(o => o.id === id)) {
                    WaWiState.orders.push({
                        id, customer, qty, price, status: 'open'
                    });
                    importedCount++;
                }
            });

            wawiSaveState();
            renderWarenwirtschaft();
            wawiShowToast(`${importedCount} neue Aufträge erfolgreich importiert!`, 'success');
            event.target.value = ''; // Reset input

        } catch (error) {
            console.error("Order Import Error:", error);
            wawiShowToast(`Import-Fehler: ${error.message}`, 'danger');
        }
    };
    reader.readAsText(file);
}


function wawiHandleScenarioChange(scenarioId) {
    if (confirm(`Szenario wechseln zu "${WAWI_SCENARIOS.find(s => s.id === scenarioId)?.name}"?\n\nAchtung: Der aktuelle Fortschritt geht verloren!`)) {
        wawiSwitchScenario(scenarioId);
        renderWarenwirtschaft();
    } else {
        // Revert select
        document.getElementById('wawi-scenario-select').value = WaWiState.activeScenario;
    }
}

function wawiHandleReset() {
    if (confirm('Szenario wirklich zurücksetzen?\n\nAlle Lagerbestände, Konten und Buchungen werden auf den Anfangszustand zurückgesetzt.')) {
        wawiResetState();
        renderWarenwirtschaft();
        wawiShowToast('Szenario wurde zurückgesetzt.', 'info');
    }
}

function wawiHandleAssemble(partId) {
    const result = wawiAssemblePart(partId);
    if (result.success) {
        wawiShowToast(result.message, 'success');
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandleFinishProduct() {
    const result = wawiFinishProduct();
    if (result.success) {
        wawiShowToast(result.message, 'success');
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandleSell(method) {
    const result = wawiSellProduct(method);
    if (result.success) {
        wawiShowToast(result.message, 'success');
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandleFulfillOrder(orderId, method) {
    const result = wawiSellProduct(method, orderId);
    if (result.success) {
        wawiShowToast(result.message, 'success');

        // Auto-generate a new order after success (to keep simulator going)
        setTimeout(() => {
            if (WaWiState.orders.filter(o => o.status === 'open').length < 1) {
                wawiGenerateNewOrder();
            }
        }, 3000);
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandleCreateManualOrder() {
    const customer = document.getElementById('wawi-manual-customer')?.value.trim();
    const qty = parseInt(document.getElementById('wawi-manual-qty')?.value || '0', 10);

    if (!customer) {
        wawiShowToast('Bitte einen Kundennamen eingeben.', 'error');
        return;
    }
    if (isNaN(qty) || qty <= 0) {
        wawiShowToast('Bitte eine gültige Menge eingeben.', 'error');
        return;
    }

    const price = wawiGetDiscountedPrice(qty);
    const id = `ORD-${200 + WaWiState.orders.length + 1}`; // Start at 200 for manual ones

    WaWiState.orders.push({ id, customer, qty, status: 'open', price });
    wawiSaveState();
    renderWarenwirtschaft();
    wawiShowToast(`Manueller Auftrag für ${customer} erstellt!`, 'success');
}

// Payment toggle state per part (in-memory only, not persisted)
const wawiPayToggles = {};

function wawiTogglePayMethod(partId, method) {
    if (!wawiPayToggles[partId]) wawiPayToggles[partId] = {};
    wawiPayToggles[partId][method] = !wawiPayToggles[partId][method];

    // Update button visual
    const btn = document.getElementById(`wawi-pay-${method}-${partId}`);
    if (btn) {
        if (wawiPayToggles[partId][method]) {
            btn.style.background = 'var(--primary)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'var(--primary)';
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    }

    wawiUpdatePayAmounts(partId);
}

function wawiUpdatePayAmounts(partId) {
    const container = document.getElementById(`wawi-pay-amounts-${partId}`);
    const restEl = document.getElementById(`wawi-pay-rest-${partId}`);
    if (!container) return;

    const active = wawiPayToggles[partId] || {};
    const methods = ['bank', 'kasse', 'kredit'].filter(m => active[m]);

    const scenario = wawiGetScenario();
    const allMaterials = [...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe];
    const part = allMaterials.find(p => p.id === partId);
    const qty = parseInt(document.getElementById(`wawi-qty-${partId}`)?.value || '0', 10);
    const totalCost = qty * (part ? part.unitPrice : 0);

    const labels = { bank: '🏦 Bank', kasse: '💵 Bar', kredit: '💳 Ziel' };

    if (methods.length === 0) {
        container.innerHTML = '';
        if (restEl) restEl.innerHTML = '';
        return;
    }

    if (methods.length === 1) {
        // Single method: full amount, no input needed
        container.innerHTML = `<div style="font-size:0.85rem; color:var(--text-main);">${labels[methods[0]]}: <strong>${wawiFormatCurrency(totalCost)}</strong></div>`;
        if (restEl) restEl.innerHTML = '';
        return;
    }

    // Multiple methods: show amount inputs
    container.innerHTML = methods.map(m => `
        <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:0.8rem; min-width:60px;">${labels[m]}:</span>
            <input type="number" id="wawi-payamt-${m}-${partId}" class="wawi-input" 
                style="width:100px; height:30px; font-size:0.85rem; padding:0 0.4rem;" 
                min="0" step="0.01" value="0"
                oninput="wawiCalcPayRest('${partId}')">
        </div>
    `).join('');

    if (restEl) restEl.innerHTML = `Restbetrag: <strong>${wawiFormatCurrency(totalCost)}</strong>`;
}

function wawiCalcPayRest(partId) {
    const active = wawiPayToggles[partId] || {};
    const methods = ['bank', 'kasse', 'kredit'].filter(m => active[m]);

    const scenario = wawiGetScenario();
    const allMaterials = [...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe];
    const part = allMaterials.find(p => p.id === partId);
    const qty = parseInt(document.getElementById(`wawi-qty-${partId}`)?.value || '0', 10);
    const totalCost = qty * (part ? part.unitPrice : 0);

    let assigned = 0;
    for (const m of methods) {
        assigned += parseFloat(document.getElementById(`wawi-payamt-${m}-${partId}`)?.value || '0');
    }
    const rest = totalCost - assigned;

    const restEl = document.getElementById(`wawi-pay-rest-${partId}`);
    if (restEl) {
        restEl.innerHTML = `Restbetrag: <strong style="color:${Math.abs(rest) < 0.01 ? 'var(--success)' : 'var(--danger)'};">${wawiFormatCurrency(rest)}</strong>`;
    }
}

function wawiHandleOrder(partId) {
    const qtyInput = document.getElementById(`wawi-qty-${partId}`);
    const qty = parseInt(qtyInput?.value || '0', 10);
    if (qty <= 0) {
        wawiShowToast('Bitte eine gültige Bestellmenge eingeben.', 'error');
        return;
    }

    const active = wawiPayToggles[partId] || {};
    const methods = ['bank', 'kasse', 'kredit'].filter(m => active[m]);

    if (methods.length === 0) {
        wawiShowToast('Bitte mindestens eine Zahlungsart auswählen.', 'error');
        return;
    }

    const scenario = wawiGetScenario();
    const allMaterials = [...scenario.bom, ...scenario.hilfsstoffe, ...scenario.betriebsstoffe];
    const part = allMaterials.find(p => p.id === partId);
    const totalCost = qty * part.unitPrice;

    let payments;
    if (methods.length === 1) {
        payments = [{ method: methods[0], amount: totalCost }];
    } else {
        payments = methods.map(m => ({
            method: m,
            amount: parseFloat(document.getElementById(`wawi-payamt-${m}-${partId}`)?.value || '0')
        })).filter(p => p.amount > 0);
    }

    const result = wawiOrderMaterial(partId, qty, payments);
    if (result.success) {
        wawiShowToast(result.message, 'success');
        // Reset toggles
        wawiPayToggles[partId] = {};
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandlePayLiabilities() {
    const result = wawiPayLiabilities();
    if (result.success) {
        wawiShowToast(result.message, 'success');
    } else {
        wawiShowToast(result.message, 'error');
    }
    renderWarenwirtschaft();
}

function wawiHandleFinancePayment(transactionId, method) {
    const transaction = WaWiState.financeTransactions.find(t => t.id === transactionId);
    if (!transaction) {
        wawiShowToast('Geschäftsvorfall nicht gefunden', 'error');
        return;
    }

    const inputId = `wawi-finance-amt-${transactionId}`;
    const amount = parseFloat(document.getElementById(inputId)?.value || '0');
    if (isNaN(amount) || amount <= 0) {
        wawiShowToast('Ungültiger Betrag', 'error');
        return;
    }

    if (amount > transaction.remainingAmount) {
        wawiShowToast('Betrag übersteigt den offenen Saldo dieser Rechnung', 'error');
        return;
    }

    const type = transaction.type; // 'forderung' or 'verbindlichkeit'
    const accountId = type === 'forderung' ? '2400' : '4400';
    let liquidId = '1200';
    if (method === 'kasse') liquidId = '1000';
    if (method === 'darlehen') liquidId = '4250';



    if (type === 'verbindlichkeit') {
        if (method !== 'darlehen') {
            const liquidBalance = wawiGetAccountBalance(liquidId);
            if (amount > liquidBalance) {
                wawiShowToast('Nicht genug Guthaben', 'error');
                return;
            }
        }
        const descStr = method === 'darlehen'
            ? `Umschuldung ${transaction.description} in Bankdarlehen`
            : `Begleichung ${transaction.description} (per ${method})`;

        wawiPostBooking(descStr, '4400', liquidId, amount);
    } else {
        wawiPostBooking(`Zahlungseingang ${transaction.description} (per ${method})`, liquidId, '2400', amount);
    }

    transaction.remainingAmount -= amount;
    wawiSaveState();

    wawiShowToast('Zahlung erfolgreich verbucht', 'success');
    renderWarenwirtschaft();
}

function wawiHandleDarlehenUmbuchung() {
    const amount = parseFloat(document.getElementById('wawi-finance-darlehen-amt')?.value || '0');
    if (isNaN(amount) || amount <= 0) {
        wawiShowToast('Ungültiger Betrag', 'error');
        return;
    }

    const verbindlichkeiten = Math.abs(wawiGetAccountBalance('4400'));
    if (amount > verbindlichkeiten) {
        wawiShowToast('Betrag übersteigt offene Verbindlichkeiten', 'error');
        return;
    }

    wawiPostBooking('Umschuldung Verbindlichkeiten in Darlehen', '4400', '4250', amount);

    wawiShowToast('Umbuchung erfolgreich', 'success');
    renderWarenwirtschaft();
}

function wawiAdjustQty(partId, delta) {
    const input = document.getElementById(`wawi-qty-${partId}`);
    if (!input) return;
    let val = parseInt(input.value || '0', 10) + delta;
    if (val < 1) val = 1;
    input.value = val;
    wawiUpdateOrderPreview(partId);
}

function wawiUpdateOrderPreview(partId) {
    const scenario = wawiGetScenario();
    const part = scenario.bom.find(p => p.id === partId);
    const qtyInput = document.getElementById(`wawi-qty-${partId}`);
    const preview = document.getElementById(`wawi-preview-${partId}`);
    if (!part || !qtyInput || !preview) return;

    const qty = parseInt(qtyInput.value || '0', 10);
    const totalCost = qty * part.unitPrice;

    preview.innerHTML = `
        Preis: ${wawiFormatCurrency(part.unitPrice)}/${part.unit} ·
        Gesamt: <strong>${wawiFormatCurrency(totalCost)}</strong>
    `;
}


// Corrected Booking Modal
function wawiShowEditBookingModal(id) {
    const entry = WaWiState.journal.find(e => e.id === id);
    if (!entry) return;

    const scenario = wawiGetScenario();
    const modalId = 'wawi-edit-modal';

    // Remove if exists
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const accounts = scenario.accounts;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'wawi-modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';

    modal.innerHTML = `
        <div class="wawi-modal-content" style="background:var(--bg-color); color:var(--text-main); padding:2rem; border-radius:1.5rem; max-width:500px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); border:2px solid var(--primary);">
            <h2 style="margin-bottom:1.5rem;">Buchungssatz korrigieren</h2>
            
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="wawi-form-group">
                    <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; color:var(--text-muted);">Buchungstext</label>
                    <input type="text" id="edit-desc" class="wawi-input" value="${entry.description}">
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="wawi-form-group">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; color:var(--text-muted);">Soll-Konto</label>
                        <select id="edit-debit" class="wawi-input">
                            ${accounts.map(acc => `<option value="${acc.id}" ${acc.id === entry.debit.accountId ? 'selected' : ''}>${acc.id} ${acc.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="wawi-form-group">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; color:var(--text-muted);">Haben-Konto</label>
                        <select id="edit-credit" class="wawi-input">
                            ${accounts.map(acc => `<option value="${acc.id}" ${acc.id === entry.credit.accountId ? 'selected' : ''}>${acc.id} ${acc.name}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="wawi-form-group">
                    <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; color:var(--text-muted);">Betrag (€)</label>
                    <input type="number" id="edit-amt" class="wawi-input" value="${entry.debit.amount}" step="0.01">
                </div>

                <div style="margin-top:1rem; display:flex; gap:1rem; justify-content:flex-end;">
                    <button class="wawi-btn wawi-btn-outline" onclick="document.getElementById('${modalId}').remove()">Abbrechen</button>
                    <button class="wawi-btn" id="save-edit-btn">Speichern</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('save-edit-btn').onclick = () => {
        const newData = {
            description: document.getElementById('edit-desc').value,
            debitAccountId: document.getElementById('edit-debit').value,
            creditAccountId: document.getElementById('edit-credit').value,
            amount: parseFloat(document.getElementById('edit-amt').value)
        };

        if (newData.amount <= 0 || isNaN(newData.amount)) {
            wawiShowToast('Bitte einen gültigen Betrag eingeben.', 'error');
            return;
        }

        wawiCorrectBooking(id, newData);
        modal.remove();
    };
}

function wawiShowHistoryPopup(id) {
    const entry = WaWiState.journal.find(e => e.id === id);
    if (!entry || !entry.originalData) return;

    const modalId = 'wawi-history-modal';
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const orig = entry.originalData;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'wawi-modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10001;padding:20px;';

    modal.innerHTML = `
        <div class="wawi-modal-content" style="background:var(--bg-color); color:var(--text-main); padding:2rem; border-radius:1.5rem; max-width:450px; width:100%; border:2px solid var(--primary);">
            <h3 style="margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
                <span>⚠️ Ursprüngliche Buchung</span>
            </h3>
            
            <div style="background:rgba(255,255,255,0.03); padding:1.25rem; border-radius:1rem; border:1px solid var(--card-border);">
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">Original-Text:</div>
                <div style="margin-bottom:1.25rem; font-weight:600;">${orig.description}</div>
                
                <div style="display:flex; flex-direction:column; gap:0.5rem; font-family: monospace; font-size:0.9rem;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${orig.debit.accountId} ${orig.debit.accountName}</span>
                        <span>${wawiFormatCurrency(orig.debit.amount)}</span>
                    </div>
                    <div style="text-align:center; color:var(--primary); font-weight:700;">an</div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>${orig.credit.accountId} ${orig.credit.accountName}</span>
                        <span>${wawiFormatCurrency(orig.credit.amount)}</span>
                    </div>
                </div>
            </div>

            <p style="margin-top:1.5rem; font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
                Hinweis: Gemäß GoB bleiben alle Änderungen an Buchungssätzen nachvollziehbar dokumentiert.
            </p>

            <div style="margin-top:2rem; display:flex; justify-content:center;">
                <button class="wawi-btn" onclick="document.getElementById('${modalId}').remove()">Schließen</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}


// =============================================================================
// SECTION 6.5: ANLAGENMANAGEMENT (ASSET MANAGEMENT)
// =============================================================================

function wawiPurchaseAsset(name, category, usefulLife, cost, payments) {
    if (!name || name.trim() === '') {
        return { success: false, message: 'Bitte geben Sie einen Namen für das Anlagegut ein.' };
    }
    if (!category || !['0510', '0700', '0840', '0860'].includes(category)) {
        return { success: false, message: 'Ungültige Kategorie.' };
    }
    usefulLife = parseInt(usefulLife);
    if (isNaN(usefulLife) || usefulLife <= 0) {
        return { success: false, message: 'Die Nutzungsdauer muss eine positive Zahl sein.' };
    }
    cost = parseFloat(cost);
    if (isNaN(cost) || cost <= 0) {
        return { success: false, message: 'Die Anschaffungskosten müssen größer als 0 sein.' };
    }
    if (!Array.isArray(payments) || payments.length === 0) {
        return { success: false, message: 'Bitte mindestens eine Zahlungsart angeben.' };
    }

    const validPurchaseAccounts = ['1200', '1000', '4400', '4250'];
    for (const p of payments) {
        if (!validPurchaseAccounts.includes(p.account)) {
            return { success: false, message: `Ungültiges Zahlungskonto: ${p.account}` };
        }
        if (isNaN(p.amount) || p.amount <= 0) {
            return { success: false, message: 'Alle Zahlungsbeträge müssen positiv sein.' };
        }
    }

    const mode = WaWiState.difficulty || 'advanced';
    let grossCost = cost;
    if (mode === 'pro') {
        grossCost = Math.round(cost * 1.19 * 100) / 100;
    }

    const totalPayments = Math.round(payments.reduce((s, p) => s + p.amount, 0) * 100) / 100;
    if (Math.abs(totalPayments - grossCost) > 0.02) {
        return { success: false, message: `Die Summe der Zahlungen (${wawiFormatCurrency(totalPayments)}) stimmt nicht mit dem ${mode === 'pro' ? 'Brutto-' : ''}Betrag (${wawiFormatCurrency(grossCost)}) überein.` };
    }

    for (const p of payments) {
        if (p.account === '1200' && wawiGetAccountBalance('1200') < p.amount) {
            return { success: false, message: `Nicht genügend Bankguthaben! Verfügbar: ${wawiFormatCurrency(wawiGetAccountBalance('1200'))}` };
        }
        if (p.account === '1000' && wawiGetAccountBalance('1000') < p.amount) {
            return { success: false, message: `Nicht genügend Kassenbestand! Verfügbar: ${wawiFormatCurrency(wawiGetAccountBalance('1000'))}` };
        }
    }

    wawiBackupState();

    const catName = category === '0510' ? 'Gebäude' : (category === '0700' ? 'Technische Anlagen und Maschinen' : (category === '0840' ? 'Fuhrpark' : 'BGA'));
    const desc = `Kauf: Anschaffung ${name} (${catName})`;

    const entries = [];
    entries.push({ side: 'soll', accountId: category, amount: cost });
    if (mode === 'pro') {
        const vat = Math.round(cost * 0.19 * 100) / 100;
        entries.push({ side: 'soll', accountId: '2600', amount: vat });
    }
    for (const p of payments) {
        entries.push({ side: 'haben', accountId: p.account, amount: p.amount });
    }

    wawiPostCompoundBooking(desc, entries);

    const newAsset = {
        id: 'AST-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: name,
        category: category,
        purchaseCost: cost,
        purchaseDate: new Date().toISOString().split('T')[0],
        usefulLife: usefulLife,
        currentBookValue: cost,
        isSold: false
    };

    if (!WaWiState.assets) WaWiState.assets = [];
    WaWiState.assets.push(newAsset);

    for (const p of payments) {
        if (p.account === '4400' || p.account === '4250') {
            WaWiState.financeTransactions.push({
                id: 'FT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'verbindlichkeit',
                date: new Date().toISOString(),
                description: `Kauf von ${name} (${catName})`,
                originalAmount: p.amount,
                remainingAmount: p.amount
            });
        }
    }

    wawiSaveState();
    return { success: true, message: `Anlagegut "${name}" erfolgreich angeschafft!` };
}

function wawiSellAsset(assetId, netSalePrice, payments) {
    if (!WaWiState.assets) return { success: false, message: 'Keine Anlagegüter vorhanden.' };
    const asset = WaWiState.assets.find(a => a.id === assetId);
    if (!asset) return { success: false, message: 'Anlagegut nicht gefunden.' };
    if (asset.isSold) return { success: false, message: 'Dieses Anlagegut wurde bereits verkauft.' };

    netSalePrice = parseFloat(netSalePrice);
    if (isNaN(netSalePrice) || netSalePrice < 0) {
        return { success: false, message: 'Der Verkaufspreis muss eine nicht-negative Zahl sein.' };
    }

    // Im Anfängermodus: Verkauf immer zu Anschaffungskosten
    const mode = WaWiState.difficulty || 'advanced';
    if (mode === 'beginner') {
        netSalePrice = asset.purchaseCost;
    }
    if (!Array.isArray(payments) || payments.length === 0) {
        return { success: false, message: 'Bitte mindestens eine Zahlungsart angeben.' };
    }

    const validSaleAccounts = ['1200', '1000', '2400'];
    for (const p of payments) {
        if (!validSaleAccounts.includes(p.account)) {
            return { success: false, message: `Ungültiges Zahlungskonto: ${p.account}` };
        }
        if (isNaN(p.amount) || p.amount <= 0) {
            return { success: false, message: 'Alle Zahlungsbeträge müssen positiv sein.' };
        }
    }

    const currentBookValue = asset.currentBookValue;
    const gain = netSalePrice - currentBookValue;

    let grossPrice = netSalePrice;
    let taxAmount = 0;
    if (mode === 'pro') {
        grossPrice = Math.round(netSalePrice * 1.19 * 100) / 100;
        taxAmount = Math.round(netSalePrice * 0.19 * 100) / 100;
    }

    const totalPayments = Math.round(payments.reduce((s, p) => s + p.amount, 0) * 100) / 100;
    if (Math.abs(totalPayments - grossPrice) > 0.02) {
        return { success: false, message: `Die Summe der Zahlungen (${wawiFormatCurrency(totalPayments)}) stimmt nicht mit dem ${mode === 'pro' ? 'Brutto-' : ''}Verkaufspreis (${wawiFormatCurrency(grossPrice)}) überein.` };
    }

    wawiBackupState();

    const desc = `Verkauf: Abgang ${asset.name}`;

    const entries = [];
    // Soll-Seite: Zahlungseingang (alle Zahlungskonten)
    for (const p of payments) {
        entries.push({ side: 'soll', accountId: p.account, amount: p.amount });
    }

    // Verlust (Soll)
    if (gain < 0) {
        const lossAcc = mode === 'beginner' ? '3000' : '6960';
        entries.push({ side: 'soll', accountId: lossAcc, amount: Math.round(Math.abs(gain) * 100) / 100 });
    }

    // Haben-Seite: Anlagekonto (Buchwert-Abgang)
    entries.push({ side: 'haben', accountId: asset.category, amount: currentBookValue });

    // Gewinn (Haben)
    if (gain > 0) {
        const gainAcc = mode === 'beginner' ? '3000' : '5460';
        entries.push({ side: 'haben', accountId: gainAcc, amount: Math.round(gain * 100) / 100 });
    }

    // Umsatzsteuer (Haben, nur Pro)
    if (mode === 'pro' && taxAmount > 0) {
        entries.push({ side: 'haben', accountId: '4800', amount: taxAmount });
    }

    wawiPostCompoundBooking(desc, entries);

    asset.isSold = true;
    asset.currentBookValue = 0;
    asset.sellPrice = netSalePrice;
    asset.sellDate = new Date().toISOString().split('T')[0];

    for (const p of payments) {
        if (p.account === '2400') {
            WaWiState.financeTransactions.push({
                id: 'FT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'forderung',
                date: new Date().toISOString(),
                description: `Verkauf von ${asset.name}`,
                originalAmount: p.amount,
                remainingAmount: p.amount
            });
        }
    }

    wawiSaveState();
    return { success: true, message: `Anlagegut "${asset.name}" erfolgreich verkauft!` };
}

function wawiGetDepreciationProjections() {
    const projections = [];
    if (!WaWiState.assets) return projections;

    const currentYearStr = new Date().getFullYear().toString();

    for (const asset of WaWiState.assets) {
        if (asset.isSold) continue;
        if (asset.currentBookValue <= 1.00) continue;

        let annualDepr = asset.purchaseCost / asset.usefulLife;
        let calculatedDepr = annualDepr;

        if (asset.purchaseDate && asset.purchaseDate.startsWith(currentYearStr)) {
            const dateObj = new Date(asset.purchaseDate);
            const month = dateObj.getMonth() + 1;
            const months = 13 - month;
            calculatedDepr = annualDepr * (months / 12);
        }

        const maxAllowed = asset.currentBookValue - 1.00;
        let actualDepr = calculatedDepr;
        if (actualDepr > maxAllowed) {
            actualDepr = maxAllowed;
        }

        if (actualDepr > 0) {
            projections.push({
                assetId: asset.id,
                name: asset.name,
                category: asset.category,
                purchaseCost: asset.purchaseCost,
                currentBookValue: asset.currentBookValue,
                depreciation: Math.round(actualDepr * 100) / 100
            });
        }
    }
    return projections;
}

function wawiDepreciateAssets() {
    const mode = WaWiState.difficulty || 'advanced';
    if (mode === 'beginner') {
        return { success: false, message: 'Abschreibungen sind erst ab dem Wissensniveau "Fortgeschritten" verfügbar.' };
    }
    if (WaWiState.depreciationBooked) {
        return { success: false, message: 'Die Abschreibungen für dieses Jahr wurden bereits gebucht.' };
    }

    const projections = wawiGetDepreciationProjections();
    if (projections.length === 0) {
        return { success: false, message: 'Keine abschreibungsfähigen Anlagegüter vorhanden.' };
    }

    wawiBackupState();

    for (const proj of projections) {
        const asset = WaWiState.assets.find(a => a.id === proj.assetId);
        if (!asset) continue;

        asset.currentBookValue = Math.round((asset.currentBookValue - proj.depreciation) * 100) / 100;

        const desc = `AfA: Lineare Abschreibung für ${asset.name}`;
        wawiPostBooking(desc, '6520', asset.category, proj.depreciation);
    }

    WaWiState.depreciationBooked = true;
    wawiSaveState();

    return { success: true, message: `Abschreibungen für ${projections.length} Anlagegüter erfolgreich gebucht!` };
}

function wawiAddPaymentRow(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputStyle = 'padding:0.5rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.85rem;';
    const row = document.createElement('div');
    row.className = 'wawi-payment-row';
    row.style.cssText = 'display:flex; gap:0.5rem; align-items:center; margin-top:0.5rem;';

    let options = '';
    if (type === 'purchase') {
        options = '<option value="1200">🏦 Bank (1200)</option><option value="1000">💵 Kasse (1000)</option><option value="4400">📋 Verb. a.L.L. (4400)</option><option value="4250">🏛️ Bankdarlehen (4250)</option>';
    } else {
        options = '<option value="1200">🏦 Bank (1200)</option><option value="1000">💵 Kasse (1000)</option><option value="2400">📋 Ford. a.L.L. (2400)</option>';
    }

    row.innerHTML = `
        <select class="wawi-pay-account" style="flex:1; ${inputStyle}">${options}</select>
        <input type="number" class="wawi-pay-amount" placeholder="Betrag" step="0.01" min="0" style="width:90px; ${inputStyle}">
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:hsl(0,70%,60%); cursor:pointer; font-size:1.1rem; padding:0.2rem 0.4rem;" title="Entfernen">✕</button>
    `;
    container.appendChild(row);
}

function wawiCollectPayments(containerId) {
    const rows = document.querySelectorAll(`#${containerId} .wawi-payment-row`);
    const payments = [];
    rows.forEach(row => {
        const account = row.querySelector('.wawi-pay-account')?.value;
        const amount = parseFloat(row.querySelector('.wawi-pay-amount')?.value);
        if (account && !isNaN(amount) && amount > 0) {
            payments.push({ account, amount });
        }
    });
    return payments;
}

function wawiHandleAssetPurchaseSubmit() {
    const name = document.getElementById('wawi-asset-name')?.value;
    const category = document.getElementById('wawi-asset-category')?.value;
    const usefulLife = document.getElementById('wawi-asset-life')?.value;
    const cost = document.getElementById('wawi-asset-cost')?.value;

    const payments = wawiCollectPayments('wawi-purchase-payments');
    if (payments.length === 0) {
        wawiShowToast('Bitte mindestens eine Zahlungsart mit Betrag angeben.', 'error');
        return;
    }

    const result = wawiPurchaseAsset(name, category, usefulLife, cost, payments);
    if (result.success) {
        wawiShowToast(result.message, 'success');
        renderWarenwirtschaft();
    } else {
        wawiShowToast(result.message, 'error');
    }
}

function wawiHandleAssetSaleSubmit(assetId) {
    const priceInput = document.getElementById('wawi-sell-price');
    if (!priceInput) return;

    const payments = wawiCollectPayments('wawi-sell-payments');
    if (payments.length === 0) {
        wawiShowToast('Bitte mindestens eine Zahlungsart mit Betrag angeben.', 'error');
        return;
    }

    const result = wawiSellAsset(assetId, priceInput.value, payments);
    const modal = document.getElementById('wawi-sell-asset-modal');
    if (modal) modal.remove();

    if (result.success) {
        wawiShowToast(result.message, 'success');
        renderWarenwirtschaft();
    } else {
        wawiShowToast(result.message, 'error');
    }
}

function wawiHandleDepreciationSubmit() {
    const result = wawiDepreciateAssets();
    if (result.success) {
        wawiShowToast(result.message, 'success');
        renderWarenwirtschaft();
    } else {
        wawiShowToast(result.message, 'error');
    }
}

function wawiShowSellAssetModal(assetId) {
    const asset = WaWiState.assets.find(a => a.id === assetId);
    if (!asset) return;

    const modalId = 'wawi-sell-asset-modal';
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'wawi-modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10001;padding:20px;';

    const mode = WaWiState.difficulty || 'advanced';
    const taxHint = mode === 'pro' ? '<div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.3rem;">Hinweis: Im Profi-Modus werden automatisch 19% USt aufgeschlagen.</div>' : '';
    const catIcon = asset.category === '0510' ? '🏭' : (asset.category === '0700' ? '⚙️' : (asset.category === '0840' ? '🚚' : '🪑'));

    modal.innerHTML = `
        <div class="wawi-modal-content" style="background:var(--bg-color); color:var(--text-main); padding:2rem; border-radius:1.5rem; max-width:450px; width:100%; border:2px solid var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h3 style="margin-top:0; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem; color:var(--primary);">
                <span>🤝 Anlagegut verkaufen</span>
            </h3>

            <div style="background:rgba(255,255,255,0.03); padding:1.25rem; border-radius:1rem; border:1px solid var(--card-border); margin-bottom:1.5rem;">
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.25rem;">Anlagegut:</div>
                <div style="font-weight:600; font-size:1.1rem; margin-bottom:0.75rem;">${catIcon} ${asset.name}</div>

                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:0.4rem;">
                    <span style="color:var(--text-muted);">Anschaffungskosten:</span>
                    <span style="font-weight:600;">${wawiFormatCurrency(asset.purchaseCost)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span style="color:var(--text-muted);">Aktueller Buchwert:</span>
                    <span style="font-weight:700; color:var(--primary);">${wawiFormatCurrency(asset.currentBookValue)}</span>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                    <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Netto-Verkaufspreis (€):</label>
                    <input type="number" id="wawi-sell-price" placeholder="z. B. 5000" min="0" step="0.01" value="${mode === 'beginner' ? asset.purchaseCost : Math.round(asset.currentBookValue * 0.8 * 100) / 100}" ${mode === 'beginner' ? 'readonly' : ''} style="padding:0.6rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.9rem; width:100%; box-sizing:border-box; ${mode === 'beginner' ? 'opacity:0.7; cursor:not-allowed;' : ''}">
                    ${mode === 'beginner' ? '<div style="font-size:0.78rem; color:hsl(200,80%,60%); margin-top:0.3rem;">ℹ️ Im Anfängermodus wird immer zu den Anschaffungskosten verkauft.</div>' : ''}
                    ${taxHint}
                </div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                    <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Zahlungseingang:</label>
                    <div id="wawi-sell-payments">
                        <div class="wawi-payment-row" style="display:flex; gap:0.5rem; align-items:center;">
                            <select class="wawi-pay-account" style="flex:1; padding:0.5rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.85rem;">
                                <option value="1200">🏦 Bank (1200)</option>
                                <option value="1000">💵 Kasse (1000)</option>
                                <option value="2400">📋 Ford. a.L.L. (2400)</option>
                            </select>
                            <input type="number" class="wawi-pay-amount" placeholder="Betrag" step="0.01" min="0" value="${mode === 'beginner' ? asset.purchaseCost : Math.round(asset.currentBookValue * 0.8 * 100) / 100}" style="width:90px; padding:0.5rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.85rem;">
                        </div>
                    </div>
                    <button type="button" onclick="wawiAddPaymentRow('wawi-sell-payments','sale')" style="align-self:flex-start; background:none; border:1px dashed var(--card-border); color:var(--text-muted); padding:0.3rem 0.7rem; border-radius:0.4rem; cursor:pointer; font-size:0.8rem; margin-top:0.3rem;">+ Weitere Zahlungsquelle</button>
                </div>
            </div>

            <div style="margin-top:1.5rem; display:flex; gap:1rem; justify-content:flex-end;">
                <button class="wawi-btn wawi-btn-outline" onclick="document.getElementById('${modalId}').remove()">Abbrechen</button>
                <button class="wawi-btn wawi-btn-primary" onclick="wawiHandleAssetSaleSubmit('${asset.id}')">💰 Verkaufen</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function wawiRenderAssets(container) {
    const mode = WaWiState.difficulty || 'advanced';
    const assets = WaWiState.assets || [];
    const activeAssets = assets.filter(a => !a.isSold);
    const soldAssets = assets.filter(a => a.isSold);
    const projections = wawiGetDepreciationProjections();
    const totalBookValue = activeAssets.reduce((s, a) => s + a.currentBookValue, 0);
    const totalPurchaseCost = activeAssets.reduce((s, a) => s + a.purchaseCost, 0);
    const totalDepreciation = projections.reduce((s, p) => s + p.depreciation, 0);

    const getCatIcon = (cat) => cat === '0510' ? '🏭' : (cat === '0700' ? '⚙️' : (cat === '0840' ? '🚚' : '🪑'));
    const getCatName = (cat) => cat === '0510' ? 'Gebäude' : (cat === '0700' ? 'Technische Anlagen und Maschinen' : (cat === '0840' ? 'Fuhrpark' : 'BGA'));
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE') : '–';

    container.innerHTML = `
        <style>
            .wawi-asset-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
            @media (min-width: 900px) { .wawi-asset-grid { grid-template-columns: 1fr 1fr; } }
            .wawi-asset-card {
                background: var(--bg-card);
                border: 1px solid var(--card-border);
                border-radius: 1rem;
                padding: 1.5rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            }
            .wawi-asset-item {
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--card-border);
                border-radius: 0.75rem;
                padding: 1rem;
                margin-bottom: 0.75rem;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .wawi-asset-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
            .wawi-asset-item.sold {
                opacity: 0.5;
                border-left: 3px solid #666;
            }
            .wawi-asset-item.active {
                border-left: 3px solid hsl(140, 60%, 50%);
            }
            .wawi-asset-item.depleted {
                border-left: 3px solid hsl(35, 90%, 55%);
            }
            .wawi-depr-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.6rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                font-size: 0.9rem;
            }
            .wawi-depr-row:last-child { border-bottom: none; }
            .wawi-asset-kpi-row {
                display: flex;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            .wawi-asset-kpi {
                flex: 1;
                min-width: 130px;
                background: var(--bg-card);
                border: 1px solid var(--card-border);
                border-radius: 0.75rem;
                padding: 1rem;
                text-align: center;
            }
            .wawi-asset-kpi-val {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--primary);
            }
            .wawi-asset-kpi-label {
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 0.25rem;
            }
        </style>

        <div class="wawi-assets">
            <div class="wawi-section-header">
                <h3>🏗️ Anlagenmanagement</h3>
                <div class="wawi-section-sub">Verwaltung des Anlagevermögens: Kauf, Abschreibung und Verkauf/Abgang.</div>
            </div>

            <!-- KPI Overview -->
            <div class="wawi-asset-kpi-row">
                <div class="wawi-asset-kpi">
                    <div class="wawi-asset-kpi-val">${activeAssets.length}</div>
                    <div class="wawi-asset-kpi-label">Aktive Anlagen</div>
                </div>
                <div class="wawi-asset-kpi">
                    <div class="wawi-asset-kpi-val">${wawiFormatCurrency(totalBookValue)}</div>
                    <div class="wawi-asset-kpi-label">Gesamtbuchwert</div>
                </div>
                ${mode !== 'beginner' ? `
                <div class="wawi-asset-kpi">
                    <div class="wawi-asset-kpi-val">${wawiFormatCurrency(totalDepreciation)}</div>
                    <div class="wawi-asset-kpi-label">AfA dieses Jahr</div>
                </div>
                <div class="wawi-asset-kpi">
                    <div class="wawi-asset-kpi-val" style="color: ${WaWiState.depreciationBooked ? 'hsl(140,60%,50%)' : 'hsl(35,90%,55%)'}">${WaWiState.depreciationBooked ? '✅ Gebucht' : '⏳ Offen'}</div>
                    <div class="wawi-asset-kpi-label">AfA-Status</div>
                </div>
                ` : ''}
            </div>

            <div class="wawi-asset-grid">
                <!-- Left Column: Asset Registry -->
                <div>
                    <div class="wawi-asset-card">
                        <h4 style="margin-top:0; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                            <span>📋 Anlagenverzeichnis</span>
                            <span style="font-size:0.75rem; background:var(--primary); color:#fff; padding:0.15rem 0.5rem; border-radius:1rem; margin-left:auto;">${activeAssets.length} aktiv</span>
                        </h4>

                        ${activeAssets.length === 0 && soldAssets.length === 0 ? `
                            <div style="text-align:center; padding:2rem; color:var(--text-muted);">
                                <div style="font-size:2rem; margin-bottom:0.5rem;">📦</div>
                                <div>Noch keine Anlagegüter vorhanden.</div>
                                <div style="font-size:0.85rem;">Nutze das Formular rechts, um ein Anlagegut anzuschaffen.</div>
                            </div>
                        ` : ''}

                        ${activeAssets.map(asset => {
                            const isFullyDepreciated = asset.currentBookValue <= 1.00;
                            const depreciationPercent = Math.round((1 - asset.currentBookValue / asset.purchaseCost) * 100);
                            const statusClass = isFullyDepreciated ? 'depleted' : 'active';
                            return `
                            <div class="wawi-asset-item ${statusClass}">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                                    <div style="display:flex; align-items:center; gap:0.5rem;">
                                        <span style="font-size:1.3rem;">${getCatIcon(asset.category)}</span>
                                        <div>
                                            <div style="font-weight:600;">${asset.name}</div>
                                            <div style="font-size:0.75rem; color:var(--text-muted);">${getCatName(asset.category)} · Konto ${asset.category}</div>
                                        </div>
                                    </div>
                                    <button class="wawi-btn wawi-btn-sm wawi-btn-outline" onclick="wawiShowSellAssetModal('${asset.id}')" style="font-size:0.75rem; padding:0.3rem 0.6rem;">
                                        🤝 Verkaufen
                                    </button>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.3rem;">
                                    <span style="color:var(--text-muted);">AK:</span>
                                    <span>${wawiFormatCurrency(asset.purchaseCost)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.3rem;">
                                    <span style="color:var(--text-muted);">Buchwert:</span>
                                    <span style="font-weight:700; color:${isFullyDepreciated ? 'hsl(35,90%,55%)' : 'var(--primary)'}">${wawiFormatCurrency(asset.currentBookValue)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem;">
                                    <span style="color:var(--text-muted);">ND: ${asset.usefulLife} J. · Kauf: ${formatDate(asset.purchaseDate)}</span>
                                </div>
                                <!-- Progress Bar -->
                                <div style="background:rgba(255,255,255,0.05); border-radius:0.3rem; height:6px; overflow:hidden;">
                                    <div style="height:100%; width:${depreciationPercent}%; background:${isFullyDepreciated ? 'hsl(35,90%,55%)' : 'var(--primary)'}; border-radius:0.3rem; transition:width 0.5s;"></div>
                                </div>
                                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.2rem; text-align:right;">${depreciationPercent}% abgeschrieben</div>
                            </div>
                            `;
                        }).join('')}

                        ${soldAssets.length > 0 ? `
                            <h5 style="margin-top:1.5rem; margin-bottom:0.75rem; color:var(--text-muted); font-size:0.85rem;">🗑️ Verkaufte / Abgegangene Anlagen</h5>
                            ${soldAssets.map(asset => `
                                <div class="wawi-asset-item sold">
                                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
                                        <span style="font-size:1.1rem;">${getCatIcon(asset.category)}</span>
                                        <div>
                                            <div style="font-weight:500; text-decoration:line-through;">${asset.name}</div>
                                            <div style="font-size:0.75rem; color:var(--text-muted);">
                                                Verkauft am ${formatDate(asset.sellDate)} für ${wawiFormatCurrency(asset.sellPrice || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        ` : ''}
                    </div>
                </div>

                <!-- Right Column: Purchase + Depreciation -->
                <div>
                    <!-- Purchase Form -->
                    <div class="wawi-asset-card" style="margin-bottom:1.5rem;">
                        <h4 style="margin-top:0; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                            <span>🆕 Anlagegut anschaffen</span>
                        </h4>
                        <div style="display:flex; flex-direction:column; gap:1rem;">
                            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Bezeichnung:</label>
                                <input type="text" id="wawi-asset-name" placeholder="z. B. CNC-Maschine" style="padding:0.6rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.9rem; width:100%; box-sizing:border-box;">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Kategorie:</label>
                                <select id="wawi-asset-category" style="padding:0.6rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.9rem; width:100%;">
                                    <option value="0510">🏭 Gebäude (Konto 0510)</option>
                                    <option value="0700">⚙️ Technische Anlagen und Maschinen (Konto 0700)</option>
                                    <option value="0840">🚚 Fuhrpark (Konto 0840)</option>
                                    <option value="0860">🪑 Büro- & Geschäftsausstattung (Konto 0860)</option>
                                </select>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Nutzungsdauer (in Jahren):</label>
                                <input type="number" id="wawi-asset-life" value="5" min="1" max="50" style="padding:0.6rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.9rem; width:100%; box-sizing:border-box;">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Anschaffungskosten (Netto in €):${mode === 'pro' ? '<span style="font-size:0.7rem; opacity:0.7;"> +19% VSt</span>' : ''}</label>
                                <input type="number" id="wawi-asset-cost" placeholder="z. B. 10000" min="1" step="0.01" style="padding:0.6rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.9rem; width:100%; box-sizing:border-box;">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Zahlungsart(en):</label>
                                <div id="wawi-purchase-payments">
                                    <div class="wawi-payment-row" style="display:flex; gap:0.5rem; align-items:center;">
                                        <select class="wawi-pay-account" style="flex:1; padding:0.5rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.85rem;">
                                            <option value="1200">🏦 Bank (1200)</option>
                                            <option value="1000">💵 Kasse (1000)</option>
                                            <option value="4400">📋 Verb. a.L.L. (4400)</option>
                                            <option value="4250">🏛️ Bankdarlehen (4250)</option>
                                        </select>
                                        <input type="number" class="wawi-pay-amount" placeholder="Betrag" step="0.01" min="0" style="width:90px; padding:0.5rem; border-radius:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--card-border); color:var(--text-main); font-size:0.85rem;">
                                    </div>
                                </div>
                                <button type="button" onclick="wawiAddPaymentRow('wawi-purchase-payments','purchase')" style="align-self:flex-start; background:none; border:1px dashed var(--card-border); color:var(--text-muted); padding:0.3rem 0.7rem; border-radius:0.4rem; cursor:pointer; font-size:0.8rem; margin-top:0.3rem;">+ Weitere Zahlungsquelle</button>
                            </div>
                            <button class="wawi-btn wawi-btn-primary" onclick="wawiHandleAssetPurchaseSubmit()" style="width:100%; margin-top:0.5rem; padding:0.7rem;">
                                💰 Anschaffung buchen
                            </button>
                        </div>
                    </div>

                    ${mode === 'beginner' ? `
                    <!-- Depreciation: disabled in beginner mode -->
                    <div class="wawi-asset-card" style="border-color: var(--card-border); opacity:0.5;">
                        <h4 style="margin-top:0; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
                            <span>📉 Abschreibung (AfA)</span>
                            <span style="font-size:0.7rem; background:rgba(255,255,255,0.08); color:var(--text-muted); padding:0.15rem 0.5rem; border-radius:1rem;">🔒 Ab Fortgeschritten</span>
                        </h4>
                        <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">
                            Die Abschreibung (AfA) ist ab dem Wissensniveau <strong>Fortgeschritten</strong> verfügbar.
                        </div>
                    </div>
                    ` : `
                    <!-- Depreciation Card -->
                    <div class="wawi-asset-card" style="border-color: ${WaWiState.depreciationBooked ? 'hsl(140,60%,30%)' : 'hsl(35,90%,40%)'}; border-width:2px;">
                        <h4 style="margin-top:0; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                            <span>📉 Abschreibung (AfA)</span>
                            ${WaWiState.depreciationBooked ? '<span style="font-size:0.7rem; background:hsl(140,60%,25%); color:hsl(140,70%,70%); padding:0.15rem 0.5rem; border-radius:1rem;">✅ Gebucht</span>' : '<span style="font-size:0.7rem; background:hsl(35,90%,20%); color:hsl(35,90%,70%); padding:0.15rem 0.5rem; border-radius:1rem;">⏳ Ausstehend</span>'}
                        </h4>

                        ${projections.length > 0 ? `
                            <div style="margin-bottom:1rem;">
                                ${projections.map(p => `
                                    <div class="wawi-depr-row">
                                        <div style="display:flex; align-items:center; gap:0.5rem;">
                                            <span>${getCatIcon(p.category)}</span>
                                            <div>
                                                <div style="font-size:0.85rem; font-weight:500;">${p.name}</div>
                                                <div style="font-size:0.7rem; color:var(--text-muted);">BW: ${wawiFormatCurrency(p.currentBookValue)} → ${wawiFormatCurrency(Math.round((p.currentBookValue - p.depreciation) * 100) / 100)}</div>
                                            </div>
                                        </div>
                                        <span style="font-weight:700; color:hsl(0,70%,60%); font-size:0.9rem;">−${wawiFormatCurrency(p.depreciation)}</span>
                                    </div>
                                `).join('')}
                                <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:2px solid var(--card-border); display:flex; justify-content:space-between; font-weight:700;">
                                    <span>Gesamt-AfA:</span>
                                    <span style="color:hsl(0,70%,60%);">−${wawiFormatCurrency(totalDepreciation)}</span>
                                </div>
                            </div>
                        ` : `
                            <div style="text-align:center; padding:1rem; color:var(--text-muted); font-size:0.9rem;">
                                Keine abschreibungsfähigen Anlagegüter vorhanden.
                            </div>
                        `}

                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem; line-height:1.4;">
                            💡 <strong>Lineare AfA</strong> (pro-rata temporis): Die Abschreibung wird monatsgenau berechnet. Der Erinnerungswert beträgt 1,00 €.
                        </div>

                        <button class="wawi-btn ${WaWiState.depreciationBooked ? 'wawi-btn-outline' : 'wawi-btn-primary'}" 
                            onclick="wawiHandleDepreciationSubmit()" 
                            style="width:100%; padding:0.7rem; ${WaWiState.depreciationBooked ? 'opacity:0.5; cursor:not-allowed;' : ''}"
                            ${WaWiState.depreciationBooked ? 'disabled' : ''}>
                            ${WaWiState.depreciationBooked ? '✅ Abschreibungen bereits gebucht' : '📉 Abschreibung (AfA) buchen'}
                        </button>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}


// =============================================================================
// SECTION 7: INITIALIZATION
// =============================================================================

// Load state when module file is loaded
wawiLoadState();
