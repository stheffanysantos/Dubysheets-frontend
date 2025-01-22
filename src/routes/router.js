import { createRouter, createWebHistory } from 'vue-router';

// Importando os componentes corretamente
import Home from '../components/HomePage.vue';
import testeBootstrap from '../components/testeBootstrap.vue';
import PlanilhaPedidos from '../components/PlanilhaPedidos.vue';
import VisualizaComponent from '../components/visualizaComponent.vue';
import RodapePedido from '../components/RodapePedido.vue';
import CadastroPedido from '../components/CadastroPedido.vue';
import LoginModal from '../components/LoginModal.vue';

const routes = [
  {
    path: '/',
    component: Home, // Página inicial com todos os componentes juntos
  },

  {
    path: '/CadastroPedido',
    component: CadastroPedido, // Página inicial com todos os componentes juntos
  },
  {
    path: '/LoginModal',
    component: LoginModal, // Página inicial com todos os componentes juntos
  },
  {
    path: '/teste-bootstrap',
    component: testeBootstrap
  },
  {
    path: '/planilha-pedidos',
    component: PlanilhaPedidos
  },
  {
    path: '/visualiza',
    component: VisualizaComponent
  },
  {
    path: '/rodape',
    component: RodapePedido
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
