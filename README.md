# 📊 Buchhaltungstrainer & ERP-Simulator

[![Version](https://img.shields.io/badge/version-0.2.6-blue.svg)](https://github.com/mrgoldsmitt/Buchhaltungstrainer/releases)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Platform](https://img.shields.io/badge/platform-Web%20SPA-brightgreen.svg)]()
[![No Backend](https://img.shields.io/badge/backend-None%20(Pure%20Client--Side)-orange.svg)]()

Der **Buchhaltungstrainer** ist eine interaktive, responsive Single-Page-Webanwendung zur didaktischen Vermittlung der kaufmännischen Buchführung, Bilanzierung und betriebswirtschaftlichen Prozesse (vom physischen Lagerbestand bis zur vollständigen ERP-Simulation).

Konzipiert für den Einsatz in Berufskollegs, Wirtschaftsschulen, Ausbildungsbetrieben sowie im Selbststudium.

---

## 🚀 Features & Didaktische Module

Das didaktische Konzept basiert auf dem Modellunternehmen **Fire Bike GmbH** (mittelständischer Hersteller von City-Bikes, Mountainbikes und E-Bikes) und führt Lernende schrittweise durch den gesamten kaufmännischen Zyklus:

### 1. 📖 Theorie & Grundlagen
* Kompaktes Nachschlagewerk zu den Grundsätzen ordnungsmäßiger Buchführung (GoB).
* Übersichtlicher Industriekontenrahmen (IKR).
* Erklärungen zu Bestands- und Erfolgskonten, Vorsteuer/Umsatzsteuer sowie Abschreibungen (AfA).

### 2. 📦 Inventur (Lagererfassung)
* Physische Bestandserfassung im Lager der *Fire Bike GmbH*.
* Erfassen von Roh-, Hilfs- und Betriebsstoffen, unfertigen/fertigen Erzeugnissen sowie Handelswaren.
* Automatische Erkennung und Buchung von Inventurdifferenzen (Schwund, Bruch, Diebstahl).

### 3. 📋 Inventar (§ 240 HGB)
* Strukturierte Bestandsaufstellung nach Vermögen (Anlage- und Umlaufvermögen) und Schulden.
* Gliederung nach Liquidität und Fälligkeit.
* Automatische Berechnung des Reinvermögens (Eigenkapital).

### 4. ⚖️ Bilanz (§ 266 HGB)
* Interaktives Erstellen der T-Bilanz (Aktiva vs. Passiva).
* Visualisierung der Bilanzveränderungen (Aktivtausch, Passivtausch, Bilanzverlängerung, Bilanzverkürzung).
* Live-Validierung der Bilanzgleichheit ($\sum \text{Aktiva} = \sum \text{Passiva}$).

### 5. 📒 Finanzbuchhaltung (FiBu)
* **Geschäftsfall-Generator**: Über 235 praxisnahe Belege und Geschäftsfälle.
* **T-Konten (Hauptbuch)** & **Journal (Grundbuch)** in Echtzeit.
* **Zusammengesetzte Buchungssätze**: Dynamische Eingabe von $N$ Soll- an $M$ Haben-Buchungen.
* **Prüfungsmodus (Exam Challenge)**:
  * 5-Minuten-Countdown mit 10 zufälligen Buchungssätzen.
  * Manipulationssicheres, druckbares PDF-Leistungszertifikat (jsPDF) inklusive Notenberechnung und Fehleranalyse.

### 6. 🏭 ERP-Warenwirtschaftssimulation
Vollständiger Lebenszyklus eines Industrieunternehmens:
* **Dashboard & KPI**: Liquiditätsstatus, Lagerwert, Periodengewinn und Gesamtauslastung.
* **Beschaffung**: Lieferantenbestellungen mit Mengenstaffeln, Zahlungszielen und Skontoabzug.
* **Lager & Disposition**: Stücklisten (Bill of Materials / BOM) für City-Bikes und E-Bikes.
* **Fertigung**: Automatische Materialentnahme und Einbuchung fertiger Erzeugnisse.
* **Vertrieb**: Angebote, Kundenaufträge, Rechnungsstellung und offene Posten.
* **Anlagenmanagement**: Anschaffung von Anlagegütern (Gebäude 0510, Maschinen 0700, Fuhrpark 0840, BGA 0860), lineare AfA und Anlagenabgänge.
* **Finanzwesen (FI)**: Automatische Buchungsgenerierung in Journal, T-Konten und GuV.

### 7. 🎯 Stationenlernen
* Didaktisch aufbereitetes Stationenlernen für den modularen Unterrichtseinsatz und differenziertes Üben.

---

## 🎓 Didaktisches Stufenkonzept

| Stufe | Fokus | Steuer & AfA | Buchungstyp |
|---|---|---|---|
| **Stufe 1 (Anfänger)** | Reine Bestandsbuchungen (Aktiv-/Passivtausch) | Keine Steuer (0 % VoSt/USt), keine AfA | Einfache Buchungssätze |
| **Stufe 2 (Fortgeschritten)** | Erfolgskonten (Aufwand & Ertrag), GuV | Lineare AfA, Verkäufe mit Marge | Einfache & mehrzeilige Buchungssätze |
| **Stufe 3 (Profi)** | Volle steuerliche Erfassung | 19 % Vorsteuer & Umsatzsteuer, Zahllast | Zusammengesetzte Buchungen ($N$ an $M$), Skonto |

---

## 🎨 Themes & Design System

* 🌙 **Dunkelmodus (Dark Mode)**: Modernes High-Tech-Design für blendfreies Arbeiten.
* ☀️ **Hellmodus (Light Mode)**: Klassisch-kontrastreich für Beamer und helle Unterrichtsräume.
* 💼 **Pro / Enterprise Edition**: Angelehnt an moderne ERP-Systeme (SAP Fiori Horizon) mit Shell-Bar, Mandantenanzeige (`Mandant 100 • FI/CO`) und business-orientierter Typografie.

---

## 🛠️ Technische Spezifikation

* **Architektur**: Rein clientseitige Single-Page Application (SPA).
* **Frontend**: HTML5, Vanilla JavaScript (ES6+), modernes CSS3 (CSS Variables, Flexbox, CSS Grid).
* **Bibliotheken**: [jsPDF](https://github.com/parallax/jsPDF) (Clientseitige Zertifikatserstellung).
* **Touch-Support**: DragDropTouch Polyfill für Tablets (iPad) und Touchscreens.
* **Offline-fähig**: Läuft komplett lokal ohne zwingende Internetverbindung oder Backend.

---

## 💻 Schnellstart & Lokale Ausführung

Da moderne Browser aus Sicherheitsgründen Einschränkungen beim Laden lokaler Skripte über das `file://`-Protokoll besitzen (CORS), empfiehlt sich ein lokaler Webserver:

### Option A: Über npm / Node.js
```bash
# Repository klonen
git clone https://github.com/mrgoldsmitt/Buchhaltungstrainer.git
cd Buchhaltungstrainer

# Abhängigkeiten für Tests installieren (optional)
npm install

# Lokalen Server starten
npm start
```
Die Anwendung ist anschließend unter `http://localhost:8085` erreichbar.

### Option B: Über Python (ohne Installation)
```bash
python3 -m http.server 8085
```

### Option C: macOS One-Click
Doppelklick auf die Datei `start-server.command`.

---

## 🧪 Tests

Zur Verifikation der Datenstrukturen und der Kernberechnungen der Warenwirtschaft:
```bash
npm test
```

---

## 🌐 Deployment (Cloudflare Workers / Pages)

Das Projekt kann direkt als statische Website über Cloudflare Workers Static Assets bereitgestellt werden:
```bash
npx wrangler deploy
```

---

## 📦 Release-Erstellung

Mit dem mitgelieferten Skript `deploy_release.sh` kann ein eigenständiges Distributions-ZIP erstellt oder direkt als GitHub Release veröffentlicht werden:

```bash
# Nur Distributions-ZIP bauen (liegt in dist/)
./deploy_release.sh --build-only

# GitHub Release erstellen und Asset hochladen
./deploy_release.sh --release
```

---

## 📄 Lizenz

Dieses Werk bzw. der Buchhaltungstrainer ist unter der [Creative Commons Namensnennung - Nicht-kommerziell 4.0 International Lizenz (CC BY-NC 4.0)](LICENSE) lizenziert.

* **Sie dürfen:** Das Projekt frei kopieren, weiterverbreiten und in jedwedem Format oder Medium nutzen.
* **Bedingungen:** 
  1. **Namensnennung (Attribution / BY):** Sie müssen angemessene Urheberangaben machen ([@mrgoldsmitt](https://github.com/mrgoldsmitt)), einen Link zur Lizenz beifügen und angeben, ob Änderungen vorgenommen wurden.
  2. **Nicht-kommerziell (NonCommercial / NC):** Sie dürfen das Material **nicht für kommerzielle Zwecke** verwenden.

Vollständiger Lizenztext: Siehe [`LICENSE`](LICENSE) oder online bei [Creative Commons](https://creativecommons.org/licenses/by-nc/4.0/deed.de).

Urheber & Entwickler: [@mrgoldsmitt](https://github.com/mrgoldsmitt) ([mrgoldsmitt.work](https://mrgoldsmitt.work)).
