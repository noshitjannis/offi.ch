
<script>
    import HeroBox from "$lib/components/HeroBox.svelte";
    import OptionCard from "$lib/components/OptionCard.svelte";
</script>

<svelte:head>
    <title>Login oder Gast</title>
</svelte:head>

<section class="page">
    <HeroBox
        title="Wie möchten Sie Ihre Offerte erstellen?"
        description="Wählen Sie, ob Sie sich anmelden möchten oder ohne Login direkt mit einer neuen Offerte beginnen."
        flat
    />

    <div class="cards">
        <OptionCard
            title="Mit Login Offerte erstellen"
            description="Melden Sie sich an, speichern Sie Ihre Daten und greifen Sie später erneut auf Ihre Offerten zu."
            href="/login/basic"
            buttonText="Mit Login starten"
            iconSize={70}
            iconFrame={false}
        >
            <img slot="icon" src="/offi-icon_login.png" alt="" class="login-icon" width="70" height="70" />
        </OptionCard>

        <OptionCard
            title="Ohne Login fortfahren"
            description="Erstellen Sie eine Offerte ohne Konto. Ihre Eingaben werden nur für diese Sitzung gespeichert."
            href="/guest"
            buttonText="Ohne Login starten"
            buttonVariant="secondary"
            iconVariant="alt"
            iconSize={70}
            iconFrame={false}
        >
            <img
                slot="icon"
                src="/offi-icon_ohne-login.png"
                alt=""
                class="guest-icon"
                width="70"
                height="70"
            />
        </OptionCard>
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

    .cards {
        width: min(920px, 100%);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.25rem;
    }

    .login-icon,
    .guest-icon {
        width: 70px;
        height: 70px;
        object-fit: contain;
    }

    @media (max-width: 640px) {
        .page {
            padding: 2.5rem 1rem;
        }
    }
</style>
