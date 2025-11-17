// VisualizarMesa.jsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { PedidoContext } from '../../PedidoContext';
import { MesaContext } from '../../MesaContext';

export default function VisualizarMesa() {
  const router = useRouter();
  const { mesaSelecionada } = useContext(MesaContext);
  const { buscarPedidosPorMesa, loading } = useContext(PedidoContext);
  const [pedidosMesa, setPedidosMesa] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);

  const carregar = async () => {
    if (!mesaSelecionada) return;
    setCarregandoPedidos(true);
    const dados = await buscarPedidosPorMesa(mesaSelecionada?.id_mesa ?? mesaSelecionada?.id);
    // Espera-se que 'dados' seja array de pedidos, cada pedido com campo 'itens' ou 'itens' equivalente
    // Normaliza para o formato que a UI espera
    const normalizados = (dados || []).map(p => ({
      id: p.id_pedido ?? p.id,
      data: p.data_abertura ?? p.created_at ?? '',
      total: Number(p.valor_total ?? p.total ?? 0),
      produtos: p.itens ?? p.itens_pedido ?? p.produtos ?? [],
      status: p.status ?? 'pendente'
    }));
    setPedidosMesa(normalizados);
    setCarregandoPedidos(false);
  };

  useEffect(() => {
    carregar();
  }, [mesaSelecionada]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mesa {mesaSelecionada?.numero}</Text>

      {carregandoPedidos || loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#004aad" />
          <Text style={{ marginTop: 10, color: '#004aad' }}>Carregando pedidos...</Text>
        </View>
      ) : pedidosMesa.length === 0 ? (
        <Text style={styles.vazio}>Nenhum pedido realizado ainda.</Text>
      ) : (
        <FlatList
          data={pedidosMesa}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                <Text style={styles.pedidoData}>{item.data}</Text>
              </View>

              <FlatList
                data={item.produtos}
                keyExtractor={(prod, idx) => `${prod.id_produto ?? prod.id}-${idx}`}
                renderItem={({ item: prod }) => (
                  <View style={styles.produtoLinha}>
                    <Text style={styles.produtoNome}>{prod.nome_produto ?? prod.nome ?? prod.nomeProduto ?? 'Produto'}</Text>
                    <Text style={styles.produtoQtd}>x{prod.quantidade ?? prod.qtd ?? 1}</Text>
                    <Text style={styles.produtoPreco}>
                      R$ {((prod.preco_unitario ?? prod.preco ?? prod.valor) * (prod.quantidade ?? 1)).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                )}
              />

              <View style={styles.totalContainer}>
                <Text style={styles.totalTexto}>Total:</Text>
                <Text style={styles.totalValor}>R$ {Number(item.total).toFixed(2).replace('.', ',')}</Text>
              </View>

              <Text style={[styles.status, item.status === 'entregue' ? { color: '#007b00' } : { color: '#ff8c00' }]}>{item.status}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => router.push('/visualizacao')}>
        <Text style={styles.textoBotao}>Adicionar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 26, fontWeight: '700', color: '#004aad', textAlign: 'center', marginBottom: 20 },
  pedidoCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 14, marginBottom: 18 },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  pedidoId: { fontSize: 16, fontWeight: '600', color: '#004aad' },
  pedidoData: { fontSize: 14, color: '#666' },
  produtoLinha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  produtoNome: { fontSize: 15, color: '#333', flex: 1 },
  produtoQtd: { width: 40, textAlign: 'center', color: '#555' },
  produtoPreco: { fontSize: 15, fontWeight: '500' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 6 },
  totalTexto: { fontSize: 16, fontWeight: '600' },
  totalValor: { fontSize: 16, fontWeight: '700', color: '#004aad' },
  status: { marginTop: 8, fontStyle: 'italic', fontWeight: '600' },
  botaoAdicionar: { backgroundColor: '#004aad', borderRadius: 10, paddingVertical: 14, alignItems: 'center', position: 'absolute', bottom: 30, left: 20, right: 20 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#777', marginTop: 50, fontSize: 16 },
});
