<template>
  <!-- Navbar simples com título e alguns itens de navegação -->
  <b-navbar toggleable="lg" type="dark" variant="primary" >
    <b-navbar-brand href="#">
      <img src="@/assets/dubyicon.png" alt="Logo" width="200" height="100">
    </b-navbar-brand>

    <b-navbar-nav>
    <div class="button">
    <b-nav-item>
        <router-link to="/LoginModal">
            <a class="btn btn-outline-light" target="_blank">Login</a>
        </router-link>
    </b-nav-item>
    <b-nav-item>
        <router-link to="/">
            <a class="btn btn-outline-light" target="_blank">Visualizar Pedidos</a>
        </router-link>
    </b-nav-item>
    <b-nav-item>
      <a href="https://duby.com.br/falecomagente" class="btn btn-outline-light" target="_blank">Fale Conosco</a>
    </b-nav-item>
    </div>
    </b-navbar-nav>
  </b-navbar>
  </template>
  
  <script>
  // Importando o plugin do BootstrapVueNext apenas neste componente
  import { createApp } from 'vue';
  import BootstrapPlugin from '@/plugins/bootstrap'; // Caminho para o plugin
  
  export default {
    name: "CabeçalhoSimples",
    mounted() {
      // Usando o plugin aqui
      const app = createApp(this);
      app.use(BootstrapPlugin);
    }
  };
  </script>
 
 <style>
.container-fluid{
  background-color: #412884;
}
#app{
  background-color: #412884;
}

.button{
    display: flex;
    flex-wrap: inherit;
    align-items: center;
    justify-content:center;
}
.bg-primary {
    --bs-bg-opacity: 1;
    background-color: #412884;
}

.bg-primary {
    --bs-bg-opacity: 1;
    background-color: #412884 !important;
}

.bg-primary {
    --bs-bg-opacity: 1;
    background-color: #412884 !important;
}

@media (max-width: 768px) {
  .navbar>.container, .navbar>.container-fluid, .navbar>.container-lg, .navbar>.container-md, .navbar>.container-sm, .navbar>.container-xl, .navbar>.container-xxl {
    display: flex
;
    flex-wrap: inherit;
    align-items: center;
    justify-content: center;
}

  .button {
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
  }

  .button a {
    width: 100%;
    margin: 1px;
    padding: 5px;
  }
}

.bg-primary {
  --bs-bg-opacity: 1;
  background-color: #412884 !important;
}

</style>