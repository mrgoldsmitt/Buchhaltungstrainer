// =====================================================
// buchfuehrung.js - Buchungssätze und T-Konten
// =====================================================

// Difficulty-based cases – Generalized compound format
// Each case uses sollKonten: [{konto, betrag}] and habenKonten: [{konto, betrag}]
const BUCHUNGS_CASES_LEVELS = {
    beginner: [
        { text: "Wir kaufen Rohstoffe auf Ziel für 5.000 €.", sollKonten: [{konto:"Rohstoffe",betrag:5000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:5000}] },
        { text: "Ein Kunde begleicht eine offene Rechnung per Banküberweisung: 2.000 €.", sollKonten: [{konto:"Bank",betrag:2000}], habenKonten: [{konto:"Forderungen",betrag:2000}] },
        { text: "Wir kaufen einen neuen Lieferwagen gegen Barzahlung: 15.000 €.", sollKonten: [{konto:"Fuhrpark",betrag:15000}], habenKonten: [{konto:"Kasse",betrag:15000}] },
        { text: "Wir heben Bargeld vom Bankkonto ab und legen es in die Kasse: 500 €.", sollKonten: [{konto:"Kasse",betrag:500}], habenKonten: [{konto:"Bank",betrag:500}] },
        { text: "Wir begleichen eine Lieferantenrechnung durch Banküberweisung: 3.500 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:3500}], habenKonten: [{konto:"Bank",betrag:3500}] },
        { text: "Rohstoffeinkauf (30.000 €): 10.000 € per Banküberweisung und 20.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:30000}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Verbindlichkeiten",betrag:20000}] },
        { text: "Kauf eines Lieferwagens (25.000 €): 15.000 € per Banküberweisung, 10.000 € als Darlehen.", sollKonten: [{konto:"Fuhrpark",betrag:25000}], habenKonten: [{konto:"Bank",betrag:15000},{konto:"Darlehen",betrag:10000}] },
        { text: "Ein Kunde begleicht seine Rechnung (3.000 €): 2.000 € per Banküberweisung und 1.000 € bar.", sollKonten: [{konto:"Bank",betrag:2000},{konto:"Kasse",betrag:1000}], habenKonten: [{konto:"Forderungen",betrag:3000}] },
        { text: "Wir kaufen Rohstoffe gegen Barzahlung: 800 €.", sollKonten: [{konto:"Rohstoffe",betrag:800}], habenKonten: [{konto:"Kasse",betrag:800}] },
        { text: "Wir zahlen Bargeld auf das Bankkonto ein: 2.500 €.", sollKonten: [{konto:"Bank",betrag:2500}], habenKonten: [{konto:"Kasse",betrag:2500}] },
        { text: "Kauf einer neuen Maschine per Banküberweisung: 45.000 €.", sollKonten: [{konto:"Maschinen",betrag:45000}], habenKonten: [{konto:"Bank",betrag:45000}] },
        { text: "Wir kaufen Büroausstattung (BGA) auf Ziel: 3.200 €.", sollKonten: [{konto:"BGA",betrag:3200}], habenKonten: [{konto:"Verbindlichkeiten",betrag:3200}] },
        { text: "Ein Kunde bezahlt seine offene Rechnung bar: 1.500 €.", sollKonten: [{konto:"Kasse",betrag:1500}], habenKonten: [{konto:"Forderungen",betrag:1500}] },
        { text: "Wir begleichen eine Lieferantenrechnung bar: 750 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:750}], habenKonten: [{konto:"Kasse",betrag:750}] },
        { text: "Kauf eines Grundstücks per Banküberweisung: 120.000 €.", sollKonten: [{konto:"Maschinen",betrag:120000}], habenKonten: [{konto:"Bank",betrag:120000}] },
        { text: "Wir kaufen Rohstoffe per Banküberweisung: 6.300 €.", sollKonten: [{konto:"Rohstoffe",betrag:6300}], habenKonten: [{konto:"Bank",betrag:6300}] },
        { text: "Rückzahlung eines Darlehens per Banküberweisung: 10.000 €.", sollKonten: [{konto:"Darlehen",betrag:10000}], habenKonten: [{konto:"Bank",betrag:10000}] },
        { text: "Aufnahme eines Bankdarlehens: 50.000 € werden gutgeschrieben.", sollKonten: [{konto:"Bank",betrag:50000}], habenKonten: [{konto:"Darlehen",betrag:50000}] },
        { text: "Ein Kunde überweist eine Teilzahlung: 4.000 € von 6.000 € offener Forderung.", sollKonten: [{konto:"Bank",betrag:4000}], habenKonten: [{konto:"Forderungen",betrag:4000}] },
        { text: "Wir kaufen einen Drucker (BGA) gegen Barzahlung: 450 €.", sollKonten: [{konto:"BGA",betrag:450}], habenKonten: [{konto:"Kasse",betrag:450}] },
        { text: "Wir verkaufen eine alte Maschine gegen Barzahlung: 8.000 €.", sollKonten: [{konto:"Kasse",betrag:8000}], habenKonten: [{konto:"Maschinen",betrag:8000}] },
        { text: "Wir kaufen einen neuen Computer (BGA) per Banküberweisung: 1.800 €.", sollKonten: [{konto:"BGA",betrag:1800}], habenKonten: [{konto:"Bank",betrag:1800}] },
        { text: "Eine Kundenrechnung wird per Banküberweisung beglichen: 7.500 €.", sollKonten: [{konto:"Bank",betrag:7500}], habenKonten: [{konto:"Forderungen",betrag:7500}] },
        { text: "Wir begleichen zwei Lieferantenrechnungen per Bank: 2.200 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:2200}], habenKonten: [{konto:"Bank",betrag:2200}] },
        { text: "Kauf von Rohstoffen auf Ziel: 14.500 €.", sollKonten: [{konto:"Rohstoffe",betrag:14500}], habenKonten: [{konto:"Verbindlichkeiten",betrag:14500}] },
        { text: "Wir kaufen einen gebrauchten Lieferwagen per Banküberweisung: 9.000 €.", sollKonten: [{konto:"Fuhrpark",betrag:9000}], habenKonten: [{konto:"Bank",betrag:9000}] },
        { text: "Ein Kunde bezahlt eine Rechnung: 5.500 € per Banküberweisung.", sollKonten: [{konto:"Bank",betrag:5500}], habenKonten: [{konto:"Forderungen",betrag:5500}] },
        { text: "Barabhebung vom Geschäftskonto: 3.000 €.", sollKonten: [{konto:"Kasse",betrag:3000}], habenKonten: [{konto:"Bank",betrag:3000}] },
        { text: "Bareinzahlung auf das Geschäftskonto: 4.200 €.", sollKonten: [{konto:"Bank",betrag:4200}], habenKonten: [{konto:"Kasse",betrag:4200}] },
        { text: "Kauf von Verpackungsmaterial (Rohstoffe) bar: 320 €.", sollKonten: [{konto:"Rohstoffe",betrag:320}], habenKonten: [{konto:"Kasse",betrag:320}] },
        { text: "Wir begleichen eine Verbindlichkeit bar: 1.100 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:1100}], habenKonten: [{konto:"Kasse",betrag:1100}] },
        { text: "Anschaffung einer Produktionsmaschine auf Ziel: 85.000 €.", sollKonten: [{konto:"Maschinen",betrag:85000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:85000}] },
        { text: "Wir verkaufen einen alten PKW (Fuhrpark) per Banküberweisung: 12.000 €.", sollKonten: [{konto:"Bank",betrag:12000}], habenKonten: [{konto:"Fuhrpark",betrag:12000}] },
        { text: "Kauf eines Schreibtischs (BGA) auf Ziel: 950 €.", sollKonten: [{konto:"BGA",betrag:950}], habenKonten: [{konto:"Verbindlichkeiten",betrag:950}] },
        { text: "Darlehensrückzahlung per Bank: 5.000 €.", sollKonten: [{konto:"Darlehen",betrag:5000}], habenKonten: [{konto:"Bank",betrag:5000}] },
        { text: "Rohstoffeinkauf per Bank: 3.800 €.", sollKonten: [{konto:"Rohstoffe",betrag:3800}], habenKonten: [{konto:"Bank",betrag:3800}] },
        { text: "Kauf einer Fertigungsanlage per Bank: 72.000 €.", sollKonten: [{konto:"Maschinen",betrag:72000}], habenKonten: [{konto:"Bank",betrag:72000}] },
        { text: "Wir zahlen eine offene Lieferantenrechnung per Bank: 4.800 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:4800}], habenKonten: [{konto:"Bank",betrag:4800}] },
        { text: "Ein Kunde überweist den vollen Rechnungsbetrag: 9.200 €.", sollKonten: [{konto:"Bank",betrag:9200}], habenKonten: [{konto:"Forderungen",betrag:9200}] },
        { text: "Barverkauf eines nicht mehr benötigten Regals (BGA): 200 €.", sollKonten: [{konto:"Kasse",betrag:200}], habenKonten: [{konto:"BGA",betrag:200}] },
        { text: "Kauf von Schrauben und Nägeln (Rohstoffe) bar: 55 €.", sollKonten: [{konto:"Rohstoffe",betrag:55}], habenKonten: [{konto:"Kasse",betrag:55}] },
        { text: "Wir nehmen ein Darlehen auf. Die Bank überweist 30.000 €.", sollKonten: [{konto:"Bank",betrag:30000}], habenKonten: [{konto:"Darlehen",betrag:30000}] },
        { text: "Einkauf von Verpackungsfolien (Rohstoffe) auf Ziel: 1.200 €.", sollKonten: [{konto:"Rohstoffe",betrag:1200}], habenKonten: [{konto:"Verbindlichkeiten",betrag:1200}] },
        { text: "Wir kaufen ein Firmenfahrzeug auf Ziel: 28.000 €.", sollKonten: [{konto:"Fuhrpark",betrag:28000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:28000}] },
        { text: "Barabhebung für Portokasse: 150 €.", sollKonten: [{konto:"Kasse",betrag:150}], habenKonten: [{konto:"Bank",betrag:150}] },
        { text: "Kauf von Rohstoffen bar: 2.400 €.", sollKonten: [{konto:"Rohstoffe",betrag:2400}], habenKonten: [{konto:"Kasse",betrag:2400}] },
        { text: "Banküberweisung einer Lieferantenrechnung: 6.700 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:6700}], habenKonten: [{konto:"Bank",betrag:6700}] },
        { text: "Kauf eines Servers (BGA) per Banküberweisung: 5.500 €.", sollKonten: [{konto:"BGA",betrag:5500}], habenKonten: [{konto:"Bank",betrag:5500}] },
        { text: "Ein Geschäftspartner überweist seine offene Rechnung: 3.300 €.", sollKonten: [{konto:"Bank",betrag:3300}], habenKonten: [{konto:"Forderungen",betrag:3300}] },
        { text: "Eigenkapitalerhöhung durch Bareinlage des Inhabers: 20.000 €.", sollKonten: [{konto:"Kasse",betrag:20000}], habenKonten: [{konto:"Eigenkapital",betrag:20000}] },
        { text: "Der Inhaber legt Geld auf das Geschäftskonto ein: 15.000 €.", sollKonten: [{konto:"Bank",betrag:15000}], habenKonten: [{konto:"Eigenkapital",betrag:15000}] },
        { text: "Kauf von Kupferdraht (Rohstoffe) auf Ziel: 7.800 €.", sollKonten: [{konto:"Rohstoffe",betrag:7800}], habenKonten: [{konto:"Verbindlichkeiten",betrag:7800}] },
        { text: "Wir begleichen eine Verbindlichkeit per Bank: 11.000 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:11000}], habenKonten: [{konto:"Bank",betrag:11000}] },
        { text: "Anschaffung einer CNC-Maschine per Bank: 95.000 €.", sollKonten: [{konto:"Maschinen",betrag:95000}], habenKonten: [{konto:"Bank",betrag:95000}] },
        { text: "Ein Kunde zahlt eine Abschlagsrechnung bar: 600 €.", sollKonten: [{konto:"Kasse",betrag:600}], habenKonten: [{konto:"Forderungen",betrag:600}] },
        { text: "Wir kaufen Stahlbleche (Rohstoffe) per Bank: 4.500 €.", sollKonten: [{konto:"Rohstoffe",betrag:4500}], habenKonten: [{konto:"Bank",betrag:4500}] },
        { text: "Rückzahlung einer Darlehensrate per Bank: 2.500 €.", sollKonten: [{konto:"Darlehen",betrag:2500}], habenKonten: [{konto:"Bank",betrag:2500}] },
        { text: "Kauf von Bürostühlen (BGA) bar: 1.400 €.", sollKonten: [{konto:"BGA",betrag:1400}], habenKonten: [{konto:"Kasse",betrag:1400}] },
        // Zusammengesetzte Buchungssätze – Anfänger
        { text: "Maschinenkauf (50.000 €): 30.000 € per Bank und 20.000 € auf Ziel.", sollKonten: [{konto:"Maschinen",betrag:50000}], habenKonten: [{konto:"Bank",betrag:30000},{konto:"Verbindlichkeiten",betrag:20000}] },
        { text: "Rohstoffeinkauf (8.000 €): 3.000 € bar und 5.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:8000}], habenKonten: [{konto:"Kasse",betrag:3000},{konto:"Verbindlichkeiten",betrag:5000}] },
        { text: "BGA-Kauf (4.000 €): 2.500 € per Bank und 1.500 € bar.", sollKonten: [{konto:"BGA",betrag:4000}], habenKonten: [{konto:"Bank",betrag:2500},{konto:"Kasse",betrag:1500}] },
        { text: "Kundenrechnung (5.000 €) wird beglichen: 3.500 € per Bank und 1.500 € bar.", sollKonten: [{konto:"Bank",betrag:3500},{konto:"Kasse",betrag:1500}], habenKonten: [{konto:"Forderungen",betrag:5000}] },
        { text: "Kauf eines Firmenfahrzeugs (35.000 €): 20.000 € per Bank, 15.000 € als Darlehen.", sollKonten: [{konto:"Fuhrpark",betrag:35000}], habenKonten: [{konto:"Bank",betrag:20000},{konto:"Darlehen",betrag:15000}] },
        { text: "Rohstoffeinkauf (15.000 €): 10.000 € per Bank und 5.000 € bar.", sollKonten: [{konto:"Rohstoffe",betrag:15000}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Kasse",betrag:5000}] },
        { text: "Maschinenkauf (80.000 €): 50.000 € per Bank und 30.000 € als Darlehen.", sollKonten: [{konto:"Maschinen",betrag:80000}], habenKonten: [{konto:"Bank",betrag:50000},{konto:"Darlehen",betrag:30000}] },
        { text: "Ein Kunde begleicht seine Rechnung (10.000 €): 7.000 € per Bank, 3.000 € bar.", sollKonten: [{konto:"Bank",betrag:7000},{konto:"Kasse",betrag:3000}], habenKonten: [{konto:"Forderungen",betrag:10000}] },
        { text: "Rohstoffkauf (20.000 €): 12.000 € per Bank und 8.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:20000}], habenKonten: [{konto:"Bank",betrag:12000},{konto:"Verbindlichkeiten",betrag:8000}] },
        { text: "BGA-Kauf (6.000 €): 4.000 € per Bank, 2.000 € auf Ziel.", sollKonten: [{konto:"BGA",betrag:6000}], habenKonten: [{konto:"Bank",betrag:4000},{konto:"Verbindlichkeiten",betrag:2000}] },
        { text: "Kauf eines Transporters (22.000 €): 12.000 € per Bank, 10.000 € auf Ziel.", sollKonten: [{konto:"Fuhrpark",betrag:22000}], habenKonten: [{konto:"Bank",betrag:12000},{konto:"Verbindlichkeiten",betrag:10000}] },
        { text: "Rohstoffeinkauf (9.500 €): 4.500 € bar und 5.000 € per Bank.", sollKonten: [{konto:"Rohstoffe",betrag:9500}], habenKonten: [{konto:"Kasse",betrag:4500},{konto:"Bank",betrag:5000}] },
        { text: "Maschinenkauf (60.000 €): 40.000 € per Bank, 20.000 € auf Ziel.", sollKonten: [{konto:"Maschinen",betrag:60000}], habenKonten: [{konto:"Bank",betrag:40000},{konto:"Verbindlichkeiten",betrag:20000}] },
        { text: "Kundenrechnung (8.000 €): 6.000 € per Bank und 2.000 € bar.", sollKonten: [{konto:"Bank",betrag:6000},{konto:"Kasse",betrag:2000}], habenKonten: [{konto:"Forderungen",betrag:8000}] },
        { text: "BGA-Kauf (2.800 €): 1.800 € per Bank und 1.000 € bar.", sollKonten: [{konto:"BGA",betrag:2800}], habenKonten: [{konto:"Bank",betrag:1800},{konto:"Kasse",betrag:1000}] },
        { text: "Fahrzeugkauf (18.000 €): 8.000 € bar und 10.000 € per Bank.", sollKonten: [{konto:"Fuhrpark",betrag:18000}], habenKonten: [{konto:"Kasse",betrag:8000},{konto:"Bank",betrag:10000}] },
        { text: "Kauf einer neuen Produktionsanlage auf Ziel: 60.000 €.", sollKonten: [{konto:"Maschinen",betrag:60000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:60000}] },
        { text: "Wir erwerben ein neues Firmenfahrzeug gegen Banküberweisung: 32.000 €.", sollKonten: [{konto:"Fuhrpark",betrag:32000}], habenKonten: [{konto:"Bank",betrag:32000}] },
        { text: "Kauf von neuen Büromöbeln (BGA) per Banküberweisung: 4.500 €.", sollKonten: [{konto:"BGA",betrag:4500}], habenKonten: [{konto:"Bank",betrag:4500}] },
        { text: "Wir verkaufen eine alte, ausgemusterte Fräsmaschine gegen Banküberweisung: 15.000 €.", sollKonten: [{konto:"Bank",betrag:15000}], habenKonten: [{konto:"Maschinen",betrag:15000}] },
        { text: "Verkauf eines alten PKW (Fuhrpark) gegen Barzahlung: 6.500 €.", sollKonten: [{konto:"Kasse",betrag:6500}], habenKonten: [{konto:"Fuhrpark",betrag:6500}] },
        { text: "Anschaffung von Lagerregalen (BGA) auf Ziel: 2.800 €.", sollKonten: [{konto:"BGA",betrag:2800}], habenKonten: [{konto:"Verbindlichkeiten",betrag:2800}] },
        { text: "Verkauf eines gebrauchten Büro-Computers (BGA) bar für 300 €.", sollKonten: [{konto:"Kasse",betrag:300}], habenKonten: [{konto:"BGA",betrag:300}] },
        { text: "Kauf eines neuen Gabelstaplers (Fuhrpark) auf Ziel: 24.000 €.", sollKonten: [{konto:"Fuhrpark",betrag:24000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:24000}] },
        { text: "Wir erwerben eine neue Verpackungsmaschine gegen Banküberweisung: 18.500 €.", sollKonten: [{konto:"Maschinen",betrag:18500}], habenKonten: [{konto:"Bank",betrag:18500}] },
        { text: "Kauf eines Transporters (30.000 €): 10.000 € per Bank, Rest über Darlehen.", sollKonten: [{konto:"Fuhrpark",betrag:30000}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Darlehen",betrag:20000}] },
    ],
    advanced: [
        { text: "Wir überweisen die Miete für die Lagerhalle von unserem Bankkonto: 1.500 €.", sollKonten: [{konto:"Mietaufwendungen",betrag:1500}], habenKonten: [{konto:"Bank",betrag:1500}] },
        { text: "Verkauf von fertigen Erzeugnissen auf Ziel: 8.000 €.", sollKonten: [{konto:"Forderungen",betrag:8000}], habenKonten: [{konto:"Umsatzerlöse",betrag:8000}] },
        { text: "Wir bezahlen die Stromrechnung für das Büro bar: 120 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:120}], habenKonten: [{konto:"Kasse",betrag:120}] },
        { text: "Zinserträge werden unserem Bankkonto gutgeschrieben: 45 €.", sollKonten: [{konto:"Bank",betrag:45}], habenKonten: [{konto:"Zinserträge",betrag:45}] },
        { text: "Wir kaufen Büromaterial gegen Barzahlung: 80 €.", sollKonten: [{konto:"Bürobedarf",betrag:80}], habenKonten: [{konto:"Kasse",betrag:80}] },
        { text: "Verkauf von Waren (6.000 €): 4.000 € per Banküberweisung und 2.000 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:4000},{konto:"Forderungen",betrag:2000}], habenKonten: [{konto:"Umsatzerlöse",betrag:6000}] },
        { text: "Rohstoffeinkauf (12.000 €): 7.000 € per Banküberweisung und 5.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:12000}], habenKonten: [{konto:"Bank",betrag:7000},{konto:"Verbindlichkeiten",betrag:5000}] },
        { text: "Wir verkaufen Waren gegen Barzahlung: 3.500 €.", sollKonten: [{konto:"Kasse",betrag:3500}], habenKonten: [{konto:"Umsatzerlöse",betrag:3500}] },
        { text: "Verkauf von Erzeugnissen per Banküberweisung: 12.000 €.", sollKonten: [{konto:"Bank",betrag:12000}], habenKonten: [{konto:"Umsatzerlöse",betrag:12000}] },
        { text: "Wir überweisen die Versicherungsprämie per Bank: 2.400 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:2400}], habenKonten: [{konto:"Bank",betrag:2400}] },
        { text: "Mieteinnahmen gehen per Banküberweisung ein: 1.800 €.", sollKonten: [{konto:"Bank",betrag:1800}], habenKonten: [{konto:"Zinserträge",betrag:1800}] },
        { text: "Kauf von Druckerpapier (Bürobedarf) bar: 35 €.", sollKonten: [{konto:"Bürobedarf",betrag:35}], habenKonten: [{konto:"Kasse",betrag:35}] },
        { text: "Wir zahlen Telefonkosten per Bank: 180 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:180}], habenKonten: [{konto:"Bank",betrag:180}] },
        { text: "Einkauf von Rohstoffen per Bank: 9.500 €.", sollKonten: [{konto:"Rohstoffe",betrag:9500}], habenKonten: [{konto:"Bank",betrag:9500}] },
        { text: "Kauf von Reinigungsmaterial (Materialaufwand) bar: 65 €.", sollKonten: [{konto:"Materialaufwand",betrag:65}], habenKonten: [{konto:"Kasse",betrag:65}] },
        { text: "Wir überweisen die Miete für Büroräume: 2.200 €.", sollKonten: [{konto:"Mietaufwendungen",betrag:2200}], habenKonten: [{konto:"Bank",betrag:2200}] },
        { text: "Verkauf von Fertigprodukten auf Ziel: 15.000 €.", sollKonten: [{konto:"Forderungen",betrag:15000}], habenKonten: [{konto:"Umsatzerlöse",betrag:15000}] },
        { text: "Bankgutschrift für Zinserträge: 120 €.", sollKonten: [{konto:"Bank",betrag:120}], habenKonten: [{konto:"Zinserträge",betrag:120}] },
        { text: "Wir bezahlen die Wasserrechnung bar: 95 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:95}], habenKonten: [{konto:"Kasse",betrag:95}] },
        { text: "Kauf von Kugelschreibern (Bürobedarf) bar: 12 €.", sollKonten: [{konto:"Bürobedarf",betrag:12}], habenKonten: [{konto:"Kasse",betrag:12}] },
        { text: "Wir verkaufen Waren per Banküberweisung: 7.200 €.", sollKonten: [{konto:"Bank",betrag:7200}], habenKonten: [{konto:"Umsatzerlöse",betrag:7200}] },
        { text: "Zahlung der monatlichen Leasingrate per Bank: 850 €.", sollKonten: [{konto:"Mietaufwendungen",betrag:850}], habenKonten: [{konto:"Bank",betrag:850}] },
        { text: "Ein Kunde bezahlt seine Rechnung bar: 2.300 €.", sollKonten: [{konto:"Kasse",betrag:2300}], habenKonten: [{konto:"Forderungen",betrag:2300}] },
        { text: "Wir begleichen eine Lieferantenrechnung per Bank: 5.800 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:5800}], habenKonten: [{konto:"Bank",betrag:5800}] },
        { text: "Rohstoffeinkauf auf Ziel: 18.000 €.", sollKonten: [{konto:"Rohstoffe",betrag:18000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:18000}] },
        { text: "Kauf von Toner (Bürobedarf) per Bank: 150 €.", sollKonten: [{konto:"Bürobedarf",betrag:150}], habenKonten: [{konto:"Bank",betrag:150}] },
        { text: "Barverkauf von Restbeständen: 900 €.", sollKonten: [{konto:"Kasse",betrag:900}], habenKonten: [{konto:"Umsatzerlöse",betrag:900}] },
        { text: "Wir überweisen die Gebäudeversicherung per Bank: 3.600 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:3600}], habenKonten: [{konto:"Bank",betrag:3600}] },
        { text: "Materialaufwand für Reparatur bar bezahlt: 280 €.", sollKonten: [{konto:"Materialaufwand",betrag:280}], habenKonten: [{konto:"Kasse",betrag:280}] },
        { text: "Verkauf einer Dienstleistung auf Ziel: 4.500 €.", sollKonten: [{konto:"Forderungen",betrag:4500}], habenKonten: [{konto:"Umsatzerlöse",betrag:4500}] },
        { text: "Zinserträge vom Festgeld: 320 €.", sollKonten: [{konto:"Bank",betrag:320}], habenKonten: [{konto:"Zinserträge",betrag:320}] },
        { text: "Wir bezahlen die Müllentsorgung per Bank: 210 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:210}], habenKonten: [{konto:"Bank",betrag:210}] },
        { text: "Kauf von Briefumschlägen (Bürobedarf) bar: 18 €.", sollKonten: [{konto:"Bürobedarf",betrag:18}], habenKonten: [{konto:"Kasse",betrag:18}] },
        { text: "Ein Kunde überweist den Rechnungsbetrag: 6.400 €.", sollKonten: [{konto:"Bank",betrag:6400}], habenKonten: [{konto:"Forderungen",betrag:6400}] },
        { text: "Rohstoffeinkauf bar: 1.800 €.", sollKonten: [{konto:"Rohstoffe",betrag:1800}], habenKonten: [{konto:"Kasse",betrag:1800}] },
        { text: "Wir verkaufen Erzeugnisse bar: 5.600 €.", sollKonten: [{konto:"Kasse",betrag:5600}], habenKonten: [{konto:"Umsatzerlöse",betrag:5600}] },
        { text: "Zahlung der Grundsteuer per Bank: 1.400 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:1400}], habenKonten: [{konto:"Bank",betrag:1400}] },
        { text: "Miete für Parkplätze per Bank: 350 €.", sollKonten: [{konto:"Mietaufwendungen",betrag:350}], habenKonten: [{konto:"Bank",betrag:350}] },
        { text: "Rohstoffkauf per Bank: 7.700 €.", sollKonten: [{konto:"Rohstoffe",betrag:7700}], habenKonten: [{konto:"Bank",betrag:7700}] },
        { text: "Verkauf von Waren auf Ziel: 11.000 €.", sollKonten: [{konto:"Forderungen",betrag:11000}], habenKonten: [{konto:"Umsatzerlöse",betrag:11000}] },
        { text: "Kauf von Ordnern (Bürobedarf) bar: 42 €.", sollKonten: [{konto:"Bürobedarf",betrag:42}], habenKonten: [{konto:"Kasse",betrag:42}] },
        { text: "Wir begleichen eine Verbindlichkeit per Bank: 8.300 €.", sollKonten: [{konto:"Verbindlichkeiten",betrag:8300}], habenKonten: [{konto:"Bank",betrag:8300}] },
        { text: "Einkauf von Schmierstoffen (Materialaufwand) auf Ziel: 430 €.", sollKonten: [{konto:"Materialaufwand",betrag:430}], habenKonten: [{konto:"Verbindlichkeiten",betrag:430}] },
        { text: "Barverkauf von Produkten: 1.250 €.", sollKonten: [{konto:"Kasse",betrag:1250}], habenKonten: [{konto:"Umsatzerlöse",betrag:1250}] },
        { text: "Wir überweisen die Kfz-Steuer per Bank: 520 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:520}], habenKonten: [{konto:"Bank",betrag:520}] },
        { text: "Zinserträge aus Kapitalanlagen: 85 €.", sollKonten: [{konto:"Bank",betrag:85}], habenKonten: [{konto:"Zinserträge",betrag:85}] },
        { text: "Materialaufwand für Wartung per Bank: 1.100 €.", sollKonten: [{konto:"Materialaufwand",betrag:1100}], habenKonten: [{konto:"Bank",betrag:1100}] },
        { text: "Wir verkaufen Restposten per Bank: 3.800 €.", sollKonten: [{konto:"Bank",betrag:3800}], habenKonten: [{konto:"Umsatzerlöse",betrag:3800}] },
        { text: "Miete für externe Lagerfläche per Bank: 900 €.", sollKonten: [{konto:"Mietaufwendungen",betrag:900}], habenKonten: [{konto:"Bank",betrag:900}] },
        { text: "Rohstoffeinkauf auf Ziel: 22.000 €.", sollKonten: [{konto:"Rohstoffe",betrag:22000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:22000}] },
        { text: "Ein Kunde überweist eine Anzahlung: 3.000 €.", sollKonten: [{konto:"Bank",betrag:3000}], habenKonten: [{konto:"Forderungen",betrag:3000}] },
        { text: "Kauf von Post-Its (Bürobedarf) bar: 8 €.", sollKonten: [{konto:"Bürobedarf",betrag:8}], habenKonten: [{konto:"Kasse",betrag:8}] },
        { text: "Wir überweisen die Haftpflichtversicherung: 1.950 €.", sollKonten: [{konto:"Sonst. Aufwendungen",betrag:1950}], habenKonten: [{konto:"Bank",betrag:1950}] },
        { text: "Verkauf von Fertigware per Bank: 9.800 €.", sollKonten: [{konto:"Bank",betrag:9800}], habenKonten: [{konto:"Umsatzerlöse",betrag:9800}] },
        // Zusammengesetzte Buchungssätze – Fortgeschritten
        { text: "Warenverkauf (10.000 €): 6.000 € per Bank und 4.000 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:6000},{konto:"Forderungen",betrag:4000}], habenKonten: [{konto:"Umsatzerlöse",betrag:10000}] },
        { text: "Rohstoffeinkauf (16.000 €): 10.000 € per Bank, 6.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:16000}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Verbindlichkeiten",betrag:6000}] },
        { text: "Verkauf von Waren (9.000 €): 5.000 € bar und 4.000 € auf Ziel.", sollKonten: [{konto:"Kasse",betrag:5000},{konto:"Forderungen",betrag:4000}], habenKonten: [{konto:"Umsatzerlöse",betrag:9000}] },
        { text: "Rohstoffkauf (25.000 €): 15.000 € per Bank und 10.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:25000}], habenKonten: [{konto:"Bank",betrag:15000},{konto:"Verbindlichkeiten",betrag:10000}] },
        { text: "Warenverkauf (7.500 €): 3.500 € bar und 4.000 € per Bank.", sollKonten: [{konto:"Kasse",betrag:3500},{konto:"Bank",betrag:4000}], habenKonten: [{konto:"Umsatzerlöse",betrag:7500}] },
        { text: "Rohstoffeinkauf (14.000 €): 4.000 € bar, 10.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:14000}], habenKonten: [{konto:"Kasse",betrag:4000},{konto:"Verbindlichkeiten",betrag:10000}] },
        { text: "Kundenrechnung (12.000 €): 8.000 € per Bank und 4.000 € bar.", sollKonten: [{konto:"Bank",betrag:8000},{konto:"Kasse",betrag:4000}], habenKonten: [{konto:"Forderungen",betrag:12000}] },
        { text: "Verkauf von Erzeugnissen (20.000 €): 12.000 € per Bank und 8.000 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:12000},{konto:"Forderungen",betrag:8000}], habenKonten: [{konto:"Umsatzerlöse",betrag:20000}] },
        { text: "Rohstoffeinkauf (11.000 €): 6.000 € per Bank und 5.000 € bar.", sollKonten: [{konto:"Rohstoffe",betrag:11000}], habenKonten: [{konto:"Bank",betrag:6000},{konto:"Kasse",betrag:5000}] },
        { text: "Warenverkauf (8.500 €): 5.500 € per Bank, 3.000 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:5500},{konto:"Forderungen",betrag:3000}], habenKonten: [{konto:"Umsatzerlöse",betrag:8500}] },
        { text: "Rohstoffkauf (6.800 €): 2.800 € bar und 4.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:6800}], habenKonten: [{konto:"Kasse",betrag:2800},{konto:"Verbindlichkeiten",betrag:4000}] },
        { text: "Verkauf auf Ziel und bar (13.000 €): 9.000 € auf Ziel und 4.000 € bar.", sollKonten: [{konto:"Forderungen",betrag:9000},{konto:"Kasse",betrag:4000}], habenKonten: [{konto:"Umsatzerlöse",betrag:13000}] },
        { text: "Rohstoffeinkauf (19.000 €): 12.000 € per Bank, 7.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:19000}], habenKonten: [{konto:"Bank",betrag:12000},{konto:"Verbindlichkeiten",betrag:7000}] },
        { text: "Warenverkauf (5.200 €): 3.200 € per Bank und 2.000 € bar.", sollKonten: [{konto:"Bank",betrag:3200},{konto:"Kasse",betrag:2000}], habenKonten: [{konto:"Umsatzerlöse",betrag:5200}] },
        { text: "Kauf einer Spezialmaschine per Banküberweisung: 42.000 €.", sollKonten: [{konto:"Maschinen",betrag:42000}], habenKonten: [{konto:"Bank",betrag:42000}] },
        { text: "Kauf von ergonomischen Bürostühlen (BGA) auf Ziel: 1.800 €.", sollKonten: [{konto:"BGA",betrag:1800}], habenKonten: [{konto:"Verbindlichkeiten",betrag:1800}] },
        { text: "Verkauf eines gebrauchten Firmen-PKW (Fuhrpark) per Banküberweisung: 8.500 €.", sollKonten: [{konto:"Bank",betrag:8500}], habenKonten: [{konto:"Fuhrpark",betrag:8500}] },
        { text: "Wir erwerben einen Elektro-Gabelstapler (Fuhrpark) per Banküberweisung: 19.500 €.", sollKonten: [{konto:"Fuhrpark",betrag:19500}], habenKonten: [{konto:"Bank",betrag:19500}] },
        { text: "Kauf eines Hochleistungsservers (BGA) gegen Banküberweisung: 6.200 €.", sollKonten: [{konto:"BGA",betrag:6200}], habenKonten: [{konto:"Bank",betrag:6200}] },
        { text: "Wir verkaufen ein gebrauchtes Lagerregal (BGA) gegen Barzahlung: 150 €.", sollKonten: [{konto:"Kasse",betrag:150}], habenKonten: [{konto:"BGA",betrag:150}] },
        { text: "Erwerb einer computergesteuerten Fräsmaschine (Maschinen) auf Ziel: 55.000 €.", sollKonten: [{konto:"Maschinen",betrag:55000}], habenKonten: [{konto:"Verbindlichkeiten",betrag:55000}] },
        { text: "Kauf eines neuen Transporters (35.000 €): 15.000 € per Bank, Rest auf Ziel.", sollKonten: [{konto:"Fuhrpark",betrag:35000}], habenKonten: [{konto:"Bank",betrag:15000},{konto:"Verbindlichkeiten",betrag:20000}] },
        { text: "Kauf einer Hobelmaschine (14.000 €): 4.000 € bar, Rest per Bank.", sollKonten: [{konto:"Maschinen",betrag:14000}], habenKonten: [{konto:"Kasse",betrag:4000},{konto:"Bank",betrag:10000}] },
        { text: "Kauf einer Büroausstattung (5.000 €): 2.000 € per Bank und 3.000 € auf Ziel.", sollKonten: [{konto:"BGA",betrag:5000}], habenKonten: [{konto:"Bank",betrag:2000},{konto:"Verbindlichkeiten",betrag:3000}] },
    ],
    pro: [
        { text: "Einkauf von Rohstoffen auf Ziel: 10.000 € zzgl. 19% Umsatzsteuer.", sollKonten: [{konto:"Rohstoffe",betrag:10000},{konto:"Vorsteuer",betrag:1900}], habenKonten: [{konto:"Verbindlichkeiten",betrag:11900}] },
        { text: "Verkauf von Waren auf Ziel: 5.000 € zzgl. 19% Umsatzsteuer.", sollKonten: [{konto:"Forderungen",betrag:5950}], habenKonten: [{konto:"Umsatzerlöse",betrag:5000},{konto:"Umsatzsteuer",betrag:950}] },
        { text: "Einkauf eines Computers (BGA) per Banküberweisung: 1.200 € inkl. 19% Umsatzsteuer.", sollKonten: [{konto:"BGA",betrag:1008.40},{konto:"Vorsteuer",betrag:191.60}], habenKonten: [{konto:"Bank",betrag:1200}] },
        { text: "Wir überweisen die Umsatzsteuerschuld an das Finanzamt: 2.100 €.", sollKonten: [{konto:"Umsatzsteuer",betrag:2100}], habenKonten: [{konto:"Bank",betrag:2100}] },
        { text: "Bareinkauf von Hilfsstoffen: 200 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:200},{konto:"Vorsteuer",betrag:38}], habenKonten: [{konto:"Kasse",betrag:238}] },
        { text: "Rohstoffeinkauf (netto 10.000 € + 1.900 € VoSt): 5.000 € per Bank, Rest auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:10000},{konto:"Vorsteuer",betrag:1900}], habenKonten: [{konto:"Bank",betrag:5000},{konto:"Verbindlichkeiten",betrag:6900}] },
        { text: "Verkauf von Waren (netto 8.000 € + 1.520 € USt): 6.000 € per Bank und 3.520 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:6000},{konto:"Forderungen",betrag:3520}], habenKonten: [{konto:"Umsatzerlöse",betrag:8000},{konto:"Umsatzsteuer",betrag:1520}] },
        { text: "Einkauf von Rohstoffen per Bank: 4.000 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:4000},{konto:"Vorsteuer",betrag:760}], habenKonten: [{konto:"Bank",betrag:4760}] },
        { text: "Verkauf von Erzeugnissen per Bank: 7.000 € zzgl. 19% USt.", sollKonten: [{konto:"Bank",betrag:8330}], habenKonten: [{konto:"Umsatzerlöse",betrag:7000},{konto:"Umsatzsteuer",betrag:1330}] },
        { text: "Bareinkauf von Rohstoffen: 600 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:600},{konto:"Vorsteuer",betrag:114}], habenKonten: [{konto:"Kasse",betrag:714}] },
        { text: "Barverkauf von Waren: 1.500 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:1785}], habenKonten: [{konto:"Umsatzerlöse",betrag:1500},{konto:"Umsatzsteuer",betrag:285}] },
        { text: "Kauf eines Druckers (BGA) auf Ziel: 500 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:500},{konto:"Vorsteuer",betrag:95}], habenKonten: [{konto:"Verbindlichkeiten",betrag:595}] },
        { text: "Verkauf von Fertigprodukten auf Ziel: 12.000 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:14280}], habenKonten: [{konto:"Umsatzerlöse",betrag:12000},{konto:"Umsatzsteuer",betrag:2280}] },
        { text: "Einkauf von Hilfsstoffen per Bank: 350 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:350},{konto:"Vorsteuer",betrag:66.50}], habenKonten: [{konto:"Bank",betrag:416.50}] },
        { text: "Rohstoffeinkauf auf Ziel: 8.500 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:8500},{konto:"Vorsteuer",betrag:1615}], habenKonten: [{konto:"Verbindlichkeiten",betrag:10115}] },
        { text: "Warenverkauf per Bank: 3.000 € zzgl. 19% USt.", sollKonten: [{konto:"Bank",betrag:3570}], habenKonten: [{konto:"Umsatzerlöse",betrag:3000},{konto:"Umsatzsteuer",betrag:570}] },
        { text: "Einkauf eines Monitors (BGA) bar: 400 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:400},{konto:"Vorsteuer",betrag:76}], habenKonten: [{konto:"Kasse",betrag:476}] },
        { text: "Umsatzsteuer-Vorauszahlung an das Finanzamt per Bank: 1.800 €.", sollKonten: [{konto:"Umsatzsteuer",betrag:1800}], habenKonten: [{konto:"Bank",betrag:1800}] },
        { text: "Vorsteuer-Erstattung vom Finanzamt: 950 €.", sollKonten: [{konto:"Bank",betrag:950}], habenKonten: [{konto:"Vorsteuer",betrag:950}] },
        { text: "Rohstoffeinkauf per Bank: 15.000 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:15000},{konto:"Vorsteuer",betrag:2850}], habenKonten: [{konto:"Bank",betrag:17850}] },
        { text: "Barverkauf von Erzeugnissen: 2.500 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:2975}], habenKonten: [{konto:"Umsatzerlöse",betrag:2500},{konto:"Umsatzsteuer",betrag:475}] },
        { text: "Einkauf von Rohstoffen auf Ziel: 6.000 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:6000},{konto:"Vorsteuer",betrag:1140}], habenKonten: [{konto:"Verbindlichkeiten",betrag:7140}] },
        { text: "Verkauf von Waren auf Ziel: 9.000 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:10710}], habenKonten: [{konto:"Umsatzerlöse",betrag:9000},{konto:"Umsatzsteuer",betrag:1710}] },
        { text: "Kauf von Büromöbeln (BGA) per Bank: 2.800 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:2800},{konto:"Vorsteuer",betrag:532}], habenKonten: [{konto:"Bank",betrag:3332}] },
        { text: "Barverkauf von Waren: 800 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:952}], habenKonten: [{konto:"Umsatzerlöse",betrag:800},{konto:"Umsatzsteuer",betrag:152}] },
        { text: "Einkauf von Hilfsstoffen auf Ziel: 1.200 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:1200},{konto:"Vorsteuer",betrag:228}], habenKonten: [{konto:"Verbindlichkeiten",betrag:1428}] },
        { text: "Rohstoffeinkauf bar: 950 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:950},{konto:"Vorsteuer",betrag:180.50}], habenKonten: [{konto:"Kasse",betrag:1130.50}] },
        { text: "Verkauf per Bank: 4.200 € zzgl. 19% USt.", sollKonten: [{konto:"Bank",betrag:4998}], habenKonten: [{konto:"Umsatzerlöse",betrag:4200},{konto:"Umsatzsteuer",betrag:798}] },
        { text: "Kauf einer Tastatur (BGA) bar: 80 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:80},{konto:"Vorsteuer",betrag:15.20}], habenKonten: [{konto:"Kasse",betrag:95.20}] },
        { text: "Warenverkauf auf Ziel: 6.500 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:7735}], habenKonten: [{konto:"Umsatzerlöse",betrag:6500},{konto:"Umsatzsteuer",betrag:1235}] },
        { text: "USt-Zahllast an das Finanzamt per Bank: 3.400 €.", sollKonten: [{konto:"Umsatzsteuer",betrag:3400}], habenKonten: [{konto:"Bank",betrag:3400}] },
        { text: "Rohstoffeinkauf per Bank: 2.200 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:2200},{konto:"Vorsteuer",betrag:418}], habenKonten: [{konto:"Bank",betrag:2618}] },
        { text: "Barverkauf von Fertigprodukten: 3.800 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:4522}], habenKonten: [{konto:"Umsatzerlöse",betrag:3800},{konto:"Umsatzsteuer",betrag:722}] },
        { text: "Einkauf von Materialien auf Ziel: 5.500 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:5500},{konto:"Vorsteuer",betrag:1045}], habenKonten: [{konto:"Verbindlichkeiten",betrag:6545}] },
        { text: "Verkauf auf Ziel: 11.000 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:13090}], habenKonten: [{konto:"Umsatzerlöse",betrag:11000},{konto:"Umsatzsteuer",betrag:2090}] },
        { text: "Kauf von Hilfsstoffen bar: 180 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:180},{konto:"Vorsteuer",betrag:34.20}], habenKonten: [{konto:"Kasse",betrag:214.20}] },
        { text: "Rohstoffeinkauf per Bank: 7.800 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:7800},{konto:"Vorsteuer",betrag:1482}], habenKonten: [{konto:"Bank",betrag:9282}] },
        { text: "Warenverkauf bar: 4.000 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:4760}], habenKonten: [{konto:"Umsatzerlöse",betrag:4000},{konto:"Umsatzsteuer",betrag:760}] },
        { text: "BGA-Kauf (Laptop) auf Ziel: 1.500 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:1500},{konto:"Vorsteuer",betrag:285}], habenKonten: [{konto:"Verbindlichkeiten",betrag:1785}] },
        { text: "Einkauf Rohstoffe bar: 1.300 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:1300},{konto:"Vorsteuer",betrag:247}], habenKonten: [{konto:"Kasse",betrag:1547}] },
        { text: "Verkauf per Bank: 6.800 € zzgl. 19% USt.", sollKonten: [{konto:"Bank",betrag:8092}], habenKonten: [{konto:"Umsatzerlöse",betrag:6800},{konto:"Umsatzsteuer",betrag:1292}] },
        { text: "Hilfsstoffeinkauf per Bank: 500 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:500},{konto:"Vorsteuer",betrag:95}], habenKonten: [{konto:"Bank",betrag:595}] },
        { text: "Warenverkauf auf Ziel: 15.000 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:17850}], habenKonten: [{konto:"Umsatzerlöse",betrag:15000},{konto:"Umsatzsteuer",betrag:2850}] },
        { text: "Rohstoffeinkauf auf Ziel: 3.500 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:3500},{konto:"Vorsteuer",betrag:665}], habenKonten: [{konto:"Verbindlichkeiten",betrag:4165}] },
        { text: "Barverkauf: 2.000 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:2380}], habenKonten: [{konto:"Umsatzerlöse",betrag:2000},{konto:"Umsatzsteuer",betrag:380}] },
        { text: "USt-Vorauszahlung ans Finanzamt per Bank: 4.500 €.", sollKonten: [{konto:"Umsatzsteuer",betrag:4500}], habenKonten: [{konto:"Bank",betrag:4500}] },
        { text: "Einkauf BGA (Beamer) per Bank: 900 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:900},{konto:"Vorsteuer",betrag:171}], habenKonten: [{konto:"Bank",betrag:1071}] },
        { text: "Rohstoffeinkauf per Bank: 12.500 € zzgl. 19% USt.", sollKonten: [{konto:"Rohstoffe",betrag:12500},{konto:"Vorsteuer",betrag:2375}], habenKonten: [{konto:"Bank",betrag:14875}] },
        { text: "Verkauf bar: 5.500 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:6545}], habenKonten: [{konto:"Umsatzerlöse",betrag:5500},{konto:"Umsatzsteuer",betrag:1045}] },
        { text: "Hilfsstoffeinkauf auf Ziel: 750 € zzgl. 19% USt.", sollKonten: [{konto:"Hilfsstoffe",betrag:750},{konto:"Vorsteuer",betrag:142.50}], habenKonten: [{konto:"Verbindlichkeiten",betrag:892.50}] },
        { text: "Verkauf auf Ziel: 8.200 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:9758}], habenKonten: [{konto:"Umsatzerlöse",betrag:8200},{konto:"Umsatzsteuer",betrag:1558}] },
        // Zusammengesetzte Buchungssätze – Profi (Steuer + gemischte Zahlung)
        { text: "Rohstoffeinkauf (netto 6.000 € + VoSt 1.140 €): 4.000 € per Bank, 3.140 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:6000},{konto:"Vorsteuer",betrag:1140}], habenKonten: [{konto:"Bank",betrag:4000},{konto:"Verbindlichkeiten",betrag:3140}] },
        { text: "Warenverkauf (netto 12.000 € + USt 2.280 €): 10.000 € per Bank, 4.280 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:10000},{konto:"Forderungen",betrag:4280}], habenKonten: [{konto:"Umsatzerlöse",betrag:12000},{konto:"Umsatzsteuer",betrag:2280}] },
        { text: "Rohstoffeinkauf (netto 20.000 € + VoSt 3.800 €): 15.000 € per Bank, 8.800 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:20000},{konto:"Vorsteuer",betrag:3800}], habenKonten: [{konto:"Bank",betrag:15000},{konto:"Verbindlichkeiten",betrag:8800}] },
        { text: "Warenverkauf (netto 5.000 € + USt 950 €): 3.000 € bar, 2.950 € auf Ziel.", sollKonten: [{konto:"Kasse",betrag:3000},{konto:"Forderungen",betrag:2950}], habenKonten: [{konto:"Umsatzerlöse",betrag:5000},{konto:"Umsatzsteuer",betrag:950}] },
        { text: "BGA-Kauf (netto 3.000 € + VoSt 570 €): 2.000 € per Bank, 1.570 € auf Ziel.", sollKonten: [{konto:"BGA",betrag:3000},{konto:"Vorsteuer",betrag:570}], habenKonten: [{konto:"Bank",betrag:2000},{konto:"Verbindlichkeiten",betrag:1570}] },
        { text: "Verkauf (netto 15.000 € + USt 2.850 €): 10.000 € per Bank und 7.850 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:10000},{konto:"Forderungen",betrag:7850}], habenKonten: [{konto:"Umsatzerlöse",betrag:15000},{konto:"Umsatzsteuer",betrag:2850}] },
        { text: "Rohstoffeinkauf (netto 8.000 € + VoSt 1.520 €): 5.520 € bar und 4.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:8000},{konto:"Vorsteuer",betrag:1520}], habenKonten: [{konto:"Kasse",betrag:5520},{konto:"Verbindlichkeiten",betrag:4000}] },
        { text: "Warenverkauf (netto 4.500 € + USt 855 €): 3.355 € per Bank, 2.000 € bar.", sollKonten: [{konto:"Bank",betrag:3355},{konto:"Kasse",betrag:2000}], habenKonten: [{konto:"Umsatzerlöse",betrag:4500},{konto:"Umsatzsteuer",betrag:855}] },
        { text: "Rohstoffkauf (netto 14.000 € + VoSt 2.660 €): 10.000 € per Bank, 6.660 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:14000},{konto:"Vorsteuer",betrag:2660}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Verbindlichkeiten",betrag:6660}] },
        { text: "Verkauf (netto 10.000 € + USt 1.900 €): 7.000 € per Bank, 4.900 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:7000},{konto:"Forderungen",betrag:4900}], habenKonten: [{konto:"Umsatzerlöse",betrag:10000},{konto:"Umsatzsteuer",betrag:1900}] },
        { text: "Rohstoffeinkauf (netto 3.000 € + VoSt 570 €): 2.570 € bar, 1.000 € auf Ziel.", sollKonten: [{konto:"Rohstoffe",betrag:3000},{konto:"Vorsteuer",betrag:570}], habenKonten: [{konto:"Kasse",betrag:2570},{konto:"Verbindlichkeiten",betrag:1000}] },
        { text: "Warenverkauf (netto 7.500 € + USt 1.425 €): 5.000 € per Bank, 3.925 € auf Ziel.", sollKonten: [{konto:"Bank",betrag:5000},{konto:"Forderungen",betrag:3925}], habenKonten: [{konto:"Umsatzerlöse",betrag:7500},{konto:"Umsatzsteuer",betrag:1425}] },
        { text: "Kauf einer CNC-Maschine per Banküberweisung: 50.000 € zzgl. 19% USt.", sollKonten: [{konto:"Maschinen",betrag:50000},{konto:"Vorsteuer",betrag:9500}], habenKonten: [{konto:"Bank",betrag:59500}] },
        { text: "Kauf eines Lieferwagens (Fuhrpark) auf Ziel: 35.000 € zzgl. 19% USt.", sollKonten: [{konto:"Fuhrpark",betrag:35000},{konto:"Vorsteuer",betrag:6650}], habenKonten: [{konto:"Verbindlichkeiten",betrag:41650}] },
        { text: "Kauf von Büroregalen (BGA) gegen Barzahlung: 800 € zzgl. 19% USt.", sollKonten: [{konto:"BGA",betrag:800},{konto:"Vorsteuer",betrag:152}], habenKonten: [{konto:"Kasse",betrag:952}] },
        { text: "Wir verkaufen eine alte Produktionsmaschine per Banküberweisung: 12.000 € zzgl. 19% USt.", sollKonten: [{konto:"Bank",betrag:14280}], habenKonten: [{konto:"Maschinen",betrag:12000},{konto:"Umsatzsteuer",betrag:2280}] },
        { text: "Verkauf eines ausgemusterten Firmen-PKW (Fuhrpark) bar für 5.000 € zzgl. 19% USt.", sollKonten: [{konto:"Kasse",betrag:5950}], habenKonten: [{konto:"Fuhrpark",betrag:5000},{konto:"Umsatzsteuer",betrag:950}] },
        { text: "Wir verkaufen einen gebrauchten Schreibtisch (BGA) auf Ziel für 400 € zzgl. 19% USt.", sollKonten: [{konto:"Forderungen",betrag:476}], habenKonten: [{konto:"BGA",betrag:400},{konto:"Umsatzsteuer",betrag:76}] },
        { text: "Einkauf eines Gabelstaplers (Fuhrpark) per Banküberweisung: 23.800 € inkl. 19% USt.", sollKonten: [{konto:"Fuhrpark",betrag:20000},{konto:"Vorsteuer",betrag:3800}], habenKonten: [{konto:"Bank",betrag:23800}] },
        { text: "Kauf eines 3D-Druckers (Maschinen) gegen Barzahlung: 1.190 € inkl. 19% USt.", sollKonten: [{konto:"Maschinen",betrag:1000},{konto:"Vorsteuer",betrag:190}], habenKonten: [{konto:"Kasse",betrag:1190}] },
        { text: "Kauf einer Hobelmaschine (netto 15.000 € + VoSt 2.850 €): 10.000 € per Bank, Rest auf Ziel.", sollKonten: [{konto:"Maschinen",betrag:15000},{konto:"Vorsteuer",betrag:2850}], habenKonten: [{konto:"Bank",betrag:10000},{konto:"Verbindlichkeiten",betrag:7850}] },
        { text: "Kauf eines Transporters (netto 25.000 € + VoSt 4.750 €): 15.000 € per Bank, Rest auf Ziel.", sollKonten: [{konto:"Fuhrpark",betrag:25000},{konto:"Vorsteuer",betrag:4750}], habenKonten: [{konto:"Bank",betrag:15000},{konto:"Verbindlichkeiten",betrag:14750}] },
    ]
};

const KONTEN_LISTE_LEVELS = {
    beginner: ["Bank", "Kasse", "Forderungen", "Verbindlichkeiten", "Rohstoffe", "Fuhrpark", "Maschinen", "BGA", "Eigenkapital", "Darlehen"],
    advanced: ["Bank", "Kasse", "Forderungen", "Verbindlichkeiten", "Rohstoffe", "Umsatzerlöse", "Mietaufwendungen", "Materialaufwand", "Bürobedarf", "Zinserträge", "Sonst. Aufwendungen", "Fuhrpark", "Maschinen", "BGA"],
    pro: ["Bank", "Kasse", "Forderungen", "Verbindlichkeiten", "Rohstoffe", "Hilfsstoffe", "Umsatzerlöse", "Vorsteuer", "Umsatzsteuer", "BGA", "Materialaufwand", "Fuhrpark", "Maschinen"]
};

let currentBuchungLevel = 'beginner';
let currentCaseIndex = 0;
let buchungFeedback = null;
let buchungSuccess = false;

// New Exam Mode Variables
let currentBuchungMode = 'practice'; // 'practice' or 'exam'
let examCases = [];
let examAnswers = [];
let examScore = 0;
let examTimer = null;
let examTimeLeft = 300;
let examEndTime = 0; // 2 minutes
let examFinished = false;
let examStudentName = '';

function setBuchungMode(mode) {
    if (currentBuchungMode === mode) return;
    
    if (currentBuchungMode === 'exam' && examCases.length > 0) {
        if (!confirm("Möchtest du den Prüfungsmodus wirklich verlassen? Dein Prüfungsergebnis geht dabei verloren.")) {
            renderBuchung(); // Toggle optisch zurücksetzen
            return;
        }
    }

    currentBuchungMode = mode;
    currentCaseIndex = 0;
    buchungFeedback = null;
    buchungSuccess = false;
    if (examTimer) clearInterval(examTimer);
    examTimer = null;
    examTimeLeft = 300;
    examFinished = false;
    examCases = [];
    examAnswers = [];
    renderBuchung();
}

function startExam() {
    const nameInput = document.getElementById('exam-student-name-input');
    if (nameInput) {
        examStudentName = nameInput.value.trim();
        if (!examStudentName) {
            alert("Bitte gib deinen Namen ein, um die Prüfung zu starten. Dieser Name erscheint auf dem Zertifikat und kann später nicht mehr geändert werden.");
            return;
        }
    }

    const cases = BUCHUNGS_CASES_LEVELS[currentBuchungLevel];
    // Pick 10 random cases
    const shuffled = [...cases].sort(() => 0.5 - Math.random());
    examCases = shuffled.slice(0, 10);
    examAnswers = [];
    examScore = 0;
    currentCaseIndex = 0;
    examTimeLeft = 300;
    examEndTime = Date.now() + (300 * 1000);
    examFinished = false;
    buchungFeedback = null;
    buchungSuccess = false;
    
    examTimer = setInterval(() => {
        const now = Date.now();
        examTimeLeft = Math.ceil((examEndTime - now) / 1000);
        if (examTimeLeft <= 0) {
            examTimeLeft = 0;
            finishExam();
        } else {
            updateTimerDisplay();
        }
    }, 500);
    
    renderBuchung();
}

function finishExam() {
    if (examTimer) clearInterval(examTimer);
    examTimer = null;
    examFinished = true;
    renderBuchung();
}


function getAnswersHtml() {
    if (!examAnswers || examAnswers.length === 0) return '';
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 2rem; font-size: 0.9rem; text-align: left;">';
    html += '<tr style="background: rgba(0,0,0,0.05); border-bottom: 2px solid var(--text-main); color: var(--text-main);">';
    html += '<th style="padding: 0.75rem;">Nr.</th>';
    html += '<th style="padding: 0.75rem;">Geschäftsfall & Buchung</th>';
    html += '<th style="padding: 0.75rem; text-align: center;">Ergebnis</th>';
    html += '</tr>';
    
    examAnswers.forEach((ans, idx) => {
        const sollStr = ans.userSoll.map(s => `${s.konto || '?'} ${formatEur(s.betrag || 0)}`).join(' + ');
        const habenStr = ans.userHaben.map(h => `${h.konto || '?'} ${formatEur(h.betrag || 0)}`).join(' + ');
        const resColor = ans.isCorrect ? '#10b981' : '#ef4444';
        const resText = ans.isCorrect ? 'Richtig' : 'Falsch';
        
        html += `<tr style="border-bottom: 1px solid var(--card-border); color: var(--text-main);">`;
        html += `<td style="padding: 0.75rem; vertical-align: top;">${idx + 1}</td>`;
        html += `<td style="padding: 0.75rem;">
            <div style="margin-bottom: 0.4rem; color: var(--text-muted); font-size: 0.85rem;">${ans.text}</div>
            <div style="font-family: monospace; font-weight: bold;">${sollStr} an ${habenStr}</div>
        </td>`;
        html += `<td style="padding: 0.75rem; text-align: center; font-weight: bold; color: ${resColor}; vertical-align: top;">${resText}</td>`;
        html += `</tr>`;
    });
    html += '</table>';
    return html;
}

function updateTimerDisplay() {
    const el = document.getElementById('exam-timer-display');
    if (el) {
        const m = Math.floor(examTimeLeft / 60);
        const s = examTimeLeft % 60;
        el.innerText = `${m}:${s.toString().padStart(2, '0')}`;
        if (examTimeLeft <= 10) {
            el.style.color = '#ef4444';
            el.style.animation = 'pulse 1s infinite';
        }
    }
}

function generateFibuPDF() {
    if (typeof wawiShowToast === 'function') {
        wawiShowToast('Zertifikat wird vorbereitet...', 'info');
    }

    const studentName = examStudentName || 'Unbenannt';
    const dateStr = new Date().toLocaleDateString('de-DE');
    const timeStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    const percentage = Math.round((examScore / examCases.length) * 100);
    
    // Format Filename
    const safeName = studentName.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_');
    const safeDate = dateStr.replace(/\./g, '-');
    const safeTime = timeStr.replace(':', '-');
    const pdfTitle = `Buchhaltung_Prüfung_${safeName}_${safeDate}_${safeTime}`;

    // 1. Prepare Print Container in DOM
    let printContainer = document.getElementById('fibu-print-container');
    if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'fibu-print-container';
        document.body.appendChild(printContainer);
    }
    
    // 2. Setup HTML Structure
    const htmlContent = `
        <div class="wawi-print-header">
            <h1>Buchführungs-Zertifikat</h1>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 1.1rem;">
            <div>
                <strong>Name:</strong> ${studentName}<br>
                <strong>Niveaustufe:</strong> ${currentBuchungLevel.toUpperCase()}<br>
            </div>
            <div style="text-align: right;">
                <strong>Datum:</strong> ${dateStr}<br>
                <strong>Uhrzeit:</strong> ${timeStr}<br>
            </div>
        </div>
        
        <div style="background: #f0f0f0; padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 2rem; border: 1px solid #ccc; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <h3 style="margin-top: 0; border-bottom: none; font-size: 1.2rem;">Prüfungsergebnis</h3>
            <div style="font-size: 2rem; font-weight: bold; color: ${percentage >= 50 ? '#10b981' : '#ef4444'};">
                ${examScore} / ${examCases.length} korrekt (${percentage}%)
            </div>
        </div>
        
        <div class="wawi-print-section" style="margin-top: 2rem;">
            <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 0.5rem;">Deine Antworten:</h2>
            ${getAnswersHtml().replace(/var\(--text-main\)/g, '#000').replace(/var\(--text-muted\)/g, '#555').replace(/var\(--card-border\)/g, '#ccc')}
        </div>

        <div style="font-size: 0.9rem; color: #555; text-align: center; margin-top: 4rem; border-top: 1px solid #ccc; padding-top: 1rem;">
            Dieses Zertifikat wurde maschinell erstellt und ist ohne Unterschrift gültig.
        </div>
    `;
    
    printContainer.innerHTML = htmlContent;
    
    // 3. Trigger Print
    const originalTitle = document.title;
    document.title = pdfTitle;
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.title = originalTitle;
            // Note: We leave printContainer in the DOM, so Safari can render it during the print process.
        }, 1000);
    }, 500);
}

function generateHint(userSoll, userHaben, currentCase) {
    let hint = "<strong>Tipp:</strong> ";
    const targetAccounts = [...currentCase.sollKonten, ...currentCase.habenKonten].map(k => k.konto);
    
    // Check if any expected account falls into categories
    const activeAccounts = ["Bank", "Kasse", "Forderungen", "Rohstoffe", "Hilfsstoffe", "Fuhrpark", "Maschinen", "BGA", "Vorsteuer"];
    const passiveAccounts = ["Verbindlichkeiten", "Eigenkapital", "Darlehen", "Umsatzsteuer"];
    const aufwandAccounts = ["Mietaufwendungen", "Materialaufwand", "Bürobedarf", "Sonst. Aufwendungen"];
    const ertragAccounts = ["Umsatzerlöse", "Zinserträge"];
    
    let rules = [];
    if (targetAccounts.some(k => activeAccounts.includes(k))) {
        rules.push("Aktive Bestandskonten (in der Bilanz auf der Aktivseite): Zugänge im Soll, Abgänge im Haben.");
    }
    if (targetAccounts.some(k => passiveAccounts.includes(k))) {
        rules.push("Passive Bestandskonten (in der Bilanz auf der Passivseite): Zugänge im Haben, Abgänge im Soll.");
    }
    if (targetAccounts.some(k => aufwandAccounts.includes(k))) {
        rules.push("Aufwandskonten (Erfolgskonten): Zugänge im Soll (mindern das Eigenkapital).");
    }
    if (targetAccounts.some(k => ertragAccounts.includes(k))) {
        rules.push("Ertragskonten (Erfolgskonten): Zugänge im Haben (mehren das Eigenkapital).");
    }
    
    if (rules.length > 0) {
        hint += "<ul style='margin-top:0.5rem; padding-left:1.5rem;'>" + rules.map(r => `<li>${r}</li>`).join('') + "</ul>";
    } else {
        hint += "Prüfe die Kontenarten und ob es sich um Zugänge oder Abgänge handelt.";
    }
    return hint;
}


function setBuchungLevel(level) {
    if (currentBuchungLevel === level) return;
    currentBuchungLevel = level;
    currentCaseIndex = 0;
    buchungFeedback = null;
    buchungSuccess = false;
    renderBuchung();
}

function renderBuchung() {
    const container = document.getElementById('buchung-container');
    if (!container) return;

    const cases = BUCHUNGS_CASES_LEVELS[currentBuchungLevel];
    const currentCase = currentBuchungMode === 'exam' && examCases.length > 0 ? examCases[currentCaseIndex] : cases[currentCaseIndex];
    const konten = KONTEN_LISTE_LEVELS[currentBuchungLevel];
    const isCompound = currentCase.sollKonten.length > 1 || currentCase.habenKonten.length > 1;

    let kontoOptions = `<option value="">-- Konto wählen --</option>`;
    konten.sort().forEach(k => {
        kontoOptions += `<option value="${k}">${k}</option>`;
    });

    // Build Soll rows
    let sollRows = '';
    for (let i = 0; i < currentCase.sollKonten.length; i++) {
        sollRows += `
            <div style="display:flex; gap:0.5rem; align-items:center; ${i > 0 ? 'margin-top:0.5rem;' : ''}">
                <select id="bs-soll-${i}" style="flex:1; height:38px; padding:0 0.5rem; border-radius:4px; background:var(--bg-color); color:var(--text-main); border:1px solid var(--card-border); font-size:0.85rem;">
                    ${kontoOptions}
                </select>
                <input type="number" id="bs-betrag-soll-${i}" placeholder="Betrag" style="width:100px; height:38px; padding:0 0.5rem; border-radius:4px; background:var(--bg-color); color:var(--text-main); border:1px solid var(--card-border); font-size:0.85rem; box-sizing:border-box;">
            </div>
        `;
    }

    // Build Haben rows
    let habenRows = '';
    for (let i = 0; i < currentCase.habenKonten.length; i++) {
        habenRows += `
            <div style="display:flex; gap:0.5rem; align-items:center; ${i > 0 ? 'margin-top:0.5rem;' : ''}">
                <select id="bs-haben-${i}" style="flex:1; height:38px; padding:0 0.5rem; border-radius:4px; background:var(--bg-color); color:var(--text-main); border:1px solid var(--card-border); font-size:0.85rem;">
                    ${kontoOptions}
                </select>
                <input type="number" id="bs-betrag-haben-${i}" placeholder="Betrag" style="width:100px; height:38px; padding:0 0.5rem; border-radius:4px; background:var(--bg-color); color:var(--text-main); border:1px solid var(--card-border); font-size:0.85rem; box-sizing:border-box;">
            </div>
        `;
    }

    let html = `
        <!-- Level Selector & Mode Selector -->
        <div class="card" style="margin-bottom: 1rem; border-bottom: 2px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h4 style="margin: 0; color: var(--primary);">Niveaustufe wählen:</h4>
                    <p style="margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--text-muted);">Wähle die Schwierigkeit für die Buchungssätze.</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-primary ${currentBuchungLevel === 'beginner' ? 'active' : ''}" style="margin: 0; padding: 0.4rem 0.8rem; font-size: 0.85rem; ${currentBuchungLevel !== 'beginner' ? 'background: rgba(255,255,255,0.05); color: var(--text-main); border-color: transparent;' : ''}" onclick="setBuchungLevel('beginner')">Anfänger</button>
                    <button class="btn-primary ${currentBuchungLevel === 'advanced' ? 'active' : ''}" style="margin: 0; padding: 0.4rem 0.8rem; font-size: 0.85rem; ${currentBuchungLevel !== 'advanced' ? 'background: rgba(255,255,255,0.05); color: var(--text-main); border-color: transparent;' : ''}" onclick="setBuchungLevel('advanced')">Fortgeschritten</button>
                    <button class="btn-primary ${currentBuchungLevel === 'pro' ? 'active' : ''}" style="margin: 0; padding: 0.4rem 0.8rem; font-size: 0.85rem; ${currentBuchungLevel !== 'pro' ? 'background: rgba(255,255,255,0.05); color: var(--text-main); border-color: transparent;' : ''}" onclick="setBuchungLevel('pro')">Profi</button>
                </div>
            </div>
            
            <!-- Mode Toggle -->
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--card-border);">
                <div style="font-weight: 600; color: var(--text-main);">Modus:</div>
                <div class="wawi-mode-toggle" style="gap: 1rem;">
                    <span class="${currentBuchungMode === 'practice' ? 'active' : ''}">Übung</span>
                    <label class="wawi-switch">
                        <input type="checkbox" ${currentBuchungMode === 'exam' ? 'checked' : ''} onchange="setBuchungMode(this.checked ? 'exam' : 'practice')">
                        <span class="wawi-slider round"></span>
                    </label>
                    <span class="${currentBuchungMode === 'exam' ? 'active' : ''}">Prüfung</span>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">

            ${currentBuchungMode === 'exam' && examCases.length === 0 ? `
                <div style="text-align: center; padding: 2rem;">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">Bereit für die Prüfung?</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Du hast 5 Minuten Zeit für 10 zufällige Buchungssätze der Niveaustufe "${currentBuchungLevel.toUpperCase()}".</p>
                    
                    <div style="max-width: 300px; margin: 0 auto 2rem; text-align: left;">
                        <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: bold;">Dein Name (Pflichtfeld):</label>
                        <input type="text" id="exam-student-name-input" placeholder="Max Mustermann" class="wawi-input" style="width: 100%;">
                    </div>
                    
                    <button class="btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;" onclick="startExam()">Prüfung starten 🚀</button>
                </div>
            ` : currentBuchungMode === 'exam' && examFinished ? `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: ${examScore / 10 >= 0.5 ? '#10b981' : '#ef4444'}; margin-bottom: 1rem;">Prüfung beendet!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem;">Dein Ergebnis: <strong>${examScore} / 10</strong> korrekte Buchungssätze (${Math.round((examScore/10)*100)}%).</p>
                    
                    <div style="max-width: 300px; margin: 0 auto 2rem; text-align: center; background: rgba(0,0,0,0.05); padding: 1rem; border-radius: 8px;">
                        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Geprüfter Name:</span>
                        <strong style="font-size: 1.1rem; color: var(--text-main);">${examStudentName}</strong>
                    </div>
                    
                    <button class="btn-primary wawi-btn-pdf" style="margin: 0 auto;" onclick="generateFibuPDF()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Zertifikat als PDF speichern
                    </button>
                    
                    <div style="margin-top: 3rem; text-align: left;">
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">Bearbeitete Buchungssätze:</h4>
                        ${getAnswersHtml()}
                    </div>
                </div>
            ` : `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: var(--primary);">Geschäftsfall ${currentCaseIndex + 1} / ${currentBuchungMode === 'exam' ? 10 : cases.length}</h3>
                
                ${currentBuchungMode === 'exam' ? `
                    <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.4rem 1rem; border-radius: 2rem; font-weight: bold;">
                        ⏱️ <span id="exam-timer-display">${Math.floor(examTimeLeft / 60)}:${(examTimeLeft % 60).toString().padStart(2, '0')}</span>
                    </div>
                ` : `
                    <div style="display: flex; gap: 0.3rem;">
                        <button class="btn-primary" style="margin:0; padding: 0.3rem 0.6rem;" onclick="prevCase()" ${currentCaseIndex === 0 ? 'disabled' : ''}>&larr;</button>
                        <button class="btn-primary" style="margin:0; padding: 0.3rem 0.6rem;" onclick="nextCase()" ${currentCaseIndex === cases.length - 1 ? 'disabled' : ''}>&rarr;</button>
                    </div>
                `}
            </div>
            
            <p style="font-size: 1.1rem; line-height: 1.6; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 6px; margin-bottom: 1.5rem;">
                "${currentCase.text}"
            </p>

            ${isCompound ? '<div style="margin-bottom:1rem; padding:0.6rem 1rem; background:rgba(0,134,203,0.1); border-radius:6px; border-left:4px solid var(--primary); font-size:0.85rem;"><strong>💡 Hinweis:</strong> Dies ist ein <strong>zusammengesetzter Buchungssatz</strong> mit mehreren Soll- und/oder Haben-Konten.</div>' : ''}

            <h4 style="margin-bottom: 1rem;">Buchungssatz bilden (Eintrag ins Journal / Grundbuch):</h4>
            
            <div class="buchung-form" style="display:flex; align-items:flex-start; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem; background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
                <div style="flex:1; min-width:140px;">
                    <label style="display:block; margin-bottom:0.4rem; color:var(--text-muted); font-size:0.85rem;">Soll-Konto${currentCase.sollKonten.length > 1 ? 'n' : ''}</label>
                    ${sollRows}
                </div>
                
                <div style="font-weight:bold; font-size:1.1rem; height:38px; display:flex; align-items:center; padding-top:1.6rem;">an</div>

                <div style="flex:1; min-width:140px;">
                    <label style="display:block; margin-bottom:0.4rem; color:var(--text-muted); font-size:0.85rem;">Haben-Konto${currentCase.habenKonten.length > 1 ? 'n' : ''}</label>
                    ${habenRows}
                </div>

                <div style="padding-top:1.6rem;">
                    <button class="btn-primary" style="margin:0; height:38px; padding:0 1.2rem; white-space:nowrap;" onclick="checkBuchung()">Buchen</button>
                </div>
            </div>

            <div id="buchung-feedback">
                ${buchungFeedback 
                    ? `<div class="feedback-box ${buchungSuccess ? 'success' : 'error'}">${buchungFeedback}</div>` 
                    : ''}
            </div>

            ${buchungSuccess && currentBuchungMode !== 'exam' ? renderCompoundTKonten(currentCase) : ''}
            `}

        </div>
    `;

    container.innerHTML = html;
}

function checkBuchung() {
    const cases = BUCHUNGS_CASES_LEVELS[currentBuchungLevel];
    const currentCase = currentBuchungMode === 'exam' ? examCases[currentCaseIndex] : cases[currentCaseIndex];

    // Collect user inputs
    const userSoll = [];
    for (let i = 0; i < currentCase.sollKonten.length; i++) {
        const konto = document.getElementById(`bs-soll-${i}`)?.value;
        const betrag = parseFloat((document.getElementById(`bs-betrag-soll-${i}`)?.value || '').replace(',', '.'));
        userSoll.push({ konto, betrag });
    }

    const userHaben = [];
    for (let i = 0; i < currentCase.habenKonten.length; i++) {
        const konto = document.getElementById(`bs-haben-${i}`)?.value;
        const betrag = parseFloat((document.getElementById(`bs-betrag-haben-${i}`)?.value || '').replace(',', '.'));
        userHaben.push({ konto, betrag });
    }

    // Validation: all fields filled
    const allFilled = userSoll.every(s => s.konto && !isNaN(s.betrag)) && userHaben.every(h => h.konto && !isNaN(h.betrag));
    if (!allFilled) {
        buchungFeedback = "Bitte fülle alle Konten und Beträge aus.";
        buchungSuccess = false;
        renderBuchung();
        return;
    }

    // Check correctness: match each entry (order-sensitive)
    let correct = true;
    for (let i = 0; i < currentCase.sollKonten.length; i++) {
        if (userSoll[i].konto !== currentCase.sollKonten[i].konto || Math.abs(userSoll[i].betrag - currentCase.sollKonten[i].betrag) > 0.02) {
            correct = false;
            break;
        }
    }
    if (correct) {
        for (let i = 0; i < currentCase.habenKonten.length; i++) {
            if (userHaben[i].konto !== currentCase.habenKonten[i].konto || Math.abs(userHaben[i].betrag - currentCase.habenKonten[i].betrag) > 0.02) {
                correct = false;
                break;
            }
        }
    }

    if (correct) {
        if (currentBuchungMode === 'exam') {
            examAnswers.push({
                text: currentCase.text,
                userSoll: [...userSoll],
                userHaben: [...userHaben],
                isCorrect: true
            });
            examScore++;
            buchungFeedback = "Korrekt! Weiter zur nächsten Frage...";
            buchungSuccess = true;
            renderBuchung();
            
            setTimeout(() => {
                if (currentCaseIndex < 9) {
                    currentCaseIndex++;
                    buchungFeedback = null;
                    buchungSuccess = false;
                    renderBuchung();
                } else {
                    finishExam();
                }
            }, 800);
            return;
        } else {
            const isCompound = currentCase.sollKonten.length > 1 || currentCase.habenKonten.length > 1;
            if (isCompound) {
                buchungFeedback = "Richtig! Der zusammengesetzte Buchungssatz wurde korrekt gebildet.";
            } else {
                const s = currentCase.sollKonten[0];
                const h = currentCase.habenKonten[0];
                buchungFeedback = `Richtig! ${s.konto} an ${h.konto} für ${formatEur(s.betrag)}.`;
            }
            buchungSuccess = true;
        }
    } else {
        if (currentBuchungMode === 'exam') {
            examAnswers.push({
                text: currentCase.text,
                userSoll: [...userSoll],
                userHaben: [...userHaben],
                isCorrect: false
            });
            buchungFeedback = "Leider falsch! Nächste Frage...";
            buchungSuccess = false;
            renderBuchung();
            
            setTimeout(() => {
                if (currentCaseIndex < 9) {
                    currentCaseIndex++;
                    buchungFeedback = null;
                    buchungSuccess = false;
                    renderBuchung();
                } else {
                    finishExam();
                }
            }, 1000);
            return;
        } else {
            buchungFeedback = "Der Buchungssatz ist leider nicht korrekt.<br>" + generateHint(userSoll, userHaben, currentCase);
            buchungSuccess = false;
        }
    }

    renderBuchung();
}

function nextCase() {
    const cases = BUCHUNGS_CASES_LEVELS[currentBuchungLevel];
    if (currentCaseIndex < cases.length - 1) {
        currentCaseIndex++;
        buchungFeedback = null;
        buchungSuccess = false;
        renderBuchung();
    }
}

function prevCase() {
    if (currentCaseIndex > 0) {
        currentCaseIndex--;
        buchungFeedback = null;
        buchungSuccess = false;
        renderBuchung();
    }
}

function renderCompoundTKonten(c) {
    let accounts = '';
    // Render Soll T-Konten
    for (const entry of c.sollKonten) {
        accounts += renderSingleTAccount(entry.konto, entry.betrag, 'Soll');
    }
    // Render Haben T-Konten
    for (const entry of c.habenKonten) {
        accounts += renderSingleTAccount(entry.konto, entry.betrag, 'Haben');
    }

    const isCompound = c.sollKonten.length > 1 || c.habenKonten.length > 1;
    const title = isCompound ? 'Zusammengesetzter Buchungssatz im Hauptbuch:' : 'Eintragung ins Hauptbuch (T-Konten):';

    return `
        <h4 style="margin-top: 2rem; margin-bottom: 1rem;">${title}</h4>
        <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            ${accounts}
        </div>
    `;
}

function renderSingleTAccount(name, betrag, side) {
    const formattedBetrag = formatEur(betrag);
    return `
        <div style="flex: 1; min-width: 250px; border: 1px solid var(--card-border); border-radius: 4px; overflow: hidden;">
            <div style="background: var(--card-border); padding: 0.5rem; text-align: center; border-bottom: 2px solid var(--text-main);">
                <strong>${name}</strong>
            </div>
            <div style="display: flex; min-height: 100px;">
                <div style="flex: 1; border-right: 2px solid var(--text-main); padding: 0.5rem;">
                    <span style="color: var(--text-muted); font-size: 0.8rem; display: block; text-align: center; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 0.2rem; margin-bottom: 0.4rem;">Soll</span>
                    ${side === 'Soll' ? `<div style="display: flex; justify-content: space-between; font-family: monospace; color: #10b981; font-weight: bold;"><span>(1)</span><span>${formattedBetrag}</span></div>` : ''}
                </div>
                <div style="flex: 1; padding: 0.5rem;">
                    <span style="color: var(--text-muted); font-size: 0.8rem; display: block; text-align: center; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 0.2rem; margin-bottom: 0.4rem;">Haben</span>
                    ${side === 'Haben' ? `<div style="display: flex; justify-content: space-between; font-family: monospace; color: #10b981; font-weight: bold;"><span>(1)</span><span>${formattedBetrag}</span></div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Keep old function names for backward compatibility (unused but safe)
function renderTKonten(sollKonto, habenKonto, betrag) {
    return renderCompoundTKonten({ sollKonten: [{konto: sollKonto, betrag}], habenKonten: [{konto: habenKonto, betrag}] });
}

function renderSplitTKonten(c) {
    return renderCompoundTKonten(c);
}
