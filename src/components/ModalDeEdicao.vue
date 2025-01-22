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
              <option value="Pendente">PENDENTE</option>
              <option value="Entregue">ENTREGUE</option>
              <option value="Cancelado">CANCELADO</option>
              <option value="Retirar no local">RETIRAR NO LOCAL</option>
            </select>
          </div>

          <div class="form-group">
            <label for="turno">Turno:</label>
            <select id="turno" v-model="pedidoTemp.turno" required>
              <option value="manha">MANHÃ</option>
              <option value="tarde">TARDE</option>
            </select>
          </div>

          <div class="form-group">
            <label for="observacao">Observação:</label>
            <textarea id="observacao" v-model="pedidoTemp.observacao" placeholder="Opcional" @input="quebrarLinha"></textarea>
          </div>

          <div class="form-group">
            <label for="previsao">Previsão:</label>
            <input type="date" id="previsao" v-model="pedidoTemp.previsao" />
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
import Swal from "sweetalert2";

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
          // Exibe o SweetAlert2 de sucesso
          Swal.fire({
            title: 'Pedido Atualizado!',
            text: 'As alterações no pedido foram salvas com sucesso.',
            icon: 'success',
            timer: 2000, // O alerta desaparece automaticamente após 2 segundos
            showConfirmButton: false, // Remove o botão de confirmação
          }).then(() => {
            // Emite o evento para o componente pai recarregar a lista de pedidos
            this.$emit("atualizarPedidos");  // Garantir que o evento de recarregamento seja disparado
            this.fecharModal(); // Fecha o modal automaticamente após o alerta
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível atualizar o pedido.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Erro ao salvar pedido editado:", error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível salvar as alterações. Tente novamente.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
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
  width: 100%; /* Faz os botões ocuparem 100% da largura do contêiner */
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 10px;
}

button[type="submit"] {
  background: #73ba60;
  color: white;
  border: none;
}

button[type="button"] {
  background: #dc3545;
  color: white;
  border: none;
}

button[type="submit"]:hover {
  background-color: #4a9e45;
}

button[type="button"]:hover {
  background-color: #c82333;
}

button:hover {
  opacity: 0.9;
}

.btn-close {
  background: #322871;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 20px;
  width: 91%; /* Faz o botão de fechar ocupar 100% da largura do contêiner */
}

.btn-close:hover {
  background-color: #322871;
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .button-container {
    flex-direction: column;
  }

  .btn {
    width: 90%;
  }
}
</style>
