import React, { createContext, useState } from 'react';

// Contexto
export const AdicionalContext = createContext();

// Provider
export const AdicionalProvider = ({ children }) => {
  const [adicionais, setAdicionais] = useState([]);

  const adicionarAdicional = (novoAdicional) => {
    setAdicionais((prev) => [...prev, novoAdicional]);
  };

  const editarAdicional = (index, adicionalAtualizado) => {
    const novos = [...adicionais];
    novos[index] = adicionalAtualizado;
    setAdicionais(novos);
  };

  const removerAdicional = (index) => {
    setAdicionais((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AdicionalContext.Provider
      value={{ adicionais, adicionarAdicional, editarAdicional, removerAdicional }}
    >
      {children}
    </AdicionalContext.Provider>
  );
};
