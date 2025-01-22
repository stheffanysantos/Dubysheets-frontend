<template>
    <div>
      <teste-bootstrap />
      <PlanilhaPedidos />
      <rodape-pedido />
    </div>
  </template>
  
  <script>
  import testeBootstrap from './testeBootstrap.vue';
  import PlanilhaPedidos from './PlanilhaPedidos.vue';
  import RodapePedido from './RodapePedido.vue';
  
  export default {
    components: {
      testeBootstrap,
      PlanilhaPedidos,
      RodapePedido
    }
  };
  </script>
  