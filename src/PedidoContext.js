// PedidoContext.js
import React, { createContext, useState, useMemo } from "react";
import { Alert } from "react-native";

export const PedidoContext = createContext();

// Ajuste aqui para apontar pro seu backend (inclui /api)
const API_BASE = "http://SEU_BACKEND:3333/api";

export function PedidoProvider({ children }) {
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [categoriasSalvas, setCategoriasSalvas] = useState([]);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]); // cache local opcional
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Operações locais
  // -------------------------
  const adicionarProduto = (produto, quantidade) => {
    setItensSelecionados(prev => {
      const existente = prev.find(i => i.id_produto === produto.id_produto);
      if (existente) {
        return prev.map(i =>
          i.id_produto === produto.id_produto ? { ...i, quantidade } : i
        );
      }
      return [...prev, { ...produto, quantidade }];
    });
  };

  const removerProduto = (id_produto) => {
    setItensSelecionados(prev => prev.filter(i => i.id_produto !== id_produto));
  };

  const calcularSubtotal = item => Number((item.preco * item.quantidade) || 0);

  const totalPedido = useMemo(
    () => itensSelecionados.reduce((acc, it) => acc + calcularSubtotal(it), 0),
    [itensSelecionados]
  );

  const getResumoPedido = () => {
    const resumo = {};
    itensSelecionados.forEach(item => {
      const cat = item.nome_categoria || item.categoria_nome || "Outros";
      if (!resumo[cat]) resumo[cat] = [];
      resumo[cat].push({ ...item, subtotal: calcularSubtotal(item) });
    });
    return resumo;
  };

  const salvarCategoria = (id_categoria) => {
    setCategoriasSalvas(prev => (prev.includes(id_categoria) ? prev : [...prev, id_categoria]));
  };

  const getTotalPedido = () => totalPedido;

  // -------------------------
  // BACKEND
  // -------------------------
  // Cria pedido + itens em uma única chamada
  const criarPedidoNoBackend = async ({ mesaId, usuarioId, restauranteId, tipo_preparo = "normal", observacoes = "" }) => {
    if (itensSelecionados.length === 0) {
      Alert.alert("Pedido vazio", "Adicione ao menos um produto antes de confirmar.");
      return null;
    }

    const payload = {
      id_mesa: mesaId ?? null,
      id_usuario: usuarioId ?? null,
      id_restaurante: restauranteId ?? null,
      status: "pendente",
      tipo_preparo,
      valor_total: Number(totalPedido.toFixed(2)),
      observacoes,
      itens: itensSelecionados.map(i => ({
        id_produto: i.id_produto ?? null,
        nome_produto: i.nome || i.nome_produto || null,
        quantidade: i.quantidade,
        preco_unitario: Number(i.preco),
        id_categoria: i.id_categoria ?? null
      }))
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        console.error("Erro criar pedido:", body);
        Alert.alert("Erro", body.message || "Falha ao criar pedido");
        return null;
      }

      // Limpa estado local após criação
      setItensSelecionados([]);
      setCategoriasSalvas([]);
      // Atualiza cache local (opcional)
      const novoPedidoLocal = {
        id: body.id_pedido ?? body.id ?? null,
        data: new Date().toLocaleString(),
        total: payload.valor_total,
        produtos: payload.itens,
        status: payload.status,
        numeroMesa: mesaId
      };
      setPedidosFinalizados(prev => [novoPedidoLocal, ...prev]);

      return body.id_pedido ?? body.id ?? null;
    } catch (error) {
      console.error("Erro conectar backend:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar pedidos de uma mesa (retorna array de pedidos com itens)
  const buscarPedidosPorMesa = async (mesaId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/mesa/${mesaId}/pedidos`);
      const body = await res.json();
      if (!res.ok) {
        console.error("Erro buscar pedidos:", body);
        return [];
      }
      return body;
    } catch (error) {
      console.error("Erro buscar pedidos:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido
  const atualizarStatusPedido = async (id_pedido, novoStatus) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pedido/${id_pedido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
      });
      const body = await res.json();
      if (!res.ok) {
        console.error("Erro atualizar status:", body);
        return false;
      }
      // Atualiza cache local
      setPedidosFinalizados(prev => prev.map(p => (p.id === id_pedido ? { ...p, status: novoStatus } : p)));
      return true;
    } catch (error) {
      console.error("Erro atualizar status:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Exports
  // -------------------------
  return (
    <PedidoContext.Provider value={{
      itensSelecionados,
      categoriasSalvas,
      pedidosFinalizados,
      loading,
      adicionarProduto,
      removerProduto,
      calcularSubtotal,
      totalPedido,
      getResumoPedido,
      salvarCategoria,
      getTotalPedido,
      criarPedidoNoBackend,
      buscarPedidosPorMesa,
      atualizarStatusPedido,
      setItensSelecionados,
      setPedidosFinalizados
    }}>
      {children}
    </PedidoContext.Provider>
  );
}
