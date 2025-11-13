import { createContext, useState, useMemo } from 'react';

export const PedidoContext = createContext();

export function PedidoProvider({ children }) {
  const [itensSelecionados, setItensSelecionados] = useState([]);
  // Estrutura: [{ id_produto, nome, preco, quantidade, id_categoria, nome_categoria }]
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);

  // 🧩 Adiciona ou atualiza produto
  const adicionarProduto = (produto, quantidade) => {
    setItensSelecionados((prev) => {
      const existente = prev.find(item => item.id_produto === produto.id_produto);

      if (existente) {
        // Atualiza a quantidade
        return prev.map(item =>
          item.id_produto === produto.id_produto
            ? { ...item, quantidade }
            : item
        );
      } else {
        // Adiciona novo produto incluindo nome da categoria
        const nomeCategoria =
          produto.nome_categoria ||
          produto.categoria_nome || // caso venha com outro nome do back
          `Categoria ${produto.id_categoria}`;
        return [
          ...prev,
          { ...produto, quantidade, nome_categoria: nomeCategoria },
        ];
      }
    });
  };

  // 🗑️ Remover produto
  const removerProduto = (id_produto) => {
    setItensSelecionados(prev => prev.filter(item => item.id_produto !== id_produto));
  };

  // 💰 Calcular subtotal de cada item
  const calcularSubtotal = (item) => item.preco * item.quantidade;

  // 💵 Calcular total geral
  const totalPedido = useMemo(() => {
    return itensSelecionados.reduce((acc, item) => acc + calcularSubtotal(item), 0);
  }, [itensSelecionados]);

  // 🔖 Filtrar produtos por categoria
  const getProdutosPorCategoria = (id_categoria) => {
    return itensSelecionados.filter(item => item.id_categoria === id_categoria);
  };

  // 💾 Salvar categoria (não finaliza o pedido)
  const salvarCategoria = (id_categoria) => {
    const produtosDaCategoria = getProdutosPorCategoria(id_categoria);
    console.log('Produtos salvos da categoria:', produtosDaCategoria);
  };

  // ✅ Revisar pedido completo
  const revisarPedido = () => ({
    produtos: itensSelecionados.map(item => ({
      ...item,
      subtotal: calcularSubtotal(item),
    })),
    total: totalPedido,
  });

  // 🧾 Agrupar produtos por categoria para exibir na tela de revisão
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

  // 💲 Obter total geral do pedido
  const getTotalPedido = () => totalPedido;

  // 🚀 Finalizar pedido (usado ao confirmar)
  const fecharPedido = (mesaSelecionada) => {
    const pedido = revisarPedido();

    if (pedido.produtos.length === 0) {
      alert("Não há produtos no pedido para confirmar!");
      return;
    }

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      total: pedido.total,
      produtos: pedido.produtos,
      status: 'Aguardando preparo',
      numeroMesa: mesaSelecionada?.numero || "Desconhecida",
    };

    setPedidosFinalizados(prev => [...prev, novoPedido]);
    setItensSelecionados([]);
    console.log("Pedido finalizado:", novoPedido);
  };

  return (
    <PedidoContext.Provider
      value={{
        itensSelecionados,
        pedidosFinalizados,
        adicionarProduto,
        removerProduto,
        salvarCategoria,
        getProdutosPorCategoria,
        revisarPedido,
        fecharPedido,
        totalPedido,
        getResumoPedido,
        getTotalPedido,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}
