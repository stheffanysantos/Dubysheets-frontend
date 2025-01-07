<template>
  <div id="app">
    <div class="image-header">
      <img src="@/assets/dubyicon.png" alt="Minha Imagem" />
    </div>
    <PlanilhaPedidos />
    <RodapePedido />
  </div>
</template>

<script>
import PlanilhaPedidos from './components/PlanilhaPedidos.vue';
import RodapePedido from './components/RodapePedido.vue';

export default {
  components: {
    RodapePedido,
    PlanilhaPedidos,
  },
};
</script>

<style>
body {
  background-color: #412884; 
}

.image-header {
  display: flex;
  align-items: center;
}
</style>
