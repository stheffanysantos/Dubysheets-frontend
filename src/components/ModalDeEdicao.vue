<template>
  <div v-if="isVisible" class="modal" @click.self="fecharModal">
    <div class="modal-content">
      <h2>Editar Pedido</h2>
      <form @submit.prevent="salvarPedidoEditado">
        <div class="form-group-container">
          <div class="form-group">
            <label for="data">Data:</label>
            <input type="date" id="data" v-model="pedidoTemp.data" required />
          </div>

          <div class="form-group">
            <label for="produto">Produto:</label>
            <input type="text" id="produto" v-model="pedidoTemp.produto" required />
          </div>

          <div class="form-group">
            <label for="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" v-model.number="pedidoTemp.quantidade" required />
          </div>

          <div class="form-group">
            <label for="preco">Preço:</label>
            <input type="number" id="preco" v-model.number="pedidoTemp.preco" placeholder="Opcional" step="0.01" />
          </div>

          <div class="form-group">
            <label for="unidade">Unidade:</label>
            <input type="text" id="unidade" v-model="pedidoTemp.unidade" required />
          </div>

          <div class="form-group">
            <label for="empresa">Empresa:</label>
            <input type="text" id="empresa" v-model="pedidoTemp.empresa" required />
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="pedidoTemp.status" required>
              <option value="pendente">Pendente</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
              <option value="retirado">Retirar no local</option>
            </select>
          </div>

          <div class="form-group">
            <label for="turno">Turno:</label>
            <select id="turno" v-model="pedidoTemp.turno" required>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>

          <div class="form-group">
            <label for="observacao">Observação:</label>
            <textarea id="observacao" v-model="pedidoTemp.observacao" placeholder="Opcional" @input="quebrarLinha"></textarea>
          </div>

          <div class="form-group">
            <label for="previsao">Previsão:</label>
            <input type="date" id="previsao" v-model="pedidoTemp.previsao" required />
          </div>

          <button type="submit" class="btn">Salvar</button>
        </div>
      </form>
      <button @click="fecharModal" class="btn btn-close">Fechar</button>
    </div>
  </div>
</template>

<script>
import pedidoService from "@/services/api";

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    pedidoEditado: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pedidoTemp: {observacao: ""},
    };
  },
  watch: {
    pedidoEditado: {
      handler(newPedido) {
        if (newPedido) {
          this.pedidoTemp = {
            ...newPedido,
            data: this.formatDateForInput(newPedido.data),
            previsao: this.formatDateForInput(newPedido.previsao),
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
  quebrarLinha() {
    let texto = this.pedidoTemp.observacao.replace(/\n/g, "");
    texto = texto.slice(0, 25); // Limita a 50 caracteres
    const partes = texto.match(/.{1,25}/g); // Quebra a cada 15 caracteres
    // Junta as partes com uma quebra de linha
    this.pedidoTemp.observacao = partes ? partes.join("\n") : texto;
  },

    // Formata a data para o padrão YYYY-MM-DD
    formatDateForInput(date) {
      if (!date) return "";
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async salvarPedidoEditado() {
      try {
        const pedidoEnviado = { ...this.pedidoTemp };
        const response = await pedidoService.updatePedido(pedidoEnviado.id, pedidoEnviado);

        if (response) {
          // Emite um evento para o componente pai recarregar a lista
          this.$emit("recarregarPedidos");
          this.fecharModal();
        } else {
          alert("Erro ao atualizar pedido.");
        }
      } catch (error) {
        console.error("Erro ao salvar pedido editado:", error);
        alert("Não foi possível salvar as alterações. Tente novamente.");
      }
    },


    fecharModal() {
      this.$emit("fechar");
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.6rem;
  font-weight: bold;
  color: #322871;
  text-align: center;
}

.form-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.form-group {
  width: 48%;
  margin-bottom: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 6px;
  font-size: 0.85rem;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
}

textarea {
  height: 70px;
}

button {
  cursor: pointer;
}

button[type="submit"] {
  background: #73ba60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 20px;
}

button[type="button"] {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 10px;
}

button:hover {
  opacity: 0.9;
}

button[type="submit"]:hover {
  background-color: #4a9e45;
}

button[type="button"]:hover {
  background-color: #c82333;
}

.btn-close {
  background: #322871;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 20px;
}

.btn-close:hover {
  background-color: #12283f;
}
</style>
