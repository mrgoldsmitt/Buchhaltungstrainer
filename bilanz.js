// =====================================================
// bilanz.js - Bilanz: Posten per Drag & Drop zuordnen
// =====================================================

// State: which exact categories are in which bilanz part
let bilanzAssignments = {
    'av': [],     // Anlagevermögen
    'uv': [],     // Umlaufvermögen
    'lv': [],     // Langfr. Verbindl.
    'kv': []      // Kurzfr. Verbindl.
};

// User-entered values for each dropped EXACT CATEGORY (not single items)
let bilanzItemValues = {};

// Summary values
let bilanzSummary = {
    sumAV: null,
    sumUV: null,
    eigenkapital: null,
    sumLV: null,
    sumKV: null,
    sumAktiva: null,
    sumPassiva: null
};

// Returns an array of SubCategory IDs (like 'rohstoffe', 'bga') that are actually present
function getActiveSubCategories() {
    var activeSet = new Set();
    if (AppState.inventurData) {
        var correctSubMappings = typeof getCorrectInventarSubMappings === 'function' ? getCorrectInventarSubMappings() : {};
        AppState.inventurData.forEach(function(item) {
            var subCat = correctSubMappings[item.id];
            if (subCat) {
                activeSet.add(subCat);
            }
        });
    }
    return Array.from(activeSet);
}

function renderBilanz() {
    var container = document.getElementById('bilanz-container');
    if (!container) return;

    if (!AppState.inventarData.aktiva || AppState.inventarData.aktiva.length === 0) {
        container.innerHTML = '<div class="card" style="text-align: center; padding: 3rem;">' +
            '<h3 style="color: var(--text-muted);">Noch keine Daten vorhanden</h3>' +
            '<p>Bitte schließe zuerst das Inventar ab.</p>' +
            '<button class="btn-primary" id="btn-goto-inventar" onclick="setMode(\'inventar\')">Zum Inventar</button></div>';
        var gotoBtn = document.getElementById('btn-goto-inventar');
        if (gotoBtn) {
            gotoBtn.addEventListener('dblclick', function(e) {
                e.preventDefault(); e.stopPropagation();
                showBilanzPasswordModal(true);
            });
        }
        return;
    }

    // Build reference list (Einzelposten)
    var refItems = [];
    if (AppState.inventurData && AppState.inventurData.length > 0) {
        AppState.inventurData.forEach(function(item) {
            var total = item.totalValue != null ? item.totalValue : (item.amount * item.pricePerUnit);
            refItems.push({ id: item.id, name: item.name, value: total });
        });
    }
    if (!window._bilanzRefItems) {
        var shuffled = refItems.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
        }
        window._bilanzRefItems = shuffled;
    }

    var refRows = '';
    window._bilanzRefItems.forEach(function(item) {
        refRows += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">' +
            '<td style="padding: 0.2rem 0.4rem; font-size: 0.8rem;">' + item.name + '</td>' +
            '<td style="padding: 0.2rem 0.4rem; text-align: right; font-family: monospace; white-space: nowrap; font-size: 0.8rem;">' + formatEur(item.value) + '</td></tr>';
    });

    // Collect all placed subcategories IDs
    var placedIds = new Set();
    Object.keys(bilanzAssignments).forEach(function(cat) {
        bilanzAssignments[cat].forEach(function(id) { placedIds.add(id); });
    });

    // Get unplaced Exact Categories
    var unplaced = [];
    var activeSubCats = getActiveSubCategories();
    var subLabels = typeof getInventarSubCategoryLabels === 'function' ? getInventarSubCategoryLabels() : {};
    
    activeSubCats.forEach(function(subCatId) {
        if (!placedIds.has(subCatId)) {
            unplaced.push({ id: subCatId, name: subLabels[subCatId] || subCatId });
        }
    });

    // Helper: render a drop zone with placed exact categories
    function renderDropZone(catId, title, color) {
        var items = bilanzAssignments[catId] || [];
        var h = '<div class="bilanz-category" style="border-left: 3px solid ' + color + '; padding-left: 0.5rem; margin-bottom: 0.75rem;">' +
            '<div style="font-weight: bold; font-size: 0.85rem; margin-bottom: 0.3rem; color: ' + color + ';">' + title + '</div>' +
            '<div class="bilanz-dropzone" data-cat="' + catId + '" style="min-height: 36px; border: 2px dashed rgba(255,255,255,0.15); border-radius: 4px; padding: 0.3rem; display: flex; flex-wrap: wrap; gap: 0.3rem; transition: all 0.2s;">';

        if (items.length === 0) {
            h += '<span style="color: var(--text-muted); font-size: 0.75rem; font-style: italic; padding: 0.2rem;">Posten hierher ziehen...</span>';
        } else {
            items.forEach(function(itemId) {
                var name = subLabels[itemId] || itemId;
                var val = bilanzItemValues[itemId];
                h += '<div class="bilanz-dropped-item" draggable="true" data-item-id="' + itemId + '" id="bchip-' + itemId + '" style="display: flex; align-items: center; gap: 0.3rem; background: rgba(255,255,255,0.08); border-radius: 4px; padding: 0.2rem 0.4rem; font-size: clamp(0.65rem, 1.5vw, 0.75rem); flex-wrap: wrap; border: 1px solid var(--card-border); cursor: grab;">' +
                    '<span style="cursor: pointer; color: #ef4444; font-weight: bold;" onclick="removeBilanzItem(\'' + catId + '\',\'' + itemId + '\')" title="Entfernen">✕</span>' +
                    '<span style="min-width: 0; word-break: break-word;" title="' + name + '">' + name + '</span>' +
                    '<input type="number" step="any" class="inv-input bilanz-item-val" style="width: clamp(60px, 25%, 90px); padding: 0.15rem 0.3rem; border: 1px solid var(--card-border); font-size: clamp(0.6rem, 1.3vw, 0.75rem);" value="' + (val != null ? val : '') + '" onchange="saveBilanzItemValue(\'' + itemId + '\', this.value)" id="bv-' + itemId + '">' +
                '</div>';
            });
        }

        h += '</div></div>';
        return h;
    }

    // Summary input helper
    function sumInput(id, label, val, bold) {
        var style = bold ? 'font-weight: bold;' : '';
        return '<div class="inventar-sum-row" style="' + style + '">' +
            '<span style="font-size: clamp(0.7rem, 1.8vw, 0.85rem);">' + label + '</span>' +
            '<input type="number" step="any" class="inv-input inventar-sum-input" style="' + style + ' border: 1px solid var(--card-border); font-size: clamp(0.65rem, 1.5vw, 0.8rem);" id="' + id + '" value="' + (val != null ? val : '') + '" onchange="saveBilanzSummary(\'' + id.replace('bilanz-', '') + '\', this.value)">' +
        '</div>';
    }

    var html = '';

    // Reference list
    html += '<div class="card" style="margin-bottom: 1rem;">' +
        '<p style="margin-bottom: 0.5rem;"><strong>Aufgabe:</strong> Ordne die genauen Kategorien per Drag & Drop den Bilanzpositionen zu. Addiere dann die Werte der entsprechenden Einzelposten aus der Liste und trage die Summen ein.</p>' +
        '<p style="margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">💡 <em>Alternativ: Kategorie antippen, dann Zielbereich antippen.</em></p>' +
        '<details style="cursor: pointer;">' +
            '<summary style="font-weight: bold; color: var(--primary); padding: 0.3rem 0; font-size: 0.9rem;">📋 Werte nachschlagen (' + refItems.length + ' Posten)</summary>' +
            '<div style="max-height: 220px; overflow-y: auto; margin-top: 0.3rem; border: 1px solid var(--card-border); border-radius: 4px;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                    '<thead><tr style="background: rgba(0,0,0,0.2); position: sticky; top: 0;">' +
                        '<th style="padding: 0.3rem 0.4rem; text-align: left; font-size: 0.8rem;">Einzelposten</th>' +
                        '<th style="padding: 0.3rem 0.4rem; text-align: right; font-size: 0.8rem;">Wert</th>' +
                    '</tr></thead><tbody>' + refRows + '</tbody></table></div>' +
        '</details></div>';

    // T-Konto
    html += '<div class="card" style="margin-bottom: 1rem;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--text-main); padding-bottom: 0.4rem; margin-bottom: 0.75rem;">' +
            '<h3 style="margin: 0; flex: 1; text-align: center; font-size: 1rem;">Aktiva</h3>' +
            '<h2 style="margin: 0; color: var(--primary); font-weight: bold; padding: 0 1rem; font-size: 1.1rem;">BILANZ</h2>' +
            '<h3 style="margin: 0; flex: 1; text-align: center; font-size: 1rem;">Passiva</h3>' +
        '</div>' +
        '<div style="display: flex;">' +
            // AKTIVA
            '<div style="flex: 1; padding-right: 0.75rem; border-right: 3px solid var(--text-main);">' +
                renderDropZone('av', 'A. Anlagevermögen', '#3b82f6') +
                sumInput('bilanz-sumAV', 'Σ Anlagevermögen:', bilanzSummary.sumAV, false) +
                '<hr style="border-color: rgba(255,255,255,0.1); margin: 0.5rem 0;">' +
                renderDropZone('uv', 'B. Umlaufvermögen', '#10b981') +
                sumInput('bilanz-sumUV', 'Σ Umlaufvermögen:', bilanzSummary.sumUV, false) +
                '<div style="border-top: 2px solid var(--text-main); margin-top: 0.75rem; padding-top: 0.5rem;">' +
                    sumInput('bilanz-sumAktiva', 'Bilanzsumme:', bilanzSummary.sumAktiva, true) +
                '</div>' +
            '</div>' +
            // PASSIVA
            '<div style="flex: 1; padding-left: 0.75rem;">' +
                '<div class="bilanz-category" style="border-left: 3px solid #f59e0b; padding-left: 0.5rem; margin-bottom: 0.75rem;">' +
                    '<div style="font-weight: bold; font-size: 0.85rem; margin-bottom: 0.3rem; color: #f59e0b;">A. Eigenkapital</div>' +
                    '<div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem;"><em>(= Vermögen − Schulden)</em></div>' +
                    sumInput('bilanz-eigenkapital', 'Eigenkapital:', bilanzSummary.eigenkapital, false) +
                '</div>' +
                renderDropZone('lv', 'B. Langfristige Verbindlichkeiten', '#ef4444') +
                sumInput('bilanz-sumLV', 'Σ Langfr. Verb.:', bilanzSummary.sumLV, false) +
                '<hr style="border-color: rgba(255,255,255,0.1); margin: 0.5rem 0;">' +
                renderDropZone('kv', 'C. Kurzfristige Verbindlichkeiten', '#8b5cf6') +
                sumInput('bilanz-sumKV', 'Σ Kurzfr. Verb.:', bilanzSummary.sumKV, false) +
                '<div style="border-top: 2px solid var(--text-main); margin-top: 0.75rem; padding-top: 0.5rem;">' +
                    sumInput('bilanz-sumPassiva', 'Bilanzsumme:', bilanzSummary.sumPassiva, true) +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

    // Unplaced chips pool
    if (unplaced.length > 0) {
        html += '<div class="card" style="margin-bottom: 1rem;">' +
            '<p style="margin-bottom: 0.5rem; font-weight: bold; font-size: 0.9rem;">📦 Kategorien einsortieren (' + unplaced.length + ' übrig):</p>' +
            '<div id="bilanz-pool" style="display: flex; flex-wrap: wrap; gap: 0.4rem;">';
        unplaced.forEach(function(item) {
            html += '<div class="bilanz-chip" draggable="true" data-item-id="' + item.id + '">' + item.name + '</div>';
        });
        html += '</div></div>';
    } else {
        html += '<div class="card" style="margin-bottom: 1rem; text-align: center; padding: 1rem; color: var(--text-muted);">' +
            '<span>✅ Alle Kategorien wurden zugeordnet.</span></div>';
    }

    // Submit Button
    html += '<div style="margin-top: 0.5rem;">' +
        '<button class="btn-primary" id="btn-bilanz-submit" style="width: 100%; padding: 0.8rem;">Bilanz abschließen / prüfen</button>' +
        '<div id="bilanz-validation-feedback" style="margin-top: 0.75rem; font-weight: bold; text-align: center; min-height: 2.5rem;"></div></div>';

    container.innerHTML = html;

    // Attach drag & drop
    initBilanzDragDrop();

    // Button handlers
    var submitBtn = document.getElementById('btn-bilanz-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() { validateBilanz(); });
        submitBtn.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showBilanzPasswordModal(false);
        });
    }
}

// --- Drag & Drop ---
var _bilanzTouchState = null;

function _executeBilanzDrop(itemId, cat, targetEl, clientX) {
    var targetItem = targetEl ? (targetEl.closest ? targetEl.closest('.bilanz-dropped-item') : null) : null;
    var insertBeforeId = targetItem ? targetItem.dataset.itemId : null;

    // Remove from any category first
    Object.keys(bilanzAssignments).forEach(function(c) {
        bilanzAssignments[c] = bilanzAssignments[c].filter(function(id) { return id !== itemId; });
    });

    if (insertBeforeId && insertBeforeId !== itemId) {
        var rect = targetItem.getBoundingClientRect();
        var insertAfter = (clientX - rect.left) > (rect.width / 2);
        var index = bilanzAssignments[cat].indexOf(insertBeforeId);
        if (index > -1) {
            bilanzAssignments[cat].splice(insertAfter ? index + 1 : index, 0, itemId);
        } else {
            bilanzAssignments[cat].push(itemId);
        }
    } else {
        bilanzAssignments[cat].push(itemId);
    }
    renderBilanz();
}

function initBilanzDragDrop() {
    var chips = document.querySelectorAll('.bilanz-chip[draggable], .bilanz-dropped-item[draggable]');
    var zones = document.querySelectorAll('.bilanz-dropzone');

    // --- Desktop: HTML5 Drag & Drop ---
    chips.forEach(function(chip) {
        chip.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.itemId);
            this.classList.add('dragging');
        });
        chip.addEventListener('dragend', function() { this.classList.remove('dragging'); });
    });

    zones.forEach(function(zone) {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            var itemId = e.dataTransfer.getData('text/plain');
            var cat = this.dataset.cat;
            if (itemId && cat) {
                _executeBilanzDrop(itemId, cat, e.target, e.clientX);
            }
        });
    });

    // --- Mobile: Pointer Events Drag (enhancement for supported browsers) ---
    chips.forEach(function(chip) {
        chip.addEventListener('pointerdown', _bilanzPointerDown);
    });

    // --- Universal Fallback: Tap-to-Select, Tap-to-Drop ---
    // Works on ALL browsers including Opera for Android.
    chips.forEach(function(chip) {
        chip.addEventListener('click', _bilanzChipClick);
    });
    zones.forEach(function(zone) {
        zone.addEventListener('click', _bilanzZoneClick);
    });

    // Re-apply selection state after re-render
    if (_bilanzSelectedChipId) {
        var selEl = document.querySelector('[data-item-id="' + _bilanzSelectedChipId + '"]');
        if (selEl) {
            selEl.classList.add('bilanz-chip-selected');
            document.querySelectorAll('.bilanz-dropzone').forEach(function(z) {
                z.classList.add('bilanz-drop-ready');
            });
        } else {
            _bilanzSelectedChipId = null;
        }
    }
}

// =============================================
// Tap-to-Select State
// =============================================
var _bilanzSelectedChipId = null;
var _bilanzJustDragged = false;

function _bilanzSelectChip(itemId) {
    _bilanzDeselectChip();
    _bilanzSelectedChipId = itemId;
    var el = document.querySelector('[data-item-id="' + itemId + '"]');
    if (el) el.classList.add('bilanz-chip-selected');
    document.querySelectorAll('.bilanz-dropzone').forEach(function(z) {
        z.classList.add('bilanz-drop-ready');
    });
}

function _bilanzDeselectChip() {
    if (_bilanzSelectedChipId) {
        var el = document.querySelector('[data-item-id="' + _bilanzSelectedChipId + '"]');
        if (el) el.classList.remove('bilanz-chip-selected');
    }
    _bilanzSelectedChipId = null;
    document.querySelectorAll('.bilanz-dropzone').forEach(function(z) {
        z.classList.remove('bilanz-drop-ready');
    });
}

function _bilanzChipClick(e) {
    if (_bilanzJustDragged) { _bilanzJustDragged = false; return; }
    var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'button') return;
    if (e.target.textContent && e.target.textContent.trim() === '✕') return;
    e.stopPropagation();
    var itemId = this.dataset.itemId;

    // If another chip is already selected and we tap a placed item in a dropzone,
    // insert the selected chip BEFORE this item (enables reordering)
    if (_bilanzSelectedChipId && _bilanzSelectedChipId !== itemId) {
        var dropzone = this.closest ? this.closest('.bilanz-dropzone') : null;
        if (dropzone) {
            var cat = dropzone.dataset.cat;
            if (cat) {
                var selectedId = _bilanzSelectedChipId;
                _bilanzDeselectChip();
                // Remove selected item from its current position
                Object.keys(bilanzAssignments).forEach(function(c) {
                    bilanzAssignments[c] = bilanzAssignments[c].filter(function(id) { return id !== selectedId; });
                });
                // Insert before the tapped item
                var index = bilanzAssignments[cat].indexOf(itemId);
                if (index > -1) {
                    bilanzAssignments[cat].splice(index, 0, selectedId);
                } else {
                    bilanzAssignments[cat].push(selectedId);
                }
                renderBilanz();
                return;
            }
        }
    }

    if (_bilanzSelectedChipId === itemId) {
        _bilanzDeselectChip();
    } else {
        _bilanzSelectChip(itemId);
    }
}

function _bilanzZoneClick(e) {
    if (!_bilanzSelectedChipId) return;
    if (e.target.closest && e.target.closest('.bilanz-dropped-item')) return;
    if (e.target.closest && e.target.closest('.bilanz-chip')) return;
    e.stopPropagation();
    var cat = this.dataset.cat;
    if (cat) {
        var itemId = _bilanzSelectedChipId;
        _bilanzDeselectChip();
        _executeBilanzDrop(itemId, cat, e.target, e.clientX);
    }
}

// =============================================
// Pointer Events Drag (enhancement)
// =============================================
function _bilanzPointerDown(e) {
    if (e.pointerType !== 'touch') return;
    var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'button' || tag === 'select' || tag === 'textarea') return;
    if (e.target.closest && e.target.closest('input, button, select, textarea')) return;
    if (e.target.textContent && e.target.textContent.trim() === '✕') return;

    var chip = e.currentTarget;
    var itemId = chip.dataset.itemId;
    if (!itemId) return;

    // Do NOT call e.preventDefault() here — let click events fire for tap-to-select
    e.stopPropagation();

    _bilanzTouchState = {
        itemId: itemId,
        startX: e.clientX,
        startY: e.clientY,
        clone: null,
        isDragging: false,
        sourceChip: chip,
        offsetX: 0,
        offsetY: 0,
        pointerId: e.pointerId
    };

    window.addEventListener('pointermove', _bilanzPointerMove);
    window.addEventListener('pointerup', _bilanzPointerEnd);
    window.addEventListener('pointercancel', _bilanzPointerEnd);
}

function _bilanzPointerMove(e) {
    if (!_bilanzTouchState) return;
    if (e.pointerId !== _bilanzTouchState.pointerId) return;

    var dx = e.clientX - _bilanzTouchState.startX;
    var dy = e.clientY - _bilanzTouchState.startY;

    if (!_bilanzTouchState.isDragging) {
        if (Math.abs(dx) + Math.abs(dy) < 8) return;
        _bilanzTouchState.isDragging = true;
        _bilanzDeselectChip(); // Clear any tap selection when drag starts

        var rect = _bilanzTouchState.sourceChip.getBoundingClientRect();
        _bilanzTouchState.offsetX = e.clientX - rect.left;
        _bilanzTouchState.offsetY = e.clientY - rect.top;

        var clone = _bilanzTouchState.sourceChip.cloneNode(true);
        clone.id = 'bilanz-touch-clone';
        clone.style.cssText =
            'position:fixed;z-index:999999;pointer-events:none;opacity:0.85;' +
            'width:' + rect.width + 'px;transform:scale(1.05);' +
            'box-shadow:0 8px 25px rgba(0,0,0,0.4);transition:none;' +
            'left:' + (e.clientX - _bilanzTouchState.offsetX) + 'px;' +
            'top:' + (e.clientY - _bilanzTouchState.offsetY) + 'px;';
        document.body.appendChild(clone);
        _bilanzTouchState.clone = clone;
        _bilanzTouchState.sourceChip.style.opacity = '0.3';
    }

    e.preventDefault();

    if (_bilanzTouchState.clone) {
        _bilanzTouchState.clone.style.left = (e.clientX - _bilanzTouchState.offsetX) + 'px';
        _bilanzTouchState.clone.style.top = (e.clientY - _bilanzTouchState.offsetY) + 'px';
    }

    document.querySelectorAll('.bilanz-dropzone').forEach(function(z) { z.classList.remove('drag-over'); });
    if (_bilanzTouchState.clone) _bilanzTouchState.clone.style.display = 'none';
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (_bilanzTouchState.clone) _bilanzTouchState.clone.style.display = '';
    if (el) {
        var zone = el.closest ? el.closest('.bilanz-dropzone') : null;
        if (zone) zone.classList.add('drag-over');
    }
}

function _bilanzPointerEnd(e) {
    if (!_bilanzTouchState) return;
    if (e.pointerId !== _bilanzTouchState.pointerId) return;

    window.removeEventListener('pointermove', _bilanzPointerMove);
    window.removeEventListener('pointerup', _bilanzPointerEnd);
    window.removeEventListener('pointercancel', _bilanzPointerEnd);

    document.querySelectorAll('.bilanz-dropzone').forEach(function(z) { z.classList.remove('drag-over'); });

    if (_bilanzTouchState.sourceChip) {
        _bilanzTouchState.sourceChip.style.opacity = '';
    }

    if (_bilanzTouchState.isDragging && _bilanzTouchState.clone) {
        _bilanzJustDragged = true; // Suppress the upcoming click event
        _bilanzTouchState.clone.style.display = 'none';
        var target = document.elementFromPoint(e.clientX, e.clientY);
        _bilanzTouchState.clone.remove();
        if (target) {
            var zone = target.closest ? target.closest('.bilanz-dropzone') : null;
            if (zone && zone.dataset.cat) {
                _executeBilanzDrop(_bilanzTouchState.itemId, zone.dataset.cat, target, e.clientX);
            }
        }
    } else if (_bilanzTouchState.clone) {
        _bilanzTouchState.clone.remove();
    }

    _bilanzTouchState = null;
}

function _bilanzTouchCleanup() {
    if (!_bilanzTouchState) return;
    window.removeEventListener('pointermove', _bilanzPointerMove);
    window.removeEventListener('pointerup', _bilanzPointerEnd);
    window.removeEventListener('pointercancel', _bilanzPointerEnd);
    document.querySelectorAll('.bilanz-dropzone').forEach(function(z) { z.classList.remove('drag-over'); });
    if (_bilanzTouchState.sourceChip) _bilanzTouchState.sourceChip.style.opacity = '';
    if (_bilanzTouchState.clone) _bilanzTouchState.clone.remove();
    _bilanzTouchState = null;
}

function removeBilanzItem(cat, itemId) {
    bilanzAssignments[cat] = bilanzAssignments[cat].filter(function(id) { return id !== itemId; });
    delete bilanzItemValues[itemId];
    renderBilanz();
}

function saveBilanzItemValue(itemId, value) {
    if (value !== '' && value != null) {
        bilanzItemValues[itemId] = parseFloat(String(value).replace(',', '.'));
    } else {
        bilanzItemValues[itemId] = null;
    }
}

function saveBilanzSummary(key, value) {
    if (value !== '' && value != null) {
        bilanzSummary[key] = parseFloat(String(value).replace(',', '.'));
    } else {
        bilanzSummary[key] = null;
    }
}

// --- Correct values ---
function getCorrectBilanzMappings() {
    return {
        'bebaute_grundstuecke': 'av',
        'maschinen': 'av',
        'fuhrpark': 'av',
        'bga': 'av',
        'rohstoffe': 'uv',
        'hilfsstoffe': 'uv',
        'betriebsstoffe': 'uv',
        'unfertige_erzeugnisse': 'uv',
        'fertige_erzeugnisse': 'uv',
        'handelswaren': 'uv',
        'forderungen_ll': 'uv',
        'bank': 'uv',
        'kasse': 'uv',
        'darlehen': 'lv',
        'verbindlichkeiten_ll': 'kv',
        'sonstige_verbindlichkeiten': 'kv'
    };
}

function getCorrectBilanzOrder() {
    return {
        'av': ['bebaute_grundstuecke', 'maschinen', 'fuhrpark', 'bga'],
        'uv': ['rohstoffe', 'hilfsstoffe', 'betriebsstoffe', 'unfertige_erzeugnisse', 'fertige_erzeugnisse', 'handelswaren', 'forderungen_ll', 'bank', 'kasse'],
        'lv': ['darlehen'],
        'kv': ['verbindlichkeiten_ll', 'sonstige_verbindlichkeiten']
    };
}

function getCorrectBilanzValues() {
    var data = AppState.inventarData;
    if (!data || !data.aktiva) return null;
    var anlage = 0, umlauf = 0, ek = 0, lang = 0, kurz = 0;
    data.aktiva.forEach(function(a) {
        if (a.name === 'Anlagevermögen') anlage = a.value;
        if (a.name === 'Umlaufvermögen') umlauf = a.value;
    });
    data.passiva.forEach(function(p) {
        if (p.name === 'Eigenkapital') ek = p.value;
        if (p.name === 'Langfristige Verbindl.') lang = p.value;
        if (p.name === 'Kurzfristige Verbindl.') kurz = p.value;
    });
    return { sumAV: anlage, sumUV: umlauf, eigenkapital: ek, sumLV: lang, sumKV: kurz,
        sumAktiva: anlage + umlauf, sumPassiva: ek + lang + kurz };
}

// Ersetzt Einzelposten-Werte durch korrekte Summen pro SubKategorie
function getCorrectBilanzItemValues() {
    var vals = {};
    if (AppState.inventurData) {
        var correctSubMappings = typeof getCorrectInventarSubMappings === 'function' ? getCorrectInventarSubMappings() : {};
        AppState.inventurData.forEach(function(item) {
            var subCat = correctSubMappings[item.id];
            if (subCat) {
                var val = item.totalValue != null ? item.totalValue : (item.amount * item.pricePerUnit);
                vals[subCat] = (vals[subCat] || 0) + val;
            }
        });
    }
    return vals;
}

// --- Validation ---
function validateBilanz() {
    var feedback = document.getElementById('bilanz-validation-feedback');
    var correctMappings = getCorrectBilanzMappings();
    var correctVals = getCorrectBilanzValues();
    var correctItemVals = getCorrectBilanzItemValues();
    if (!correctVals) { feedback.innerHTML = '<span style="color: #ef4444;">❌ Keine Daten aus dem Inventar.</span>'; return; }

    var tolerance = 0.01;

    // 1. Check all items are assigned
    var activeSubCats = getActiveSubCategories();
    var assignedCount = 0;
    Object.keys(bilanzAssignments).forEach(function(c) { assignedCount += bilanzAssignments[c].length; });
    var posErrors = 0;
    var orderErrors = 0;
    var valErrors = 0;

    var correctOrder = getCorrectBilanzOrder();
    var activeOrder = {};
    Object.keys(correctOrder).forEach(function(c) {
        activeOrder[c] = correctOrder[c].filter(function(id) { return activeSubCats.indexOf(id) !== -1; });
    });

    Object.keys(bilanzAssignments).forEach(function(cat) {
        bilanzAssignments[cat].forEach(function(itemId, i) {
            var expectedItemId = activeOrder[cat] ? activeOrder[cat][i] : null;
            var isPosError = correctMappings[itemId] !== cat;
            var isOrderError = false;
            if (isPosError) {
                posErrors++;
            } else if (expectedItemId && expectedItemId !== itemId) {
                isOrderError = true;
                orderErrors++;
            }
            
            var el = document.getElementById('bv-' + itemId);
            var wrapper = document.getElementById('bchip-' + itemId);
            var uv = bilanzItemValues[itemId];
            var cv = correctItemVals[itemId];
            var isValError = uv == null || isNaN(uv) || Math.abs(uv - cv) > tolerance;
            if (isValError) valErrors++;
            
            if (el) {
                el.style.borderWidth = '2px';
                if (isValError) {
                    el.style.borderColor = '#ef4444';
                    el.style.background = 'rgba(239, 68, 68, 0.1)';
                } else {
                    el.style.borderColor = '#10b981';
                    el.style.background = 'rgba(16, 185, 129, 0.1)';
                }
            }
            if (wrapper) {
                if (isPosError || isOrderError) {
                    wrapper.style.borderColor = '#ef4444';
                    wrapper.style.boxShadow = '0 0 0 1px #ef4444';
                } else {
                    wrapper.style.borderColor = '#10b981';
                    wrapper.style.boxShadow = '0 0 0 1px #10b981';
                }
            }
        });
    });

    if (assignedCount < activeSubCats.length) {
        feedback.innerHTML = '<span style="color: #ef4444;">❌ Noch ' + (activeSubCats.length - assignedCount) + ' Kategorien nicht zugeordnet.</span>';
        return;
    }
    if (posErrors > 0) {
        feedback.innerHTML = '<span style="color: #ef4444;">❌ ' + posErrors + ' Kategorien dem falschen Bereich zugeordnet.</span>';
        return;
    }
    if (orderErrors > 0) {
        feedback.innerHTML = '<span style="color: #ef4444;">❌ ' + orderErrors + ' Kategorien sind in der falschen Reihenfolge (Liquidation/Fälligkeit)!</span>';
        return;
    }
    if (valErrors > 0) {
        feedback.innerHTML = '<span style="color: #ef4444;">❌ ' + valErrors + ' Summen sind falsch aufaddiert oder fehlen.</span>';
        return;
    }

    // 4. Check summary values
    var sumFields = [
        ['bilanz-sumAV', bilanzSummary.sumAV, correctVals.sumAV, 'Σ Anlagevermögen'],
        ['bilanz-sumUV', bilanzSummary.sumUV, correctVals.sumUV, 'Σ Umlaufvermögen'],
        ['bilanz-eigenkapital', bilanzSummary.eigenkapital, correctVals.eigenkapital, 'Eigenkapital'],
        ['bilanz-sumLV', bilanzSummary.sumLV, correctVals.sumLV, 'Σ Langfr. Verb.'],
        ['bilanz-sumKV', bilanzSummary.sumKV, correctVals.sumKV, 'Σ Kurzfr. Verb.'],
        ['bilanz-sumAktiva', bilanzSummary.sumAktiva, correctVals.sumAktiva, 'Bilanzsumme Aktiva'],
        ['bilanz-sumPassiva', bilanzSummary.sumPassiva, correctVals.sumPassiva, 'Bilanzsumme Passiva']
    ];
    for (var i = 0; i < sumFields.length; i++) {
        var f = sumFields[i];
        var el = document.getElementById(f[0]);
        if (el) {
            el.style.borderWidth = '2px';
            if (f[1] == null || isNaN(f[1]) || Math.abs(f[1] - f[2]) > tolerance) {
                el.style.borderColor = '#ef4444';
                el.style.background = 'rgba(239, 68, 68, 0.1)';
                feedback.innerHTML = '<span style="color: #ef4444;">❌ ' + f[3] + (f[1] == null ? ' fehlt.' : ' ist falsch.') + '</span>';
                return;
            } else {
                el.style.borderColor = '#10b981';
                el.style.background = 'rgba(16, 185, 129, 0.1)';
            }
        }
    }

    feedback.innerHTML = '<span style="color: #10b981;">🎉 Die Bilanz ist korrekt! Die Waage ist im Gleichgewicht ⚖️</span><br>' +
        '<button class="btn-primary" style="margin-top:0.5rem; padding: 0.6rem;" onclick="setMode(\'buchung\')">Zur Buchführung wechseln →</button>';
}

// --- Lehrkraft-Passwort ---
var _bilanzLoadDataFirst = false;

function showBilanzPasswordModal(loadDataFirst) {
    _bilanzLoadDataFirst = !!loadDataFirst;
    var existing = document.getElementById('bilanz-pw-modal-overlay');
    if (existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.id = 'bilanz-pw-modal-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = '<div class="inventur-modal" style="max-width: 400px;">' +
        '<div class="inventur-modal-header"><span>🔒 Lehrkraft-Zugang (Bilanz)</span>' +
        '<button class="close-btn" onclick="document.getElementById(\'bilanz-pw-modal-overlay\').remove()">×</button></div>' +
        '<div class="inventur-modal-body"><p style="margin-bottom: 0.5rem;">Bitte Passwort eingeben:</p>' +
        '<input type="password" id="bilanz-pw-input" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--card-border); border-radius: 4px; background: rgba(0,0,0,0.2); color: var(--text-main); text-align: center; font-size: 1.1rem;" placeholder="Passwort" onkeydown="if(event.key===\'Enter\') checkBilanzPassword()">' +
        '<div id="bilanz-pw-error" style="color: #ef4444; font-size: 0.85rem; min-height: 1.2rem; margin-top: 0.25rem;"></div></div>' +
        '<div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1);">' +
        '<button class="btn-primary" style="margin: 0; width: 60%;" onclick="checkBilanzPassword()">Bestätigen</button></div></div>';
    document.body.appendChild(overlay);
    setTimeout(function() { document.getElementById('bilanz-pw-input').focus(); }, 100);
}

function checkBilanzPassword() {
    var input = document.getElementById('bilanz-pw-input');
    if (!input) return;
    if (input.value === 'BT2026!') {
        document.getElementById('bilanz-pw-modal-overlay').remove();
        if (_bilanzLoadDataFirst) {
            if (!AppState.inventurData || AppState.inventurData.length === 0) {
                if (typeof autoFillSolution === 'function') autoFillSolution();
            }
            if (!AppState.inventarData.aktiva || AppState.inventarData.aktiva.length === 0) {
                if (typeof autoFillInventar === 'function') autoFillInventar();
                if (typeof finishInventar === 'function') finishInventar();
            }
            autoFillBilanz();
            _bilanzLoadDataFirst = false;
        } else {
            showBilanzSolutionModal();
        }
    } else {
        document.getElementById('bilanz-pw-error').textContent = '❌ Falsches Passwort!';
        input.value = ''; input.focus();
    }
}

function showBilanzSolutionModal() {
    var cv = getCorrectBilanzValues();
    if (!cv) { alert('Bitte zuerst das Inventar abschließen.'); return; }
    var existing = document.getElementById('bilanz-solution-overlay');
    if (existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.id = 'bilanz-solution-overlay';
    overlay.className = 'inventur-modal-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = '<div class="inventur-modal" style="max-width: 550px; max-height: 85vh; overflow-y: auto;">' +
        '<div class="inventur-modal-header" style="background: #10b981;"><span>✅ Lösungsübersicht – Bilanz</span>' +
        '<button class="close-btn" onclick="document.getElementById(\'bilanz-solution-overlay\').remove()">×</button></div>' +
        '<div style="padding: 1rem;">' +
            '<div style="display: flex; border-bottom: 2px solid var(--text-main); margin-bottom: 0.5rem; padding-bottom: 0.3rem;">' +
                '<div style="flex:1; text-align: center; font-weight: bold;">Aktiva</div>' +
                '<div style="flex:1; text-align: center; font-weight: bold;">Passiva</div></div>' +
            '<div style="display: flex;">' +
                '<div style="flex:1; border-right: 2px solid var(--text-main); padding-right: 0.5rem;">' +
                    '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>AV:</span><span>' + formatEur(cv.sumAV) + '</span></div>' +
                    '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>UV:</span><span>' + formatEur(cv.sumUV) + '</span></div>' +
                    '<div style="border-top: 1px solid rgba(255,255,255,0.3); margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: bold;"><span>Summe:</span><span>' + formatEur(cv.sumAktiva) + '</span></div></div>' +
                '<div style="flex:1; padding-left: 0.5rem;">' +
                    '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>EK:</span><span>' + formatEur(cv.eigenkapital) + '</span></div>' +
                    '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Langfr.:</span><span>' + formatEur(cv.sumLV) + '</span></div>' +
                    '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0;"><span>Kurzfr.:</span><span>' + formatEur(cv.sumKV) + '</span></div>' +
                    '<div style="border-top: 1px solid rgba(255,255,255,0.3); margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: bold;"><span>Summe:</span><span>' + formatEur(cv.sumPassiva) + '</span></div></div>' +
            '</div></div>' +
        '<div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.1); display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">' +
            '<button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px;" onclick="autoFillBilanz()">📋 Werte übernehmen</button>' +
            '<button class="btn-primary" style="margin: 0; flex: 1; max-width: 250px; background: #6b7280;" onclick="document.getElementById(\'bilanz-solution-overlay\').remove()">Schließen</button></div></div>';
    document.body.appendChild(overlay);
}

function autoFillBilanz() {
    var correctMappings = getCorrectBilanzMappings();
    var correctItemVals = getCorrectBilanzItemValues();
    var cv = getCorrectBilanzValues();
    var activeSubCats = getActiveSubCategories();
    if (!cv) return;

    // Reset
    bilanzAssignments = { 'av': [], 'uv': [], 'lv': [], 'kv': [] };
    bilanzItemValues = {};

    var correctOrder = getCorrectBilanzOrder();
    Object.keys(bilanzAssignments).forEach(function(cat) {
        var orderForCat = correctOrder[cat] || [];
        orderForCat.forEach(function(subCatId) {
            if (activeSubCats.indexOf(subCatId) !== -1) {
                bilanzAssignments[cat].push(subCatId);
                bilanzItemValues[subCatId] = correctItemVals[subCatId];
            }
        });
    });

    // Fill summary values
    bilanzSummary.sumAV = cv.sumAV;
    bilanzSummary.sumUV = cv.sumUV;
    bilanzSummary.eigenkapital = cv.eigenkapital;
    bilanzSummary.sumLV = cv.sumLV;
    bilanzSummary.sumKV = cv.sumKV;
    bilanzSummary.sumAktiva = cv.sumAktiva;
    bilanzSummary.sumPassiva = cv.sumPassiva;

    var overlay = document.getElementById('bilanz-solution-overlay');
    if (overlay) overlay.remove();
    renderBilanz();
}

