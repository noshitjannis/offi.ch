
<svelte:head>
    <title>Login oder Gast</title>
</svelte:head>

<section class="page">
    <div class="intro">
        <h1>Wie möchten Sie Ihre Offerte erstellen?</h1>
        <p>
            Wählen Sie, ob Sie sich anmelden möchten oder ohne Login direkt mit einer neuen Offerte
            beginnen.
        </p>
    </div>

    <div class="cards">
        <a class="card" href="">
            <div class="card-icon">
                <span class="icon-square" aria-hidden="true"></span>
            </div>
            <h2>Mit Login Offerte erstellen</h2>
            <p>
                Melden Sie sich an, speichern Sie Ihre Daten und greifen Sie später erneut auf Ihre
                Offerten zu.
            </p>
            <span class="card-button">Mit Login starten</span>
        </a>

        <a class="card" href="/guest">
            <div class="card-icon alt">
                <span class="icon-square" aria-hidden="true"></span>
            </div>
            <h2>Ohne Login fortfahren</h2>
            <p>
                Erstellen Sie eine Offerte ohne Konto. Ihre Eingaben werden nur für diese Sitzung
                gespeichert.
            </p>
            <span class="card-button secondary">Ohne Login starten</span>
        </a>
    </div>
</section>

<style>
    :global(body) {
        margin: 0;
        background: #f5f7fb;
        color: #0f172a;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: top;
        gap: 1.75rem;
        padding: 3rem 1.5rem;
        box-sizing: border-box;
    }

    .intro {
        text-align: center;
        max-width: 640px;
    }

    .intro h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.65rem;
        font-weight: 700;
        color: #0b1530;
        letter-spacing: -0.01em;
    }

    .intro p {
        margin: 0;
        color: #475569;
        line-height: 1.6;
    }

    .cards {
        width: min(920px, 100%);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.25rem;
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        background: #ffffff;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
        text-decoration: none;
        color: inherit;
        transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
        cursor: pointer;
    }

    .card:hover,
    .card:focus-visible {
        transform: translateY(-4px);
        border-color: #cbd5e1;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
        outline: none;
    }

    .card:active {
        transform: translateY(-1px);
    }

    .card-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #eef2ff;
        display: grid;
        place-items: center;
    }

    .card-icon.alt {
        background: #e7f5ff;
    }

    .icon-square {
        width: 22px;
        height: 22px;
        border-radius: 8px;
        background: #cbd5f5;
    }

    .card h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.01em;
    }

    .card p {
        margin: 0;
        color: #475569;
        line-height: 1.6;
    }

    .card-button {
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.65rem 1rem;
        background: #0c3266;
        color: #ffffff;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.95rem;
        box-shadow: 0 2px 6px rgba(10, 34, 80, 0.2);
    }

    .card-button.secondary {
        background: #0f766e;
        box-shadow: 0 2px 6px rgba(6, 78, 59, 0.18);
    }

    @media (max-width: 640px) {
        .page {
            padding: 2.5rem 1rem;
        }
    }
</style>
