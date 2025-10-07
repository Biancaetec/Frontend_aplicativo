import React, { createContext, useState, useEffect } from 'react';

export const MesaContext = createContext();

export function MesaProvider({ children }) {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/api/mesa';

  // Listar mesas
  const carregarMesas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    }
  };

  // Adicionar mesa
  const adicionarMesa = async (numero) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          descricao: `Mesa ${numero}`,
          id_restaurante: 1,
          ocupada: false,
        }),
      });
      if (!res.ok) throw new Error('Erro ao criar mesa');
      await carregarMesas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Editar mesa
  const editarMesa = async (id_mesa, numero, ocupada) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          ocupada,
        }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar mesa');
      await carregarMesas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Excluir mesa
  const excluirMesa = async (id_mesa) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar mesa');
      await carregarMesas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMesas();
  }, []);

  return (
    <MesaContext.Provider value={{ mesas, carregarMesas, adicionarMesa, editarMesa, excluirMesa, loading }}>
      {children}
    </MesaContext.Provider>
  );
}
