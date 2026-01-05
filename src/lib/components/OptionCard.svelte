<script>
    export let title = "";
    export let description = "";
    export let href;
    export let buttonText;
    export let buttonVariant = "primary";
    export let iconVariant = "default";
    export let iconSize = 44;
    export let iconFrame = true;
</script>

<svelte:element this={href ? "a" : "div"} class="card" href={href ?? undefined}>
    <div
        class={`card-icon ${iconVariant === "alt" ? "alt" : ""} ${!iconFrame ? "no-frame" : ""}`}
        style={`width: ${iconSize}px; height: ${iconSize}px;`}
    >
        <slot name="icon">
            <span class="icon-square" aria-hidden="true"></span>
        </slot>
    </div>
    <h2>{title}</h2>
    <p>{description}</p>

    <slot name="content" />

    {#if buttonText}
        <span class={`card-button ${buttonVariant === "secondary" ? "secondary" : ""}`}>
            {buttonText}
        </span>
    {/if}
</svelte:element>

<style>
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
    .card:focus-visible,
    .card:focus-within {
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

    .card-icon.no-frame {
        background: transparent;
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
</style>
