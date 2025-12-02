
<script lang="ts">
  import { onMount } from "svelte";

  export let data;
  const ctaHref = data.user ? "/builder" : "/login";
  const navLinks = [
    { href: "/#funktionen", label: "Funktionen" },
    { href: "/#preise", label: "Preise" },
    { href: "/#templates", label: "Vorlagen" }
  ];
  let menuOpen = false;
  let isCondensed = false;
  let hideHeader = false;
  let lastScrollY = 0;

  const handleNavClick = (event: MouseEvent, href: string) => {
    if (!href.startsWith("/#")) return;

    const targetId = href.slice(2);
    const target = document.getElementById(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }

    menuOpen = false;
  };

  onMount(() => {
    lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY + 5;
      const scrollingUp = currentY < lastScrollY - 5;

      isCondensed = currentY > 40;

      if (scrollingDown && currentY > 80 && !menuOpen) {
        hideHeader = true;
      } else if (scrollingUp || currentY <= 80) {
        hideHeader = false;
      }

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<svelte:head>
  <title>Offi</title>
</svelte:head>

<div class="app">
  <header class={`header ${isCondensed ? "seamless" : ""} ${hideHeader ? "hidden" : ""}`}>
    <div class={`header-inner ${isCondensed ? "condensed" : ""}`}>
      <a class="brand" href="/">
        <img src="/offi_logo.svg" alt="Logo Offi" />
        <span class="sr-only">Offi</span>
      </a>

      <button
        class="menu-toggle"
        aria-label="Navigation öffnen"
        aria-expanded={menuOpen}
        on:click={() => (menuOpen = !menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class={`header-actions ${menuOpen ? "open" : ""}`}>
        <nav>
          {#each navLinks as link}
            <a href={link.href} on:click={(event) => handleNavClick(event, link.href)}>{link.label}</a>
          {/each}
        </nav>

        <div class="header-cta">
          <a class="login-link" href="/login/basic" on:click={() => (menuOpen = false)}>Login</a>
          {#if data.user}
            <a class="login-link" href="/account" on:click={() => (menuOpen = false)}>Account</a>
          {/if}
          <a class="nav-cta" href={ctaHref} on:click={() => (menuOpen = false)}>Offerte erstellen</a>
        </div>
      </div>
    </div>
  </header>

  <main class="main">
    <slot />
  </main>
</div>

<style>
  :global(:root) {
    --content-max-width: 1240px;
  }

  :global(body) {
    margin: 0;
    background: #f8fafc;
    color: #0f172a;
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .app {
    min-height: 100vh;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: transparent;
    color: #ffffff;
    padding: 0.75rem 0 1.25rem;
    transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, padding 0.25s ease;
    border-bottom: 0 solid transparent;
  }

  .header.hidden {
    transform: translateY(-110%);
  }

  .header.seamless {
    background: #ffffff;
    padding: 0.35rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .header-inner {
    width: min(calc(100% - 2rem), var(--content-max-width));
    margin: 0 auto;
    padding: 1.1rem 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1.25rem;
    box-sizing: border-box;
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 18px 36px rgba(13, 38, 76, 0.12);
    position: relative;
    transition: all 0.25s ease;
  }

  .header-inner.condensed {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0.75rem 1.25rem;
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

  .menu-toggle {
    display: none;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    flex-direction: column;
    cursor: pointer;
  }

  .menu-toggle span {
    display: block;
    width: 18px;
    height: 2px;
    background: #0f172a;
    border-radius: 999px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  nav {
    display: flex;
    gap: 1.1rem;
  }

  nav a {
    margin: 0;
    text-decoration: none;
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  nav a:hover {
    border-color: #e2e8f0;
    background: #f8fafc;
    color: #1f5fff;
  }

  .header-cta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .login-link {
    color: #0f172a;
    text-decoration: none;
    font-weight: 600;
    padding: 0.45rem 0.75rem;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .login-link:hover {
    border-color: #e2e8f0;
    background: #f8fafc;
    color: #1f5fff;
  }

  .nav-cta {
    background: linear-gradient(120deg, #1f5fff, #639dff);
    color: #ffffff;
    text-decoration: none;
    padding: 0.6rem 1.8rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.95rem;
    transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 12px 28px rgba(31, 95, 255, 0.3);
  }

  .nav-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px rgba(31, 95, 255, 0.35);
  }

  .main {
    max-width: var(--content-max-width);
    margin: 1rem auto 3rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 900px) {
    .header-inner {
      grid-template-columns: auto auto;
      align-items: center;
    }

    .menu-toggle {
      display: inline-flex;
      justify-self: end;
    }

    .header-actions {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      box-shadow: 0 18px 36px rgba(13, 38, 76, 0.12);
      padding: 1rem 1.2rem;
      display: none;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      z-index: 10;
    }

    .header-actions.open {
      display: flex;
    }

    nav {
      flex-direction: column;
      width: 100%;
      gap: 0.35rem;
    }

    nav a {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      background: #f8fafc;
    }

    .header-cta {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .nav-cta {
      width: 100%;
      text-align: center;
    }
  }
</style>
