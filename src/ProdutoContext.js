// import { createContext, useState, useEffect, useMemo } from 'react';
// import { useAuth } from './hooks/Auth/useAuth.js';

// export const ProdutoContext = createContext();

// export function ProdutoProvider({ children }) {
//   const [produtos, setProdutos] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { user, loading: authLoading } = useAuth();

//   // ID do restaurante
//   const id_restaurante = useMemo(() => user?.restaurante?.id_restaurante, [user]);

//   // console.log("Hook restaurante: ", id_restaurante);

//   const API_URL = 'https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/produto';

//   // Carregar produtos
//   const carregarProdutos = async () => {
//   if (authLoading || !id_restaurante) return;
//   setLoading(true);
//   try {
//     // ⚡ Passando id_restaurante como param na URL
//     const res = await fetch(`${API_URL}/${id_restaurante}`);
//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Erro ao carregar produtos: ${text}`);
//     }
//     const data = await res.json();
//     setProdutos(data);
//   } catch (error) {
//     console.error('[ProdutoContext] carregarProdutos:', error);
//   } finally {
//     setLoading(false);
//   }
// };

//   // Adicionar produto
//   // const adicionarProduto = async ({ nome, preco, id_categoria, descricao, imagem, id_restaurante }) => {
//   const adicionarProduto = async ({ nome, preco, categoria, descricao, imagem, tipo_preparo, id_categoria, ativo }) => {
    
//     // console.log("🔹 Adicionando produto para restaurante ID:", id_restaurante);
//     if (!id_restaurante) throw new Error('Usuário não autenticado');
//     console.log("🔹 Dados do novo produto Context:", { nome, preco, categoria, descricao, imagem, id_restaurante, id_categoria });
//     setLoading(true);
//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           nome,
//           preco,
//           categoria,
//           descricao,
//           imagem,
//           id_restaurante,
//           tipo_preparo,
//           id_categoria,
//           ativo
//         }),
//       });
//       //if (!res.ok) throw new Error(await res.text());
//       if (!res.ok) throw new Error(await res.text());
//       await carregarProdutos();
//     } catch (error) {
//       console.error('[ProdutoContext] adicionarProduto:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Editar produto
//   const editarProduto = async (id_produto, dadosAtualizados) => {
//   if (!id_restaurante) throw new Error('Usuário não autenticado');
//   setLoading(true);
//   try {
//     const res = await fetch(`${API_URL}/${id_produto}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ...dadosAtualizados, id_restaurante }),
//     });

//     if (!res.ok) throw new Error(await res.text());
//     await carregarProdutos();
//   } catch (error) {
// console.error('[ProdutoContext] editarProduto => ERRO COMPLETO:', JSON.stringify(error));
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };


//   // Excluir produto
//   const excluirProduto = async (id_produto) => {
//     if (!id_restaurante) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/${id_produto}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error(await res.text());
//       await carregarProdutos();
//     } catch (error) {
//       console.error('[ProdutoContext] excluirProduto:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//     // Filtrar produtos por categoria (sem refazer requisição)
//   const carregarProdutosPorCategoria = (id_categoria) => {
//     if (!produtos || produtos.length === 0) return [];
//     return produtos.filter(
//       (p) => p.id_categoria === Number(id_categoria)
//     );
//   };

//   // Atualiza produtos quando o usuário é carregado
//   useEffect(() => {
//     if (!authLoading && id_restaurante) {
//       carregarProdutos();
//     }
//   }, [authLoading, id_restaurante]);

//   if (authLoading) return null;

//    return (
//     <ProdutoContext.Provider
//       value={{
//         produtos,
//         carregarProdutos,
//         carregarProdutosPorCategoria, // 🔹 adiciona aqui
//         adicionarProduto,
//         editarProduto,
//         excluirProduto,
//         loading,
//         id_restaurante,
//       }}
//     >
//       {children}
//     </ProdutoContext.Provider>
//   );
// }
import { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/Auth/useAuth.js';

export const ProdutoContext = createContext();

export function ProdutoProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  // ID do restaurante
  const id_restaurante = useMemo(() => user?.restaurante?.id_restaurante, [user]);

  const API_URL = 'https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/produto';
  //const API_URL = 'https://special-invention-9769xr99qw56hx95x-3001.app.github.dev/api/produto';

  // 🔹 Carregar produtos filtrando pelo restaurante
  const carregarProdutos = async () => {
    if (authLoading || !id_restaurante) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_restaurante}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao carregar produtos: ${text}`);
      }
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error('[ProdutoContext] carregarProdutos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Adicionar produto
  const adicionarProduto = async ({
    nome,
    preco,
    categoria,
    descricao,
    imagem = null, // imagem agora é opcional
    tipo_preparo,
    id_categoria,
    ativo = 1
  }) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          preco,
          categoria,
          descricao,
          imagem, // permite null
          id_restaurante,
          tipo_preparo,
          id_categoria,
          ativo
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await carregarProdutos();
    } catch (error) {
      console.error('[ProdutoContext] adicionarProduto:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Editar produto
  const editarProduto = async (id_produto, dadosAtualizados) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_produto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dadosAtualizados, id_restaurante }),
      });
      if (!res.ok) throw new Error(await res.text());
      await carregarProdutos();
    } catch (error) {
      console.error('[ProdutoContext] editarProduto:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir produto
  const excluirProduto = async (id_produto) => {
    if (!id_restaurante) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_produto}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await carregarProdutos();
    } catch (error) {
      console.error('[ProdutoContext] excluirProduto:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtrar produtos por categoria (sem refazer requisição)
  const carregarProdutosPorCategoria = (id_categoria) => {
    if (!produtos || produtos.length === 0) return [];
    return produtos.filter((p) => p.id_categoria === Number(id_categoria));
  };

  // 🔹 Atualiza produtos quando o usuário é carregado
  useEffect(() => {
    if (!authLoading && id_restaurante) {
      carregarProdutos();
    }
  }, [authLoading, id_restaurante]);

  if (authLoading) return null;

  return (
    <ProdutoContext.Provider
      value={{
        produtos,
        carregarProdutos,
        carregarProdutosPorCategoria,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        loading,
        id_restaurante,
      }}
    >
      {children}
    </ProdutoContext.Provider>
  );
}
