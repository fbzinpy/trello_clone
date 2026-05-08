<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

html.dark-mode,
html.dark-mode body,
html.dark-mode #app,
body.dark-mode,
#app.dark-mode {
  background: #0b1020 !important;
  color: #dbeafe !important;
}

html.dark-mode .layout,
body.dark-mode .layout,
#app.dark-mode .layout {
  background: #0b1020 !important;
}

html.dark-mode .main,
body.dark-mode .main,
#app.dark-mode .main {
  background:
    radial-gradient(circle at 18% 12%, rgba(59,130,246,.16), transparent 30%),
    radial-gradient(circle at 78% 24%, rgba(20,184,166,.12), transparent 26%),
    linear-gradient(135deg, #0b1020 0%, #11182a 48%, #0c1f24 100%) !important;
}

html.dark-mode .content,
body.dark-mode .content,
#app.dark-mode .content {
  background: transparent !important;
  color: #dbeafe !important;
  min-height: calc(100vh - 58px);
}

html.dark-mode .header,
body.dark-mode .header,
#app.dark-mode .header {
  background: rgba(9,14,27,.88) !important;
  border-bottom-color: rgba(96,165,250,.18) !important;
  box-shadow: 0 12px 30px rgba(0,0,0,.26) !important;
  backdrop-filter: blur(14px);
}

html.dark-mode .sidebar,
body.dark-mode .sidebar,
#app.dark-mode .sidebar {
  background: linear-gradient(180deg, #0b1020 0%, #0d1628 58%, #0a1322 100%) !important;
  border-right-color: rgba(96,165,250,.16) !important;
  box-shadow: inset -1px 0 0 rgba(255,255,255,.02);
}

html.dark-mode .logo,
body.dark-mode .logo,
#app.dark-mode .logo {
  color: #8ec5ff !important;
}

html.dark-mode .menu-title,
body.dark-mode .menu-title,
#app.dark-mode .menu-title {
  color: #6f86a8 !important;
}

html.dark-mode .nav-item,
body.dark-mode .nav-item,
#app.dark-mode .nav-item {
  color: #d7e3f5 !important;
}

html.dark-mode .nav-item:hover,
html.dark-mode .nav-item.active,
body.dark-mode .nav-item:hover,
body.dark-mode .nav-item.active,
#app.dark-mode .nav-item:hover,
#app.dark-mode .nav-item.active {
  background: rgba(59,130,246,.16) !important;
  color: #93c5fd !important;
}

html.dark-mode .page-title,
html.dark-mode .section-title,
body.dark-mode .page-title,
body.dark-mode .section-title,
#app.dark-mode .page-title,
#app.dark-mode .section-title {
  color: #f8fafc !important;
}

html.dark-mode .page-subtitle,
body.dark-mode .page-subtitle,
#app.dark-mode .page-subtitle {
  color: #a8c1df !important;
}

html.dark-mode .search,
body.dark-mode .search,
#app.dark-mode .search {
  background: rgba(15,26,44,.9) !important;
  border-color: rgba(96,165,250,.22) !important;
  color: #e5edf8 !important;
}

html.dark-mode .card.add,
body.dark-mode .card.add,
#app.dark-mode .card.add {
  background: rgba(19,30,51,.82) !important;
  border-color: rgba(148,163,184,.24) !important;
  color: #dbeafe !important;
  box-shadow: 0 12px 22px rgba(0,0,0,.2) !important;
}

html.dark-mode .card.add:hover,
body.dark-mode .card.add:hover,
#app.dark-mode .card.add:hover {
  background: rgba(30,48,78,.92) !important;
  border-color: rgba(96,165,250,.42) !important;
}

html.dark-mode .card:not(.add),
body.dark-mode .card:not(.add),
#app.dark-mode .card:not(.add) {
  background: linear-gradient(135deg, #4f63f2 0%, #0b74d1 48%, #16b67d 100%) !important;
  box-shadow: 0 14px 26px rgba(4,12,28,.32) !important;
}

html.dark-mode .card-menu,
body.dark-mode .card-menu,
#app.dark-mode .card-menu,
html.dark-mode .dropdown,
body.dark-mode .dropdown,
#app.dark-mode .dropdown,
html.dark-mode .modal,
body.dark-mode .modal,
#app.dark-mode .modal {
  background: rgba(17,28,46,.96) !important;
  border-color: rgba(96,165,250,.18) !important;
  box-shadow: 0 20px 44px rgba(0,0,0,.36) !important;
}
</style>
