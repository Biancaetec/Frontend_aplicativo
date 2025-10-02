import React, { createContext, useState } from 'react';

export const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);

  const adicionarProduto = ({ nome, categoriaId }) => {
    if (!nome || !categoriaId) return;

    const novoProduto = {
      id: Date.now().toString(),
      nome,
      categoriaId,
    };

    setProdutos([...produtos, novoProduto]);
  };

  return (
    <ProdutoContext.Provider value={{ produtos, adicionarProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
};
