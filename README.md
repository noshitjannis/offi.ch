# Projektdokumentation – Offi

## Inhaltsverzeichnis

1. [Einordnung & Zielsetzung](#1-einordnung--zielsetzung)
2. [Zielgruppe & Stakeholder](#2-zielgruppe--stakeholder)
3. [Anforderungen & Umfang](#3-anforderungen--umfang)
4. [Vorgehen & Artefakte](#4-vorgehen--artefakte)
    - [Understand & Define](#41-understand--define)
    - [Sketch](#42-sketch)
    - [Decide](#43-decide)
    - [Prototype](#44-prototype)
    - [Validate](#45-validate)
5. [Erweiterungen [Optional]](#5-erweiterungen-optional)
6. [Projektorganisation [Optional]](#6-projektorganisation-optional)
7. [KI-Deklaration](#7-ki-deklaration)
8. [Anhang [Optional]](#8-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Einordnung & Zielsetzung
Kurz beschreiben, welches Problem adressiert wird und welches Ergebnis angestrebt ist.
- **Kontext & Problem:** Offi adressiert den manuellen Offert-Prozess in Word/Excel (doppelte Stammdaten, Medienbrüche und Layout-Probleme beim PDF-Export sowie geringe Nachverfolgbarkeit). Ziel ist ein geführter Web-Builder, der Offerten konsistent als A4-PDF und JSON exportiert.
- **Ziele:** 
  - Geführter Workflow, um Firmen- und Kundendaten sowie Positionen sauber zu erfassen
  - Live A4-Preview, damit Layout und Seitenumbrüche bereits während der Eingabe stimmen
  - Export als A4-PDF (druck-/versandfähig) und als JSON (Vorlagen/Weiterbearbeitung)
  - Wiederverwendung von Stammdaten (Firmenprofil inkl. MWST/Bank/Logo)
- **Abgrenzung [Optional]:** Kein vollwertiges CRM, keine E-Signatur, kein In-App Mailing/Versand, keine automatisierten Zahlungs-/Rechnungsprozesse (z.B. QR-Rechnung) im aktuellen Prototyp.

## 2. Zielgruppe & Stakeholder
Wem nützt die Lösung, wer ist beteiligt oder betroffen?
- **Primäre Zielgruppe:** Schweizer KMU, Startups und Freelancer, die regelmässig Offerten erstellen und CH-Spezifika wie CHF, MWST und Bankdaten direkt im Dokument brauchen.
- **Weitere Stakeholder [Optional]:** 
  - (Projektkontext) Dozierende/Assistenz im Modul Prototyping
  - Potenzielle interne Admins/Teammitglieder (falls Offi später als SaaS erweitert wird)
- **Annahmen [Optional]:**
  - Nutzende bevorzugen einen geführten Builder mit sofortigem A4-Preview gegenüber Word/Excel.
  - Die klare Trennung „Gastmodus vs. Login“ reduziert Einstiegshürden, ohne den Nutzen von Accounts zu verwischen.
  - Das Speichern von Entwürfen und fertigen Offerten ist für reale Nutzung zentral (nicht nur Export).

## 3. Anforderungen & Umfang
Beschreibt den verbindlichen Umfang gemäss Übungen und allfällige Erweiterungen.
- **Kernfunktionalität (Mindestumfang):** (aus den umgesetzten Workflows abgeleitet)
  - Landing mit klarer Value Proposition und CTA (Gast starten oder einloggen/registrieren)
  - Auth-Flow: Registrierung, Login, Logout; Session-basiert
  - Gastmodus: Offerte erstellen und exportieren, aber keine serverseitige Speicherung
  - Firmenprofil: Stammdaten inkl. Adresse, MWST, Bankdaten und Logo-Upload
  - Offert-Builder: Kundendaten + Offert-Metadaten + Positionsliste erfassen, Berechnungen (Subtotal, Rabatt, MWST, Total)
  - Live A4-Preview inkl. Export als PDF sowie Export/Import als JSON
  - Verwaltung: Entwürfe und fertige Offerten in Listen anzeigen, bearbeiten/löschen/umbenennen
- **Akzeptanzkriterien:** (ableitbar und testbar)
  1) Nutzende können den End-to-End Workflow „Offerte erstellen -> PDF exportieren“ ohne Fehlermeldung durchlaufen.
  2) Das A4-PDF wirkt sauber (kein abgeschnittener Inhalt; Layout entspricht Preview; keine ungewollten Zusatzseiten).
  3) Firmenprofil-Daten (Adresse/MWST/Bank/Logo) werden gespeichert und beim nächsten Builder-Start vorbefüllt.
  4) Positionsberechnung ist konsistent (Subtotal -> Rabatt -> Zwischentotal -> MWST -> Total) und in CHF formatiert.
  5) JSON-Export erzeugt ein wiederverwendbares Datenformat; JSON-Import/Template-Load führt zu identischem Preview-Ergebnis.
  6) Angemeldete Nutzende können Entwürfe speichern und später wieder laden und weiterbearbeiten.
  7) Fertige Offerten können gespeichert, angezeigt und aus einer Offer wieder als Draft zum Bearbeiten erzeugt werden.
  8) Gastmodus blockiert serverseitiges Speichern (Entwurf/Offer) klar und bietet eine CTA zum Login/Registrieren.
- **Erweiterungen [Optional]:** (falls als „über Mindestumfang“ gewertet)
  - A4-Export-Optimierung (Scaling/Overflow-Handling für saubere Seitenumbrüche)
  - Offer/Draft Lifecycle (Konvertierung Offer -> Draft zum Bearbeiten)

## 4. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 4.1 Understand & Define
- **Ausgangslage & Ziele:** Offerten werden in Word/Excel häufig manuell erstellt; Stammdaten werden kopiert und verursachen Fehler, und beim PDF-Export entstehen Layout-Probleme. Ziel war ein geführter Builder mit professionellem A4-Output und Wiederverwendung von Stammdaten.
- **Zielgruppenverständnis:** Fokus auf typische Offert-Situation in CH (CHF, MWST, Bankdaten, Logo) und auf einen Workflow, der auch ohne Vorwissen schnell zum Resultat führt.
- **Wesentliche Erkenntnisse:** 
  - Der PDF-Export ist das „sichtbare Endprodukt“ und muss sauber sein (Layout/Seitenumbrüche).
  - Stammdaten-Reuse (Firmenprofil) ist zentral, um Zeit zu sparen und Fehler zu reduzieren.
  - Ein klar geführter Ablauf hilft besonders beim Einstieg (Gast/Account sauber trennen).
  - Ohne Speicherfunktion (Drafts/Offers) bleibt ein Prototyp im realen Use Case zu limitiert.

### 4.2 Sketch
- **Variantenüberblick:** Es wurden Varianten für den Builder-Flow und die Account-Struktur skizziert.
- **Skizzen:** 
  - Variante A: Stepper/Wizard (schrittweiser Prozess)
  - Variante B: Ein-Seiten-Builder mit Accordion links und Live-Preview rechts
  - Account-Varianten: Tabs vs. Accordion für Profil + Listen (Drafts/Offers)
  
  Artefakt: Skizze als PDF im Repository:
  - `static/jm_abgabe9.pdf`

  Unterschiede kurz:
  - Stepper reduziert sichtbare Komplexitaet pro Schritt, kann aber Preview/Export-Checks verzögern.
  - Ein-Seiten-Builder erlaubt ständiges A4-Preview und schnellere Iteration (Felder anpassen -> Preview sofort).

### 4.3 Decide
- **Gewählte Variante & Begründung:** Gewählt wurde der Ein-Seiten-Builder mit Accordion links und Live A4-Preview rechts.
  - Entscheidungskriterien: schnelle Iteration, ständige Sicht auf das Endresultat (A4), klare Strukturierung trotz vieler Felder, weniger Kontextwechsel.
  - Zusätzlich: klare CTA-Trennung „Gast starten“ vs. „Login/Registrierung“.
- **End-to-End-Ablauf:** 
  1) Landing -> Auswahl Gast oder Login
  2) (Optional) Registrierung/Login -> Account
  3) Builder öffnen -> Firmenprofil wird vorbefüllt
  4) Kunde + Offertdaten + Positionen erfassen
  5) Preview prüfen (A4) -> Export (PDF/JSON)
  6) (Account) Draft speichern oder fertige Offer speichern/verwalten
- **Referenz-Mockup:** 
  - Figma (Referenz): https://www.figma.com/make/ucTDZwwmh235jCSA3Gejzm/SaaS-Webdesign-f%C3%BCr-Offertino?p=f&fullscreen=1

### 4.4 Prototype
- **Kernfunktionalität:** 
  - Landing mit Marketing-Sektionen und klaren CTAs (Gast vs. Login)
  - Auth: Registrierung/Login/Logout (Session-basiert)
  - Builder: Accordion-Formular, Live A4-Preview, Berechnungen, PDF-Export und JSON Export/Import
  - Account: Firmenprofil inkl. Logo, Listen für Drafts und Offers inkl. Bearbeiten/Löschen/Umbenennen
  - Datenpersistenz (Account): Speicherung in MongoDB für Profil, Drafts und Offers
- **Deployment:** https://offich.netlify.app/

#### 4.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** 
  - Landing (Value Proposition, Features, Steps, Zielgruppen, Pricing/CTA)
  - Einstieg: Auswahl Gastmodus oder Login/Registrierung
  - Builder (Erfassung links, A4-Preview rechts, Finish/Export)
  - Account (Profil + Verwaltung Drafts/Offers)
- **Oberflächenentwürfe:** (als Leitplanken, Screenshots empfohlen)
  - Landing: Hero, Feature-Grid, Steps, Zielgruppen-Block, CTA
  - Login/Gast: Karten-UI für klare Entscheidung
  - Builder: Accordion links (Formularblöcke) + A4 Preview rechts
  - Finish/Export: Export-Karten (PDF/JSON) und Save-Optionen
  - Account: Profil-Accordion (Stammdaten) + Listen/Modals für Drafts und Offers
- **Designentscheidungen:** 
  - Accordion statt „endloser“ Form: reduziert Overload, bleibt aber auf einer Seite.
  - Live A4-Preview: Layout-Fokus von Anfang an, weniger „PDF-Ueberraschungen“ am Schluss.
  - Gastmodus + Account getrennt: schneller Einstieg, aber klare Begrenzung (kein Speichern ohne Login).
  - Platzhalter/Defaults so eingesetzt, dass Preview stabil bleibt, aber Formular nicht verwirrt.

#### 4.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie-Stack:** SvelteKit (Svelte), TypeScript, MongoDB, Auth via Lucia (mit Mongo-Adapter), clientseitiger PDF-Export via html2pdf.js/jspdf.
- **Tooling:** 
  - Lokale Entwicklung: Node.js + npm (Dev-Server)
  - Deployment: Netlify
  - Design: Figma (Mockup/Referenz), Adobe Illustrator (Logo/Maskottchen)
  - Datenbank: MongoDB (URI via Env)
- **Struktur & Komponenten:** (Kurzübersicht)
  - Pages/Layouts in SvelteKit (Landing, Login/Register, Builder, Account)
  - Server Actions für Login/Register/Account-Updates
  - API-Endpunkte für Draft/Offer Save/Load/Delete
  - MongoDB Client als Singleton (HMR-sicher) + DB-Auswahl via Env
  - Builder-State: Formularwerte + „resolved“-Werte für stabiles Preview/PDF
- **Daten & Schnittstellen [Optional]:**
  - Collections: `users`, `sessions`, `drafts`, `offers`
  - Profil-Daten unter `users.company` (Adresse, MWST, Bank, Logo als Data-URL/Base64)
  - Draft/Offer Payload konsistent (company, customer, offerMeta, tax, positions)
  - JSON Export/Import nutzt denselben Payload (Vorlagenformat)
- **Besondere Entscheidungen:**
  - PDF-Export clientseitig (schnell für Prototyp, weniger Backend-Komplexität), dafür mehr Aufwand in Layout/Overflow.
  - Gastmodus ohne Speichern (klarer Nutzen von Accounts, reduziert Daten-/Session-Komplexitaet fuer Gaeste).
  - Fokus auf Prototyping statt Testautomatisierung/CI (manuelle E2E-Tests, siehe Validate).

### 4.5 Validate
- **URL der getesteten Version** (separat deployt)
  - Es gab kein separates Deployment für die Tests; die Evaluationen wurden vor Ort auf einer lokalen Version durchgeführt. Das aktuelle Deployment ist: https://offich.netlify.app/
- **Ziele der Prüfung:** 
  - Verstehen Nutzende den geführten Builder-Flow (Gast/Login) ohne Erklärungen?
  - Ist das Formular (Accordion) verständlich und nicht überfordernd?
  - Funktionieren Export (PDF/JSON) und Bearbeitungsschritt im JSON-Szenario?
- **Vorgehen:** moderiert, on-site (vor Ort)
- **Stichprobe:** 2 Testpersonen
  - 1x KMU-Besitzer
  - 1x Peer
- **Aufgaben/Szenarien:** 
  1) „Erstelle eine Offerte für Firma XYZ: trage alle Firmeninfos ein und erstelle Positionen X, Y und Z für den Kunden ZYX. Exportiere die Offerte als PDF.“
  2) „Speichere die Offerte als JSON, passe danach die Preise der Positionen an (über JSON/Template-Workflow) und prüfe das Resultat im Preview/Export.“
- **Kennzahlen & Beobachtungen:** 
  - Erfolgsquote: 2/2 Personen konnten beide Szenarien nahezu ohne Komplikationen abschliessen.
  - Qualitative Beobachtungen:
    - Workflow wurde als sauber, geführt und nachvollziehbar wahrgenommen.
    - Platzhaltertext im Formular war anfänglich zu dominant/verwirrend.
    - Logo-Upload Dialog/Fenster wirkte zu klein und unpraktisch.
    - Wunsch nach Speichern/Verwalten (Drafts/Offers) wurde als zentraler Produktnutzen bestätigt.
- **Zusammenfassung der Resultate:** Der Builder-Flow ist grundsätzlich verständlich und führt Nutzende sicher zum Resultat. Die grössten Usability-Verbesserungen betreffen Formulardetails (Platzhalter) und die Bedienbarkeit einzelner Inputs (Logo Upload) sowie die Notwendigkeit einer Speicherfunktion.
- **Abgeleitete Verbesserungen:** (priorisiert)
  1) Draft/Offer-Backend einführen bzw. ausbauen, damit reale Nutzung möglich wird.
  2) Platzhalterstrategie überarbeiten (weniger dominant, klarere Defaults, bessere Labels/Helper).
  3) Logo-Upload UX verbessern (grössere Vorschau/Dropzone, klarere Interaktion).
- **Umgesetzte Anpassungen [Optional]:**
  - Backend für Entwürfe und fertige Offerten (Persistenz in MongoDB, Verwaltung im Account).
  - Platzhalter/Defaults so angepasst, dass das Formular weniger verwirrt und Preview stabil bleibt.
  - Logo-Upload Fenster/Interaktion vergrössert und besser bedienbar.

## 5. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.

Der Mindestumfang (gemass Übung 10 / Woche 11) verlangt u.a. **einen klaren Hauptworkflow**, **mind. eine Uebersichtsseite mit DB-Daten**, **mind. eine Erfassungs-/Bearbeitungsseite**, **MongoDB-Persistenz**, sowie ein **Deployment**. Erweiterungen sind folglich Funktionen/Optimierungen, die ueber diese Baseline hinausgehen (z.B. zusaetzliche Workflows, erweiterte Verwaltung, Export-Qualitaet, Templates). 

- **Beschreibung & Nutzen:**
  - **Mehrere Workflows statt nur „ein Hauptworkflow“:** Neben dem Kernfluss „Offerte erstellen -> Export“ gibt es getrennte Flows für **Gastmodus vs. Account**, sowie den **Lifecycle Draft -> Offer** und **Offer -> Draft** (zum späteren Bearbeiten). Das macht Offi näher an einer realen Anwendung.
  - **Erweiterte Verwaltung im Account:** Drafts und Offers können nicht nur angezeigt werden, sondern auch **umbenannt, gelöscht und gezielt weiterbearbeitet** werden (inkl. Modals/Inline-Aktionen). Das geht über ein reines „List aus DB“ hinaus.
  - **A4-PDF Export-Qualität als Schwerpunkt:** Der PDF-Export wurde so optimiert, dass die Offerte **druck-/versandfähig** wirkt (stabile A4-Darstellung, weniger Layout-Überraschungen bei Seitenumbruechen/Overflow).
  - **JSON Export/Import als Template-Mechanik:** Offerten können als JSON gespeichert und später wieder geladen/bearbeitet werden (z.B. Preise anpassen). Das ermöglicht Vorlagen und Wiederverwendung, statt nur einen einmaligen Export.

- **Umsetzung in Kürze:**
  - **PDF-Export:** Clientseitiger Export mit separatem Export-DOM (ohne Layout-Transforms) sowie Handling für A4-Skalierung/Overflow, damit Preview und PDF konsistent bleiben.
  - **Persistenz & Lifecycle:** MongoDB-Collections für **Drafts** und **Offers** inkl. Save/Load/Delete und Umwandlung Offer <-> Draft; Anzeige/Verwaltung im Account (Listen + Modals).
  - **JSON Templates:** Konsistentes Datenformat für Export/Import (company/customer/offerMeta/tax/positions) zur Wiederverwendung und zur gezielten Nachbearbeitung.

- **Abgrenzung zum Mindestumfang:**
  - Der Mindestumfang fordert lediglich **(a)** einen funktionierenden Hauptworkflow, **(b)** mindestens eine DB-Übersichtsseite, **(c)** mindestens eine Erfassungs-/Bearbeitungsseite sowie **(d)** MongoDB-Persistenz und Deployment. Offi ergänzt dies durch **mehrere zusätzliche Workflows** (Gast/Account + Draft/Offer Lifecycle), **erweiterte Verwaltungsfunktionen** (Rename/Delete/Modals), **Export-Qualitätsoptimierung für A4-PDF** sowie **JSON Export/Import** als Template-Format und zählt damit als Erweiterung über den Mindestumfang hinaus.


## 6. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** Dieses Repository enthält den SvelteKit-Prototyp inkl. statischer Assets (z.B. PDFs im `static/` Ordner).
- **Issue-Management:** leichtgewichtig; Bugs/ToDos wurden direkt aus Tests abgeleitet und umgesetzt.
- **Commit-Praxis:** sprechende Commits; Codex-Unterstützung für Commit Messages (siehe KI-Deklaration).

## 7. KI-Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### Eingesetzte KI-Werkzeuge
- Gemini Nano Banana Pro (Generierung von Maskottchen-Variationen „Offi“)
- GPT-5.x (Ideenfindung, Prompt-Engineering, Konzepttexte)
- Codex 5.x (Fehlerkorrekturen, Code-Ergänzungen, Hilfe bei Git/Commit-Beschreibungen)

### Zweck & Umfang
KI wurde zur Unterstützung in drei Bereichen eingesetzt:
1) **Visuelle Variationen:** Erstellung mehrerer Offi-Varianten (z.B. für Login-Block) auf Basis eines bestehenden Maskottchen-Stils.
2) **Konzept & Text:** Ideengenerierung und Strukturierung (z.B. Formulierungen, klare Workflows, Dokumentation).
3) **Code-Support:** Debugging, Ergänzungen/Refactoring, sowie Hilfe bei Git Push/Commit-Texten, wenn eigene Recherche (z.B. StackOverflow) nicht ausreichte.

Qualitätssicherung:
- Codevorschläge wurden manuell geprüft und im laufenden Prototyp getestet (manuelle End-to-End Tests).
- Visuelle Outputs wurden selektiert und ggf. nachbearbeitet bzw. nur als Varianten genutzt.
- Urheberrecht/Quellen: Das Kern-Branding (Logo & Maskottchen Offi) stammt aus eigener Arbeit (Illustrator); KI wurde für Variationen eingesetzt.

### Art der Beiträge
- Teilweise KI-unterstützte Vorschläge für:
  - Prompt-Variationen für Maskottchen-Illustrationen
  - Code-Fixes und Code-Ergänzungen
  - Commit-Beschreibungen und einzelne Textpassagen/Ideen
- Der Prototyp als Gesamtsystem, Designentscheidungen, Integration, Flows, Logiken, Testing und Tollentscheidungen wurden eigenständig umgesetzt.

### Eigene Leistung (Abgrenzung)
- Eigenständig: Informationsarchitektur, UI/UX-Konzept (Builder + Preview), technische Umsetzung in SvelteKit, Integration von Auth/Persistenz/Export, Evaluation vor Ort sowie Ableitung der Verbesserungen.
- Eigenständig erstellt: Logo und Maskottchen Offi als Original in Adobe Illustrator.

### Reflexion
Nutzen:
- Schnellere Iteration bei Designvarianten und beim Debugging.
- Bessere Promptqualität durch Iteration (GPT -> Codex -> Umsetzung).

Grenzen/Risiken:
- KI-Vorschläge können falsche Annahmen treffen oder fehlerhaften Code liefern.
- Visuelle Outputs brauchen Selektion und konsistente Stilkontrolle.

Qualitätssicherung:
- Manuelles Review, lokale Tests, und Usability-Tests mit zwei Personen (moderiert) als Realitätscheck.

### Prompt-Vorgehen [Optional]
Beispiel (Gemini):
- „this is Offi, my mascot for my website which helps businesses to make pdf offers. take a deep look at the style of it and how it works and how it looks. I need some different version of this to put throughout the website. For this Block where the dot is a want a version of offi, where it works with "login"“

Workflow:
- Idee/Prompt-Varianten (GPT) -> Umsetzung/Debug (Codex) -> manuelle Integration und Tests.

### Quellen & Rechte [Optional]
- Logo und Maskottchen „Offi“: eigene Erstellung in Adobe Illustrator (Originalwerk).
- KI-generierte Variationen: erstellt mit den oben genannten Tools; genutzt als Varianten innerhalb des Projekts.
- Restliche Icons sind alle selber gemacht (Pfeil im Profil) oder Emojis.
- Es wurden kostenlose und öfffentlich zugängliche Fonts verwenden.

## 8. Anhang [Optional]
Beispiele:
- **Testskript & Materialien:** 
  - `static/1_Usability Evaluation_peer.pdf`
  - `static/2_Usability Evaluation_kmu.pdf`
- **Rohdaten/Auswertung:** 
  - `static/1_Usability Evaluation_peer.pdf`
  - `static/2_Usability Evaluation_kmu.pdf`
