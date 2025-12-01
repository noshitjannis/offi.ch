<script lang="ts">
    export let data;
    export let form;

    const profile = form?.company ?? data.profile ?? {};
    let editing = false;
</script>

<svelte:head>
    <title>Mein Account</title>
</svelte:head>

<section class="page">
    <div class="hero">
        <p class="eyebrow">Account</p>
        <h1>Willkommen zurück</h1>
        <p class="lede">
            Ergänzen Sie Ihre Firmendaten, damit Sie diese nicht jedes Mal ausfüllen müssen.
        </p>
    </div>

    <div class="card">
        <div class="card-head">
            <div>
                <p class="eyebrow small">Profil</p>
                <h2 class="subhead">Ihre Angaben</h2>
                <p class="hint">
                    Ergänzen Sie Ihre Firmendaten, damit Sie diese nicht jedes Mal ausfüllen müssen.
                </p>
            </div>
            <div class="card-actions">
                <button class="ghost" type="button" on:click={() => (editing = !editing)}>
                    {editing ? "Abbrechen" : "Bearbeiten"}
                </button>
                <form method="POST" action="?/logout" class="logout-inline">
                    <button type="submit" class="ghost danger">Abmelden</button>
                </form>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-row">
                <span class="label">E-Mail</span>
                <span class="value">{data.user.email}</span>
            </div>
            <div class="info-row">
                <span class="label">Firmenname</span>
                <span class="value">{data.user.name ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">Adresse</span>
                <span class="value">{profile.addressStreet ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">PLZ / Ort</span>
                <span class="value">
                    {(profile.addressZip ?? "—") + " " + (profile.addressCity ?? "")}
                </span>
            </div>
            <div class="info-row">
                <span class="label">Telefon</span>
                <span class="value">{profile.phone ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">Website</span>
                <span class="value">{profile.website ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">MWST</span>
                <span class="value">{profile.mwst ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">Bank</span>
                <span class="value">{profile.bankName ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">Bank-Ort</span>
                <span class="value">{profile.bankLocation ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">Kontonummer</span>
                <span class="value">{profile.bankAccount ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">IBAN</span>
                <span class="value">{profile.bankIban ?? "—"}</span>
            </div>
            <div class="info-row">
                <span class="label">SWIFT</span>
                <span class="value">{profile.bankSwift ?? "—"}</span>
            </div>
        </div>
    </div>

    {#if editing}
        <div class="card form-card">
            <div class="form-head">
                <div>
                    <h2 class="subhead">Firmendaten bearbeiten</h2>
                    <p class="hint">
                        Speichern Sie Ihre Firmendaten, damit Sie diese nicht jedes Mal ausfüllen müssen.
                    </p>
                </div>
            </div>

            <form class="stack" method="POST" action="?/save">
                <label>
                    Adresse (Strasse)
                    <input
                        name="addressStreet"
                        type="text"
                        placeholder="Musterweg 10"
                        value={profile.addressStreet ?? ""}
                    />
                </label>
                <label>
                    PLZ
                    <input name="addressZip" type="text" placeholder="8000" value={profile.addressZip ?? ""} />
                </label>
                <label>
                    Ort
                    <input name="addressCity" type="text" placeholder="Zürich" value={profile.addressCity ?? ""} />
                </label>
                <label>
                    Telefon
                    <input name="phone" type="text" placeholder="+41 44 123 45 67" value={profile.phone ?? ""} />
                </label>
                <label>
                    Website
                    <input name="website" type="url" placeholder="https://offi.ch" value={profile.website ?? ""} />
                </label>
                <label>
                    MWST-Nummer
                    <input name="mwst" type="text" placeholder="CHE-123.456.789 MWST" value={profile.mwst ?? ""} />
                </label>
                <label>
                    Bankname
                    <input name="bankName" type="text" placeholder="Zürcher Kantonalbank" value={profile.bankName ?? ""} />
                </label>
                <label>
                    Ort
                    <input name="bankLocation" type="text" placeholder="Zürich" value={profile.bankLocation ?? ""} />
                </label>
                <label>
                    Kontonummer
                    <input name="bankAccount" type="text" placeholder="12-345678-0" value={profile.bankAccount ?? ""} />
                </label>
                <label>
                    IBAN
                    <input
                        name="bankIban"
                        type="text"
                        placeholder="CH93 0076 2011 6238 5295 7"
                        value={profile.bankIban ?? ""}
                    />
                </label>
                <label>
                    SWIFT-Code
                    <input name="bankSwift" type="text" placeholder="ZKBKCHZZ80A" value={profile.bankSwift ?? ""} />
                </label>

                <div class="actions">
                    <button type="submit">Speichern</button>
                </div>
            </form>
        </div>
    {/if}
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
        width: min(800px, 100%);
        background: #fff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
        padding: 1.25rem 1.3rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .form-card {
        width: min(640px, 100%);
        gap: 0.5rem;
    }

    .card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
    }

    .card-actions {
        display: flex;
        gap: 0.5rem;
    }

    .ghost {
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #0f172a;
        font-weight: 700;
        padding: 0.55rem 0.9rem;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }

    .ghost:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    }

    .ghost.danger {
        border-color: #fecdd3;
        background: #fff1f2;
        color: #be123c;
    }

    .ghost.danger:hover {
        box-shadow: 0 8px 18px rgba(190, 18, 60, 0.18);
        background: #ffe4e6;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.75rem;
    }

    .info-row {
        padding: 0.85rem;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #f8fafc;
    }

    .label {
        color: #475569;
        font-weight: 600;
    }

    .value {
        font-weight: 700;
        color: #0f172a;
        word-break: break-word;
    }

    .form-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .subhead {
        margin: 0;
        font-size: 1.2rem;
        color: #0f172a;
        letter-spacing: -0.01em;
    }

    .hint {
        margin: 0.15rem 0 0;
        color: #475569;
        font-size: 0.95rem;
        line-height: 1.5;
    }

    .stack {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-weight: 700;
        color: #0f172a;
    }

    input {
        font: inherit;
        padding: 0.65rem 0.75rem;
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

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.25rem;
    }

    .actions button {
        border: none;
        background: linear-gradient(135deg, #0c3266, #2563eb);
        color: #fff;
        font-weight: 800;
        padding: 0.9rem 1.4rem;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 140ms ease, box-shadow 140ms ease;
    }

    .actions button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
    }

    @media (max-width: 640px) {
        .page {
            padding: 2.5rem 1rem;
        }

        .hero {
            padding: 1.25rem 1.1rem;
        }
    }
</style>
