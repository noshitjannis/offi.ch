<script lang="ts">
	export let eyebrow = "";
	export let title = "";
	export let description = "";
	export let flat = false;
</script>

<div class={`hero-box ${flat ? "flat" : ""}`}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}
	{#if title}
		<h1>{title}</h1>
	{/if}
	{#if description}
		<p class="lede">{description}</p>
	{/if}
	<slot />
</div>

<style>
	.hero-box {
		width: min(960px, 100%);
		margin: 0 auto;
		padding: 1.5rem 1.75rem;
		border-radius: 16px;
		background: radial-gradient(circle at 20% 20%, #e7f0ff, #f5f7fb 40%);
		border: 1px solid #e2e8f0;
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
		text-align: center;
	}

	.hero-box.flat {
		background: transparent;
		border: none;
		box-shadow: none;
		padding: 1.25rem 0;
	}

	.hero-box h1 {
		margin: 0 0 0.4rem;
		font-size: 1.8rem;
		font-weight: 800;
		color: #0b1530;
		letter-spacing: -0.015em;
	}

	.hero-box .eyebrow {
		margin: 0 0 0.35rem;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #1d4ed8;
	}

	.hero-box .lede {
		margin: 0.25rem auto 0;
		color: #475569;
		max-width: 640px;
		line-height: 1.6;
		text-align: center;
	}
</style>
