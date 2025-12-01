<script lang="ts">
    export let data;
    export let form;

    const profile = form?.company ?? data.profile ?? {};
    let editing = false;
    let logoDrag = false;
    let logoPreview: string | null = profile.logoData ?? null;
    let logoInput: HTMLInputElement | null = null;
    let confirmDraftId: string | null = null;

    const setFilesOnInput = (file: File) => {
        if (!logoInput) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        logoInput.files = dt.files;
    };

    const handleLogoFile = async (file?: File | null) => {
        if (!file) return;
        setFilesOnInput(file);
        const reader = new FileReader();
        reader.onload = () => {
            logoPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleLogoDrop = async (event: DragEvent) => {
        logoDrag = false;
        const file = event.dataTransfer?.files?.[0];
        await handleLogoFile(file);
    };

    const handleLogoDragEnter = () => (logoDrag = true);
    const handleLogoDragLeave = () => (logoDrag = false);
    const handleLogoDragOver = () => (logoDrag = true);

    const triggerLogoBrowse = () => {
        logoInput?.click();
    };

    function confirmDelete(id: string) {
        confirmDraftId = id;
    }

    const handleLogoSelect = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        await handleLogoFile(file);
    };
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
        <details class="accordion">
            <summary class="card-head">
                <div>
                    <p class="eyebrow small">Profil</p>
                    <h2 class="subhead">Ihre Angaben</h2>
                    <p class="hint">
                        Ergänzen Sie Ihre Firmendaten, damit Sie diese nicht jedes Mal ausfüllen müssen.
                    </p>
                </div>
                <div class="card-actions">
                    <img src="/arrow.png" alt="" class="accordion-icon" aria-hidden="true" />
                </div>
            </summary>

            <div class="accordion-body">
                <div class="inline-actions">
                    <button class="ghost" type="button" on:click={() => (editing = !editing)}>
                        {editing ? "Abbrechen" : "Bearbeiten"}
                    </button>
                    <form method="POST" action="?/logout" class="logout-inline">
                        <button type="submit" class="ghost danger">Abmelden</button>
                    </form>
                </div>

                {#if profile.logoData}
                    <div class="logo-wrap">
                        <img src={profile.logoData} alt="Firmenlogo" />
                    </div>
                {/if}

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
        </details>
    </div>

    {#if data.drafts?.length}
        <div class="card drafts-card">
            <div class="card-head">
                <div>
                    <p class="eyebrow small">Entwürfe</p>
                    <h2 class="subhead">Gespeicherte Offerten</h2>
                </div>
            </div>
            <div class="draft-list">
                {#each data.drafts as draft}
                    <div class="draft-row">
                        <a class="draft-link" href={`/builder?draft=${draft.id}`}>
                            <div class="draft-name">{draft.name ?? "Entwurf"}</div>
                            <div class="draft-date">
                                {draft.updatedAt
                                    ? new Date(draft.updatedAt).toLocaleDateString("de-CH")
                                    : ""}
                            </div>
                        </a>
                        <button class="delete-btn" type="button" on:click={() => confirmDelete(draft.id)}>
                            Löschen
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {#if confirmDraftId}
        <div class="modal-backdrop">
            <div class="modal">
                <p>Diese Aktion kann nicht rückgängig gemacht werden. Gelöscht ist gelöscht. Weiterfahren?</p>
                <div class="modal-actions">
                    <button type="button" class="ghost" on:click={() => (confirmDraftId = null)}>
                        Abbrechen
                    </button>
                    <form method="POST" action="?/deleteDraft">
                        <input type="hidden" name="draftId" value={confirmDraftId} />
                        <button type="submit" class="danger-btn">Definitiv löschen</button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

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

            <form class="stack" method="POST" action="?/save" enctype="multipart/form-data">
                <div
                    class="logo-dropzone"
                    class:dragging={logoDrag}
                    role="button"
                    tabindex="0"
                    aria-label="Firmenlogo hochladen"
                    on:click={triggerLogoBrowse}
                    on:keydown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            triggerLogoBrowse();
                        }
                    }}
                    on:dragenter|preventDefault={handleLogoDragEnter}
                    on:dragover|preventDefault={handleLogoDragOver}
                    on:dragleave={handleLogoDragLeave}
                    on:drop|preventDefault={handleLogoDrop}
                >
                    {#if logoPreview}
                        <img class="logo-dropzone-preview" src={logoPreview} alt="Firmenlogo" />
                        <p class="logo-dropzone-text">
                            Logo ersetzen? Klicken oder neue Datei ablegen.
                        </p>
                    {:else}
                        <div class="logo-dropzone-icon" aria-hidden="true">🗂️</div>
                        <p class="logo-dropzone-text">
                            Logo hierhin ziehen oder klicken, um PNG/JPG hochzuladen
                        </p>
                        <p class="logo-dropzone-subtext">Empfohlen: 160 × 60 px</p>
                    {/if}
                </div>
                <input
                    type="file"
                    accept="image/png,image/jpeg"
                    name="logo"
                    class="logo-file-input"
                    bind:this={logoInput}
                    on:change={handleLogoSelect}
                />

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
                    <input name="website" type="text" placeholder="offi.ch" value={profile.website ?? ""} />
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

    .drafts-card {
        width: min(800px, 100%);
        gap: 0.5rem;
    }

    .draft-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .draft-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #f8fafc;
        text-decoration: none;
        color: inherit;
        transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
    }

    .draft-row:hover {
        transform: translateY(-1px);
        border-color: #cbd5e1;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    }

    .draft-name {
        font-weight: 700;
        color: #0f172a;
    }

    .draft-date {
        color: #475569;
        font-size: 0.95rem;
    }

    .draft-link {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        text-decoration: none;
        color: inherit;
        flex: 1;
    }

    .delete-btn {
        border: 1px solid #fecdd3;
        background: #fff1f2;
        color: #be123c;
        font-weight: 700;
        padding: 0.5rem 0.9rem;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease;
    }

    .delete-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(190, 18, 60, 0.18);
    }

    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.35);
        display: grid;
        place-items: center;
        z-index: 20;
        padding: 1rem;
    }

    .modal {
        background: #fff;
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        width: min(420px, 100%);
        border: 1px solid #e2e8f0;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
    }

    .modal p {
        margin: 0 0 1rem;
        color: #0f172a;
        font-weight: 600;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
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

    .danger-btn {
        border: 1px solid #fecdd3;
        background: #be123c;
        color: #fff;
        font-weight: 700;
        padding: 0.55rem 0.9rem;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }

    .danger-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(190, 18, 60, 0.2);
        background: #9f1239;
    }

    .logo-dropzone {
        border: 2px dashed #c7d1e0;
        border-radius: 0.8rem;
        padding: 1.4rem;
        text-align: center;
        background: #f8fbff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        margin-bottom: 0.9rem;
        outline: none;
    }

    .logo-dropzone.dragging {
        border-color: #84c1ff;
        background: #eef5ff;
        box-shadow: 0 12px 28px rgba(1, 51, 100, 0.12);
    }

    .logo-dropzone:focus-visible {
        box-shadow: 0 0 0 3px rgba(132, 193, 255, 0.6);
        border-color: #84c1ff;
    }

    .logo-dropzone-icon {
        font-size: 2.4rem;
        margin-bottom: 0.5rem;
    }

    .logo-dropzone-text {
        margin: 0.25rem 0;
        font-size: 0.92rem;
        font-weight: 600;
        color: #0b2a57;
    }

    .logo-dropzone-subtext {
        margin: 0;
        font-size: 0.8rem;
        color: #6b7280;
    }

    .logo-dropzone-preview {
        display: block;
        max-width: 240px;
        max-height: 110px;
        margin: 0 auto 0.75rem;
        object-fit: contain;
    }

    .logo-file-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
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

    .accordion {
        border: none;
        padding: 0;
        margin: 0;
    }

    .accordion summary {
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .accordion summary::-webkit-details-marker {
        display: none;
    }

    .accordion-body {
        margin-top: 0.5rem;
    }

    .accordion-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 18px;
        width: auto;
        transition: transform 150ms ease;
        margin-left: auto;
        transform: rotate(0deg);
    }

    .accordion[open] .accordion-icon {
        transform: rotate(180deg);
    }

    .inline-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 0.5rem;
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

    .logo-wrap {
        width: 120px;
        height: 120px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        display: grid;
        place-items: center;
    }

    .logo-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
