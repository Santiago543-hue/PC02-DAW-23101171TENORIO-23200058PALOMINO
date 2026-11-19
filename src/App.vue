<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink class="brand" to="/">
          <span class="brand__mark" aria-hidden="true">I</span>
          <span>Item<span class="brand__accent">Base</span></span>
        </RouterLink>
        <nav aria-label="Navegación principal">
          <RouterLink class="nav-link" to="/">Elementos</RouterLink>
        </nav>
      </div>
    </header>

    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>
