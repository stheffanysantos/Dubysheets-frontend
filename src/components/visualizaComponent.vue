<template>
  <div class="app">
    <div class="filtro-container">
      <img class="imagem-filtro" src="@/assets/iconbolota.png" alt="icone ao lado do filtro" height="70" />
      <div class="form-group">
        <label for="filtroStatus">Status:</label>
        <select id="filtroStatus" v-model="filtros.status">
          <option value="">Todos</option>
          <option value="pendente">PENDENTE</option>
          <option value="Entregue">ENTREGUE</option>
          <option value="Cancelado">CANCELADO</option>
          <option value="Retirar no local">RETIRAR NO LOCAL</option>
        </select>
      </div>
      <div class="form-group">
        <label for="filtroProduto">Produto:</label>
        <input type="text" id="filtroProduto" v-model="filtros.produto" placeholder="Digite o produto" />
      </div>
      <div class="form-group">
        <label for="filtroFornecedor">Fornecedor:</label>
        <input type="text" id="filtroFornecedor" v-model="filtros.empresa" placeholder="Digite o fornecedor" />
      </div>
      <div class="form-group">
        <label for="filtroData">Data:</label>
        <input type="date" id="filtroData" v-model="filtros.data" placeholder="Selecione a data" />
      </div>
    </div>

    <div class="relatorio-container">
      <h2>Visualização de Pedidos</h2>
      <div v-if="isLoading" class="loading">Carregando pedidos...</div>
      <table v-else>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Unidade</th>
            <th>Fornecedor</th>
            <th>Previsão</th>
            <th>Status</th>
            <th>Turno</th>
            <th>Observação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in pedidosFiltrados" :key="pedido.id">
            <td>{{ formatarData(pedido.data) }}</td>
            <td>{{ pedido.produto }}</td>
            <td>{{ pedido.quantidade }}</td>
            <td>{{ pedido.unidade }}</td>
            <td>{{ pedido.empresa }}</td>
            <td>{{ formatarData(pedido.previsao) }}</td>
            <td>{{ pedido.status }}</td>
            <td>{{ pedido.turno }}</td>
            <td class="observacao" style="white-space: pre-wrap;">{{ pedido.observacao }}</td>
            <td>
              <button @click="abrirModal(pedido)" class="btn btn-edit">
                <img src="@/assets/lapis.png" alt="Editar" class="icon-img">
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="paginacao">
        <button @click="paginaAtual--" :disabled="paginaAtual === 1">Anterior</button>
        
        <button 
          v-for="pagina in totalPaginas" 
          :key="pagina" 
          @click="paginaAtual = pagina" 
          :class="{ ativo: paginaAtual === pagina }">
          {{ pagina }}
        </button>

        <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas">Próximo</button>
      </div>

      <!-- Gráfico de Status -->
      <div class="dashboard-container">
        <canvas id="myBarChart"></canvas>
      </div>

      <!-- Novo gráfico de Data -->
      <div class="dashboard-container">
        <canvas id="dateBarChart"></canvas>
      </div>

    </div>
    
    <!-- Modal para atualizar status -->
    <statusModal 
      v-if="modalVisivel" 
      :pedido="pedidoSelecionado" 
      @fechar="fecharModal" 
      @atualizarStatus="atualizarStatus">
    </statusModal>
  </div>
</template>


<script>
import statusModal from "@/components/statusModal.vue";
import pedidoService from "@/services/api";
import Swal from "sweetalert2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  components: {
    statusModal,
  },
  data() {
    return {
      pedidos: [],
      pedido: {},
      isLoading: false,
      filtros: {
        status: "",
        produto: "",
        fornecedor: "",
      },
      modalVisivel: false,
      pedidoSelecionado: null,
      chartData: null,  // Dados do gráfico
      paginaAtual: 1,  // Página atual
      itensPorPagina: 15,  // Quantidade de itens por página
    };
  },
  computed: {
    pedidosFiltrados() {
    const pedidosFiltrados = this.pedidos.filter(pedido => {
      const matchStatus = this.filtros.status ? pedido.status === this.filtros.status : true;
      const matchProduto = this.filtros.produto ? pedido.produto.toLowerCase().includes(this.filtros.produto.toLowerCase()) : true;
      const matchFornecedor = this.filtros.empresa ? pedido.empresa.toLowerCase().includes(this.filtros.empresa.toLowerCase()) : true;
      const matchData = this.filtros.data ? pedido.previsao && pedido.previsao.toLowerCase().includes(this.filtros.data.toLowerCase()) : true;
      return matchStatus && matchProduto && matchFornecedor && matchData;
    });

    // **Paginação**: Retorna apenas os pedidos da página atual
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return pedidosFiltrados.slice(inicio, fim);
  },

  totalPaginas() {
    return Math.ceil(this.pedidos.length / this.itensPorPagina);
  }
},
  methods: {
    formatarPreco(valor) {
      if (!valor) return "R$ 0,00";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },

    formatarData(data) {
      if (!data || isNaN(new Date(data).getTime())) {
        return "--/--/--";
      }
      const date = new Date(data);
      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const dia = String(localDate.getDate()).padStart(2, "0");
      const mes = String(localDate.getMonth() + 1).padStart(2, "0");
      const ano = localDate.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },

    async getPedidos() {
      this.isLoading = true;
      try {
        const pedidos = await pedidoService.getPedidos();
                this.pedidos = Array.isArray(pedidos)
          ? pedidos.sort((a, b) => b.id - a.id)
          : [];
        this.pedidos = pedidos || [];
        this.chartData = this.processChartData(pedidos);  // Atualiza os dados do gráfico
        this.renderChart();  // Renderiza o gráfico
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        this.pedidos = [];
      } finally {
        this.isLoading = false;
      }
    },

    atualizarFiltros() {
      this.getPedidos();
    },

    async atualizarStatus(id, novoStatus) {
  try {
    const pedidoAtualizado = { status: novoStatus };
    await pedidoService.updatePedido(id, pedidoAtualizado);

    // Exibe o SweetAlert2 de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Status atualizado!',
      text: 'O status do pedido foi alterado com sucesso.',
      timer: 2000, // O alerta desaparece automaticamente após 2 segundos
      showConfirmButton: false,
    }).then(() => {
      // Emite um evento para o componente pai recarregar os pedidos
      this.$emit("atualizarPedidos");

      // Se houver um modal aberto, ele será fechado
      this.fecharModal?.();
    });

  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    Swal.fire({
      icon: 'error',
      title: 'Erro ao atualizar o status',
      text: 'Ocorreu um erro ao tentar atualizar o status. Tente novamente.',
      timer: 2000,
      showConfirmButton: false,
    });
  }
},


    abrirModal(pedido) {
      this.pedidoSelecionado = pedido;
      this.modalVisivel = true;
    },

    fecharModal() {
      this.modalVisivel = false;
      this.pedidoSelecionado = null;
    },

    processChartData(data) {
      const statusCounts = data.reduce((acc, pedido) => {
        acc[pedido.status] = (acc[pedido.status] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(statusCounts).map(status => ({
        status,
        count: statusCounts[status],
      }));
    },

    renderChart() {
      if (!this.chartData || this.chartData.length === 0) {
        console.error('Nenhum dado disponível para o gráfico');
        return;
      }

      const labels = this.chartData.map(item => item.status);
      const values = this.chartData.map(item => item.count);

      const ctx = document.getElementById('myBarChart').getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar', // Alterado para gráfico de barras
          data: {
            labels: labels,
            datasets: [{
              label: 'Pedidos por Status',  // Título do gráfico
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return tooltipItem.label + ': ' + tooltipItem.raw;
                  }
                }
              }
            }
          }
        });
      }
    }
  },
      processDateChartData(data) {
      const dateCounts = data.reduce((acc, pedido) => {
        const date = pedido.previsao.slice(0, 10); // Usando apenas a parte da data (yyyy-mm-dd)
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(dateCounts).map(date => ({
        date,
        count: dateCounts[date],
      }));
    },
  mounted() {
    this.getPedidos();
  },
};
</script>


<style>
@import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);

.app {
  font-family: Nunito, Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px auto;
  max-width: 95%;
  background: #f4f7fb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.filtro-container {
  display: flex;
  justify-content: space-between;
  width: 95%;
  margin-bottom: 20px; /* Adicionar margem inferior */
}

.main-container {
  display: flex;
  gap: 20px;
  margin: 0 auto;
}

.form-container,
.relatorio-container {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.form-container {
  margin-right: 20px;
  padding: 30px;
  align-items: center;
  text-transform: uppercase;
}

.relatorio-container {
  width: 100%;
  margin-left: 0;
  align-items: center;
  justify-content: center;
  margin-bottom: 1%;
}

h1 {
  font-size: 30px;
  color: #12283f;
  margin-bottom: 20px;
}

h2, h3 {
  font-size: 20px;
  color: #12283f;
  margin-bottom: 20px;
}

.quebra-estrutura {
  flex-direction: row;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 14px;
  color: #322871;
  margin-bottom: 6px;
}

input, select, textarea, button {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

input, select, textarea {
  background-color: #f9f9f9;
}

button {
  cursor: pointer;
  background: #73ba60;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background: #5d9f4b;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

th, td {
  text-align: center;
  padding: 2px;
  border-bottom: 1px solid #ddd;
  white-space: pre-wrap; 
  word-wrap: break-word; 
}

.icon-img {
  width: 20px;
  height: 15px;
  object-fit: contain;
}

th {
  background-color: #412884;
  color: white;
}

tr:hover {
  background-color: #f4f4f4;
}

.btn {
  padding: 10px 15px;
  border-radius: 5px;
}

.btn-edit {
  background: #412884;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-edit:hover {
  background: #322871;
}

.btn-delete:hover {
  background: #9a2e2f;
}

.dashboard-container{
  display: flex;
  box-sizing: border-box;
  padding: 1%;
  width: 100%;
  margin-bottom: 1px; /* Aumenta o espaço entre o gráfico e o relatório */


}

.paginacao {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
}

.paginacao button {
  background: #412884;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}

.paginacao button.ativo {
  background: #5d9f4b;
  font-weight: bold;
}

.paginacao button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .app {
    max-width: 87%;
    padding: 10px;
  }

  .filtro-container,
  .form-container,
  .relatorio-container {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    flex-direction: column;
  }

  .filtro-container input,
  .filtro-container select {
    margin-bottom: 10px;
  }

  .main-container {
    flex-direction: column;
    gap: 15px;
  }

  h1 {
    font-size: 20px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 6px;
  }

  .btn {
    padding: 6px 10px;
  }

  .image-header img {
    width: 100%;
  }
  .imagem-filtro {
    width: 80%; /* Reduzindo a largura da imagem para 50% */
    height: auto; /* Mantendo a proporção */
  }
}


@media (max-width: 480px) {
  .filtro-container {
    gap: 8px;
  }

  .filtro-container .image-header {
    margin-bottom: 10px;
  }

  .filtro-container input,
  .filtro-container select {
    margin-bottom: 8px;
  }

  h1, h2, h3 {
    font-size: 18px;
  }

  button {
    padding: 8px;
    font-size: 12px;
  }

  input, select, textarea {
    font-size: 12px;
    padding: 8px;
  }

  table {
    font-size: 10px;
  }

  .btn {
    font-size: 10px;
    padding: 5px 8px;
  }

  .form-container,
  .relatorio-container {
    padding: 8px;
    font-size: 12px;
    overflow-x: auto;
  }

  .image-header img {
    max-width: 100%;
  }

  .imagem-filtro {
    width: 75%; /* Reduzindo ainda mais a largura da imagem em telas menores */
    height: auto; /* Mantendo a proporção */
    align-items: center;
  }

}
</style>