import React, { createContext, useState } from 'react';

export const MesaContext = createContext();

export const MesaProvider = ({ children }) => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/api/mesa';

  // ================= BUSCAR MESAS =================
  const buscarMesas = async () => {
    try {
      const response = await fetch(baseUrl);
      const data = await response.json();
      setMesas(data);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
    }
  };

  // ================= ADICIONAR MESA =================
  const adicionarMesa = async (numero) => {
    try {
      setLoading(true);
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          descricao: `Mesa ${numero}`,
          id_restaurante: 1,
          ocupada: false,
        }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar mesa');
      await buscarMesas(); // Atualiza a lista
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDITAR MESA =================
  const editarMesa = async (id_mesa, numero, ocupada) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${id_mesa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: Number(numero), ocupada }),
      });
      if (!response.ok) throw new Error('Erro ao editar mesa');
      await buscarMesas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= EXCLUIR MESA =================
  const excluirMesa = async (id_mesa) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${id_mesa}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir mesa');
      await buscarMesas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MesaContext.Provider
      value={{ mesas, adicionarMesa, editarMesa, excluirMesa, buscarMesas, loading }}
    >
      {children}
    </MesaContext.Provider>
  );
};
