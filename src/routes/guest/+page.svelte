<script>
    let isDragging = false;
    let fileName = "";
    /** @type {HTMLInputElement | null} */
    let fileInput = null;

    function handleFiles(files) {
        const file = files?.[0];
        fileName = file ? file.name : "";
    }

    function handleDrop(event) {
        isDragging = false;
        handleFiles(event.dataTransfer?.files);
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

    function handleFileSelect(event) {
        handleFiles(event.currentTarget.files);
    }

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
        <div class="panel upload-panel">
            <div class="panel-header">
                <div class="panel-icon">
                    <span class="icon-square" aria-hidden="true"></span>
                </div>
                <h2>Aus Vorlage starten</h2>
                <p>Laden Sie eine JSON-Datei einer ausgefüllten Offerte hoch.</p>
            </div>

            <div
                class="dropzone"
                class:dragging={isDragging}
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
            <span class="drop-sub">{fileName ? fileName : "oder klicken zum Auswählen"}</span>
        </div>
    </div>

            <button class="panel-button" type="button" on:click={triggerBrowse}>
                Vorlage hochladen
            </button>
        </div>

        <div class="panel start-panel">
            <div class="panel-header">
                <div class="panel-icon alt">
                    <span class="icon-square" aria-hidden="true"></span>
                </div>
                <h2>Neue Offerte erstellen</h2>
                <p>Starten Sie leer und füllen Sie Schritt für Schritt Ihre Offerte aus.</p>
            </div>

            <a class="panel-button primary" href="/builder"> Neue Offerte erstellen </a>
        </div>
    </div>
</section>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2.5rem 1.5rem 3rem;
        box-sizing: border-box;
    }

    .hero {
        width: min(980px, 100%);
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

    .panel {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 1.25rem 1.25rem 1.5rem;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-height: 260px;
    }

    .panel-header {
        margin-bottom: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .panel h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.01em;
    }

    .panel p {
        margin: 0;
        color: #475569;
        line-height: 1.5;
        max-width: 520px;
    }

    .panel-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #eef2ff;
        display: grid;
        place-items: center;
    }

    .panel-icon.alt {
        background: #e7f5ff;
    }

    .icon-square {
        width: 22px;
        height: 22px;
        border-radius: 8px;
        background: #cbd5f5;
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

    .panel-button {
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.7rem 1.2rem;
        background: #0c3266;
        color: #ffffff;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(10, 34, 80, 0.18);
        transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }

    .panel-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(10, 34, 80, 0.22);
    }

    .panel-button.primary {
        background: #0f766e;
        box-shadow: 0 2px 6px rgba(6, 78, 59, 0.18);
    }

    .panel-button.primary:hover {
        box-shadow: 0 4px 12px rgba(6, 78, 59, 0.22);
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
