
<script lang="ts">
  export let data;
  const ctaHref = data.user ? "/builder" : "/login";
</script>

<svelte:head>
  <title>Offi</title>
</svelte:head>

<div class="app">
  <header class="header">
    <div class="header-inner">
      <a class="brand" href="/">
        <img src="/offi_logo.svg" alt="Logo Offi" />
        <span class="sr-only">Offi</span>
      </a>

      <div class="header-actions">
        <nav>
          <a href="/account">Account</a>
        </nav>

        <a class="nav-cta" href={ctaHref}>Offerte erstellen</a>
      </div>
    </div>
  </header>

  <main class="main">
    <slot />
  </main>
</div>

<style>
  :global(:root) {
    --content-max-width: 960px;
  }

  :global(body) {
    margin: 0;
    background: #f5f5f7;
    color: #111827;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .app {
    min-height: 100vh;
  }

  .header {
    background: transparent;
    color: #ffffff;
    padding: 0.75rem 0 1.25rem;
  }

  .header-inner {
    width: min(calc(100% - 2rem), var(--content-max-width));
    margin: 0 auto;
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    box-sizing: border-box;
    background: #ffffff;
    color: #013364;
    border: 1px solid #e0e0e0;
    border-radius: 0.7rem;
    box-shadow: 0 20px 40px rgba(1, 51, 100, 0.1);
  }

  .brand {
    display: inline-flex;
    align-items: center;
  }

  .brand img {
    display: block;
    height: 50px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  nav {
    display: flex;
    gap: 1rem;
  }

  nav a {
    margin: 0;
    text-decoration: none;
    color: #013364;
    font-size: 0.95rem;
    font-weight: 500;
  }

  nav a:hover {
    color: #013364;
  }

  .nav-cta {
    background: #84c1ff;
    color: #013364;
    text-decoration: none;
    padding: 0.6rem 1.8rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .nav-cta:hover {
    background: #9bd1ff;
    transform: translateY(-1px);
  }

  .main {
    max-width: var(--content-max-width);
    margin: 1rem auto 3rem;
    padding: 0 1rem;
  }
</style>
