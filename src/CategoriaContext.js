import React, { createContext, useState } from 'react';

export const CategoriaContext = createContext();

export const CategoriaProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  const adicionarCategorias = (novasCategorias) => {
    setCategorias(prev => [...prev, ...novasCategorias]);
  };

  return (
    <CategoriaContext.Provider value={{ categorias, adicionarCategorias }}>
      {children}
    </CategoriaContext.Provider>
  );
};