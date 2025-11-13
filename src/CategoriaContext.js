import { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/Auth/useAuth.js';

export const CategoriaContext = createContext();

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  // ID do restaurante
  const id_restaurante = useMemo(() => user?.restaurante?.id_restaurante, [user]);

  const API_URL = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/api/categoria';

  // Carregar categorias
  const carregarCategorias = async () => {
    if (authLoading || !id_restaurante) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?id_restaurante=${id_restaurante}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCategorias(data);

      // console.log("🔹 Categorias carregadas:", data);
    } catch (error) {
      console.error('[CategoriaContext] carregarCategorias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar categoria
  const adicionarCategoria = async ({ nome }) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, id_restaurante }),
      });
      if (!res.ok) throw new Error(await res.text());
      await carregarCategorias();
    } catch (error) {
      console.error('[CategoriaContext] adicionarCategoria:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Editar categoria (corrigido: inclui id_restaurante)
  const editarCategoria = async (id_categoria, nome) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_categoria}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, id_restaurante }), // <-- Corrigido
      });
      if (!res.ok) throw new Error(await res.text());
      await carregarCategorias();
    } catch (error) {
      console.error('[CategoriaContext] editarCategoria:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Excluir categoria
  const excluirCategoria = async (id_categoria) => {
    if (!id_restaurante) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_categoria}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await carregarCategorias();
    } catch (error) {
      console.error('[CategoriaContext] excluirCategoria:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualiza categorias quando usuário é carregado
  useEffect(() => {
    if (!authLoading && id_restaurante) {
      carregarCategorias();
    }
  }, [authLoading, id_restaurante]);

  if (authLoading) return null;

  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        carregarCategorias,
        adicionarCategoria,
        editarCategoria,
        excluirCategoria,
        loading,
        id_restaurante,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
}
