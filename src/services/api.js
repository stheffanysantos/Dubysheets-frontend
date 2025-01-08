import axios from "axios";



const API_BASE_URL = "https://dubyapp.com.br/api/pedidos";

const pedidoService = {

  async getPedidos() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error.response?.data || error.message);
      throw error;
    }
  },


  async addPedido(pedido) {
    try {
      const response = await axios.post(API_BASE_URL, pedido);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pedido:", error.response?.data || error.message);
      throw error;
    }
  },

 
  async updatePedido(id, pedidoAtualizado) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, pedidoAtualizado);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error.response?.data || error.message);
      throw error;
    }
  },

  
  async deletePedido(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir pedido:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default pedidoService;
