<template>
    <footer class="footer">
      <div class="footer-content">
        <p>Desenvolvido por <a href="https://www.seusite.com" target="_blank" rel="noopener noreferrer">Duby Inteligência e Organização Empresarial</a></p>
        <p>&copy; {{ currentYear }} - <a href="mailto:contato@exemplo.com">51.615.629/0001-87 | Contato: contato@duby.com.br</a></p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentYear: new Date().getFullYear(),  
      };
    },
  };
  </script>
  
  <style scoped>
  
  @import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);
  
  .footer {
    background-color: #412884;
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 1rem;
    position: relative;
    bottom: 0;
    width: 100%;
    font-family: Nunito, Arial, Helvetica, sans-serif;
  }
  
  .footer-content a {
    color: white;  
    text-decoration: none;
  }
  
  .footer-content a:hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
  .footer {
    padding: 10px;
    font-size: 0.85rem;
  }

  .footer-content {
    gap: 3px;
  }

  .footer-content p {
    margin: 5px 0;
  }

  .footer-content a {
    display: block; /* Faz os links ficarem em linhas separadas */
    font-size: 0.9rem;
  }
}
  </style>
  
  
  