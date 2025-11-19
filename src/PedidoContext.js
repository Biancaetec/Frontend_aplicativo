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

  //const API_URL = 'https://automatic-train-wrvv54w5wg9whv455-3001.app.github.dev/api/pedido';
  const API_URL = 'https://special-invention-9769xr99qw56hx95x-3001.app.github.dev/api/pedidocompleto';

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
  const criarPedidoCompleto = async ({ numeroMesa, id_mesa }) => {
    if (!id_restaurante) throw new Error('Usuário não autenticado');

    const pedido = revisarPedido();

    if (pedido.produtos.length === 0) {
      alert("Selecione ao menos 1 produto!");
      return;
    }

    const payload = {
      id_mesa: id_mesa,
      id_usuario: user?.restaurante?.id_usuario,
      observacoes: null,
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
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}
