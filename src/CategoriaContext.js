import React, { createContext, useState } from 'react';

export const CategoriaContext = createContext();

export const CategoriaProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  // Função para adicionar várias categorias de uma vez
  const adicionarCategorias = (novasCategorias) => {
    // Garante que cada categoria tenha um id único
    const categoriasComId = novasCategorias.map((cat, index) => ({
      id: Date.now() + index,
      nome: cat.nome,
    }));
    setCategorias((prev) => [...prev, ...categoriasComId]);
  };

  const removerCategoria = (id) => {
    setCategorias((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <CategoriaContext.Provider
      value={{ categorias, adicionarCategorias, removerCategoria }}
    >
      {children}
    </CategoriaContext.Provider>
  );
};
