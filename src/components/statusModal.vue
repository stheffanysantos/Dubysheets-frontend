<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Atualizar Status</h3>
      <p>Pedido: {{ pedido?.produto || 'Desconhecido' }}</p>
      <label for="novoStatus">Atualizar o pedido para Entregue? </label>
      <select v-model="statusSelecionado" disabled>
        <option value="Entregue">ENTREGUE</option>
      </select>
      <div class="modal-actions">
        <button @click="$emit('fechar')" class="btn-cancel">Cancelar</button>
        <button @click="confirmarAtualizacao" class="btn-confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script>
// Importe o SweetAlert2
import Swal from 'sweetalert2';

export default {
  props: {
    pedido: Object,
  },
  data() {
    return {
      statusSelecionado: "Entregue", // O status será forçado para "Entregue"
    };
  },
  methods: {
async confirmarAtualizacao() {
  if (!this.pedido) {
    alert("Pedido não encontrado.");
    return;
  }

  // Exibe o SweetAlert2 para confirmação
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Você está prestes a marcar o pedido como ENTREGUE.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#412884',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, confirmar!',
    cancelButtonText: 'Cancelar',
  });

      if (result.isConfirmed) {
        // Se o usuário confirmar, emite o evento de atualização
        this.$emit("atualizarStatus", this.pedido.id, this.statusSelecionado);

        // Exibe o alerta de sucesso e fecha automaticamente após 2 segundos
        Swal.fire({
          title: 'Status Atualizado!',
          text: 'O pedido foi marcado como ENTREGUE.',
          icon: 'success',
          timer: 2000, // Alerta desaparecendo após 2 segundos
          showConfirmButton: false, // Remove o botão de confirmação
        }).then(() => {
          this.$emit('fechar'); // Fecha o modal automaticamente
        });
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.modal-actions {
  margin-top: 25px;
  margin-bottom: 20px;
  margin: 0 10px;
  display: flex;
  justify-content: space-between;
}

.btn-cancel {
  background-color: #d33;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #412884;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>
