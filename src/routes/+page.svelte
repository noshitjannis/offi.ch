<script lang="ts">
  export let data;

  const primaryCta = data?.user ? "/builder" : "/login/register";
  const secondaryCta = "/guest";
  const accountHref = data?.user ? "/account" : "/login/basic";
</script>

<svelte:head>
  <title>Offi | Offerten erstellen, versenden und nachfassen</title>
  <meta
    name="description"
    content="Erstelle Offerten in wenigen Minuten, speichere Entwürfe und exportiere saubere PDFs. Offi ist das clevere Offert-Tool für Schweizer KMU."
  />
</svelte:head>

<div class="home">
  <section class="hero" id="top">
    <div class="container">
      <div class="hero-card">
        <div class="hero-grid">
          <div class="hero-copy" data-animate>
            <div class="hero-top">
              <p class="eyebrow">Offerten fertig in Minuten</p>
              <h1>Kostenlos Offerten erstellen – mit Login noch schneller.</h1>
              <p class="lede">
                Offi führt dich durch Stammdaten, Kund:innen und Positionen bis zum fertigen PDF. Eingeloggt nutzt du gespeicherte Firmendaten, kopierst Offerten und sparst dir jede doppelte Eingabe.
              </p>
            </div>

            <div class="hero-cta-block">
              <div class="hero-actions">
                <a class="btn primary" href={primaryCta}>Kostenlos Offerte erstellen</a>
                <a class="btn ghost" href={secondaryCta}>Ohne Login testen</a>
              </div>

              <p class="trust">
                {#if data?.user}
                  Du bist eingeloggt – Stammdaten sind vorausgefüllt, die nächste Offerte dauert nur Minuten.
                {:else}
                  <span class="trust-small">Mit Login speicherst du Stammdaten und bist beim nächsten Mal in Minuten fertig. Keine Kreditkarte nötig.</span>
                {/if}
              </p>
            </div>
          </div>

          <div class="hero-visual" data-animate>
            <div class="mockup">
              <div class="mockup-top">
                <span class="pill pill-blue">{data?.user ? "Deine Offerte" : "Offerte"}</span>
                <span class="pill pill-soft">Entwurf gespeichert</span>
              </div>

              <div class="mockup-body">
                <div class="mockup-section">
                  <p class="section-label">Firmendaten</p>
                  <div class="lines">
                    <span class="line wide"></span>
                    <span class="line"></span>
                  </div>
                </div>

                <div class="mockup-section">
                  <p class="section-label">Kund:in & Kontakt</p>
                  <div class="lines">
                    <span class="line wide"></span>
                    <span class="line"></span>
                  </div>
                </div>

                <div class="mockup-section table">
                  <div class="table-head">
                    <span>Pos.</span>
                    <span>Beschreibung</span>
                    <span class="right">Menge</span>
                    <span class="right">Preis</span>
                  </div>
                  <div class="table-row">
                    <span class="pill small">01</span>
                    <span>Website-Konzept & Design</span>
                    <span class="right">1</span>
                    <span class="right">CHF 4'200.00</span>
                  </div>
                  <div class="table-row">
                    <span class="pill small alt">02</span>
                    <span>Implementierung & Testing</span>
                    <span class="right">1</span>
                    <span class="right">CHF 2'340.00</span>
                  </div>
                </div>

                <div class="mockup-footer">
                  <div class="footer-labels">
                    <span class="pill ghost-pill">Rabatt & MWST berechnet</span>
                    <span class="pill ghost-pill">PDF bereit</span>
                  </div>
                  <div class="total">
                    <p>Gesamttotal</p>
                    <strong>CHF 6'540.00</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section features" id="funktionen">
    <div class="container">
      <div class="section-header">
        <p class="eyebrow">Wie Offi deinen Offert-Prozess vereinfacht</p>
        <h2>Von Stammdaten bis PDF in einem Flow</h2>
        <p class="section-text">
          Hinterlege deine Firmendaten, erstelle Offerten mit Positionen, Rabatten und MWST, speichere Entwürfe und exportiere fertige Dokumente – ohne Excel-Umwege.
        </p>
      </div>

      <div class="feature-grid">
        <div class="feature-card" data-animate style="animation-delay: 60ms">
          <div class="icon">⚡</div>
          <h3>Offerten in Minuten erstellen</h3>
          <p>
            Geführter Builder für Firmen- und Kundendaten, Offert-Infos, Lieferbedingungen und Positionen. Plausibilitätschecks verhindern leere Pflichtfelder.
          </p>
        </div>
        <div class="feature-card" data-animate style="animation-delay: 120ms">
          <div class="icon alt">📇</div>
          <h3>Standardangaben einmal pflegen</h3>
          <p>
            Firmendaten, MWST, Bankverbindung und Kontakt speicherst du im Account und übernimmst sie automatisch in jede neue Offerte.
          </p>
        </div>
        <div class="feature-card" data-animate style="animation-delay: 180ms">
          <div class="icon">🧾</div>
          <h3>Saubere PDF-Exporte</h3>
          <p>
            Formatiere A4-PDFs inklusive Logo, Zwischentotal, Rabatt und MWST. Bereit für den Versand per E-Mail oder Download.
          </p>
        </div>
        <div class="feature-card" data-animate style="animation-delay: 240ms">
          <div class="icon alt">📂</div>
          <h3>Entwürfe & fertige Offerten im Überblick</h3>
          <p>
            Entwürfe speichern, fertige Dokumente ablegen, Titel anpassen und bei Bedarf wieder als Entwurf öffnen – deine finale Version bleibt erhalten.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="section deep-dive">
    <div class="container split">
      <div class="text" data-animate>
        <p class="eyebrow">Offerten, Follow-ups und Abschlüsse im Griff</p>
        <h2>Alle Offerten nachvollziehbar an einem Ort</h2>
        <p>
          Offi trennt klar zwischen Entwürfen und fertigen Offerten. Du siehst jederzeit, was in Arbeit ist, was versendet wurde und welche Dokumente du kopieren möchtest, um nachzufassen.
        </p>
        <p>
          PDFs erzeugst du direkt im Builder, inklusive MWST, Rabatt und sauberer Totals. Wenn du eine Offerte aktualisieren willst, öffnest du das fertige Dokument erneut als Entwurf – ohne die finale Version zu überschreiben.
        </p>

        <ul class="list">
          <li>Statusübersicht für Entwürfe und fertige Offerten</li>
          <li>PDF- und JSON-Export für Versand und Vorlagen</li>
          <li>Fertige Offerten kopieren und weiterentwickeln</li>
        </ul>
      </div>

      <div class="visual" data-animate>
        <div class="status-card">
          <div class="status-head">
            <div>
              <p class="eyebrow small">Übersicht</p>
              <h3>Deine Offerten</h3>
            </div>
            <span class="pill pill-soft">aktualisiert</span>
          </div>
          <div class="status-rows">
            <div class="status-row">
              <div>
                <p class="label">Entwürfe</p>
                <p class="hint">Zuletzt bearbeitet heute</p>
              </div>
              <strong>5</strong>
            </div>
            <div class="status-row">
              <div>
                <p class="label">Fertige Offerten</p>
                <p class="hint">PDF exportiert</p>
              </div>
              <strong>12</strong>
            </div>
            <div class="status-row">
              <div>
                <p class="label">Vorlagen</p>
                <p class="hint">JSON bereit für Import</p>
              </div>
              <strong>3</strong>
            </div>
          </div>
          <div class="status-footer">
            <a class="pill-link" href={accountHref}>Zu den Dokumenten</a>
            <a class="pill-link" href="/builder">Neue Offerte</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section steps">
    <div class="container">
      <div class="section-header">
        <p class="eyebrow">So funktioniert Offi</p>
        <h2>In drei klaren Schritten zur fertigen Offerte</h2>
      </div>

      <div class="step-grid">
        <div class="step-card" data-animate>
          <div class="step-badge">1</div>
          <h3>Unternehmen & Kund:innen anlegen</h3>
          <p>Firmendaten, MWST und Bankverbindung einmal im Account speichern und Kundenangaben ergänzen.</p>
        </div>
        <div class="step-card" data-animate style="animation-delay: 80ms">
          <div class="step-badge">2</div>
          <h3>Offerte mit Bausteinen zusammenklicken</h3>
          <p>Positionen erfassen, Rabatte hinzufügen, Zwischentotal prüfen und Felder per Validierung absichern.</p>
        </div>
        <div class="step-card" data-animate style="animation-delay: 160ms">
          <div class="step-badge">3</div>
          <h3>PDF exportieren, senden und nachfassen</h3>
          <p>Sauberes PDF oder JSON herunterladen und fertige Offerten später erneut als Entwurf öffnen.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section audience">
    <div class="container">
      <div class="section-header">
        <p class="eyebrow">Für diese Unternehmen ist Offi ideal</p>
        <h2>Klarer Fokus auf Schweizer KMU</h2>
      </div>
      <div class="audience-grid">
        <div class="audience-card" data-animate>
          <div class="icon">🔧</div>
          <h3>Handwerker & Baugewerbe</h3>
          <p>Saubere Positionen mit Mengen, Rabatten und MWST – übersichtlich für deine Kundschaft.</p>
        </div>
        <div class="audience-card" data-animate style="animation-delay: 70ms">
          <div class="icon alt">🧠</div>
          <h3>Agenturen & Dienstleister</h3>
          <p>Paketpreise, optionale Bausteine und klare Totals, damit Projekte schnell freigegeben werden.</p>
        </div>
        <div class="audience-card" data-animate style="animation-delay: 140ms">
          <div class="icon">💼</div>
          <h3>Berater:innen & Freelancer</h3>
          <p>Standardangaben hinterlegen, Offerten kopieren und in wenigen Minuten versandfertig machen.</p>
        </div>
        <div class="audience-card" data-animate style="animation-delay: 210ms">
          <div class="icon alt">🛠️</div>
          <h3>Kleine Handels- & Servicebetriebe</h3>
          <p>Einfach Mengen und Preise pflegen, PDF exportieren und als Vorlage für Wiederholungen nutzen.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section templates" id="templates">
    <div class="container split">
      <div class="text" data-animate>
        <p class="eyebrow">Vorlagen & Datenübernahme</p>
        <h2>Vorlagen importieren oder als JSON sichern</h2>
        <p>
          Lade bestehende Offerten als JSON ein, um direkt weiterzuarbeiten, oder exportiere fertige Dokumente als Vorlage für dein Team. Der Gastmodus hilft dir, ohne Login zu testen.
          Mit Login kannst du Entwürfe speichern, finale Offerten ablegen und deine Stammdaten hinterlegen.
        </p>
        <div class="template-actions">
          <a class="btn primary" href="/guest">Vorlage laden</a>
          <a class="btn ghost" href="/builder">Neue Offerte starten</a>
        </div>
        <p class="hint">JSON-Import und -Export sind im Builder und im Gastmodus verfügbar.</p>
      </div>
      <div class="template-card" data-animate>
        <div class="card-row">
          <span class="pill pill-blue">JSON</span>
          <p class="card-title">Vorlage hochladen</p>
        </div>
        <p class="card-text">Ziehe deine Datei hinein oder wähle sie aus.</p>
        <div class="drop-visual">
          <span class="dash"></span>
          <span class="dash"></span>
          <span class="dash short"></span>
        </div>
        <div class="card-row spaced">
          <p class="card-title">PDF Export</p>
          <span class="pill ghost-pill">bereit</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section pricing" id="preise">
    <div class="container">
      <div class="pricing-panel" data-animate>
        <div class="pricing-header">
          <p class="eyebrow">Preise</p>
          <h2>Ein Preis: CHF 0.–</h2>
          <p class="section-text">
            Offi bleibt kostenlos. Alle Funktionen sind freigeschaltet: Stammdaten speichern, Entwürfe sichern, finale Offerten ablegen und PDFs oder JSON exportieren.
          </p>
        </div>

        <div class="pricing-body">
          <div class="pricing-list">
            <div class="pricing-item">
              <span class="dot"></span>
              <div>
                <p class="item-title">Offert-Builder ohne Limit</p>
                <p class="hint">Entwürfe, finale Offerten, Kopien erstellen.</p>
              </div>
            </div>
            <div class="pricing-item">
              <span class="dot"></span>
              <div>
                <p class="item-title">PDF- und JSON-Export inklusive</p>
                <p class="hint">Saubere PDFs mit MWST & Rabatten, Vorlagen als JSON.</p>
              </div>
            </div>
            <div class="pricing-item">
              <span class="dot"></span>
              <div>
                <p class="item-title">Stammdaten & Bankangaben speichern</p>
                <p class="hint">Firmendaten, MWST und Bankverbindung einmal pflegen.</p>
              </div>
            </div>
          </div>

          <div class="pricing-cta">
            <p class="price-tag">CHF 0.–</p>
            <p class="hint">Keine Kreditkarte nötig.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section trust">
    <div class="container trust-grid">
      <div>
        <p class="eyebrow">Warum Offi</p>
        <h2>Gemacht für Schweizer KMU</h2>
        <p class="section-text">
          Fokus auf saubere Offerten, klare Felder und minimale Administration. Keine unnötigen Module – nur das, was du für schnelle Zusagen brauchst.
        </p>
      </div>
      <ul class="trust-points">
        <li>Speziell für Schweizer KMU entwickelt</li>
        <li>PDF-Exports mit MWST, Rabatten und Totals</li>
        <li>Klares Interface ohne Ballast</li>
      </ul>
    </div>
  </section>

  <section class="section final-cta">
    <div class="container final-card" data-animate>
      <div>
        <h2>Bereit für bessere Offerten in weniger Zeit?</h2>
        <p class="section-text">
          Starte noch heute, übernimm deine Stammdaten und verschicke die erste Offerte als PDF – ohne Kreditkarte.
        </p>
      </div>
      <div class="final-actions">
        <a class="btn primary" href={primaryCta}>Jetzt kostenlos testen</a>
        <a class="btn ghost" href={secondaryCta}>Im Gastmodus ausprobieren</a>
      </div>
    </div>
  </section>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #f8fafc;
    color: #0f172a;
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .home {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 3.5rem;
  }

  .container {
    width: min(1240px, calc(100% - 2.5rem));
    margin: 0 auto;
  }

  .hero {
    position: relative;
    padding: 2.25rem 0 3.5rem;
  }

  .hero-card {
    position: relative;
    z-index: 1;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 20px 48px rgba(13, 38, 76, 0.12);
    padding: clamp(1.4rem, 2vw, 2rem);
    overflow: hidden;
  }

  .hero-card::after {
    content: "";
    position: absolute;
    top: -40%;
    right: -20%;
    width: 45%;
    height: 120%;
    background: radial-gradient(circle at 50% 50%, rgba(99, 157, 255, 0.12), transparent 60%);
    pointer-events: none;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    align-items: stretch;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
  }

  .hero-top {
    display: grid;
    gap: 0.4rem;
  }

  .hero-cta-block {
    margin-top: auto;
    display: grid;
    gap: 0.5rem;
  }

  .hero-copy h1 {
    margin: 0 0 0.6rem;
    font-size: clamp(2rem, 3vw + 1rem, 2.6rem);
    letter-spacing: -0.02em;
  }

  .hero-copy .lede {
    margin: 0 0 1.2rem;
    line-height: 1.6;
    color: #334155;
  }

  .hero-actions {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.8rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    text-decoration: none;
    font-size: 1rem;
    transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, color 140ms ease;
  }

  .btn.primary {
    background: linear-gradient(120deg, #1f5fff, #639dff);
    color: #ffffff;
    box-shadow: 0 12px 30px rgba(31, 95, 255, 0.35);
    width: auto;
  }

  .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(31, 95, 255, 0.4);
  }

  .btn.ghost {
    border: 1px solid #d7e0ec;
    background: #ffffff;
    color: #0f172a;
  }

  .btn.ghost:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  }

  .trust {
    margin: 0.4rem 0 0.6rem;
    color: #475569;
  }

  .trust-small {
    font-size: 0.9rem;
  }

  .hero-visual {
    display: flex;
    justify-content: flex-end;
  }

  .mockup {
    width: min(500px, 100%);
    background: #ffffff;
    border-radius: 18px;
    border: 1px solid #e1e8f5;
    box-shadow: 0 14px 32px rgba(13, 38, 76, 0.12);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mockup-top {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.95rem;
    background: #eef2ff;
    color: #1f5fff;
  }

  .pill.pill-blue {
    background: #e5ecff;
    color: #1f5fff;
  }

  .pill.pill-soft {
    background: #f1f5f9;
    color: #0f172a;
  }

  .pill.small {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }

  .pill.small.alt {
    background: #e6f4ff;
    color: #0f4dc0;
  }

  .pill.ghost-pill {
    background: #f8fafc;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  .mockup-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mockup-section {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.75rem;
  }

  .mockup-section.table {
    background: #ffffff;
  }

  .section-label {
    margin: 0 0 0.45rem;
    font-weight: 700;
    color: #0f172a;
  }

  .lines {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .line {
    height: 8px;
    background: linear-gradient(90deg, #d5e3ff, #e2e8f0);
    border-radius: 999px;
    width: 60%;
  }

  .line.wide {
    width: 86%;
  }

  .table-head,
  .table-row {
    display: grid;
    grid-template-columns: 70px 1fr 80px 130px;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
  }

  .table-head {
    color: #475569;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }

  .table-row {
    padding: 0.5rem 0.35rem;
    border-radius: 10px;
    background: #f8fafc;
    color: #0f172a;
    margin-bottom: 0.4rem;
  }

  .table-row:last-child {
    margin-bottom: 0;
  }

  .right {
    justify-self: end;
  }

  .mockup-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0.75rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    flex-wrap: wrap;
  }

  .footer-labels {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .total {
    text-align: right;
  }

  .total p {
    margin: 0;
    color: #475569;
  }

  .total strong {
    font-size: 1.15rem;
  }

  .section {
    padding: 2.5rem 0;
  }

  .section-header h2 {
    margin: 0.3rem 0;
    font-size: 1.8rem;
    letter-spacing: -0.01em;
  }

  .section-text {
    max-width: 720px;
    color: #475569;
    line-height: 1.6;
    margin: 0.25rem 0 0;
  }

  .eyebrow {
    margin: 0;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1f5fff;
    font-size: 0.85rem;
  }

  .eyebrow.small {
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  .features .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 1.4rem;
  }

  .feature-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.1rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    display: grid;
    gap: 0.45rem;
    transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
    border-color: #d7e0ec;
  }

  .feature-card .icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #eef2ff;
    display: grid;
    place-items: center;
    font-size: 1.2rem;
  }

  .feature-card .icon.alt {
    background: #e7f4ff;
  }

  .feature-card h3,
  .audience-card h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .feature-card p,
  .audience-card p {
    margin: 0;
    color: #475569;
    line-height: 1.6;
  }

  .deep-dive .split,
  .templates .split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    align-items: center;
  }

  .text h2 {
    margin: 0.3rem 0 0.25rem;
    font-size: 1.8rem;
  }

  .text p {
    margin: 0.35rem 0;
    color: #475569;
    line-height: 1.6;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0.8rem 0 0;
    display: grid;
    gap: 0.35rem;
  }

  .list li {
    padding-left: 1.5rem;
    position: relative;
    color: #0f172a;
    font-weight: 600;
  }

  .list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #1f5fff;
  }

  .visual {
    display: flex;
    justify-content: center;
  }

  .status-card {
    width: min(420px, 100%);
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 16px 38px rgba(15, 23, 42, 0.12);
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .status-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .status-rows {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .label {
    margin: 0;
    font-weight: 700;
    color: #0f172a;
  }

  .hint {
    margin: 0;
    color: #64748b;
    font-size: 0.95rem;
  }

  .status-row strong {
    font-size: 1.2rem;
    color: #0f172a;
  }

  .status-footer {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pill-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.8rem;
    border-radius: 999px;
    background: #eef2ff;
    color: #1f5fff;
    font-weight: 700;
    text-decoration: none;
    border: 1px solid #dce6ff;
  }

  .steps .step-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin-top: 1.25rem;
  }

  .step-card {
    display: grid;
    gap: 0.4rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 0.9rem;
    align-items: flex-start;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }

  .step-badge {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #eef2ff;
    color: #0f172a;
    font-weight: 800;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    align-self: flex-start;
  }

  .audience-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .audience-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }

  .templates .template-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 0.75rem 0 0.4rem;
  }

  .template-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.1rem;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
    display: grid;
    gap: 0.5rem;
  }

  .card-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .card-row.spaced {
    justify-content: space-between;
  }

  .card-title {
    margin: 0;
    font-weight: 700;
  }

  .card-text {
    margin: 0;
    color: #475569;
  }

  .drop-visual {
    display: flex;
    gap: 0.35rem;
    align-items: center;
  }

  .dash {
    flex: 1;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, #dce7ff, #e2e8f0);
  }

  .dash.short {
    flex: 0.6;
  }

  .pricing-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    box-shadow: 0 16px 38px rgba(15, 23, 42, 0.12);
    padding: 1.6rem;
    display: grid;
    gap: 1rem;
  }

  .pricing-header h2 {
    margin: 0.3rem 0 0.25rem;
    font-size: 1.9rem;
  }

  .pricing-body {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.25rem;
    align-items: center;
  }

  .pricing-list {
    display: grid;
    gap: 0.8rem;
  }

  .pricing-item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.6rem;
    align-items: flex-start;
    padding: 0.9rem;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(120deg, #1f5fff, #639dff);
    margin-top: 0.25rem;
    box-shadow: 0 6px 12px rgba(31, 95, 255, 0.35);
  }

  .item-title {
    margin: 0;
    font-weight: 700;
    color: #0f172a;
  }

  .pricing-cta {
    background: linear-gradient(120deg, #1f5fff, #639dff);
    color: #ffffff;
    border-radius: 16px;
    padding: 1.2rem;
    box-shadow: 0 16px 36px rgba(31, 95, 255, 0.25);
    display: grid;
    gap: 0.4rem;
    justify-items: start;
  }

  .price-tag {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .pricing-cta .hint {
    color: #e2e8f0;
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
    align-items: center;
  }

  .trust-points {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.6rem;
  }

  .trust-points li {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.8rem 0.9rem;
    font-weight: 700;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }

  .final-cta {
    padding-bottom: 3rem;
  }

  .final-card {
    background: linear-gradient(120deg, #1f5fff, #639dff);
    color: #ffffff;
    border-radius: 18px;
    padding: 1.8rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
    gap: 1rem;
    align-items: center;
    box-shadow: 0 16px 40px rgba(31, 95, 255, 0.25);
  }

  .final-card .section-text {
    color: #e2e8f0;
  }

  .final-actions {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    align-items: stretch;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 14px;
    padding: 0.9rem;
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    align-self: stretch;
    justify-self: stretch;
    min-width: 0;
  }

  .final-card .btn {
    box-shadow: none;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .final-card .btn.primary {
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
  }

  .final-card .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.22);
  }

  .final-card .btn.ghost {
    border-color: rgba(255, 255, 255, 0.65);
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }

  .audience-card .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #eef2ff;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
  }

  .audience-card .icon.alt {
    background: #e7f4ff;
  }

  [data-animate] {
    opacity: 0;
    animation: fadeUp 640ms ease forwards;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 960px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero-visual {
      justify-content: flex-start;
    }

    .hero-card {
      padding: 1.25rem;
    }
  }

  @media (max-width: 720px) {
    .container {
      width: min(100%, calc(100% - 1.5rem));
    }

    .hero {
      padding-top: 1rem;
    }

    .hero-highlights span {
      width: 100%;
      justify-content: center;
    }

    .mockup {
      padding: 1rem;
    }

    .table-head,
    .table-row {
      grid-template-columns: 50px 1fr 70px 100px;
    }

    .final-card {
      grid-template-columns: 1fr;
    }

    .pricing-body {
      grid-template-columns: 1fr;
    }

    .final-actions {
      justify-self: stretch;
      width: 100%;
      max-width: none;
    }
  }
</style>
