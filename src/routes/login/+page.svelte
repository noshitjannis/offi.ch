
<script>
    import OptionCard from "$lib/components/OptionCard.svelte";
</script>

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
        <OptionCard
            title="Mit Login Offerte erstellen"
            description="Melden Sie sich an, speichern Sie Ihre Daten und greifen Sie später erneut auf Ihre Offerten zu."
            href="/login/basic"
            buttonText="Mit Login starten"
        />

        <OptionCard
            title="Ohne Login fortfahren"
            description="Erstellen Sie eine Offerte ohne Konto. Ihre Eingaben werden nur für diese Sitzung gespeichert."
            href="/guest"
            buttonText="Ohne Login starten"
            buttonVariant="secondary"
            iconVariant="alt"
        />
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

    @media (max-width: 640px) {
        .page {
            padding: 2.5rem 1rem;
        }
    }
</style>
