import { createContext, useState, useMemo } from 'react';

export const PedidoContext = createContext();

export function PedidoProvider({ children }) {
  const [itensSelecionados, setItensSelecionados] = useState([]); 
  // Estrutura: [{ id_produto, nome, preco, quantidade, id_categoria, nome_categoria }]

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
        // Adiciona novo produto
        return [...prev, { ...produto, quantidade }];
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
    // Aqui futuramente podemos enviar para o backend ou apenas manter local
  };

  // ✅ Revisar pedido completo
  const revisarPedido = () => ({
    produtos: itensSelecionados.map(item => ({
      ...item,
      subtotal: calcularSubtotal(item)
    })),
    total: totalPedido
  });

  // 🧾 Agrupar produtos por categoria para exibir na tela de revisão
  const getResumoPedido = () => {
    const resumo = {};
    itensSelecionados.forEach(item => {
      const categoria = item.nome_categoria || `Categoria ${item.id_categoria}`;
      if (!resumo[categoria]) resumo[categoria] = [];
      resumo[categoria].push({
        ...item,
        subtotal: calcularSubtotal(item),
      });
    });
    return resumo;
  };

  // 💲 Obter total geral do pedido
  const getTotalPedido = () => totalPedido;

  // 🚀 Fechar pedido (futuramente integrará com o backend)
  const fecharPedido = () => {
    const pedido = revisarPedido();
    console.log('Pedido finalizado:', pedido);
    // Chamar API futuramente
  };

  return (
    <PedidoContext.Provider
      value={{
        itensSelecionados,
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
