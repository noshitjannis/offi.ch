<script lang="ts">
    export let form;

    let passwordVisible = false;
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<section class="page">
    <div class="hero">
        <p class="eyebrow">Anmelden</p>
        <h1>Offertino Login</h1>
        <p class="lede">
            Melden Sie sich mit Ihrer E-Mail an, um Offerten zu speichern und jederzeit wieder
            aufzurufen.
        </p>
    </div>

    <div class="card">
        <form method="POST" action="?/login" class="form">
            <div class="field">
                <label for="email">E-Mail</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vorname@firma.ch"
                    autocomplete="email"
                    required
                    value={form?.email ?? ""}
                />
            </div>

            <div class="field">
                <label for="password">Passwort</label>
                <div class="password-input">
                    <input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                    />
                    <button
                        class="ghost-btn"
                        type="button"
                        aria-label={passwordVisible ? "Passwort verbergen" : "Passwort anzeigen"}
                        on:click={() => (passwordVisible = !passwordVisible)}
                    >
                        {passwordVisible ? "Verbergen" : "Anzeigen"}
                    </button>
                </div>
            </div>

            {#if form?.message}
                <p class="error">{form.message}</p>
            {/if}

            <button type="submit" class="submit">Einloggen</button>
            <p class="meta">
                Noch kein Account?
                <a href="/login/register">Jetzt erstellen</a>
            </p>
        </form>
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
        gap: 1.25rem;
        padding: 2.75rem 1.5rem 3.5rem;
        box-sizing: border-box;
        align-items: center;
    }

    .hero {
        width: min(960px, 100%);
        padding: 1.5rem 1.75rem;
        border-radius: 16px;
        background: radial-gradient(circle at 20% 20%, #e7f0ff, #f5f7fb 40%);
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
    }

    .eyebrow {
        margin: 0 0 0.35rem;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #1d4ed8;
    }

    .hero h1 {
        margin: 0 0 0.4rem;
        font-size: 1.8rem;
        font-weight: 800;
        color: #0b1530;
        letter-spacing: -0.015em;
    }

    .lede {
        margin: 0;
        color: #475569;
        max-width: 640px;
        line-height: 1.6;
    }

    .card {
        width: min(520px, 100%);
        background: #fff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
        padding: 1.6rem 1.5rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    label {
        font-weight: 700;
        color: #0f172a;
    }

    input {
        font: inherit;
        padding: 0.65rem 0.8rem;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        transition: border-color 130ms ease, box-shadow 130ms ease, background 130ms ease;
    }

    input:focus {
        outline: none;
        border-color: #2563eb;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .password-input {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 0.5rem;
    }

    .ghost-btn {
        border: 1px solid #dbeafe;
        background: #eef2ff;
        color: #1d4ed8;
        padding: 0.55rem 0.8rem;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: background 140ms ease, transform 140ms ease, box-shadow 140ms ease;
    }

    .ghost-btn:hover {
        background: #e0e7ff;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(59, 130, 246, 0.25);
    }

    .submit {
        border: none;
        background: linear-gradient(135deg, #0c3266, #2563eb);
        color: #fff;
        font-weight: 800;
        padding: 0.9rem;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 140ms ease, box-shadow 140ms ease;
    }

    .submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
    }

    .error {
        margin: 0.25rem 0 0;
        color: #b91c1c;
        font-weight: 700;
    }

    .meta {
        margin: 0;
        color: #475569;
        font-size: 0.95rem;
    }

    .meta a {
        color: #0c3266;
        font-weight: 700;
        text-decoration: none;
    }

    .meta a:hover {
        text-decoration: underline;
    }

    @media (max-width: 640px) {
        .page {
            padding: 2.5rem 1rem;
        }

        .hero {
            padding: 1.25rem 1.1rem;
        }

        .password-input {
            grid-template-columns: 1fr;
        }

        .ghost-btn {
            width: 100%;
            text-align: center;
        }
    }
</style>
