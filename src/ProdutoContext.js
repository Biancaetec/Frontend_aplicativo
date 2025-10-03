import React, { createContext, useState } from 'react';

// Cria o contexto de produtos
export const ProdutoContext = createContext();

// Provider para envolver a aplicação e fornecer dados de produtos
export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]); // Armazena todos os produtos

  // Função para adicionar um novo produto
  const adicionarProduto = (produto) => {
    setProdutos(prev => [...prev, produto]); // Adiciona sem duplicar categorias
  };

  return (
    <ProdutoContext.Provider value={{ produtos, adicionarProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
};
