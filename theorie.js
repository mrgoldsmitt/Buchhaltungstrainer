// =====================================================
// theorie.js - Theorie Modul (Inventur, Inventar, Bilanz)
// =====================================================

function renderTheorie() {
    const container = document.getElementById('theorie-container');
    if (!container) return;

    container.innerHTML = `
        <div class="theory-tabs">
            <button class="theory-tab-btn active" onclick="switchTheoryTab('inventur')">1. Inventur</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('inventar')">2. Inventar</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('bilanz')">3. Bilanz</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('erfolg')">4. Erfolgskonten</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('guv')">5. GuV</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('werkstoffe')">6. Werkstoffe</button>
            <button class="theory-tab-btn" onclick="switchTheoryTab('buchen')">7. Buchen</button>
        </div>
        <div id="theory-content" class="theory-content-area">
            <!-- Content injected here -->
        </div>
    `;

    // Load initial tab
    switchTheoryTab('inventur');
}

function switchTheoryTab(tab) {
    document.querySelectorAll('.theory-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector('.theory-tab-btn[onclick="switchTheoryTab(\'' + tab + '\')"]');
    if (activeBtn) activeBtn.classList.add('active');

    const contentArea = document.getElementById('theory-content');
    if (!contentArea) return;

    if (tab === 'inventur') {
        contentArea.innerHTML = getInventurTheoryHTML();
        // Auto-load first timeline
        setTimeout(() => showTimeline('stichtag'), 50);
    } else if (tab === 'inventar') {
        contentArea.innerHTML = getInventarTheoryHTML();
    } else if (tab === 'bilanz') {
        contentArea.innerHTML = getBilanzTheoryHTML();
    } else if (tab === 'erfolg') {
        contentArea.innerHTML = getErfolgTheoryHTML();
    } else if (tab === 'guv') {
        contentArea.innerHTML = getGuVTheoryHTML();
    } else if (tab === 'werkstoffe') {
        contentArea.innerHTML = getWerkstoffeTheoryHTML();
    } else if (tab === 'buchen') {
        contentArea.innerHTML = getBuchenTheoryHTML();
    }
}

function getInventurTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was ist eine Inventur?</h3>' +
        '<p>Die <strong>Inventur</strong> ist die Bestandsaufnahme aller Vermögensgegenstände und Schulden eines Unternehmens zu einem bestimmten Zeitpunkt. Hierbei wird durch <strong>Zählen, Messen, Wiegen oder Schätzen</strong> der tatsächliche Bestand ermittelt.</p>' +
        
        '<div class="example-box" style="margin-top: 1rem;">' +
            '<strong>Beispiel:</strong> Du betreibst einen Fahrradladen. Am Ende des Jahres zählst du alle Fahrräder, Ersatzteile (Reifen, Schläuche) und misst z.B. wie viel Liter Kettenöl noch im Fass sind. Außerdem listest du auf, wie viel Geld du auf dem Konto hast und welche Schulden noch bei der Bank offen sind.' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Arten der Inventur</h3>' +
        '<div class="layer-card">' +
            '<div class="layer-content" style="gap: 1rem;">' +
                '<div><strong>1. Körperliche Inventur:</strong> Zählen, Messen, Wiegen aller greifbaren Dinge (z.B. Waren, Bargeld, Maschinen).</div>' +
                '<div><strong>2. Buchinventur:</strong> Erfassen von unsichtbaren Vermögenswerten und Schulden anhand von Belegen und Kontoauszügen (z.B. Bankguthaben, Darlehen).</div>' +
                '<div><strong>3. Anlageninventur:</strong> Aufnahme des unbeweglichen Vermögens mithilfe einer Anlagenkarteikarte (z.B. Gebäude, Grundstücke, große Maschinen). Hier wird nicht jedes Jahr neu "gezählt", es sei denn, es wird etwas neu angeschafft oder verkauft.</div>' +
            '</div>' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Zeitpunkte der Inventurverfahren</h3>' +
        '<p>Das Gesetz schreibt vor, dass einmal im Jahr eine Inventur gemacht werden muss. Um den Betriebsablauf nicht zu sehr zu stören, gibt es verschiedene zulässige Zeitpunkte:</p>' +
        
        '<div class="timeline-interactive">' +
            '<div class="timeline-controls">' +
                '<button class="timeline-btn active" onclick="showTimeline(\'stichtag\')">Stichtagsinventur</button>' +
                '<button class="timeline-btn" onclick="showTimeline(\'verlegt\')">Verlegte Inventur</button>' +
                '<button class="timeline-btn" onclick="showTimeline(\'permanent\')">Permanente Inventur</button>' +
                '<button class="timeline-btn" onclick="showTimeline(\'stichprobe\')">Stichprobeninventur</button>' +
            '</div>' +
            '<div id="timeline-display" class="timeline-display">' +
                '<!-- Injected by JS -->' +
            '</div>' +
        '</div>' +
    '</div>';
}

function getInventarTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was ist das Inventar?</h3>' +
        '<p>Das <strong>Inventar</strong> ist das ausführliche und lückenlose Verzeichnis über das Vermögen und die Schulden eines Unternehmens. Es ist also das <strong>Ergebnis</strong> der Inventur.</p>' +
        '<p>Im Gegensatz zur Bilanz ist das Inventar sehr detailliert (alle Positionen werden einzeln mit Menge, Art und Wert aufgelistet) und wird in Staffelform untereinander geschrieben.</p>' +
        
        '<div class="example-box" style="margin-top: 1rem;">' +
            '<strong>Beispiel:</strong> Während du bei der Inventur gezählt hast ("5 Mountainbikes Typ Alp, je 400€"), schreibst du dies nun ordentlich strukturiert im Inventar auf und rechnest die Gesamtsumme aus ("Gesamtwert Mountainbikes: 2.000€").' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Aufbau des Inventars</h3>' +
        '<p>Das Inventar besteht immer aus drei Teilen, die streng sortiert werden müssen:</p>' +

        '<div class="inventar-schema">' +
            '<div class="schema-part part-a">' +
                '<h4>1. Vermögen (Aktiva)</h4>' +
                '<p><em>Sortiert nach Flüssigkeit (Wie schnell kann ich es zu Geld machen?)</em></p>' +
                '<ul>' +
                    '<li><strong>Anlagevermögen</strong> (Langfristig, z.B. Gebäude, Fuhrpark)</li>' +
                    '<li><strong>Umlaufvermögen</strong> (Kurzfristig, z.B. Waren, Bankguthaben, Kasse)</li>' +
                '</ul>' +
            '</div>' +
            '<div class="schema-part part-b">' +
                '<h4>2. Schulden (Passiva)</h4>' +
                '<p><em>Sortiert nach Fälligkeit (Wann muss ich die Rückzahlung leisten?)</em></p>' +
                '<ul>' +
                    '<li><strong>Langfristige Schulden</strong> (z.B. Hypotheken, Bankdarlehen)</li>' +
                    '<li><strong>Kurzfristige Schulden</strong> (z.B. offene Rechnungen / Verbindlichkeiten)</li>' +
                '</ul>' +
            '</div>' +
            '<div class="schema-part part-c">' +
                '<h4>3. Ermittlung des Eigenkapitals</h4>' +
                '<p><em>Die Differenz aus Vermögen und Schulden (Reinvermögen)</em></p>' +
                '<div class="formula-box">' +
                    '<span style="color:var(--secondary)">Summe des Vermögens</span><br>' +
                    '- <span style="color:#ef4444">Summe der Schulden</span><br>' +
                    '<hr>' +
                    '= <strong>Reinvermögen (Eigenkapital)</strong>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function getBilanzTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was ist eine Bilanz?</h3>' +
        '<p>Die <strong>Bilanz</strong> (von ital. bilancia = Waage) ist eine kurzgefasste Gegenüberstellung von Vermögen und Kapital in Form eines T-Kontos (Kontenform). Sie ist stark zusammengefasst und lässt die genauen Mengen weg.</p>' +
        '<p>Die Bilanz ist die gesetzlich vorgeschriebene Darstellung für das Finanzamt und die Veröffentlichung.</p>' +

        '<div class="example-box" style="margin-top: 1rem;">' +
            '<strong>Beispiel:</strong> Im Inventar stehen 5 Seiten mit allen Waren detailliert aufgelistet (Schrauben, Reifen, Helme etc. für insgesamt 20.000€). In der Bilanz steht nur noch eine einzige Zeile: <strong>"Vorräte: 20.000€"</strong>.' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Aufbau der Bilanz</h3>' +
        '<p>Auf der linken Seite (<strong>Aktiva</strong>) steht das Vermögen. Es zeigt, wo das Geld hingeflossen ist (Mittelverwendung).<br>' +
           'Auf der rechten Seite (<strong>Passiva</strong>) steht das Kapital (Eigen- und Fremdkapital/Schulden). Es zeigt, wo das Geld hergekommen ist (Mittelherkunft).</p>' +

        '<div class="bilanz-t-konto">' +
            '<div class="t-konto-header">BILANZ</div>' +
            '<div class="t-konto-sides">' +
                '<div class="t-konto-side left-side">' +
                    '<div class="side-title">AKTIVA (Mittelverwendung)</div>' +
                    '<ul class="ledger-list">' +
                        '<li><strong>A. Anlagevermögen</strong></li>' +
                        '<li class="sub-item">BGA, Maschinen</li>' +
                        '<li><strong>B. Umlaufvermögen</strong></li>' +
                        '<li class="sub-item">Waren, Bank, Kasse</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="t-konto-side right-side">' +
                    '<div class="side-title">PASSIVA (Mittelherkunft)</div>' +
                    '<ul class="ledger-list">' +
                        '<li><strong>A. Eigenkapital</strong></li>' +
                        '<li class="sub-item">Eigenkapital</li>' +
                        '<li><strong>B. Fremdkapital (Schulden)</strong></li>' +
                        '<li class="sub-item">Darlehen, VBL (Verbindlichkeiten)</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="t-konto-footer">' +
                '<div class="footer-sum"><strong>Bilanzsumme</strong> (z.B. 100.000€)</div>' +
                '<div class="footer-sum"><strong>Bilanzsumme</strong> (z.B. 100.000€)</div>' +
            '</div>' +
        '</div>' +
        
        '<p style="text-align:center; margin-top: 1rem;"><strong>Wichtig:</strong> Die Summe der linken und der rechten Seite muss immer auf den Cent genau gleich sein! Die Waage muss im Gleichgewicht stehen.</p>' +

        '<h3 style="margin-top: 2rem;">Was sind Bestandskonten?</h3>' +
        '<p>Das Wort kommt von <strong>„Bestand“</strong>. Bestandskonten sind Konten, auf denen wir die Dinge festhalten, die das Unternehmen <strong>besitzt</strong> oder <strong>schuldet</strong>. Sie werden direkt aus der Bilanz abgeleitet.</p>' +
        
        '<div class="layer-card">' +
            '<div class="layer-content">' +
                '<div><strong>📈 Aktive Bestandskonten:</strong> Hier stehen deine Besitztümer (z.B. Fahrräder im Lager, Geld bei der Bank).<br>' +
                '<em>Regel:</em> Zugänge stehen im <strong>Soll</strong> (links), Abgänge im <strong>Haben</strong> (rechts).</div>' +
                '<div style="margin-top: 1rem;"><strong>📉 Passive Bestandskonten:</strong> Hier stehen deine Schulden und dein Eigenkapital.<br>' +
                '<em>Regel:</em> Zugänge stehen im <strong>Haben</strong> (rechts), Abgänge im <strong>Soll</strong> (links).</div>' +
            '</div>' +
        '</div>' +

        '<div class="example-box" style="margin-top: 1.5rem;">' +
            '<strong>Merkregel:</strong> Bestandskonten sind wie ein „Foto“ deines Besitzes. Wenn du ein neues Fahrrad kaufst und bar bezahlst, ändert sich nur dein Bestand (mehr Fahrräder, weniger Geld in der Kasse). Du bist dadurch aber noch nicht sofort „reicher“ geworden – du hast nur Dinge getauscht.' +
        '</div>' +
    '</div>';
}

// --- Interactive Timeline Logic ---
function getErfolgTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was sind Erfolgskonten?</h3>' +
        '<p>Erfolgskonten heißen so, weil sie den <strong>Erfolg</strong> (Gewinn oder Verlust) deines Unternehmens beeinflussen. Hier geht es nicht nur um den Tausch von Dingen, sondern darum, ob du <strong>reicher</strong> oder <strong>ärmer</strong> wirst.</p>' +

        '<div class="two-column-grid" style="margin-top: 1.5rem;">' +
            '<div class="werkstoff-card" style="border-left: 5px solid #ef4444; text-align: left;">' +
                '<h4>📉 Aufwandskonten</h4>' +
                '<p>Hier werden alle Kosten festgehalten, die den „Reichtum“ (das Eigenkapital) deines Unternehmens <strong>mindern</strong>. Das sind Dinge, die verbraucht werden oder die du bezahlen musst, damit der Laden läuft.</p>' +
                '<div class="example-box" style="text-align: left;">' +
                    '<strong>Beispiele:</strong><br>' +
                    '• Miete für die Werkstatt<br>' +
                    '• Löhne für Mitarbeiter<br>' +
                    '• Strom & Heizung<br>' +
                    '• Materialverbrauch (Rohstoffe)' +
                '</div>' +
                '<p style="font-size: 0.8rem; margin-top: 0.5rem;"><em>Merkregel:</em> Aufwendungen stehen immer im <strong>Soll</strong> (links).</p>' +
            '</div>' +

            '<div class="werkstoff-card" style="border-left: 5px solid #10b981; text-align: left;">' +
                '<h4>📈 Ertragskonten</h4>' +
                '<p>Hier hältst du fest, was dein Unternehmen <strong>erwirtschaftet</strong>. Erträge <strong>mehren</strong> deinen Reichtum (das Eigenkapital).</p>' +
                '<div class="example-box" style="text-align: left;">' +
                    '<strong>Beispiele:</strong><br>' +
                    '• Verkauf von Fahrrädern<br>' +
                    '• Reparatur-Dienstleistungen<br>' +
                    '• Zinserträge von der Bank' +
                '</div>' +
                '<p style="font-size: 0.8rem; margin-top: 0.5rem;"><em>Merkregel:</em> Erträge stehen immer im <strong>Haben</strong> (rechts).</p>' +
            '</div>' +
        '</div>' +

        '<div class="formula-box" style="margin-top: 2rem; background: rgba(0, 134, 203, 0.05); text-align: left;">' +
            '<strong>Warum ist das wichtig?</strong><br>' +
            '<p>Bestandskonten zeigen nur, was da ist. Erfolgskonten zeigen, <strong>warum</strong> sich dein Eigenkapital verändert hat. Ohne Erfolgskonten wüsstest du am Ende des Jahres zwar, dass du mehr Geld hast, aber nicht, ob das durch Fahrradverkäufe oder durch ein gewonnenes Gewinnspiel kam.</p>' +
        '</div>' +
    '</div>';
}

function getGuVTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was ist die GuV (Gewinn- und Verlustrechnung)?</h3>' +
        '<p>Die <strong>GuV</strong> ist wie eine große Sammelstelle. Am Ende des Jahres werden alle Aufwands- und Ertragskonten hierher übertragen, um den Gesamterfolg zu berechnen.</p>' +

        '<div class="guv-comparison" style="display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;">' +
            '<div style="flex: 1; min-width: 250px;">' +
                '<h4 style="color:#0086cb">Das Bilanz-Foto 📸</h4>' +
                '<p>Die Bilanz zeigt den Zustand zu einem exakten <strong>Zeitpunkt</strong> (z.B. am 31.12. um 24:00 Uhr). Es ist eine Bestandsaufnahme.</p>' +
            '</div>' +
            '<div style="flex: 1; min-width: 250px;">' +
                '<h4 style="color:#f59e0b">Der GuV-Film 🎥</h4>' +
                '<p>Die GuV zeigt den Verlauf über einen <strong>Zeitraum</strong> (z.B. vom 01.01. bis 31.12.). Sie zeigt alles, was im Jahr passiert ist.</p>' +
            '</div>' +
        '</div>' +

        '<div class="formula-box" style="margin-top: 2rem;">' +
            '<h4 style="text-align: center; margin-bottom: 1rem;">Die Erfolgs-Formel</h4>' +
            '<div style="display: flex; justify-content: center; align-items: center; gap: 1rem; font-size: 1.1rem; flex-wrap: wrap;">' +
                '<span style="color:#10b981; font-weight:700;">Summe aller Erträge</span>' +
                '<span>-</span>' +
                '<span style="color:#ef4444; font-weight:700;">Summe aller Aufwendungen</span>' +
                '<span>=</span>' +
                '<span style="color:#0086cb; font-weight:800; border-bottom: 2px solid #0086cb;">Gewinn / Verlust</span>' +
            '</div>' +
        '</div>' +

        '<p style="margin-top: 2rem;"><strong>Der Abschluss:</strong> Der am Ende berechnete Gewinn wird auf das <strong>Eigenkapital-Konto</strong> in der Bilanz übertragen. So schließt sich der Kreis: Dein „Erfolg“ aus dem Jahr macht dein Unternehmen in der Bilanz schlussendlich wertvoller.</p>' +
    '</div>';
}

function showTimeline(type) {
    document.querySelectorAll('.timeline-btn').forEach(btn => btn.classList.remove('active'));
    const container = document.querySelector('.timeline-controls');
    if (container) {
        container.querySelectorAll('.timeline-btn').forEach(b => {
            if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(type)) {
                b.classList.add('active');
            }
        });
    }

    const display = document.getElementById('timeline-display');
    if (!display) return;

    let content = '';

    if (type === 'stichtag') {
        content = 
            '<h4>Stichtagsinventur</h4>' +
            '<p>Die körperliche Bestandsaufnahme erfolgt zeitnah zum Bilanzstichtag (meist 31.12.). Gemäß Gesetzgebung darf dies <strong>10 Tage davor oder danach</strong> passieren, sofern Zu- und Abgänge wert- und mengenmäßig genau dokumentiert werden.</p>' +
            '<div class="vis-timeline" style="margin-left: 2rem; margin-right: 2rem;">' +
                '<div class="vis-line"></div>' +
                '<div class="vis-node" style="left: 30%;"><span class="vis-label">21.12.</span></div>' +
                '<div class="vis-node node-major" style="left: 50%;"><span class="vis-label"><strong>31.12. (Stichtag)</strong></span></div>' +
                '<div class="vis-node" style="left: 70%;"><span class="vis-label">10.01.</span></div>' +
                '<div class="vis-highlight" style="left: 30%; width: 40%; background: rgba(16, 185, 129, 0.3);"></div>' +
            '</div>' +
            '<div class="vis-caption"><span class="color-dot" style="background:#10b981;"></span> Erlaubter Zeitraum für die Zählung (10 Tage Kulanz)</div>';
    } else if (type === 'verlegt') {
        content = 
            '<h4>Verlegte Inventur</h4>' +
            '<p>Die Zählung wird terminlich verlegt, da am 31.12. z.B. das Weihnachtsgeschäft brummt. Sie darf <strong>bis zu 3 Monate vor</strong> oder <strong>bis zu 2 Monate nach</strong> dem Bilanzstichtag erfolgen. Wichtig: Die Ergebnisse müssen dann wertmäßig auf den Stichtag vor- bzw. zurückgerechnet werden (Wertfortschreibung/Wertrückrechnung).</p>' +
            '<div class="vis-timeline">' +
                '<div class="vis-line"></div>' +
                '<div class="vis-node node-danger" style="left: 20%;"><span class="vis-label">01.10.</span></div>' +
                '<div class="vis-node node-major" style="left: 50%;"><span class="vis-label"><strong>31.12. (Stichtag)</strong></span></div>' +
                '<div class="vis-node node-danger" style="left: 70%;"><span class="vis-label">28./29.02.</span></div>' +
                '<div class="vis-highlight highlight-before" style="left: 20%; width: 30%; background: rgba(245, 158, 11, 0.3);"></div>' +
                '<div class="vis-highlight highlight-after" style="left: 50%; width: 20%; background: rgba(59, 130, 246, 0.3);"></div>' +
            '</div>' +
            '<div class="vis-caption" style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">' +
                '<div><span class="color-dot" style="background:rgba(245,158,11,1);"></span> Frühester Zählbereich (Wertfortschreibung auf 31.12)</div>' +
                '<div><span class="color-dot" style="background:rgba(59,130,246,1);"></span> Spätester Zählbereich (Wertrückrechnung auf 31.12)</div>' +
            '</div>';
    } else if (type === 'permanent') {
        content = 
            '<h4>Permanente Inventur</h4>' +
            '<p>Das Lager wird computergestützt permanent (fortlaufend) überwacht (Warenwirtschaftssystem). Es wird pro Artikel nur einmal an <strong>einem beliebigen Tag im Jahr</strong> gezählt ("rollierende Inventur"), um das System zu überprüfen. Am 31.12. reicht dann meist ein Ausdruck (Buchinventur).</p>' +
            '<div class="vis-timeline" style="margin-left: 2rem; margin-right: 4rem;">' +
                '<div class="vis-line"></div>' +
                '<div class="vis-node" style="left: 0%;"><span class="vis-label">01.01.</span></div>' +
                '<div class="vis-mark" style="left: 15%; animation-delay: 0.1s;"></div>' +
                '<div class="vis-mark" style="left: 30%; animation-delay: 0.3s;"></div>' +
                '<div class="vis-mark" style="left: 55%; animation-delay: 0.5s;"></div>' +
                '<div class="vis-mark" style="left: 75%; animation-delay: 0.7s;"></div>' +
                '<div class="vis-node node-major" style="left: 93%;"><span class="vis-label"><strong>31.12. (Stichtag)</strong></span></div>' +
            '</div>' +
            '<div class="vis-caption"><span class="color-dot" style="background:#f39c12;"></span> Zählung einzelner Artikelgruppen über das Jahr verteilt</div>';
    } else if (type === 'stichprobe') {
        content = 
            '<h4>Stichprobeninventur</h4>' +
            '<p>Kommt bei sehr hohen Beständen an gleichartigen Gütern zum Einsatz (Schraubenfabrik, Kohlelager). Es wird nur ein <strong>mathematisch-statistisch berechneter Teil (Stichprobe)</strong> gezählt. Wenn z.B. 10% der Kisten gezogen werden und man die durchschnittliche Menge hochrechnet, gilt das als Gesamtwert. Spart extrem viel Aufwand.</p>' +
            '<div class="vis-boxes">' +
                '<div class="vis-box"></div><div class="vis-box"></div><div class="vis-box boxed-sample"></div><div class="vis-box"></div>' +
                '<div class="vis-box boxed-sample"></div><div class="vis-box"></div><div class="vis-box"></div><div class="vis-box"></div>' +
                '<div class="vis-box"></div><div class="vis-box boxed-sample"></div><div class="vis-box"></div><div class="vis-box"></div>' +
            '</div>' +
            '<div class="vis-caption"><span class="color-dot" style="background:#4682B4;"></span> Gezählte Stichproben (aus denen mit 99% Wahrscheinlichkeit der Gesamtwert ermittelt wird)</div>';
    }

    display.innerHTML = content;
}

function getWerkstoffeTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Was sind Werkstoffe?</h3>' +
        '<p>In einem Produktionsbetrieb werden verschiedene <strong>Materialien (Werkstoffe)</strong> benötigt, um ein Produkt herzustellen. Man unterscheidet drei Arten:</p>' +

        '<div class="werkstoff-cards">' +

            '<div class="werkstoff-card rohstoff">' +
                '<div class="werkstoff-icon">🔩</div>' +
                '<h4>Rohstoffe</h4>' +
                '<p class="werkstoff-def">Rohstoffe sind Materialien, die den <strong>Hauptbestandteil</strong> eines Produkts bilden. Sie gehen direkt in das Produkt ein und sind im fertigen Erzeugnis deutlich erkennbar.</p>' +
                '<div class="werkstoff-merkmal"><strong>Merkmal:</strong> Ohne Rohstoffe gibt es kein Produkt!</div>' +
                '<div class="example-box" style="margin-top: 0.75rem;">' +
                    '<strong>Beispiele (Fire Bike GmbH):</strong><br>' +
                    '• Fahrradrahmen aus Aluminium<br>' +
                    '• Reifen und Schläuche<br>' +
                    '• Lenker und Sattel<br>' +
                    '• Bremsscheiben' +
                '</div>' +
            '</div>' +

            '<div class="werkstoff-card hilfsstoff">' +
                '<div class="werkstoff-icon">🔧</div>' +
                '<h4>Hilfsstoffe</h4>' +
                '<p class="werkstoff-def">Hilfsstoffe gehen ebenfalls in das Produkt ein, bilden aber nur einen <strong>Nebenbestandteil</strong>. Sie sind im fertigen Produkt oft kaum sichtbar und machen nur einen kleinen Teil des Werts aus.</p>' +
                '<div class="werkstoff-merkmal"><strong>Merkmal:</strong> Sie sind im Produkt drin, aber nur "Nebensache".</div>' +
                '<div class="example-box" style="margin-top: 0.75rem;">' +
                    '<strong>Beispiele (Fire Bike GmbH):</strong><br>' +
                    '• Schrauben und Muttern<br>' +
                    '• Lack und Farbe für den Rahmen<br>' +
                    '• Aufkleber / Logos<br>' +
                    '• Schweißdraht' +
                '</div>' +
            '</div>' +

            '<div class="werkstoff-card betriebsstoff">' +
                '<div class="werkstoff-icon">⛽</div>' +
                '<h4>Betriebsstoffe</h4>' +
                '<p class="werkstoff-def">Betriebsstoffe gehen <strong>nicht</strong> in das Produkt ein. Sie werden aber benötigt, damit die Maschinen und der Betrieb überhaupt laufen können. Sie werden bei der Produktion <strong>verbraucht</strong>.</p>' +
                '<div class="werkstoff-merkmal"><strong>Merkmal:</strong> Ohne sie läuft die Fabrik nicht – aber im Fahrrad stecken sie nicht drin!</div>' +
                '<div class="example-box" style="margin-top: 0.75rem;">' +
                    '<strong>Beispiele (Fire Bike GmbH):</strong><br>' +
                    '• Strom für die Maschinen<br>' +
                    '• Schmiermittel / Maschinenöl<br>' +
                    '• Kühlmittel für die Schweißanlage<br>' +
                    '• Reinigungsmittel für die Werkstatt' +
                '</div>' +
            '</div>' +

        '</div>' +

        '<h3 style="margin-top: 2rem;">Zusammenfassung: Der Unterschied auf einen Blick</h3>' +

        '<div class="werkstoff-table-wrap">' +
            '<table class="werkstoff-table">' +
                '<thead>' +
                    '<tr>' +
                        '<th></th>' +
                        '<th>Geht ins Produkt ein?</th>' +
                        '<th>Hauptbestandteil?</th>' +
                        '<th>Beispiel (Fahrrad)</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td><strong style="color:#0086cb">Rohstoffe</strong></td>' +
                        '<td style="text-align:center">✅ Ja</td>' +
                        '<td style="text-align:center">✅ Ja</td>' +
                        '<td>Rahmen, Reifen</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td><strong style="color:#f59e0b">Hilfsstoffe</strong></td>' +
                        '<td style="text-align:center">✅ Ja</td>' +
                        '<td style="text-align:center">❌ Nein</td>' +
                        '<td>Schrauben, Lack</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td><strong style="color:#10b981">Betriebsstoffe</strong></td>' +
                        '<td style="text-align:center">❌ Nein</td>' +
                        '<td style="text-align:center">❌ Nein</td>' +
                        '<td>Strom, Maschinenöl</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +

        '<div class="example-box" style="margin-top: 1.5rem;">' +
            '<strong>Eselsbrücke:</strong> Stell dir ein Fahrrad vor. Alles, was du am Fahrrad <strong>sehen und anfassen</strong> kannst (Rahmen, Räder) → <strong>Rohstoffe</strong>. Was drin ist, aber kaum auffällt (Schrauben, Farbe) → <strong>Hilfsstoffe</strong>. Was die Fabrik braucht, um das Fahrrad zu bauen, aber nicht drin steckt (Strom, Öl) → <strong>Betriebsstoffe</strong>.' +
        '</div>' +
    '</div>';
}

function getBuchenTheoryHTML() {
    return '<div class="theory-box">' +
        '<h3>Buchungen auf Bestandskonten</h3>' +
        '<p>Bestandskonten erfassen die Bestände an Vermögen und Kapital. Wir unterscheiden zwischen <strong>Aktiven</strong> (Was wir haben) und <strong>Passiven</strong> (Wie wir es finanziert haben/Schulden) Bestandskonten.</p>' +

        '<div class="example-box" style="margin-top: 1rem; border-left: 5px solid var(--primary);">' +
            '<strong>💡 Didaktischer Hinweis:</strong> In der Buchführung werden zwei Bücher unterschieden:<br>' +
            '• Das <strong>Journal (Grundbuch)</strong> hält alle Buchungssätze in zeitlicher Reihenfolge fest.<br>' +
            '• Das <strong>Hauptbuch (T-Konten)</strong> zeigt die sachliche Ordnung auf den einzelnen Konten.' +
        '</div>' +

        '<div class="two-column-grid" style="margin-top: 1.5rem;">' +
            '<div class="werkstoff-card" style="border-left: 5px solid var(--secondary);">' +
                '<h4>📈 Aktivkonten</h4>' +
                '<p style="font-size: 0.9rem;">(z.B. Bank, Kasse, Fuhrpark, Rohstoffe)</p>' +
                '<div style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 8px; margin-top: 0.5rem; font-family: monospace; font-size: 0.85rem;">' +
                    '<div style="display:flex; justify-content:space-between; border-bottom: 1px solid #ccc;"><span>Soll (+)</span><span>Haben (-)</span></div>' +
                    '<div style="display:flex; justify-content:space-between; color: var(--text-muted);"><span>Anfangsbestand<br>Zugänge</span><span>Abgänge<br>Schlussbestand</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="werkstoff-card" style="border-left: 5px solid #f59e0b;">' +
                '<h4>📉 Passivkonten</h4>' +
                '<p style="font-size: 0.9rem;">(z.B. Eigenkapital, Darlehen, Verbindlichkeiten)</p>' +
                '<div style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 8px; margin-top: 0.5rem; font-family: monospace; font-size: 0.85rem;">' +
                    '<div style="display:flex; justify-content:space-between; border-bottom: 1px solid #ccc;"><span>Soll (-)</span><span>Haben (+)</span></div>' +
                    '<div style="display:flex; justify-content:space-between; color: var(--text-muted);"><span>Abgänge<br>Schlussbestand</span><span>Anfangsbestand<br>Zugänge</span></div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Die vier Arten der Bilanzveränderung</h3>' +
        '<p>Jeder Geschäftsvorfall verändert die Bilanz auf eine von vier Arten:</p>' +

        '<div class="werkstoff-cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">' +
            '<div class="werkstoff-card">' +
                '<strong>1. Aktivtausch</strong><br>' +
                '<p style="font-size: 0.8rem; color: var(--text-muted);">Ein Aktivposten wird mehr, ein anderer Aktivposten wird weniger. Die Bilanzsumme bleibt gleich.</p>' +
                '<div class="example-box" style="font-size: 0.75rem;">Beispiel: Wir kaufen Briefmarken bar (Kasse weniger - , Briefmarken/Sonst. Betr. Ausstatt. mehr +).</div>' +
            '</div>' +
            '<div class="werkstoff-card">' +
                '<strong>2. Passivtausch</strong><br>' +
                '<p style="font-size: 0.8rem; color: var(--text-muted);">Ein Passivposten wird mehr, ein anderer Passivposten wird weniger. Die Bilanzsumme bleibt gleich.</p>' +
                '<div class="example-box" style="font-size: 0.75rem;">Beispiel: Wir wandeln eine kurzfristige Verbindlichkeit in ein langfristiges Darlehen um.</div>' +
            '</div>' +
            '<div class="werkstoff-card">' +
                '<strong>3. Aktiv-Passiv-Mehrung</strong><br>' +
                '<p style="font-size: 0.8rem; color: var(--text-muted);">Ein Aktivposten und ein Passivposten werden gleichzeitig mehr. Die Bilanzsumme steigt.</p>' +
                '<div class="example-box" style="font-size: 0.75rem;">Beispiel: Zielkauf von Reifen (Vorräte mehr +, Verbindlichkeiten mehr +).</div>' +
            '</div>' +
            '<div class="werkstoff-card">' +
                '<strong>4. Aktiv-Passiv-Minderung</strong><br>' +
                '<p style="font-size: 0.8rem; color: var(--text-muted);">Ein Aktivposten und ein Passivposten werden gleichzeitig weniger. Die Bilanzsumme sinkt.</p>' +
                '<div class="example-box" style="font-size: 0.75rem;">Beispiel: Wir bezahlen eine Lieferantenrechnung per Bank (Bank weniger - , Verbindlichkeiten weniger -).</div>' +
            '</div>' +
        '</div>' +

        '<h3 style="margin-top: 2rem;">Buchungen auf Erfolgskonten</h3>' +
        '<p>Erfolgskonten beeinflussen direkt den Gewinn und damit das Eigenkapital. Merke dir: <strong>Aufwendungen (Kosten)</strong> mindern das Kapital, <strong>Erträge (Einnahmen)</strong> mehren es.</p>' +

        '<div class="layer-card" style="margin-top: 1rem;">' +
            '<div class="layer-content" style="text-align: left;">' +
                '<div><strong>📉 Aufwandskonten:</strong> Haben ihren <strong>Zuwachs immer im Soll</strong> (links). Typische Konten: Mietaufwand, Löhne, Zinsaufwand.</div>' +
                '<div style="margin-top: 1rem;"><strong>📈 Ertragskonten:</strong> Haben ihren <strong>Zuwachs immer im Haben</strong> (rechts). Typische Konten: Umsatzerlöse, Zinserträge.</div>' +
            '</div>' +
        '</div>' +

        '<div class="example-box" style="margin-top: 1.5rem; text-align: left;">' +
            '<strong>Der Buchungssatz-Mantel:</strong> Jede Buchung folgt dem Schema <strong>„Soll an Haben“</strong>. Zuerst nennst du das Konto, auf dem im Soll gebucht wird, dann das Wörtchen „an“, und dann das Konto für die Haben-Buchung.' +
        '</div>' +
    '</div>';
}
