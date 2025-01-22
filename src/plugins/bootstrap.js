import { BNavbar, BNavbarBrand, BNavbarNav, BNavItem } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'; // Importando o CSS do BootstrapVueNext

export default {
  install(app) {
    // Registra os componentes no Vue, mas só quando o plugin for usado
    app.component('BNavbar', BNavbar);
    app.component('BNavbarBrand', BNavbarBrand);
    app.component('BNavbarNav', BNavbarNav);
    app.component('BNavItem', BNavItem);
  }
};
