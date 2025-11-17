// RevisarPedido.jsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { PedidoContext } from '../../PedidoContext';
import { MesaContext } from '../../MesaContext';

export default function RevisarPedido() {
  const { getResumoPedido, getTotalPedido, criarPedidoNoBackend, loading } = useContext(PedidoContext);
  const router = useRouter();
  const { mesaSelecionada } = useContext(MesaContext);

  const resumo = getResumoPedido();
  const total = getTotalPedido();
  const categorias = Object.keys(resumo || []);

  const [enviando, setEnviando] = useState(false);

  const handleConfirmar = async () => {
    if (categorias.length === 0) {
      Alert.alert('Aviso', 'Nenhum produto foi adicionado ao pedido.');
      return;
    }

    setEnviando(true);
    // chama o backend para criar o pedido
    const idCriado = await criarPedidoNoBackend({
      mesaId: mesaSelecionada?.id_mesa ?? mesaSelecionada?.id,
      usuarioId: null,
      restauranteId: null,
      tipo_preparo: "normal",
      observacoes: ""
    });

    setEnviando(false);

    if (!idCriado) {
      Alert.alert('Erro', 'Não foi possível enviar o pedido. Tente novamente.');
      return;
    }

    Alert.alert('Pedido Confirmado', `Pedido #${idCriado} criado com sucesso.`);
    // redireciona para a visualização da mesa (lista de pedidos)
    router.push('/visualizarmesa');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Revisar Pedido</Text>

      <ScrollView style={styles.scroll}>
        {categorias.length === 0 ? (
          <Text style={styles.vazio}>Nenhum produto adicionado.</Text>
        ) : (
          categorias.map((categoria, index) => (
            <View key={index} style={styles.categoriaCard}>
              <Text style={styles.nomeCategoria}>{categoria}</Text>
              {resumo[categoria].map((item, i) => (
                <View key={`${item.id_produto}-${i}`} style={styles.itemLinha}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    <Text style={styles.itemQuantidade}>x{item.quantidade}</Text>
                  </View>
                  <Text style={styles.itemPreco}>
                    R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalTexto}>Total:</Text>
          <Text style={styles.totalValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </View>

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar} disabled={enviando || loading}>
          {enviando || loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  titulo: { fontSize: 24, fontWeight: '700', color: '#004aad', textAlign: 'center', marginBottom: 20 },
  scroll: { flex: 1, marginBottom: 100 },
  categoriaCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  nomeCategoria: { fontSize: 18, fontWeight: '600', color: '#004aad', marginBottom: 8 },
  itemLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: 6 },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemNome: { fontSize: 16, color: '#333', marginRight: 8 },
  itemQuantidade: { fontSize: 15, color: '#555' },
  itemPreco: { fontSize: 16, color: '#000', fontWeight: '500' },
  rodape: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ddd' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalTexto: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalValor: { fontSize: 18, fontWeight: '700', color: '#004aad' },
  botaoConfirmar: { backgroundColor: '#004aad', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#777', fontSize: 16, marginTop: 40 },
});
