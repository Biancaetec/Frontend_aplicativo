import { createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/Auth/useAuth.js';

export const PedidoContext = createContext();

export function PedidoProvider({ children }) {
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [pedidosCompleto, setPedidosCompleto] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  // ID do restaurante
  const id_restaurante = useMemo(() => user?.restaurante?.id_restaurante, [user]);

  const API_URL = 'https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/pedidocompleto';
  //const API_URL = 'https://special-invention-9769xr99qw56hx95x-3001.app.github.dev/api/pedidocompleto';
  /* ============================================================
     🧩 Adicionar / atualizar item no pedido
  ============================================================ */
  const adicionarProduto = (produto, quantidade) => {
    setItensSelecionados(prev => {
      const existente = prev.find(p => p.id_produto === produto.id_produto);

      if (existente) {
        return prev.map(item =>
          item.id_produto === produto.id_produto
            ? { ...item, quantidade }
            : item
        );
      }

      return [
        ...prev,
        {
          ...produto,
          quantidade,
          nome_categoria:
            produto.nome_categoria ||
            produto.categoria_nome ||
            `Categoria ${produto.id_categoria}`,
        },
      ];
    });
  };

  /* ============================================================
     🗑 Remover item
  ============================================================ */
  const removerProduto = (id_produto) => {
    setItensSelecionados(prev =>
      prev.filter(item => item.id_produto !== id_produto)
    );
  };

  /* ============================================================
     💰 Subtotal & total
  ============================================================ */
  const calcularSubtotal = (item) => item.preco * item.quantidade;

  const totalPedido = useMemo(() => {
    return itensSelecionados.reduce(
      (acc, item) => acc + calcularSubtotal(item),
      0
    );
  }, [itensSelecionados]);

  /* ============================================================
     📦 Agrupamento por categoria
  ============================================================ */
  const getResumoPedido = () => {
    const resumo = {};

    itensSelecionados.forEach(item => {
      const nomeCategoria =
        item.nome_categoria ||
        item.categoria_nome ||
        `Categoria ${item.id_categoria}`;

      if (!resumo[nomeCategoria]) resumo[nomeCategoria] = [];

      resumo[nomeCategoria].push({
        ...item,
        subtotal: calcularSubtotal(item),
      });
    });

    return resumo;
  };

  /* ============================================================
     🔎 Obter pedido formatado antes de enviar
  ============================================================ */
  const revisarPedido = () => ({
    produtos: itensSelecionados.map(item => ({
      ...item,
      subtotal: calcularSubtotal(item),
    })),
    total: totalPedido,
  });

  /* ============================================================
     🚀 Criar pedido completo (enviar ao backend)
  ============================================================ */
  const criarPedidoCompleto = async ({ numeroMesa, id_mesa, observacoes = null }) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');

    const pedido = revisarPedido();

    if (pedido.produtos.length === 0) {
      alert("Selecione ao menos 1 produto!");
      return;
    }

    const payload = {
      id_mesa: id_mesa,
      id_usuario: user?.restaurante?.id_usuario,
      observacoes: observacoes,
      valor_total: pedido.total,
      status: "pendente",
      tipo_preparo: "normal",

      itens: pedido.produtos.map(p => ({
        id_produto: p.id_produto,
        quantidade: p.quantidade,
        preco_unitario: p.preco,
        tipo_porção: "inteira",
        status: "aguardando"
      }))
    };

    setLoading(true);

    try {
      console.log("numeroMesa:", numeroMesa);
      console.log("user:", user);
      console.log("id_usuario (certo):", user?.restaurante?.id_usuario);
      console.log("PAYLOAD ENVIADO:", payload);
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      await carregarPedidosCompleto();
      setItensSelecionados([]);

    } catch (err) {
      console.error("[PedidoContext] criarPedidoCompleto:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     📥 Carregar todos pedidos completos
  ============================================================ */
  const carregarPedidosCompleto = async () => {
    if (authLoading || !id_restaurante) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?id_restaurante=${id_restaurante}`);
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setPedidosCompleto(data);

    } catch (err) {
      console.error("[PedidoContext] carregarPedidosCompleto:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     ❌ Excluir pedido completo
  ============================================================ */
  const excluirPedidoCompleto = async (id_pedido_completo) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id_pedido_completo}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      await carregarPedidosCompleto();

    } catch (err) {
      console.error("[PedidoContext] excluirPedidoCompleto:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  /* ============================================================
   🔄 Atualizar status do pedido
============================================================ */
  const atualizarStatusPedido = async (id_pedido, novoStatus) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/status/${id_pedido}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus })
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Recarregar lista após atualização
      await carregarPedidosCompleto();

    } catch (err) {
      console.error("[PedidoContext] atualizarStatusPedido:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
   🔄 Atualizar status de um ITEM do pedido
============================================================ */
  const atualizarStatusItemPedido = async (id_item, novoStatus) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/itempedido/status/${id_item}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus })
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Atualiza lista geral de pedidos
      await carregarPedidosCompleto();

    } catch (err) {
      console.error("[PedidoContext] atualizarStatusItemPedido:", err);
    } finally {
      setLoading(false);
    }
  };


  /* ============================================================
     ❌ Limpar todos os pedidos de uma mesa
  ============================================================ */
  const limparPedidosDaMesa = async (id_mesa) => {
    if (!id_restaurante) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/mesa/${id_mesa}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      await carregarPedidosCompleto();

    } catch (err) {
      console.error("[PedidoContext] limparPedidosDaMesa:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     📌 Buscar fila de preparo por categoria
  ============================================================ */
  const getFilaPreparoPorCategoria = async (id_categoria) => {
    if (!id_categoria) return [];

    try {
      setLoading(true);

      //const res = await fetch(
      //  `https://special-invention-9769xr99qw56hx95x-3001.app.github.dev/api/fila-preparo/${id_categoria}`
      //);

      const res = await fetch(
        `https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/fila-preparo/${id_categoria}`
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      return data; // retorna a lista de itens na fila da categoria específica

    } catch (err) {
      console.error("[PedidoContext] getFilaPreparoPorCategoria:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🔄 Requisição automática ao carregar
  ============================================================ */
  useEffect(() => {
    if (!authLoading && id_restaurante) {
      carregarPedidosCompleto();
    }
  }, [authLoading, id_restaurante]);

  if (authLoading) return null;

  return (
    <PedidoContext.Provider
      value={{
        itensSelecionados,
        pedidosCompleto,
        loading,
        adicionarProduto,
        removerProduto,
        revisarPedido,
        totalPedido,
        getResumoPedido,
        criarPedidoCompleto,
        carregarPedidosCompleto,
        excluirPedidoCompleto,
        atualizarStatusPedido,
        atualizarStatusItemPedido,
        limparPedidosDaMesa,
        getFilaPreparoPorCategoria,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}
