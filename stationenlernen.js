// =====================================================
// stationenlernen.js - Stationenlernen Modul
// =====================================================

const STATIONEN = [
    // =====================================================
    // STATION 1: Buchführung
    // =====================================================
    {
        id: 1,
        title: 'Station 1: Buchführung',
        description: 'Grundlagen der Buchführung – Warum wird überhaupt „Buch geführt"?',
        icon: '📖',
        tasks: [
            // AFB I – Wissen (Reproduktion)
            {
                id: 's1t1',
                type: 'single',
                afb: 1,
                question: 'Welche Unternehmen sind laut Handelsgesetzbuch (HGB) zur Buchführung verpflichtet?',
                options: [
                    'Nur Aktiengesellschaften',
                    'Alle Kaufleute (d.h. alle im Handelsregister eingetragenen Unternehmen)',
                    'Nur Unternehmen mit mehr als 50 Mitarbeitern',
                    'Nur das Finanzamt selbst'
                ],
                correct: 1,
                feedback: 'Richtig! Nach § 238 HGB ist jeder Kaufmann verpflichtet, Bücher zu führen. Kaufmann ist, wer im Handelsregister eingetragen ist.'
            },
            {
                id: 's1t2',
                type: 'single',
                afb: 1,
                question: 'Welcher Grundsatz beschreibt, dass jeder Geschäftsvorfall durch einen Beleg nachgewiesen werden muss?',
                options: [
                    'Grundsatz der Klarheit',
                    'Keine Buchung ohne Beleg',
                    'Grundsatz der Wirtschaftlichkeit',
                    'Grundsatz der Vorsicht'
                ],
                correct: 1,
                feedback: 'Genau! „Keine Buchung ohne Beleg" ist einer der wichtigsten Grundsätze ordnungsgemäßer Buchführung (GoB). Jede Buchung braucht einen Nachweis.'
            },
            // AFB II – Anwenden (Transfer)
            {
                id: 's1t3',
                type: 'single',
                afb: 2,
                question: 'Die Fire Bike GmbH kauft Reifen im Wert von 3.000 €. Der Lieferant gewährt 30 Tage Zahlungsziel. Was bedeutet „auf Ziel kaufen" für die Buchführung?',
                options: [
                    'Das Unternehmen muss sofort bar bezahlen',
                    'Es entsteht eine Forderung gegenüber dem Lieferanten',
                    'Es entsteht eine Verbindlichkeit (Schuld) gegenüber dem Lieferanten – die Bezahlung erfolgt später',
                    'Der Kauf wird nicht gebucht, weil noch kein Geld geflossen ist'
                ],
                correct: 2,
                feedback: 'Korrekt! Bei einem „Kauf auf Ziel" wird sofort gebucht – es entsteht eine Verbindlichkeit, weil das Unternehmen dem Lieferanten noch Geld schuldet.'
            },
            {
                id: 's1t4',
                type: 'single',
                afb: 2,
                question: 'Ein Geschäftsfall lautet: „Wir bezahlen die Telefonrechnung über 200 € per Banküberweisung." Welcher Buchungssatz ist korrekt?',
                options: [
                    'Bank an Telefonaufwand 200 €',
                    'Telefonaufwand an Bank 200 €',
                    'Kasse an Verbindlichkeiten 200 €',
                    'Telefonaufwand an Kasse 200 €'
                ],
                correct: 1,
                feedback: 'Richtig! Aufwand (Telefonaufwand) wird im Soll gebucht und das Bankkonto (Abgang) im Haben. Merke: „Soll an Haben".'
            },
            // AFB III – Beurteilen (Reflexion)
            {
                id: 's1t5',
                type: 'single',
                afb: 3,
                question: 'Stell dir vor, ein kleines Start-up führt keine ordentliche Buchführung und kann dem Finanzamt keine Belege vorlegen. Beurteile: Welche Konsequenz ist am wahrscheinlichsten?',
                options: [
                    'Das Finanzamt ignoriert die fehlende Buchführung, da es sich um ein kleines Unternehmen handelt',
                    'Das Finanzamt schätzt die Einnahmen und Ausgaben – meist zum Nachteil des Unternehmens – und es drohen Bußgelder',
                    'Das Unternehmen kann trotzdem problemlos Steuern sparen',
                    'Es ändert sich nichts, da die Buchführung freiwillig ist'
                ],
                correct: 1,
                feedback: 'Richtig! Bei fehlender oder mangelhafter Buchführung darf das Finanzamt die Besteuerungsgrundlagen schätzen (§ 162 AO). Das fällt in der Regel ungünstig für das Unternehmen aus. Außerdem können Bußgelder und sogar Steuerstrafverfahren drohen.'
            }
        ]
    },

    // =====================================================
    // STATION 2: Rohstoffe, Hilfsstoffe, Betriebsstoffe
    // =====================================================
    {
        id: 2,
        title: 'Station 2: Werkstoffe',
        description: 'Rohstoffe, Hilfsstoffe und Betriebsstoffe unterscheiden und zuordnen.',
        icon: '🔩',
        tasks: [
            // AFB I
            {
                id: 's2t1',
                type: 'single',
                afb: 1,
                question: 'Was sind Rohstoffe?',
                options: [
                    'Materialien, die den Hauptbestandteil eines Produkts bilden',
                    'Materialien, die nur für den Betrieb der Maschinen gebraucht werden',
                    'Materialien, die als Nebenbestandteil in das Produkt eingehen',
                    'Alle Materialien, die ein Unternehmen besitzt'
                ],
                correct: 0,
                feedback: 'Richtig! Rohstoffe bilden den Hauptbestandteil des fertigen Produkts und sind deutlich erkennbar (z.B. Aluminium-Rahmen bei einem Fahrrad).'
            },
            {
                id: 's2t2',
                type: 'single',
                afb: 1,
                question: 'Was unterscheidet Betriebsstoffe von Hilfs- und Rohstoffen?',
                options: [
                    'Betriebsstoffe sind teurer als Rohstoffe',
                    'Betriebsstoffe gehen NICHT in das Produkt ein, werden aber für die Produktion benötigt',
                    'Betriebsstoffe werden nur in Handwerksbetrieben verwendet',
                    'Betriebsstoffe sind gleichbedeutend mit Hilfsstoffen'
                ],
                correct: 1,
                feedback: 'Genau! Betriebsstoffe werden bei der Herstellung verbraucht (z.B. Strom, Maschinenöl), stecken aber nicht im fertigen Produkt drin.'
            },
            // AFB II
            {
                id: 's2t3',
                type: 'matching',
                afb: 2,
                question: 'Ordne die folgenden Materialien der Fire Bike GmbH der richtigen Kategorie zu:',
                pairs: [
                    { item: 'Fahrradrahmen', target: 'Rohstoff' },
                    { item: 'Schrauben', target: 'Hilfsstoff' },
                    { item: 'Maschinenöl', target: 'Betriebsstoff' },
                    { item: 'Fahrradreifen', target: 'Rohstoff' },
                    { item: 'Lack für den Rahmen', target: 'Hilfsstoff' },
                    { item: 'Strom für Schweißanlage', target: 'Betriebsstoff' }
                ],
                categories: ['Rohstoff', 'Hilfsstoff', 'Betriebsstoff'],
                feedback: 'Super! Rohstoffe = Hauptbestandteile (Rahmen, Reifen). Hilfsstoffe = Nebenbestandteile im Produkt (Schrauben, Lack). Betriebsstoffe = für den Betrieb, nicht im Produkt (Öl, Strom).'
            },
            {
                id: 's2t4',
                type: 'single',
                afb: 2,
                question: 'Eine Bäckerei verwendet Mehl, Zucker, Backpapier und Strom. Welche Zuordnung ist korrekt?',
                options: [
                    'Mehl = Hilfsstoff, Zucker = Rohstoff, Backpapier = Betriebsstoff, Strom = Betriebsstoff',
                    'Mehl = Rohstoff, Zucker = Hilfsstoff, Backpapier = Betriebsstoff, Strom = Betriebsstoff',
                    'Mehl = Rohstoff, Zucker = Rohstoff, Backpapier = Hilfsstoff, Strom = Hilfsstoff',
                    'Mehl = Betriebsstoff, Zucker = Betriebsstoff, Backpapier = Rohstoff, Strom = Hilfsstoff'
                ],
                correct: 1,
                feedback: 'Richtig! Mehl ist der Hauptbestandteil (Rohstoff). Zucker ist ein Nebenbestandteil (Hilfsstoff). Backpapier und Strom gehen nicht ins Brot ein (Betriebsstoffe).'
            },
            // AFB III
            {
                id: 's2t5',
                type: 'single',
                afb: 3,
                question: 'Ein Möbelhersteller verwendet bei einem Schrank Holzplatten, Schrauben, Leim, Schleifpapier und Strom. Ein Kollege behauptet: „Leim ist ein Betriebsstoff, weil er so günstig ist." Beurteile diese Aussage.',
                options: [
                    'Die Aussage ist richtig – alles was günstig ist, gilt als Betriebsstoff',
                    'Die Aussage ist falsch – der Preis ist nicht das Kriterium. Leim geht in das Produkt ein (klebt das Holz zusammen) und ist daher ein Hilfsstoff',
                    'Die Aussage ist richtig – Leim ist kein sichtbarer Teil des Schranks',
                    'Die Aussage ist falsch – Leim ist ein Rohstoff, weil er unverzichtbar ist'
                ],
                correct: 1,
                feedback: 'Korrekt! Es kommt nicht auf den Preis an, sondern darauf, ob das Material ins Produkt eingeht. Leim geht ins Produkt ein (klebt das Holz zusammen) und ist ein Nebenbestandteil → Hilfsstoff. Schleifpapier dagegen geht nicht ins Produkt ein → Betriebsstoff.'
            }
        ]
    },

    // =====================================================
    // STATION 3: Inventur, Inventar, Bilanz
    // =====================================================
    {
        id: 3,
        title: 'Station 3: Inventur, Inventar & Bilanz',
        description: 'Unterscheide die drei Begriffe und verstehe den Zusammenhang.',
        icon: '📊',
        tasks: [
            // AFB I
            {
                id: 's3t1',
                type: 'single',
                afb: 1,
                question: 'Was versteht man unter einer Inventur?',
                options: [
                    'Die Aufstellung der Bilanz in Kontoform',
                    'Die mengenmäßige Bestandsaufnahme aller Vermögensgegenstände und Schulden (Zählen, Messen, Wiegen)',
                    'Die Kurzfassung des Inventars',
                    'Die Eintragung von Geschäftsvorfällen ins Hauptbuch'
                ],
                correct: 1,
                feedback: 'Richtig! Die Inventur ist die tatsächliche Bestandsaufnahme – man geht ins Lager und zählt, misst oder wiegt alle Bestände.'
            },
            {
                id: 's3t2',
                type: 'matching',
                afb: 1,
                question: 'Ordne die Beschreibungen dem richtigen Begriff zu:',
                pairs: [
                    { item: 'Tätigkeit: Zählen, Messen, Wiegen', target: 'Inventur' },
                    { item: 'Ausführliches Verzeichnis in Staffelform', target: 'Inventar' },
                    { item: 'Kurzfassung in Kontoform (T-Form)', target: 'Bilanz' },
                    { item: 'Ergebnis der Bestandsaufnahme', target: 'Inventar' },
                    { item: 'Aktiva und Passiva gegenübergestellt', target: 'Bilanz' },
                    { item: 'Körperliche Aufnahme der Bestände', target: 'Inventur' }
                ],
                categories: ['Inventur', 'Inventar', 'Bilanz'],
                feedback: 'Inventur = die Tätigkeit (zählen, messen, wiegen). Inventar = das ausführliche Ergebnis (Verzeichnis). Bilanz = die Zusammenfassung in Kontoform.'
            },
            // AFB II
            {
                id: 's3t3',
                type: 'single',
                afb: 2,
                question: 'Die Fire Bike GmbH hat folgende Werte ermittelt: Vermögen 150.000 €, Schulden 90.000 €. Wie hoch ist das Eigenkapital in der Bilanz?',
                options: [
                    '240.000 €',
                    '60.000 €',
                    '90.000 €',
                    '150.000 €'
                ],
                correct: 1,
                feedback: 'Richtig! Eigenkapital = Vermögen – Schulden = 150.000 € – 90.000 € = 60.000 €. Das Eigenkapital steht auf der Passivseite der Bilanz.'
            },
            {
                id: 's3t4',
                type: 'single',
                afb: 2,
                question: 'In welcher Reihenfolge sind die drei Schritte korrekt angeordnet?',
                options: [
                    'Bilanz → Inventar → Inventur',
                    'Inventar → Inventur → Bilanz',
                    'Inventur → Inventar → Bilanz',
                    'Inventur → Bilanz → Inventar'
                ],
                correct: 2,
                feedback: 'Genau! Erst wird gezählt (Inventur), dann wird das ausführliche Verzeichnis erstellt (Inventar), und zum Schluss wird die Kurzfassung in Kontoform aufgestellt (Bilanz).'
            },
            // AFB III
            {
                id: 's3t5',
                type: 'single',
                afb: 3,
                question: 'Ein Schüler sagt: „Die Bilanz und das Inventar sind dasselbe – beide zeigen Vermögen und Schulden." Beurteile diese Aussage und wähle die beste Begründung.',
                options: [
                    'Die Aussage ist richtig – beides zeigt Vermögen und Schulden, also ist es das Gleiche',
                    'Die Aussage ist falsch – die Bilanz zeigt nur Vermögen, das Inventar nur Schulden',
                    'Die Aussage ist falsch – beide zeigen zwar Vermögen und Schulden, unterscheiden sich aber in Detailtiefe (Inventar: einzelne Positionen mit Mengen; Bilanz: zusammengefasste Werte) und Darstellungsform (Inventar: Staffelform; Bilanz: Kontoform / T-Form)',
                    'Die Aussage ist richtig – der einzige Unterschied ist die Schriftgröße'
                ],
                correct: 2,
                feedback: 'Korrekt! Die beiden Instrumente haben den gleichen Inhalt (Vermögen und Schulden), unterscheiden sich aber grundlegend: Das Inventar ist detailliert (Menge, Art, Einzelwert) und in Staffelform. Die Bilanz ist zusammengefasst und in T-Kontoform (Aktiva links, Passiva rechts).'
            }
        ]
    },

    // =====================================================
    // STATION 4: Inventurarten & Zeitpunkte
    // =====================================================
    {
        id: 4,
        title: 'Station 4: Inventurarten & Zeitpunkte',
        description: 'Lerne die verschiedenen Arten der Inventur und deren Zeitpunkte kennen.',
        icon: '📅',
        tasks: [
            // AFB I
            {
                id: 's4t1',
                type: 'single',
                afb: 1,
                question: 'Bei welcher Inventurart werden die Bestände durch Zählen, Messen und Wiegen erfasst?',
                options: [
                    'Buchinventur',
                    'Körperliche Inventur',
                    'Anlageninventur',
                    'Stichprobeninventur'
                ],
                correct: 1,
                feedback: 'Richtig! Bei der körperlichen Inventur geht man physisch ins Lager und zählt, misst oder wiegt die Bestände.'
            },
            {
                id: 's4t2',
                type: 'matching',
                afb: 1,
                question: 'Ordne die Inventurarten der passenden Beschreibung zu:',
                pairs: [
                    { item: 'Bestände werden gezählt/gewogen', target: 'Körperliche Inventur' },
                    { item: 'Prüfung anhand von Belegen/Kontoauszügen', target: 'Buchinventur' },
                    { item: 'Aufnahme mithilfe von Anlagenkarteikarten', target: 'Anlageninventur' }
                ],
                categories: ['Körperliche Inventur', 'Buchinventur', 'Anlageninventur'],
                feedback: 'Körperliche Inventur = anfassen und zählen. Buchinventur = Belege prüfen (z.B. Kontoauszüge). Anlageninventur = langlebige Güter werden per Karteikarte verwaltet.'
            },
            // AFB II
            {
                id: 's4t3',
                type: 'single',
                afb: 2,
                question: 'Ein großer Supermarkt hat im Dezember Hochsaison (Weihnachtsgeschäft) und kann am 31.12. unmöglich alle Waren zählen. Welches Inventurverfahren wäre am besten geeignet?',
                options: [
                    'Stichtagsinventur – er muss trotzdem am 31.12. zählen',
                    'Verlegte Inventur – die Zählung kann bis zu 3 Monate vorher oder 2 Monate danach verlegt werden',
                    'Der Supermarkt braucht gar keine Inventur zu machen',
                    'Anlageninventur – er nutzt einfach die Karteikarten'
                ],
                correct: 1,
                feedback: 'Richtig! Die verlegte Inventur erlaubt es, bis zu 3 Monate vor oder 2 Monate nach dem Bilanzstichtag zu zählen. Die Ergebnisse müssen dann wertmäßig auf den 31.12. umgerechnet werden.'
            },
            {
                id: 's4t4',
                type: 'single',
                afb: 2,
                question: 'Die Fire Bike GmbH nutzt ein modernes Warenwirtschaftssystem, das alle Lagerbewegungen digital erfasst. Jeder Artikel wird einmal im Jahr stichprobenartig gezählt, um den Computerbestand zu prüfen. Welches Verfahren beschreibt dies?',
                options: [
                    'Stichtagsinventur',
                    'Verlegte Inventur',
                    'Permanente Inventur',
                    'Stichprobeninventur'
                ],
                correct: 2,
                feedback: 'Genau! Bei der permanenten Inventur wird der Bestand fortlaufend per Computer geführt. Jeder Artikel wird einmal im Jahr kontrolliert gezählt (rollierend). Am 31.12. reicht ein Systemausdruck.'
            },
            // AFB III
            {
                id: 's4t5',
                type: 'single',
                afb: 3,
                question: 'Eine Schraubenfabrik hat Millionen gleichartiger Schrauben im Lager. Der Chef sagt: „Wir zählen jede einzelne Schraube – das ist gesetzlich vorgeschrieben." Beurteile, ob der Chef recht hat, und begründe.',
                options: [
                    'Der Chef hat recht – jede Schraube muss einzeln gezählt werden',
                    'Der Chef hat unrecht – bei Massenbeständen gleichartiger Güter darf die Stichprobeninventur genutzt werden. Dabei wird nur ein repräsentativer Teil gezählt und statistisch auf den Gesamtbestand hochgerechnet. Das spart enorm viel Aufwand und ist gesetzlich erlaubt.',
                    'Der Chef hat unrecht – er muss gar keine Inventur machen, weil es zu viele Schrauben sind',
                    'Der Chef hat recht – allerdings nur alle 5 Jahre'
                ],
                correct: 1,
                feedback: 'Genau! Bei sehr großen Mengen gleichartiger Güter ist die Stichprobeninventur erlaubt. Man wählt eine statistisch repräsentative Stichprobe und rechnet hoch. Das ist effizienter und gesetzeskonform. Der Chef muss nicht jede einzelne Schraube zählen.'
            }
        ]
    }
];

// =====================================================
// State Management
// =====================================================

let stationState = {
    currentStation: null, // null = overview, 1-4 = station detail
    results: {} // { 's1t1': { answered: true, correct: true, selected: 0 }, ... }
};

// Try to restore from sessionStorage
try {
    const saved = sessionStorage.getItem('stationState');
    if (saved) {
        const parsed = JSON.parse(saved);
        stationState.results = parsed.results || {};
    }
} catch (e) { /* ignore */ }

function saveStationState() {
    try {
        sessionStorage.setItem('stationState', JSON.stringify({
            results: stationState.results
        }));
    } catch (e) { /* ignore */ }
}

// =====================================================
// Render Functions
// =====================================================

function renderStationen() {
    const container = document.getElementById('stationen-container');
    if (!container) return;

    if (stationState.currentStation === null) {
        renderStationOverview(container);
    } else {
        renderStationDetail(container, stationState.currentStation);
    }
}

function renderStationOverview(container) {
    const totalTasks = STATIONEN.reduce((sum, s) => sum + s.tasks.length, 0);
    const totalCorrect = Object.values(stationState.results).filter(r => r.correct).length;
    const totalAnswered = Object.values(stationState.results).filter(r => r.answered).length;

    let html = `
        <div class="station-overview-header">
            <div>
                <h3 style="color: var(--primary); margin-bottom: 0.25rem;">Stationenlernen</h3>
                <p class="station-intro" style="margin: 0;">Bearbeite die Stationen der Reihe nach. Jede Station hat 5 Aufgaben mit steigendem Schwierigkeitsgrad.</p>
            </div>
            <div class="station-score-display">
                <span class="score-highlight">${totalCorrect}</span> / ${totalTasks} richtig
                ${totalAnswered > 0 ? `<span style="margin-left: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">(${totalAnswered} bearbeitet)</span>` : ''}
            </div>
        </div>
    `;

    if (totalAnswered > 0) {
        html += `<button class="btn-reset" onclick="resetAllStations()" style="margin-bottom: 1.5rem; width: auto; padding: 0.4rem 1rem;">🔄 Alle Stationen zurücksetzen</button>`;
    }

    html += '<div class="station-grid">';

    STATIONEN.forEach(station => {
        const stationTasks = station.tasks;
        const answeredCount = stationTasks.filter(t => stationState.results[t.id]?.answered).length;
        const correctCount = stationTasks.filter(t => stationState.results[t.id]?.correct).length;
        const isCompleted = answeredCount === stationTasks.length;
        const progressPercent = Math.round((answeredCount / stationTasks.length) * 100);

        html += `
            <div class="station-card ${isCompleted ? 'completed' : ''}" onclick="openStation(${station.id})">
                <div class="station-card-header">
                    ${isCompleted ? '<span class="status-icon">✓ Fertig</span>' : ''}
                    <h3>${station.icon} ${station.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${station.description}</p>
                </div>
                <div class="station-progress">
                    <div style="background: rgba(255,255,255,0.1); border-radius: 4px; height: 6px; margin-bottom: 0.5rem; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: ${isCompleted ? 'var(--secondary)' : 'var(--primary)'}; border-radius: 4px; transition: width 0.3s;"></div>
                    </div>
                    ${answeredCount} / ${stationTasks.length} Aufgaben
                    ${correctCount > 0 ? ` · <span style="color: var(--secondary);">${correctCount} richtig</span>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderStationDetail(container, stationId) {
    const station = STATIONEN.find(s => s.id === stationId);
    if (!station) return;

    let html = `
        <div class="station-detail-view">
            <button class="btn-back" onclick="backToOverview()">← Zurück zur Übersicht</button>
            <h2 style="color: var(--primary); margin-bottom: 0.25rem;">${station.icon} ${station.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${station.description}</p>
            <div class="tasks-list">
    `;

    station.tasks.forEach((task, index) => {
        const result = stationState.results[task.id];
        const afbLabel = task.afb === 1 ? 'AFB I · Wissen' : task.afb === 2 ? 'AFB II · Anwenden' : 'AFB III · Beurteilen';
        const afbClass = task.afb === 1 ? 'mandatory' : task.afb === 2 ? 'interactive' : 'bonus';
        const cardClass = result?.answered ? (result.correct ? 'correct' : 'wrong') : '';

        html += `
            <div class="task-card ${cardClass}" id="task-${task.id}">
                <div class="task-header">
                    <div class="header-left">
                        <strong>Aufgabe ${index + 1}</strong>
                        ${result?.answered ? (result.correct ? ' <span style="color: var(--secondary);">✓</span>' : ' <span style="color: #ef4444;">✗</span>') : ''}
                    </div>
                    <span class="task-badge ${afbClass}">${afbLabel}</span>
                </div>
                <div class="task-question">${task.question}</div>
        `;

        if (task.type === 'single') {
            html += renderSingleChoiceTask(task, result);
        } else if (task.type === 'matching') {
            html += renderMatchingTask(task, result);
        }

        // Feedback
        if (result?.answered) {
            let feedbackText = task.feedback;
            if (!result.correct) {
                feedbackText = 'Falsch! ' + feedbackText.replace(/^(Richtig!|Genau!|Korrekt!|Super!)\s*/i, '');
            }
            
            html += `
                <div class="task-feedback">
                    <div class="feedback-box ${result.correct ? 'success' : 'error'}">
                        ${result.correct ? '✓ ' : '✗ '}${feedbackText}
                    </div>
                </div>
            `;
        }

        html += '</div>'; // .task-card
    });

    html += '</div></div>';
    container.innerHTML = html;

    // Initialize matching tasks drag/drop
    station.tasks.forEach(task => {
        if (task.type === 'matching' && !stationState.results[task.id]?.answered) {
            initMatchingInteraction(task);
        }
    });
}

// =====================================================
// Single Choice Rendering
// =====================================================

function renderSingleChoiceTask(task, result) {
    let html = '<div class="task-options">';

    task.options.forEach((option, idx) => {
        const isAnswered = result?.answered;
        let optionClass = 'option-btn';

        if (isAnswered) {
            if (idx === task.correct) {
                optionClass += ' correct';
            } else if (idx === result.selected && !result.correct) {
                optionClass += ' wrong';
            }
        } else if (result?.selected === idx) {
            optionClass += ' selected';
        }

        const disabled = isAnswered ? 'disabled' : '';

        html += `<button class="${optionClass}" ${disabled} onclick="selectStationOption('${task.id}', ${idx})">${option}</button>`;
    });

    html += '</div>';

    if (!result?.answered) {
        html += `<button class="btn-primary" onclick="checkStationAnswer('${task.id}')" style="margin-top: 1rem;">Antwort prüfen</button>`;
    }

    return html;
}

// =====================================================
// Matching Task Rendering
// =====================================================

function renderMatchingTask(task, result) {
    if (result?.answered) {
        return renderMatchingResult(task, result);
    }

    let html = '<div class="matching-container" id="matching-' + task.id + '">';

    // Item pool
    html += '<div class="matching-pool-label">Begriffe (klicke zum Auswählen):</div>';
    html += '<div class="matching-pool" id="pool-' + task.id + '">';
    // Shuffle items
    const shuffled = [...task.pairs].sort(() => Math.random() - 0.5);
    shuffled.forEach((pair, idx) => {
        html += `<div class="match-item interactive" data-item="${pair.item}" onclick="selectMatchItem(this, '${task.id}')">${pair.item}</div>`;
    });
    html += '</div>';

    // Category targets
    html += '<div class="matching-pool-label" style="margin-top: 1rem;">Kategorien (klicke, um den ausgewählten Begriff hierhin zu legen):</div>';

    task.categories.forEach(cat => {
        html += `<div style="margin-bottom: 0.75rem;">`;
        html += `<div style="font-weight: bold; margin-bottom: 0.3rem; color: var(--primary);">${cat}:</div>`;
        html += `<div class="matching-pool" id="cat-${task.id}-${cat.replace(/\s+/g, '_')}" data-category="${cat}" onclick="placeMatchItem(this, '${task.id}')">`;
        html += '</div></div>';
    });

    html += '</div>';
    html += `<button class="btn-primary" onclick="checkMatchingAnswer('${task.id}')" style="margin-top: 0.5rem;">Antwort prüfen</button>`;

    return html;
}

function renderMatchingResult(task, result) {
    let html = '<div class="matching-container">';

    task.categories.forEach(cat => {
        html += `<div style="margin-bottom: 0.75rem;">`;
        html += `<div style="font-weight: bold; margin-bottom: 0.3rem; color: var(--primary);">${cat}:</div>`;
        html += '<div class="matching-pool">';

        const assigned = result.assignments?.[cat] || [];
        assigned.forEach(item => {
            const pair = task.pairs.find(p => p.item === item);
            const isCorrect = pair && pair.target === cat;
            html += `<div class="match-item ${isCorrect ? 'status-correct' : 'status-wrong'}">${item}</div>`;
        });

        // Show missing items
        const correctItems = task.pairs.filter(p => p.target === cat).map(p => p.item);
        const missing = correctItems.filter(item => !assigned.includes(item));
        missing.forEach(item => {
            html += `<div class="match-item" style="opacity: 0.5; border-style: dashed;">${item} ✓</div>`;
        });

        html += '</div></div>';
    });

    html += '</div>';
    return html;
}

// =====================================================
// Matching Interaction Logic
// =====================================================

let selectedMatchItem = null;

function selectMatchItem(el, taskId) {
    // Remove previous selection
    document.querySelectorAll(`#matching-${taskId} .match-item.selected`).forEach(item => {
        item.classList.remove('selected');
    });

    el.classList.add('selected');
    selectedMatchItem = { element: el, item: el.dataset.item, taskId: taskId };
}

function placeMatchItem(targetPool, taskId) {
    if (!selectedMatchItem || selectedMatchItem.taskId !== taskId) return;

    // Move item to category pool
    const itemEl = selectedMatchItem.element;
    itemEl.classList.remove('selected', 'interactive');
    itemEl.onclick = function() { returnMatchItem(this, taskId); };

    targetPool.appendChild(itemEl);
    selectedMatchItem = null;
}

function returnMatchItem(el, taskId) {
    // Move back to pool
    const pool = document.getElementById('pool-' + taskId);
    if (pool) {
        el.classList.add('interactive');
        el.onclick = function() { selectMatchItem(this, taskId); };
        pool.appendChild(el);
    }
}

function initMatchingInteraction(task) {
    // Nothing extra needed - click handlers are set inline
}

// =====================================================
// Answer Checking
// =====================================================

function selectStationOption(taskId, optionIdx) {
    const result = stationState.results[taskId];
    if (result?.answered) return;

    // Temporary selection state
    if (!stationState.results[taskId]) {
        stationState.results[taskId] = { answered: false, correct: false, selected: null };
    }
    stationState.results[taskId].selected = optionIdx;

    // Update UI
    const taskCard = document.getElementById('task-' + taskId);
    if (taskCard) {
        taskCard.querySelectorAll('.option-btn').forEach((btn, idx) => {
            btn.classList.toggle('selected', idx === optionIdx);
        });
    }
}

function checkStationAnswer(taskId) {
    const result = stationState.results[taskId];
    if (!result || result.selected === null || result.selected === undefined) {
        return; // Nothing selected
    }

    // Find the task
    let task = null;
    for (const station of STATIONEN) {
        task = station.tasks.find(t => t.id === taskId);
        if (task) break;
    }
    if (!task) return;

    const isCorrect = result.selected === task.correct;
    stationState.results[taskId] = {
        answered: true,
        correct: isCorrect,
        selected: result.selected
    };

    saveStationState();
    renderStationen();
}

function checkMatchingAnswer(taskId) {
    // Find the task
    let task = null;
    for (const station of STATIONEN) {
        task = station.tasks.find(t => t.id === taskId);
        if (task) break;
    }
    if (!task) return;

    // Collect assignments from DOM
    const assignments = {};
    let totalPlaced = 0;

    task.categories.forEach(cat => {
        const catPool = document.getElementById('cat-' + taskId + '-' + cat.replace(/\s+/g, '_'));
        const items = [];
        if (catPool) {
            catPool.querySelectorAll('.match-item').forEach(el => {
                items.push(el.dataset.item);
                totalPlaced++;
            });
        }
        assignments[cat] = items;
    });

    if (totalPlaced < task.pairs.length) {
        // Not all items placed yet – show hint
        return;
    }

    // Check correctness
    let allCorrect = true;
    task.pairs.forEach(pair => {
        const catItems = assignments[pair.target] || [];
        if (!catItems.includes(pair.item)) {
            allCorrect = false;
        }
    });

    stationState.results[taskId] = {
        answered: true,
        correct: allCorrect,
        selected: null,
        assignments: assignments
    };

    saveStationState();
    renderStationen();
}

// =====================================================
// Navigation
// =====================================================

function openStation(stationId) {
    stationState.currentStation = stationId;
    renderStationen();
    // Scroll to top
    const main = document.querySelector('.main-content');
    if (main) main.scrollTop = 0;
}

function backToOverview() {
    stationState.currentStation = null;
    renderStationen();
}

function resetAllStations() {
    if (!confirm('Möchtest du wirklich alle Stationen zurücksetzen? Dein Fortschritt geht verloren.')) return;

    stationState.results = {};
    stationState.currentStation = null;
    saveStationState();
    renderStationen();
}
