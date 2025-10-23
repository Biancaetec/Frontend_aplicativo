import { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/Auth/useAuth.js';

export const MesaContext = createContext();

export function MesaProvider({ children }) {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();


  // 🔹 ID do restaurante
  const id_restaurante = useMemo(() => user?.restaurante?.id_restaurante, [user]);
  console.log('🔹 id_restaurante:', id_restaurante);

  const API_URL = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/api/mesa';

  // 🔹 Carregar mesas
  const carregarMesas = async () => {
    if (authLoading) return;
    if (!id_restaurante) {
      console.warn('[MesaContext] ID do restaurante não encontrado. Usuário precisa estar logado.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?id_restaurante=${id_restaurante}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao carregar mesas: ${msg}`);
      }
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error('[MesaContext] carregarMesas:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Adicionar mesa
  const adicionarMesa = async (numero) => {
    if (!id_restaurante) {
      console.error('[MesaContext] Não é possível adicionar mesa. Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: Number(numero),
          descricao: `Mesa ${numero}`,
          ocupada: false,
          id_restaurante,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao adicionar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('[MesaContext] adicionarMesa:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Editar mesa
  const editarMesa = async (id_mesa, numero) => {
    if (!id_restaurante) {
      console.error('[MesaContext] Não é possível editar mesa. Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }
    if (!id_mesa) {
      console.error('[MesaContext] Nenhuma mesa selecionada para edição.');
      throw new Error('Nenhuma mesa selecionada');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: Number(numero), descricao: `Mesa ${numero}` }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao editar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('[MesaContext] editarMesa:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir mesa
  const excluirMesa = async (id_mesa) => {
    if (!id_restaurante) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_mesa}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao deletar mesa: ${msg}`);
      }
      await carregarMesas();
    } catch (error) {
      console.error('[MesaContext] excluirMesa:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualiza mesas quando usuário é carregado
  useEffect(() => {
    if (!authLoading && id_restaurante) {
      carregarMesas();
    }
  }, [authLoading, id_restaurante]);

  if (authLoading) return null;

  return (
    <MesaContext.Provider
      value={{
        mesas,
        carregarMesas,
        adicionarMesa,
        editarMesa,
        excluirMesa,
        loading,
        id_restaurante,
      }}
    >
      {children}
    </MesaContext.Provider>
  );
}
