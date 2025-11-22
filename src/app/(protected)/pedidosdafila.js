import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';
import { PedidoContext } from '../../PedidoContext';
import BotaoVoltar from './botaovoltar';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function FilaPreparo() {
  const { categorias } = useContext(CategoriaContext);
  const { getFilaPreparoPorCategoria, loading, pedidosCompleto, atualizarStatusItemPedido } = useContext(PedidoContext);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [itensFila, setItensFila] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (categoriaSelecionada) {
      const carregarFila = async () => {
        setRefreshing(true);
        const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
        setItensFila(fila || []);
        setRefreshing(false);
      };
      carregarFila();
    }
  }, [categoriaSelecionada]);

  useEffect(() => {
    if (!categoriaSelecionada) return;
    const atualizar = async () => {
      setRefreshing(true);
      const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
      setItensFila(fila || []);
      setRefreshing(false);
    };
    atualizar();
  }, [pedidosCompleto]);

  const filtrarItensFila = (itens) => {
    if (!itens) return [];
    return itens.filter(item => item.status !== 'fechado');
  };

  const renderItemFila = ({ item }) => {
    const nome = item.nome_produto || item.nome || item.produto?.nome || 'Produto';
    const categoria = item.categoria_nome || item.nome_categoria || item.produto?.categoria_nome || null;
    const quantidade = item.quantidade ?? item.qtd ?? 1;
    const pedidoId = item.id_pedido ?? item.id_pedido_completo ?? item.pedido_id ?? null;
    const numeroMesa = item.numero_mesa ?? item.numero ?? item.mesa?.numero ?? null;
    const observacoes = item.observacoes ?? item.obs ?? item.pedido_observacoes ?? '';
    const status = item.status ?? 'pendente';

    let tempoTexto = '';
    const timestamp = item.data_abertura || item.created_at || item.createdAt || item.data || null;
    if (timestamp) {
      const then = new Date(timestamp);
      if (!isNaN(then)) {
        const diffMin = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000));
        tempoTexto = diffMin < 60 ? `${diffMin}m` : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
      }
    }

    const statusColor = status === 'em_preparo' ? '#FFA500' : status === 'entregue' ? '#007b00' : status === 'fechado' ? '#d32f2f' : '#6c757d';

    return (
      <View style={styles.itemBox}>
        <View style={styles.itemTopRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.quantLabelAbove}>Qtd</Text>
            <View style={styles.quantBadge}>
              <Text style={styles.quantText}>{quantidade}</Text>
            </View>
          </View>

          <View style={styles.itemCenter}>
            <Text style={styles.itemNome} numberOfLines={2}>{nome}</Text>
            {categoria ? <Text style={styles.itemCategoria}>{categoria}</Text> : null}
            {observacoes ? <Text style={styles.itemObs} numberOfLines={1}>{observacoes}</Text> : null}
          </View>

          <View style={styles.itemMeta}>
            {numeroMesa ? (
              <Text style={styles.metaTexto}>Mesa {numeroMesa}</Text>
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
          <View style={styles.actionsRow}>
            {status === 'aguardando' && (
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#f0ad4e' }]} onPress={() => atualizarStatusItemPedido(item.id_item, 'em_preparo')}>
                <Text style={styles.btnTexto}>Iniciar</Text>
              </TouchableOpacity>
            )}

            {status === 'em_preparo' && (
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#0275d8' }]} onPress={() => atualizarStatusItemPedido(item.id_item, 'pronto')}>
                <Text style={styles.btnTexto}>Finalizar</Text>
              </TouchableOpacity>
            )}

            {status === 'pronto' && (
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#5cb85c' }]} onPress={() => atualizarStatusItemPedido(item.id_item, 'entregue')}>
                <Text style={styles.btnTexto}>Entregar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>Carregando fila de preparo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BotaoVoltar destino="home" />
      </View>

      <View style={{ marginBottom: 28, marginTop: -8 }}>
        <Text style={styles.tituloCenteredUp}>Fila de Preparo</Text>
      </View>

      <View style={styles.categoriasRow}>
        {/*<TouchableOpacity style={styles.finalizadosBtnRow} onPress={() => router.push('/finalizados')}>
          <MaterialIcons name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.finalizadosText}>Finalizados</Text>
        </TouchableOpacity>*/}
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id_categoria.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContainer}
          style={styles.categoriasList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoriaBotao,
                categoriaSelecionada?.id_categoria === item.id_categoria && styles.categoriaSelecionada,
              ]}
              onPress={() => setCategoriaSelecionada(categoriaSelecionada?.id_categoria === item.id_categoria ? null : item)}
            >
              <Text style={[styles.categoriaTexto, categoriaSelecionada?.id_categoria === item.id_categoria && styles.categoriaTextoSelecionado]}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {categoriaSelecionada ? (
        <FlatList
          data={filtrarItensFila(itensFila)}
          keyExtractor={(item, index) => `${item.id_item || item.id_produto || index}`}
          renderItem={renderItemFila}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshing={refreshing}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum item na fila para esta categoria.</Text>
            </View>
          )}
          onRefresh={async () => {
            if (!categoriaSelecionada) return;
            setRefreshing(true);
            const fila = await getFilaPreparoPorCategoria(categoriaSelecionada.id_categoria);
            setItensFila(fila || []);
            setRefreshing(false);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Selecione uma categoria para ver os itens da fila.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004aad',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tituloCentered: {
    fontSize: 22,
    fontWeight: '700',
    color: '#004aad',
    textAlign: 'center',
    marginBottom: 8,
  },
  finalizadosBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  finalizadosText: {
    color: '#fff',
    fontWeight: '700'
  },
  categoriasContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
    height: 48,
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
  categoriasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  categoriasList: {
    flex: 1,
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6eefc',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemLeft: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantText: {
    color: '#004aad',
    fontWeight: '700'
  },
    quantLabelAbove: {
      marginBottom: 2,
      fontSize: 11,
      color: '#666',
      textAlign: 'center',
    },
  quantLabel: {
      display: 'none',
  },
    tituloCenteredUp: {
      fontSize: 22,
      fontWeight: '700',
      color: '#004aad',
      textAlign: 'center',
      marginBottom: 2,
      marginTop: 2,
    },
    finalizadosBtnRow: {
      backgroundColor: '#28a745',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      marginLeft: 10,
      marginTop: -11,
      marginRight: 8,
    },
  itemCenter: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
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
  itemBottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row'
  },
  btnAcao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
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
  emptyContainer: {
    padding: 24,
    alignItems: 'center'
  },
  emptyText: {
    color: '#666'
  },
  placeholderContainer: {
    padding: 20,
    alignItems: 'center'
  },
  placeholderText: {
    color: '#666'
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
