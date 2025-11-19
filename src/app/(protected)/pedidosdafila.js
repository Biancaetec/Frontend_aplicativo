import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';  // Contexto das categorias
import { PedidoContext } from '../../PedidoContext';  // Contexto dos pedidos
import BotaoVoltar from './botaovoltar';

export default function FilaPreparo() {
  const { categorias } = useContext(CategoriaContext);  // Obter categorias
  const { getFilaPreparoPorCategoria, loading, pedidosCompleto } = useContext(PedidoContext);  // Função para buscar fila de preparo por categoria
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [itensFila, setItensFila] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar a fila de preparo quando a categoria for selecionada
  useEffect(() => {
    if (categoriaSelecionada) {
      const carregarFila = async () => {
        setRefreshing(true);
        const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
        setItensFila(fila);
        setRefreshing(false);
      };

      carregarFila();
    }
  }, [categoriaSelecionada]);

  // Recarrega automaticamente a fila se os pedidos completos mudarem (ex.: status atualizado em outra tela)
  useEffect(() => {
    if (!categoriaSelecionada) return;
    const atualizar = async () => {
      setRefreshing(true);
      const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
      setItensFila(fila);
      setRefreshing(false);
    };

    atualizar();
  }, [pedidosCompleto]);

  // Filtra os itens da fila com status "aguardando", "em_preparo" ou "pronto"
  const filtrarItensFila = (itens) => {
    return itens.filter(item => 
      item.status !== "fechado"  // Exclui os itens com status fechado
    );
  };

  // Exibe a fila de preparo de forma agrupada por categoria
  const renderItemFila = ({ item, index }) => {
    // Extrair campos comuns (com safety checks)
    const nome = item.nome_produto || item.nome || item.produto?.nome || 'Produto';
    const categoria = item.categoria_nome || item.nome_categoria || item.produto?.categoria_nome || null;
    const quantidade = item.quantidade ?? item.qtd ?? 1;
    const pedidoId = item.id_pedido ?? item.id_pedido_completo ?? item.pedido_id ?? null;
    const numeroMesa = item.numero_mesa ?? item.numero ?? item.mesa?.numero ?? null;
    const observacoes = item.observacoes ?? item.obs ?? item.pedido_observacoes ?? '';
    const status = item.status ?? 'pendente';

    // Calcular tempo desde abertura/criação (em minutos) se houver timestamp
    let tempoTexto = '';
    const timestamp = item.data_abertura || item.created_at || item.createdAt || item.data || null;
    if (timestamp) {
      const then = new Date(timestamp);
      if (!isNaN(then)) {
        const diffMin = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000));
        tempoTexto = diffMin < 60 ? `${diffMin}m` : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
      }
    }

    // Cor do badge baseado no status
    const statusColor = status === 'em_preparo' ? '#FFA500' : status === 'entregue' ? '#007b00' : status === 'fechado' ? '#d32f2f' : '#6c757d';

    return (
      <View style={styles.itemBox}>
        <View style={styles.itemTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemNome}>{nome}</Text>
            {categoria ? <Text style={styles.itemCategoria}>{categoria}</Text> : null}
            {observacoes ? <Text style={styles.itemObs} numberOfLines={1}>{observacoes}</Text> : null}
          </View>

          <View style={styles.itemMeta}>
            {numeroMesa ? (
              <Text style={styles.metaTexto}>Mesa = {numeroMesa}</Text>
            ) : (
              pedidoId ? <Text style={styles.metaTexto}>Pedido #{pedidoId}</Text> : null
            )}
            {tempoTexto ? <Text style={styles.tempoTexto}>{tempoTexto}</Text> : null}
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}> 
              <Text style={styles.statusBadgeText}>{status.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemBottomRow}>
          <Text style={styles.itemQuantidade}>Quantidade: <Text style={{ fontWeight: '700' }}>{quantidade}</Text></Text>
        </View>
      </View>
    );
  };

  // Caso esteja carregando, exibe o indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#030274ff" />
        <Text style={styles.loadingText}>Carregando fila de preparo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BotaoVoltar destino="home" />
      <View style={styles.tituloRow}>
        <Text style={styles.titulo}>Fila de Preparo</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={async () => {
          if (!categoriaSelecionada) return;
          setRefreshing(true);
          const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
          setItensFila(fila);
          setRefreshing(false);
        }}>
          <Text style={styles.refreshText}>{refreshing ? 'Atualizando...' : 'Atualizar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de categorias */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id_categoria.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaBotao,
              categoriaSelecionada?.id_categoria === item.id_categoria &&
              styles.categoriaSelecionada,
            ]}
            onPress={() =>
              setCategoriaSelecionada(
                categoriaSelecionada?.id_categoria === item.id_categoria
                  ? null
                  : item
              )
            }
          >
            <Text
              style={[
                styles.categoriaTexto,
                categoriaSelecionada?.id_categoria === item.id_categoria &&
                styles.categoriaTextoSelecionado,
              ]}
            >
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Exibição dos itens filtrados da fila de preparo */}
      {categoriaSelecionada && (
        <FlatList
  data={filtrarItensFila(itensFila)}
  keyExtractor={(item, index) => `${item.id_produto}-${index}`} // Combinando id_produto com o índice
  renderItem={renderItemFila}
  contentContainerStyle={{ paddingBottom: 20 }}
  refreshing={refreshing}
  onRefresh={async () => {
    if (!categoriaSelecionada) return;
    setRefreshing(true);
    const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
    setItensFila(fila);
    setRefreshing(false);
  }}
/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    textAlign: 'center',
    marginBottom: 16,
  },
  categoriasContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
    height: 45,
  },
  categoriaBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  categoriaSelecionada: {
    backgroundColor: '#004aad',
  },
  categoriaTexto: {
    color: '#004aad',
    fontWeight: '600',
    fontSize: 15,
  },
  categoriaTextoSelecionado: {
    color: '#fff',
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce3f0',
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemStatus: {
    fontSize: 14,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#004aad',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemMeta: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  metaTexto: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  tempoTexto: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  itemCategoria: {
    fontSize: 13,
    color: '#0066cc',
    marginTop: 4,
  },
  itemObs: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
  },
  itemBottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantidade: {
    fontSize: 14,
    color: '#333',
  },
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: '#e6eefc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c6ddfb',
  },
  refreshText: {
    color: '#004aad',
    fontWeight: '700',
  },
});
