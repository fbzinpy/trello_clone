<template>
  <nav class="navbar">
    <div class="navbar-left">
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <rect width="24" height="24" rx="4" fill="#0052CC"/>
        <rect x="4" y="5" width="6" height="10" rx="1.5" fill="white"/>
        <rect x="14" y="5" width="6" height="7" rx="1.5" fill="white"/>
      </svg>
      <span class="logo-text">TrelloClone</span>
    </div>
    <div class="navbar-right">
      <router-link to="/" class="nav-link">← Volver</router-link>
    </div>
  </nav>

  <main class="precios-page">
    <div class="precios-header">
      <h1>TrelloClone, a tu manera.</h1>
      <p>Da confianza a tu equipo y potencia tu productividad.<br/>Descubre qué opción es la más adecuada para ti.</p>
    </div>

    <div class="planes-grid">
      <!-- FREE -->
      <div class="plan-card">
        <div class="plan-tier">FREE</div>
        <div class="plan-price"><span class="currency">$</span><span class="amount">0</span><span class="usd">USD</span></div>
        <p class="plan-desc">Gratis para hasta 10 colaboradores.</p>
        <button class="btn-plan outline">Empezar ahora mismo</button>
        <div class="plan-features-title">QUÉ INCLUYE:</div>
        <ul class="plan-features">
          <li>✓ Tarjetas ilimitadas</li>
          <li>✓ Hasta 10 tableros</li>
          <li>✓ Registro de tareas por correo</li>
          <li>✓ Bandeja de entrada</li>
          <li>✓ Almacenamiento ilimitado (10 MB/archivo)</li>
        </ul>
      </div>

      <!-- STANDARD -->
      <div class="plan-card">
        <div class="plan-tier">STANDARD</div>
        <div class="plan-price"><span class="currency">$</span><span class="amount">5</span><span class="usd">USD</span></div>
        <p class="plan-desc">Por usuario al mes con facturación anual.</p>
        <button class="btn-plan outline">Regístrate ahora</button>
        <div class="plan-features-title">TODO EL PLAN FREE Y ADEMÁS:</div>
        <ul class="plan-features">
          <li>✓ Tableros ilimitados</li>
          <li>✓ Listas de comprobación avanzadas</li>
          <li>✓ Duplicación de tarjetas</li>
          <li>✓ Campos personalizados</li>
          <li>✓ Almacenamiento ilimitado (250 MB/archivo)</li>
        </ul>
      </div>

      <!-- PREMIUM (destacado) -->
      <div class="plan-card featured">
        <div class="plan-badge">Más popular</div>
        <div class="plan-tier">PREMIUM</div>
        <div class="plan-price"><span class="currency">$</span><span class="amount">10</span><span class="usd">USD</span></div>
        <p class="plan-desc">Por usuario al mes con facturación anual.</p>
        <button class="btn-plan primary">Probar gratis</button>
        <div class="plan-features-title">TODO EL PLAN STANDARD Y ADEMÁS:</div>
        <ul class="plan-features">
          <li>✓ Vistas: Calendario, Cronograma, Tabla</li>
          <li>✓ Ejecuciones ilimitadas de comandos</li>
          <li>✓ Funciones de administración</li>
          <li>✓ Plantillas de nivel de espacio</li>
          <li>✓ Observadores</li>
          <li>✓ Exportación de datos</li>
        </ul>
      </div>

      <!-- ENTERPRISE -->
      <div class="plan-card">
        <div class="plan-tier">ENTERPRISE</div>
        <div class="plan-price"><span class="currency">$</span><span class="amount">17.50</span><span class="usd">USD</span></div>
        <p class="plan-desc">Por usuario al mes con facturación anual.</p>
        <button class="btn-plan outline">Contactar ventas</button>
        <div class="plan-features-title">TODO EL PLAN PREMIUM Y ADEMÁS:</div>
        <ul class="plan-features">
          <li>✓ Espacios de trabajo ilimitados</li>
          <li>✓ Permisos a nivel de organización</li>
          <li>✓ Gestión de tableros públicos</li>
          <li>✓ Invitados multitablero</li>
          <li>✓ Inicio de sesión único (SSO)</li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 56px; background: white;
  border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100;
}
.navbar-left { display: flex; align-items: center; gap: 8px; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: #0052CC; }
.navbar-right { display: flex; align-items: center; }
.nav-link { color: #0052CC; text-decoration: none; font-size: 0.9rem; font-weight: 500; }

.precios-page { padding: 4rem 2rem; background: #f8f9fa; min-height: calc(100vh - 56px); }

.precios-header { text-align: center; margin-bottom: 3rem; }
.precios-header h1 { font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800; color: #172b4d; margin-bottom: 0.8rem; }
.precios-header p { font-size: 1rem; color: #44546f; line-height: 1.6; }

.planes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.plan-card {
  background: white;
  border: 1px solid #dfe1e6;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: box-shadow 0.2s;
}
.plan-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
.plan-card.featured { border: 2px solid #0052CC; }

.plan-badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: #0052CC; color: white; font-size: 0.75rem; font-weight: 700;
  padding: 4px 14px; border-radius: 20px; white-space: nowrap;
}

.plan-tier { font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: #44546f; }

.plan-price { display: flex; align-items: baseline; gap: 2px; }
.currency { font-size: 1rem; font-weight: 700; color: #172b4d; }
.amount { font-size: 2.8rem; font-weight: 800; color: #172b4d; line-height: 1; }
.usd { font-size: 0.75rem; color: #8993a4; margin-left: 4px; }

.plan-desc { font-size: 0.82rem; color: #44546f; line-height: 1.5; min-height: 36px; }

.btn-plan {
  width: 100%; padding: 10px; border-radius: 6px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.15s; font-family: 'Inter', sans-serif;
}
.btn-plan.outline { background: none; border: 2px solid #0052CC; color: #0052CC; }
.btn-plan.outline:hover { background: #e6f0ff; }
.btn-plan.primary { background: #0052CC; border: 2px solid #0052CC; color: white; }
.btn-plan.primary:hover { background: #0747a6; }

.plan-features-title { font-size: 0.72rem; font-weight: 700; color: #44546f; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 8px; }

.plan-features { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.plan-features li { font-size: 0.85rem; color: #172b4d; line-height: 1.4; }

@media (max-width: 600px) {
  .planes-grid { grid-template-columns: 1fr; }
}
</style>
