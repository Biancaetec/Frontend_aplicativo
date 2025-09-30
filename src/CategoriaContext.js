import React, { createContext, useState } from 'react';

export const CategoriaContext = createContext();

export const CategoriaProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  // Adicionar categoria
  const adicionarCategoria = (novaCategoria) => {
    setCategorias((prevCategorias) => [...prevCategorias, novaCategoria]);
  };

  // Editar categoria
  const editarCategoria = (index, categoriaAtualizada) => {
    const novasCategorias = [...categorias];
    novasCategorias[index] = categoriaAtualizada;
    setCategorias(novasCategorias);
  };

  // Remover categoria
  const removerCategoria = (index) => {
    const novasCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(novasCategorias);
  };

  return (
    <CategoriaContext.Provider
      value={{ categorias, adicionarCategoria, editarCategoria, removerCategoria }}
    >
      {children}
    </CategoriaContext.Provider>
  );
};
