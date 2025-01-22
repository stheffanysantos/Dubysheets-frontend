  <template>
    <div>
      <teste-bootstrap />
      <visualiza-component />
      <rodape-pedido />
    </div>
  </template>
  
  <script>
  import testeBootstrap from './testeBootstrap.vue';
  import VisualizaComponent from './visualizaComponent.vue';
  import RodapePedido from './RodapePedido.vue';
  
  export default {
    components: {
      testeBootstrap,
      VisualizaComponent,
      RodapePedido
    }
  };
  </script>
  