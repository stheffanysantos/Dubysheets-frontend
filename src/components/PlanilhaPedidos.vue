<template>
  <div class="app">
    <div class="filtro-container">
      <img class="imagem-filtro"  src="@/assets/iconbolota.png" alt="icone ao lado do filtro" height="70" />
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
    </div>

    <div class="main-container">
      <div class="form-container">
        <h1><strong>Cadastrar Pedido</strong></h1>
        <form @submit.prevent="addPedido">
          <div class="form-group">
            <label for="data">Data:</label>
            <input type="date" id="data" v-model="novoPedido.data" required />
          </div>
          <div class="form-group">
            <label for="produto">Produto:</label>
            <input type="text" id="produto" v-model="novoPedido.produto" required />
          </div>
          <div class="form-group">
            <label for="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" v-model.number="novoPedido.quantidade" required />
          </div>
          <div class="form-group">
            <label for="preco">Preço:</label>
            <input type="number" id="preco" v-model.number="novoPedido.preco" placeholder="Opcional" step="0.01" />
          </div>
          <div class="form-group">
            <label for="unidade">Unidade:</label>
            <input type="text" id="unidade" v-model="novoPedido.unidade" required />
          </div>
          <div class="form-group">
            <label for="empresa">Fornecedor:</label>
            <input type="text" id="empresa" v-model="novoPedido.empresa" required />
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="novoPedido.status" required>
              <option value="Pendente">PENDENTE</option>
              <option value="Entregue">ENTREGUE</option>
              <option value="Cancelado">CANCELADO</option>
              <option value="Retirar no local">RETIRAR NO LOCAL</option>
            </select>
          </div>
          <div class="form-group">
            <label for="turno">Turno:</label>
            <select id="turno" v-model="novoPedido.turno" required>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div class="form-group">
            <label for="observacao">Observação:</label>
            <textarea id="observacao" v-model="novoPedido.observacao" placeholder="Opcional" maxlength="25"></textarea>
            <p v-if="novoPedido.observacao.length > 25" style="color: red;">Máximo de 50 caracteres (incluindo quebras de linha)</p>
          </div>

          <div class="form-group">
            <label for="previsao">Previsão:</label>
            <input type="date" id="previsao" v-model="novoPedido.previsao"/>
          </div>
          <button type="submit" class="btn">Cadastrar</button>
        </form>
      </div>

      <div class="relatorio-container">
        <h2>Relatório de Pedidos</h2>
        <div v-if="isLoading" class="loading">Carregando pedidos...</div>
        <table  v-else>
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço</th>
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
              <td>{{ formatarPreco(pedido.preco) }}</td>
              <td>{{ pedido.unidade }}</td>
              <td>{{ pedido.empresa }}</td>
              <td>{{ formatarData(pedido.previsao) }}</td>
              <td>{{ pedido.status }}</td>
              <td>{{ pedido.turno }}</td>
              <td class="observacao" style="white-space: pre-wrap;">{{ pedido.observacao }}</td>
              <td>
                <!-- Passando o ID do pedido para as funções de editar e excluir -->
                <button @click="editarPedido(pedido.id)" class="btn btn-edit">
                  <img src="@/assets/lapis.png" alt="Editar" class="icon-img">
                </button>
                <button @click="excluirPedido(pedido.id)" class="btn btn-delete">
                  <img src="@/assets/lixeira.png" alt="Editar" class="icon-img">
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edição -->
    <ModalDeEdicao
    :isVisible="isEditing"
    :pedidoEditado="pedidoEditado"
    @fechar="fecharModal"
    @atualizarPedidos="getPedidos"
  />

  </div>
</template>


<script>
import ModalDeEdicao from './ModalDeEdicao.vue';
import pedidoService from "@/services/api";
import Swal from "sweetalert2";


export default {
  components: {
    ModalDeEdicao,
  },
  data() {
    return {
      pedidos: [],
      isLoading: false,
      filtros: {
        status: "",
        produto: "",
        data: "",
      },
      isEditing: false,
      pedidoEditado: null,
      novoPedido: {
        data: "",
        produto: "",
        quantidade: 0,
        preco: null,
        unidade: "",
        empresa: "",
        previsao: "",
        status: "pendente",
        turno: "manha",
        observacao: "",
      },
    };
  },
  computed: {
    pedidosFiltrados() {
      // Verifica se pedidos é um array antes de aplicar o filtro
      if (!Array.isArray(this.pedidos)) {
        console.warn("`pedidos` não é um array:", this.pedidos);
        return [];
      }
      return this.pedidos.filter((pedido) => {
        const matchStatus = this.filtros.status ? pedido.status === this.filtros.status : true;
        const matchProduto = this.filtros.produto ? pedido.produto.toLowerCase().includes(this.filtros.produto.toLowerCase()) : true;
        const matchFornecedor = this.filtros.empresa ? pedido.empresa.toLowerCase().includes(this.filtros.empresa.toLowerCase()) : true;
        const matchData = this.filtros.data ? pedido.data && this.formatarData(pedido.data) === this.filtros.data : true;

        return matchStatus && matchProduto && matchFornecedor && matchData;
      });
    },
  },
  methods: {
      formatarPreco(valor) {
      if (!valor) return "R$ 0,00";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },

    quebrarLinha() {
      let texto = this.novoPedido.observacao;
      
      if (texto.length > 25) {
        texto = texto.slice(0, 25); 
      }
    },
        
    formatarData(data) {
      if (!data || isNaN(new Date(data).getTime())) {
        return "--/--/--"; // Retorna o valor padrão para datas nulas ou inválidas
      }
      const date = new Date(data);
      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const dia = String(localDate.getDate()).padStart(2, "0");
      const mes = String(localDate.getMonth() + 1).padStart(2, "0");
      const ano = localDate.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },

    resetForm() {
      this.novoPedido = {
        data: "",
        produto: "",
        quantidade: 0,
        preco: null,
        unidade: "",
        empresa: "",
        previsao: "",
        status: "pendente",
        turno: "manha",
        observacao: "",
      };
    },
    editarPedido(id) {
      const pedido = this.pedidos.find((p) => p.id === id);
      if (pedido) {
        this.pedidoEditado = { ...pedido };
        this.isEditing = true;
      } else {
        console.error("Pedido não encontrado para edição");
      }
    },
    async getPedidos() {
      this.isLoading = true;
      try {
        const pedidos = await pedidoService.getPedidos();
        // Ordena os pedidos pelo ID, mais recente primeiro
        this.pedidos = Array.isArray(pedidos)
          ? pedidos.sort((a, b) => b.id - a.id)
          : [];
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error.response?.data || error.message);
        this.pedidos = [];
      } finally {
        this.isLoading = false;
      }
    },
    async addPedido() {
      try {
        // Garante que previsao será null caso esteja vazio
        const pedidoParaSalvar = {
          ...this.novoPedido,
          previsao: this.novoPedido.previsao ? this.novoPedido.previsao : null,
        };

        // Envia o pedido ajustado para o serviço
        const pedidoAdicionado = await pedidoService.addPedido(pedidoParaSalvar);

        if (pedidoAdicionado && pedidoAdicionado.id) {
          this.pedidos.push(pedidoAdicionado); // Adiciona o novo pedido à lista
          this.getPedidos(); // Atualiza a lista de pedidos
          this.$emit("atualizarPedidos"); 
        }

        this.resetForm(); // Limpa o formulário após salvar
      } catch (error) {
        console.error("Erro ao adicionar pedido:", error.response?.data || error.message);
      }
    },
    async salvarPedidoEditado() {
      try {
        const response = await pedidoService.updatePedido(this.pedidoEditado.id, this.pedidoEditado);
        if (response) {
          this.$emit("atualizarPedidos"); 
          this.fecharModal();
          this.getPedidos();
        } else {
          alert("Erro ao atualizar pedido.");
        }
      } catch (error) {
        console.error("Erro ao salvar pedido editado:", error);
        alert("Não foi possível salvar as alterações. Tente novamente.");
      }
    },
    async excluirPedido(id) {
      const { isConfirmed } = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#412884",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        width: '80%',
        padding: '30px',
      });

      if (isConfirmed) {
        try {
          // Confirme a exclusão no backend
          await pedidoService.deletePedido(id);
          
          // Remova o pedido pelo `id` no array original
          this.pedidos = this.pedidos.filter((p) => p.id !== id);
          
          Swal.fire("Excluído!", "O pedido foi excluído com sucesso.", "success");
        } catch (error) {
          console.error("Erro ao excluir pedido:", error.response?.data || error.message);
          Swal.fire("Erro!", "Não foi possível excluir o pedido. Tente novamente.", "error");
        }
      }
    },

    fecharModal() {
      this.isEditing = false;
      this.pedidoEditado = null;
    },
  },
  created() {
    this.getPedidos(); // Chama o método de carregamento de pedidos ao criar o componente
  },
};
</script>



<style scoped>
@import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);

.app {
  font-family: Nunito, Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px auto;
  max-width: 98%;
  background: #f4f7fb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filtro-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 20px; /* Adicionar margem inferior */
}

.main-container {
  display: flex;
  gap: 20px;
  margin: 0 auto;
  width: 100%;
}

.form-container,
.relatorio-container {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  width: 98%;
}

.form-container {
  margin-right: 25px;
  padding: 30px;
  align-items: center;
  text-transform: uppercase;
}

.relatorio-container {
  width: 95%;
  margin-left: 0;
  padding: 20px;
}

h1 {
  font-size: 30px;
  color: #12283f;
  margin-bottom: 20px;
}

h2, h3 {
  font-size: 18px;
  color: #12283f;
  margin-bottom: 20px;
  padding: 10px;
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
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

th, td {
  text-align: center;
  padding: 5px;
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

  .custom-swal {
  max-width: 400px !important; /* Evita que fique muito grande */
  border-radius: 10px; /* Borda arredondada */
  font-size: 14px; /* Tamanho de fonte menor */
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

  .custom-swal {
  max-width: 400px !important; /* Evita que fique muito grande */
  border-radius: 10px; /* Borda arredondada */
  font-size: 14px; /* Tamanho de fonte menor */
}
  

}
</style>
