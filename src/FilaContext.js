//não está usando

import React, { createContext, useState } from 'react';

// Cria o contexto das filas de preparo
export const FilaContext = createContext();

export const FilaProvider = ({ children }) => {
  const [filas, setFilas] = useState([]);

  // Função para adicionar uma nova fila
  const adicionarFila = (novaFila) => {
    // Gera um id único usando timestamp
    const filaComId = { ...novaFila, id: Date.now() };
    setFilas(prev => [...prev, filaComId]);
  };

  // Função para remover uma fila pelo id
  const removerFila = (id) => {
    setFilas(prev => prev.filter(f => f.id !== id));
  };

  return (
    <FilaContext.Provider value={{ filas, adicionarFila, removerFila }}>
      {children}
    </FilaContext.Provider>
  );
};
