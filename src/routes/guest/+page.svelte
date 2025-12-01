<script>
    import { goto } from "$app/navigation";
    import OptionCard from "$lib/components/OptionCard.svelte";

    const TEMPLATE_STORAGE_KEY = "offertio-template";
    const requiredPaths = [
        "company.name",
        "company.address",
        "company.email",
        "company.phone",
        "company.website",
        "company.vatNumber",
        "company.bank.name",
        "company.bank.location",
        "company.bank.account",
        "company.bank.iban",
        "company.bank.swift",
        "customer.name",
        "customer.street",
        "customer.zipCity",
        "offerMeta.number",
        "offerMeta.subject",
        "offerMeta.offerDate",
        "offerMeta.requestDate",
        "offerMeta.validityDays",
        "offerMeta.delivery",
        "offerMeta.contact.person",
        "offerMeta.contact.email",
        "offerMeta.contact.phone",
        "tax.vatRate",
        "tax.discountPercent",
        "tax.discountLabel",
        "positions",
    ];

    let isDragging = false;
    let fileName = "";
    let uploadError = "";
    let isProcessing = false;
    /** @type {HTMLInputElement | null} */
    let fileInput = null;

    /** @param {Record<string, any>} object @param {string} path @returns {any} */
    function getValueAtPath(object, path) {
        return path.split(".").reduce((current, key) => {
            if (current && typeof current === "object" && key in current) {
                return current[key];
            }
            return undefined;
        }, object);
    }

    /** @param {any} data */
    function isValidTemplate(data) {
        if (!data || typeof data !== "object") return false;

        for (const path of requiredPaths) {
            const value = getValueAtPath(data, path);
            if (value === undefined || value === null || value === "") {
                return false;
            }
        }

        if (!Array.isArray(data.positions) || !data.positions.length) return false;

        return data.positions.every(
            /** @param {{ description?: unknown; articleNumber?: unknown; quantity?: unknown; unitPrice?: unknown }} pos */
            (pos) =>
                pos &&
                typeof pos.description === "string" &&
                "articleNumber" in pos &&
                "quantity" in pos &&
                "unitPrice" in pos,
        );
    }

    /** @param {File} file */
    async function processTemplateFile(file) {
        uploadError = "";
        isProcessing = true;
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!isValidTemplate(data)) {
                uploadError = "Die Datei entspricht nicht dem Offertino-Format.";
                return;
            }

            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(data));
            await goto("/builder");
        } catch (error) {
            console.error("Fehler beim Verarbeiten der Vorlage", error);
            uploadError =
                "Die Vorlage konnte nicht gelesen werden. Bitte eine gültige Offertino-JSON-Datei nutzen.";
        } finally {
            isProcessing = false;
        }
    }

    /** @param {FileList | null | undefined} files */
    async function handleFiles(files) {
        const file = files?.[0];
        fileName = file ? file.name : "";
        if (file) {
            await processTemplateFile(file);
        }
    }

    /** @param {DragEvent} event */
    async function handleDrop(event) {
        isDragging = false;
        await handleFiles(event.dataTransfer?.files);
    }

    function handleDragOver() {
        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    function triggerBrowse() {
        fileInput?.click();
    }

    /** @param {Event & { currentTarget: HTMLInputElement }} event */
    async function handleFileSelect(event) {
        await handleFiles(event.currentTarget.files);
    }

    /** @param {KeyboardEvent} event */
    function handleKeyActivate(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerBrowse();
        }
    }
</script>

<svelte:head>
    <title>Gastmodus</title>
</svelte:head>

<section class="page">
    <div class="hero">
        <div>
            <p class="eyebrow">Gastmodus</p>
            <h1>Weiter ohne Login</h1>
            <p class="lede">
                Nutzen Sie eine bestehende Vorlage oder beginnen Sie frisch. Beide Wege führen Sie
                direkt zum Offerten-Builder.
            </p>
        </div>
    </div>

    <div class="options">
        <OptionCard
            title="Aus Vorlage starten"
            description="Laden Sie eine JSON-Datei einer ausgefüllten Offerte hoch."
            href={null}
            buttonText={null}
        >
            <div class="dropzone-block" slot="content">
                <div
                    class="dropzone"
                    class:dragging={isDragging}
                    aria-busy={isProcessing}
                    on:drop|preventDefault|stopPropagation={handleDrop}
                    on:dragover|preventDefault|stopPropagation={handleDragOver}
                    on:dragleave|preventDefault|stopPropagation={handleDragLeave}
                    role="button"
                    tabindex="0"
                    on:click={triggerBrowse}
                    on:keydown={handleKeyActivate}
                >
                    <input
                        type="file"
                        accept="application/json"
                        aria-label="JSON-Datei auswählen"
                        bind:this={fileInput}
                        on:change={handleFileSelect}
                    />
                    <span class="drop-icon" aria-hidden="true">⬆</span>
                    <div class="drop-text">
                        <span class="drop-title">JSON-Datei hier ablegen</span>
                        <span class="drop-sub"
                            >{fileName ? fileName : "oder klicken zum Auswählen"}</span
                        >
                    </div>
                </div>

                {#if uploadError}
                    <p class="error-text" role="alert">{uploadError}</p>
                {/if}
            </div>
        </OptionCard>

        <OptionCard
            title="Neue Offerte erstellen"
            description="Starten Sie leer und füllen Sie Schritt für Schritt Ihre Offerte aus."
            href="/builder"
            buttonText="Neue Offerte erstellen"
            buttonVariant="secondary"
            iconVariant="alt"
        />
    </div>
</section>

<style>
    .page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2.5rem 1.5rem 3rem;
        box-sizing: border-box;
    }

    .hero {
        width: 93%;
        margin: 0 auto;
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
        margin: 0 0 0.5rem;
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

    .options {
        width: min(980px, 100%);
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1rem;
        align-items: stretch;
    }

    .dropzone {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px dashed #cbd5e1;
        border-radius: 10px;
        background: #f8fafc;
        transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease,
            transform 140ms ease;
        cursor: pointer;
    }

    .dropzone:hover {
        border-color: #94a3b8;
        transform: translateY(-2px);
    }

    .dropzone.dragging {
        border-color: #0c3266;
        background: #eef2ff;
        box-shadow: inset 0 0 0 1px #0c3266;
        transform: translateY(-2px);
    }

    .dropzone input[type="file"] {
        display: none;
    }

    .drop-icon {
        width: 42px;
        height: 42px;
        border-radius: 11px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #e7ecff;
        color: #0c3266;
        font-weight: 800;
        font-size: 1.1rem;
    }

    .drop-text {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .drop-title {
        font-weight: 700;
        color: #0f172a;
    }

    .drop-sub {
        font-size: 0.9rem;
        color: #475569;
    }

    .error-text {
        margin: 0;
        color: #b91c1c;
        font-weight: 700;
    }

    .dropzone-block {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
