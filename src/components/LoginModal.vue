<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>Login</h3>
        <label for="usuario">Usuário:</label>
        <input v-model="usuario" type="text" id="usuario" placeholder="Digite seu usuário" />
  
        <label for="senha">Senha:</label>
        <input v-model="senha" type="password" id="senha" placeholder="Digite sua senha" />
  
        <div class="modal-actions">
          <button @click="cancelar"  class="btn-cancel">Cancelar</button>
          <button @click="confirmarLogin" class="btn-confirm">Entrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from "sweetalert2";

  export default {
    data() {
      return {
        usuario: '',
        senha: '',
      };
    },
    methods: {
      cancelar() {
        this.$router.push("/");
        this.$emit("fechar"); // Fechar o modal
      },
    confirmarLogin() {
      // Definindo usuário e senha fixos
      const usuarioCorreto = 'admin';
      const senhaCorreta = 'rocha0506';

      // Verificando se os campos de usuário e senha correspondem aos valores fixos
      if (!this.usuario || !this.senha) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos vazios!',
          text: 'Por favor, preencha ambos os campos.',
          confirmButtonColor: '#412884',
          width: '80%',
          padding: '30px',
        });
        return;
      }

      if (this.usuario === usuarioCorreto && this.senha === senhaCorreta) {
        Swal.fire({
          icon: 'success',
          title: 'Login bem-sucedido!',
          text: 'Você será redirecionado.',
          confirmButtonColor: '#412884',
          width: '80%',
          padding: '30px',
        }).then(() => {
          this.$emit("fechar"); // Fechar o modal após o login
          this.$router.push("/CadastroPedido"); // Redireciona para a página principal
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Usuário ou senha incorretos!',
          confirmButtonColor: '#d33',
          width: '80%',
          padding: '30px',
        });
      }
    }
  }
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
  
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  @media (max-width: 480px) {
    .modal-content {
      width: 80%;
      padding: 20px;
    }
  }

  .custom-swal {
  max-width: 400px !important; /* Evita que fique muito grande */
  border-radius: 10px; /* Borda arredondada */
  font-size: 14px; /* Tamanho de fonte menor */
}
  </style>
  