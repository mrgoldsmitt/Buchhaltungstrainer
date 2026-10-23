// =====================================================
// script.js - Buchhaltungstrainer Hauptlogik
// =====================================================

// --- State ---
let currentMode = 'inventur';

// Global Data Store for the App to share between modules
const AppState = {
    inventurData: [],
    inventarData: {
        aktiva: [],
        passiva: []
    },
    // Triggers when a module saves data
    onDataUpdate: function(module) {
        if (module === 'inventur' && typeof renderInventar === 'function') {
            // Data flows to Inventar
            renderInventar();
        }
        if (module === 'inventar' && typeof renderBilanz === 'function') {
            // Data flows to Bilanz
            renderBilanz();
        }
    }
};
window.AppState = AppState;

// --- Theme Handling (Dark, Light, Pro) ---
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    if (theme === 'pro') theme = 'sap';
    if (!['dark', 'light', 'sap'].includes(theme)) {
        theme = 'dark';
    }
    document.body.classList.remove('light-mode', 'sap-mode', 'pro-mode');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else if (theme === 'sap') {
        document.body.classList.add('sap-mode', 'pro-mode');
    }
    localStorage.setItem('bw_theme', theme);
    updateThemeUI(theme);
}

function updateThemeUI(theme) {
    const isPro = (theme === 'sap' || theme === 'pro');
    document.querySelectorAll('.theme-opt-btn').forEach(btn => {
        const t = btn.getAttribute('data-theme');
        if (t === theme || (isPro && (t === 'sap' || t === 'pro'))) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    document.querySelectorAll('.header-theme-btn').forEach(btn => {
        const t = btn.getAttribute('data-theme');
        if (t === theme || (isPro && (t === 'sap' || t === 'pro'))) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    if (themeToggle) {
        themeToggle.checked = (theme === 'light');
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('bw_theme') || 'dark';
    let nextTheme = 'dark';
    if (currentTheme === 'dark') nextTheme = 'light';
    else if (currentTheme === 'light') nextTheme = 'sap';
    else if (currentTheme === 'sap') nextTheme = 'dark';
    setTheme(nextTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('bw_theme') || 'dark';
    setTheme(savedTheme);
}

window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;

initTheme();

// --- Sidebar Toggle ---
function toggleSidebar() {
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.toggle('open');
    } else {
        document.body.classList.toggle('sidebar-collapsed');
    }
}

// --- Mode Switcher ---
function setMode(mode) {
    currentMode = mode;
    localStorage.setItem('bt_last_module', mode);

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.querySelector(`.nav-btn[onclick="setMode('${mode}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    if (mode === 'theorie') {
        document.getElementById('theorie-section').classList.add('active');
        if (typeof renderTheorie === 'function') renderTheorie();
    } else if (mode === 'inventur') {
        document.getElementById('inventur-section').classList.add('active');
        if (typeof renderInventur === 'function') renderInventur();
    } else if (mode === 'inventar') {
        document.getElementById('inventar-section').classList.add('active');
        if (typeof renderInventar === 'function') renderInventar();
    } else if (mode === 'bilanz') {
        document.getElementById('bilanz-section').classList.add('active');
        if (typeof renderBilanz === 'function') renderBilanz();
    } else if (mode === 'buchung') {
        document.getElementById('buchung-section').classList.add('active');
        if (typeof renderBuchung === 'function') renderBuchung();
    } else if (mode === 'stationen') {
        document.getElementById('stationen-section').classList.add('active');
        if (typeof renderStationen === 'function') renderStationen();
    } else if (mode === 'warenwirtschaft') {
        document.getElementById('warenwirtschaft-section').classList.add('active');
        if (typeof WaWiState !== 'undefined' && WaWiState) {
            WaWiState.activeTab = 'dashboard';
        }
        if (typeof renderWarenwirtschaft === 'function') renderWarenwirtschaft();
    } else if (mode === 'impressum') {
        document.getElementById('impressum-section').classList.add('active');
    } else if (mode === 'changelog') {
        document.getElementById('changelog-section').classList.add('active');
    }

    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// Helper: Format Euro
function formatEur(amount) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount || 0);
}

// Initial state
window.addEventListener('DOMContentLoaded', () => {
    const lastMode = localStorage.getItem('bt_last_module') || 'theorie';
    setMode(lastMode);
});

// --- JSON Data Management (Export/Import) ---
function btExportJSON() {
    // Gather state from all modules
    const exportData = {
        metadata: {
            version: '1.6.0',
            exportedAt: new Date().toISOString()
        },
        appState: AppState,
        inventur: {
            userInputs: typeof userInputs !== 'undefined' ? userInputs : {},
            solvedChallenges: typeof solvedChallenges !== 'undefined' ? solvedChallenges : {}
        },
        inventar: {
            mappings: typeof inventarMappings !== 'undefined' ? inventarMappings : {},
            subMappings: typeof inventarSubMappings !== 'undefined' ? inventarSubMappings : {},
            sums: typeof inventarSums !== 'undefined' ? inventarSums : {}
        },
        bilanz: {
            assignments: typeof bilanzAssignments !== 'undefined' ? bilanzAssignments : {},
            itemValues: typeof bilanzItemValues !== 'undefined' ? bilanzItemValues : {},
            summary: typeof bilanzSummary !== 'undefined' ? bilanzSummary : {}
        }
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Buchhaltungstrainer_Stand_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Arbeitsstand erfolgreich als JSON heruntergeladen.', 'success');
}

function btHandleImport(event) {
    const file = event.target.files[0];
    if (file) btProcessImportFile(file);
    if (event.target) event.target.value = ''; // Reset
}

function btHandleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.border = '2px dashed var(--primary)';
    e.currentTarget.style.background = 'rgba(0,134,203,0.3)';
}

function btHandleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.border = '';
    e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
}

function btHandleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.border = '';
    e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
        btProcessImportFile(file);
    } else {
        showToast('Bitte nur JSON-Dateien (.json) hochladen.', 'danger');
    }
}

function btProcessImportFile(file) {
    if (!confirm('Möchtest du den aktuellen Arbeitsstand wirklich überschreiben? Alle ungespeicherten Daten gehen verloren.')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Restore AppState
            if (data.appState) {
                AppState.inventurData = data.appState.inventurData || [];
                AppState.inventarData = data.appState.inventarData || { aktiva: [], passiva: [] };
            }

            // Restore Inventur
            if (data.inventur) {
                if (typeof userInputs !== 'undefined') {
                    for (let k in userInputs) delete userInputs[k];
                    Object.assign(userInputs, data.inventur.userInputs || {});
                }
                if (typeof solvedChallenges !== 'undefined') {
                    for (let k in solvedChallenges) delete solvedChallenges[k];
                    Object.assign(solvedChallenges, data.inventur.solvedChallenges || {});
                }
            }

            // Restore Inventar
            if (data.inventar) {
                if (typeof inventarMappings !== 'undefined') {
                    for (let k in inventarMappings) delete inventarMappings[k];
                    Object.assign(inventarMappings, data.inventar.mappings || {});
                }
                if (typeof inventarSubMappings !== 'undefined') {
                    for (let k in inventarSubMappings) delete inventarSubMappings[k];
                    Object.assign(inventarSubMappings, data.inventar.subMappings || {});
                }
                if (typeof inventarSums !== 'undefined') {
                    for (let k in inventarSums) delete inventarSums[k];
                    Object.assign(inventarSums, data.inventar.sums || {});
                }
            }

            // Restore Bilanz
            if (data.bilanz) {
                if (typeof bilanzAssignments !== 'undefined') {
                    for (let k in bilanzAssignments) delete bilanzAssignments[k];
                    Object.assign(bilanzAssignments, data.bilanz.assignments || {});
                }
                if (typeof bilanzItemValues !== 'undefined') {
                    for (let k in bilanzItemValues) delete bilanzItemValues[k];
                    Object.assign(bilanzItemValues, data.bilanz.itemValues || {});
                }
                if (typeof bilanzSummary !== 'undefined') {
                    for (let k in bilanzSummary) delete bilanzSummary[k];
                    Object.assign(bilanzSummary, data.bilanz.summary || {});
                }
            }

            // Re-Render current mode
            setMode(currentMode);
            showToast('Arbeitsstand erfolgreich geladen!', 'success');

        } catch (error) {
            console.error('JSON Import Error:', error);
            showToast(`Fehler beim Importieren: ${error.message}`, 'danger');
        }
    };
    reader.readAsText(file);
}

// Global Toast logic
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : '#3b82f6';
    toast.style.cssText = `background: ${bg}; color: white; padding: 12px 20px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 0.9rem; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;`;
    toast.innerText = message;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // Animate out
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
