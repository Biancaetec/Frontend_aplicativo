import React, { createContext, useState } from 'react';

export const MesaContext = createContext();

export const MesaProvider = ({ children }) => {
  const [mesas, setMesas] = useState([]);

  const adicionarMesa = (novaMesa) => {
    setMesas(prev => [...prev, novaMesa]);
  };

  const removerMesa = (numero) => {
    setMesas(prev => prev.filter(m => m.numero !== numero));
  };


  return (
    <MesaContext.Provider value={{ mesas, adicionarMesa, removerMesa }}>
      {children}
    </MesaContext.Provider>
  );
};