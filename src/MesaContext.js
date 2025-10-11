import { createContext, useState, useEffect } from 'react';

export const MesaContext = createContext();

export function MesaProvider({ children }) {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/api/mesa';

  const carregarMesas = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao carregar mesas: ${msg}`);
      }
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarMesa = async (numero) => {
    if (!numero || isNaN(Number(numero))) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          descricao: `Mesa ${numero}`,
          ocupada: false,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao criar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('Erro adicionarMesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const editarMesa = async (id_mesa, numero) => {
    if (!numero || isNaN(Number(numero))) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          descricao: `Mesa ${numero}`,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao atualizar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('Erro editarMesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const excluirMesa = async (id_mesa) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao deletar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('Erro excluirMesa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMesas();
  }, []);

  return (
    <MesaContext.Provider
      value={{
        mesas,
        carregarMesas,
        adicionarMesa,
        editarMesa,
        excluirMesa,
        loading,
      }}
    >
      {children}
    </MesaContext.Provider>
  );
}
