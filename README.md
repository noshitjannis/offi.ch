# Projektdokumentation – Offertio (Offi)

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
7. [KI‑Deklaration](#7-ki‑deklaration)
8. [Anhang [Optional]](#8-anhang-optional)




## 1. Einordnung & Zielsetzung
Kurz beschreiben, welches Problem adressiert wird und welches Ergebnis angestrebt ist.
- **Kontext & Problem:** Offerten werden oft manuell in Word/Excel erstellt. Stammdaten müssen wiederholt eingegeben werden, Layouts brechen beim PDF-Export, Entwürfe/versendete Offerten sind schlecht nachverfolgbar.
- **Ziele:** Webbasierter Offert-Builder für schweizer Kleinunternehmer, der Stammdaten speichert, Offerten mit Positionen/MWST/Rabatt führt, saubere A4-PDF/JSON-Exports liefert, sodass eine Offerte in Minuten versandbereit ist.
- **Abgrenzung [Optional]:** Kein CRM oder Follow-up-Automation, keine E-Signatur oder Rechnungsstellung; E-Mail-Versand erfolgt nach Export über den eigenen Mail-Client.

## 2. Zielgruppe & Stakeholder
Wem nützt die Lösung, wer ist beteiligt oder betroffen?
- **Primäre Zielgruppe:** Schweizer Kleinunternehmen oder StartUps (Agenturen, Freelancer, Handwerk), die schnell wiederkehrende Offerten erstellen und wiederverwenden wollen.
- **Weitere Stakeholder [Optional]:** Backoffice/GL zur Freigabe, Kund:innen als PDF-Empfänger:innen, Treuhand/Administration wegen MWST- und Bankangaben.
- **Annahmen [Optional]:** CH-Formate (CHF, MWST 8.1 %), Gastmodus senkt Einstiegshürde, Login bindet durch Stammdaten-Übernahme, Datenhaltung in MongoDB.

## 3. Anforderungen & Umfang
Beschreibt den verbindlichen Umfang gemäss Übungen und allfällige Erweiterungen.
- **Kernfunktionalität (Mindestumfang):** Authentifizierung via Lucia/Mongo (Register/Login/Logout) plus Gast-Flow; Firmenprofil mit Adresse, Kontakt, MWST, Bank, Logo; Builder mit Firmen-/Kundendaten, Offertmeta (Nummer, Betreff, Gültigkeit, Liefer- & Kontaktinfo), Positionen inkl. Menge/Preis/Rabatt/MWST und automatischer Totalberechnung; Live-PDF-Preview und Export (html2pdf) sowie JSON-Export; Entwürfe speichern/umbenennen/löschen, fertige Offerten ablegen und bei Bedarf als Entwurf wieder öffnen; Vorlagen-Import über gespeicherte JSON-Daten; Account-Übersicht für Drafts/Offers.
- **Akzeptanzkriterien:** Nutzer:innen können (1) als Gast oder per Login starten, (2) Profil/Firmendaten pflegen, (3) mindestens eine Position erfassen und Totals inkl. Rabatt/MWST prüfen, (4) PDF ohne Layout-Brüche auf A4 exportieren, (5) Draft/Offer speichern und aus dem Account erneut öffnen/umbenennen/löschen, (6) JSON-Vorlage exportieren/importieren, (7) Logo und Bankdaten erscheinen im Export.
- **Erweiterungen [Optional]:** Geplante Features: Anbindung von schweizer Banken um einfach QR-Code Rechnungen zu erstellen, Versand per E-Mail direkt aus der App, Angebotsstatus/Follow-ups, Positionsbibliothek/Vorlagenkatalog, Mehrbenutzer:innen/Rollen, Mehrsprachigkeit.

## 4. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 4.1 Understand & Define
- **Ausgangslage & Ziele:** Manuelles Offertieren kostet Zeit, führt zu Medienbrüchen und inkonsistenten Layouts; Ziel war ein geführter Flow, der Stammdaten wiederverwendet und PDF/JSON sauber liefert.
- **Zielgruppenverständnis:** Fokus auf kleine Teams ohne dediziertes ERP; Anforderungen: CH-Währung/MWST, Logo/Bankinfos im Layout, klare Trennung von Entwurf/Offerte.
- **Wesentliche Erkenntnisse:** Wiederverwendung von Stammdaten spart die meiste Zeit; PDF-Qualität und Zeilenumbrüche sind kritisch; Gast-Flow senkt Einstiegshürde, Login bindet durch Datenspeicherung.

### 4.2 Sketch
- **Variantenüberblick:** Verglichen wurden ein Stepper-Flow vs. eine einseitige Formularseite mit Vorschau; Account-Übersicht als Tabs vs. Accordion.
- **Skizzen:** Erste Wireframes für Landing, Login-Optionen und Builder mit zweispaltigem Layout (Form links, Preview rechts); Varianten mit/ohne Sticky-Header dokumentiert.

### 4.3 Decide
- **Gewählte Variante & Begründung:** Einseitiger Builder mit Karten und Sticky-Preview reduziert Kontextwechsel; Accordion im Account für kompakte Profil-/Offertenverwaltung; Landing mit klarer CTA für Gast vs. Login.
- **End‑to‑End‑Ablauf:** Start auf Landing → Login oder Gast → optional Profil pflegen → Offerte im Builder ausfüllen → PDF/JSON exportieren → als Draft/Offer speichern → Verwaltung im Account.
- **Referenz‑Mockup:** Aktueller Prototyp in der App (Landing, Login-Optionen, Builder, Account). Screens entsprechen dem implementierten Layout in `src/routes/+page.svelte`, `login`, `builder`, `account`.

### 4.4 Prototype
- **Kernfunktionalität:** Live-PDF-Preview/Export, JSON-Export, Draft/Offer-Speicherung inkl. Umbenennen/Löschen/Wiederöffnen, Profil mit Logo-Upload, Bank- und MWST-Infos, Gast-Flow, Vorlagen-Import.
- **Deployment:** Lokale Ausführung via `npm install` & `npm run dev`; kein öffentliches Deployment hinterlegt (Mongo-URI in `.env` notwendig).

#### 4.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** Seiten/Routen: Landing (`/`), Login-Option (`/login`), Basic-Login/Register, Gast-Flow (`/guest`), Builder (`/builder`), Account (`/account`); globale Navigation mit Ankern auf Funktionen/Preise/Vorlagen.
- **Oberflächenentwürfe:** Card-basierte Landing mit Hero, Feature-Grid und Status-Visual; OptionCards für Login/Gast; Builder mit zweispaltigem Formular und rechts platzierter A4-Preview; Account mit Accordion für Profil plus Listen für Drafts/Offers.
- **Designentscheidungen:** Helle, reduzierte Farbpalette mit blauen Akzenten; sticky Header/CTA; Badges statt Stepnummern; responsive Grid-Breakpoints; PDF-Layout optimiert für A4 mit begrenzten Positionszeilen pro Seite.

#### 4.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie‑Stack:** SvelteKit + TypeScript, Vite; Auth via Lucia + MongoDB; clientseitiger PDF-Export mit `html2pdf.js`; Styling mit komponentenlokalem CSS.
- **Tooling:** SvelteKit-Form-Actions, `svelte-check`, Vite Devserver; lokale Entwicklung in VS Code/IDE; kein externes UI-Framework.
- **Struktur & Komponenten:** Routen für Landing/Login/Gast/Builder/Account; gemeinsame Layout-Header; Komponenten `HeroBox`, `OptionCard`; Builder hält Formularstate, berechnet Totals, chunked Positionslisten; Account-Serveractions für Draft/Offer CRUD; Hooks für Sessionvalidierung.
- **Daten & Schnittstellen [Optional]:** Mongo-Collections `users`, `sessions`, `drafts`, `offers`; Datenmodell enthält company/customer/offerMeta/tax/positions/totals; Logo als Base64 im Profil gespeichert; Template-Import via localStorage/JSON.
- **Besondere Entscheidungen:** Klare Trennung Draft vs. Offer (Reopen als Draft möglich); Logos als Data-URL gespeichert, um Storage/Hosting zu sparen; Limits für Positionszeilen, damit A4-Layout nicht bricht; JSON-Export/Import als einfache Vorlagenfunktion ohne externen Service.

### 4.5 Validate
- **URL der getesteten Version** (separat deployt) Lokale Dev-Instanz (`npm run dev`, Mongo-Testdaten).
- **Ziele der Prüfung:** Funktionale Durchgängigkeit (Profil → Offerte → PDF/JSON), Layout-Stabilität im PDF, korrekte Berechnung von Rabatt/MWST, Bedienbarkeit von Gast-Flow und Account-Listen.
- **Vorgehen:** Manuelle Klicktests im Browser (Desktop/Mobile Breakpoints), Testexports als PDF/JSON.
- **Stichprobe:** Interne Tests durch Projektteam; keine externen Nutzertests durchgeführt.
- **Aufgaben/Szenarien:** Neue Offerte als Gast erstellen, Profil ergänzen und erneut Offerte erzeugen, Draft speichern/umbenennen, Offer exportieren und wieder als Draft öffnen, PDF/JSON herunterladen.
- **Kennzahlen & Beobachtungen:** PDF bricht sauber auf A4, Logos mit ausreichender Qualität; Layout-Anpassungen (Abstände, Spaltenbreiten) aus Tests umgesetzt.
- **Zusammenfassung der Resultate:** Kernflows laufen durch; grösste UX-Gewinne durch klare Trennung Entwurf/Offerte und Auto-Übernahme der Stammdaten.
- **Abgeleitete Verbesserungen:** Geplanter E-Mail-Versand aus der App; Validierungshinweise klarer machen; mehr Vorlagen für unterschiedliche Branchen.
- **Umgesetzte Anpassungen [Optional]:** Abstände/Spaltenbreiten und PDF-Qualität wurden nach Testexports optimiert (siehe Commits zu PDF und Layout).

## 5. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
- **Beschreibung & Nutzen:** Vorlagen-Import/Export und Wiederöffnen fertiger Offerten als Draft beschleunigen Folgeangebote; Gast-Flow senkt Onboarding-Hürde.
- **Umsetzung in Kürze:** JSON-Export/Import im Builder, Speicherung von Draft/Offer in MongoDB, Neuaufsetzen eines Drafts aus Offer per Server-Action.
- **Abgrenzung zum Mindestumfang:** Erweiterungen ergänzen den Basisflow (Offerte erstellen/exportieren) um Wiederverwendbarkeit; kein E-Mail-Versand oder E-Signatur implementiert.

## 6. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** SvelteKit-Monorepo mit klaren Routen (`/`, `/login`, `/guest`, `/builder`, `/account`), `static/` für Assets, `src/lib/components` für wiederverwendbare UI.
- **Issue‑Management:** Lightweight über Aufgabenliste/Commits; kein dediziertes Ticketing.
- **Commit‑Praxis:** Sprechende Commits pro Feature/Refactor (Layout, PDF, Account/Drafts, Hero/Navigation).

## 7. KI‑Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### Eingesetzte KI‑Werkzeuge
ChatGPT (Codex/GPT-basiert) für Text- und Codevorschläge.

### Zweck & Umfang
Einsatz für Formulierungsentwürfe (README, UI-Texte), Ideen/Refactoring-Hinweise für Svelte/CSS, punktuelles Debugging; Vorschläge wurden manuell geprüft und angepasst.

### Art der Beiträge
Textpassagen (z. B. README-Abschnitte), alternative CSS/Layout-Ideen, Code-Snippets für Form-/PDF-Logik als Inspiration; finale Implementierungen manuell integriert und getestet.

### Eigene Leistung (Abgrenzung)
Architektur, Datenmodell, Routing, UI-Komposition, Tests und Entscheidungen über Annahmen/Flows wurden eigenständig umgesetzt; KI-Inhalte nur nach Review übernommen.

### Reflexion
KI beschleunigt Schreibarbeit und liefert Alternativen, ersetzt aber keine Layout-/Fachprüfung; Risiken: Halluzinationen, Lizenzunklarheiten – mitigiert durch manuellen Review, Nutzung eigener Assets und Abgleich mit CH-spezifischen Anforderungen.

### Prompt‑Vorgehen [Optional]
Kurze, auf Teilprobleme fokussierte Prompts (z. B. „Svelte html2pdf Export skaliert A4“), Iteration mit Codeausschnitten und gewünschten Constraints.

### Quellen & Rechte [Optional]
UI-Assets/Logos stammen aus dem Projekt (`static/`), Codebasis proprietär; Bibliotheken: SvelteKit, Lucia, html2pdf.js, MongoDB (OSS-Lizenzen beachtet).

## 8. Anhang [Optional]
Beispiele:
- **Testskript & Materialien:** Aktuell kein separates Testskript; manuelle Tests wie oben beschrieben.
- **Rohdaten/Auswertung:** Keine zusätzlichen Rohdaten abgelegt; PDF/JSON-Exports lassen sich lokal generieren.

---

<!-- Prüfliste (nicht abgeben, nur intern nutzen) -->
<!--
[ ] Kernfunktionalität gemäss Übungen umgesetzt (Workflows durchgängig)
[ ] Akzeptanzkriterien formuliert und erfüllt
[ ] Skizzen erstellt (mehrere Varianten, Unterschiede dokumentiert)
[ ] Referenz‑Mockup in Decide verlinkt (URL/Screenshots)
[ ] Deployment erreichbar
[ ] Umsetzung (Technik) vollständig (Technologie-Stack; Tooling & KI-Einsatz inkl. Überlegungen; Struktur/Komponenten; Daten/Schnittstellen falls genutzt)
[ ] Evaluation durchgeführt; Ergebnisse dokumentiert; Verbesserungen abgeleitet
[ ] Dokumentation vollständig, klar strukturiert und konsistent
[ ] KI‑Deklaration ausgefüllt (Werkzeuge; Zweck & Umfang; Art der Beiträge; Abgrenzung; Quellen & Rechte; optional: Prompt‑Vorgehen, Reflexion)
[ ] Erweiterungen (falls vorhanden) begründet und abgegrenzt
[ ] Anhang gepflegt (Testskript/Materialien, Rohdaten/Auswertung) [optional]
-->
