import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { PedidoContext } from '../../PedidoContext';
import { MesaContext } from '../../MesaContext';

export default function RevisarPedido() {
  const { getResumoPedido, criarPedidoCompleto } = useContext(PedidoContext);
  const router = useRouter();
  const { mesaSelecionada } = useContext(MesaContext);
  const [observacoes, setObservacoes] = useState('');

  // pegar o resumo (pode ser array, objeto por categoria ou undefined)
  const resumoRaw = getResumoPedido();
  // normalizar para array de itens
  const itens = (() => {
    if (!resumoRaw) return [];
    if (Array.isArray(resumoRaw)) return resumoRaw;
    // se for objeto agrupado por categoria: { "Bebidas": [...], "Lanches":[...] }
    try {
      return Object.values(resumoRaw).flat();
    } catch {
      return [];
    }
  })();

  // total seguro (usa preco ou preco_unitario)
  const total = itens.reduce((acc, item) => {
    const preco = Number(item.preco ?? item.preco_unitario ?? 0);
    const qtd = Number(item.quantidade ?? 0);
    return acc + preco * qtd;
  }, 0);

  const handleConfirmar = async () => {
    if (itens.length === 0) {
      Alert.alert('Aviso', 'Nenhum produto foi adicionado ao pedido.');
      return;
    }
    setObservacoes('');

    try {
      // adaptar conforme sua implementação: criarPedidoCompleto espera mesaSelecionada ou { numeroMesa }
      await criarPedidoCompleto({
        numeroMesa: mesaSelecionada?.numero,
        id_mesa: mesaSelecionada?.id_mesa,
        observacoes: observacoes || null,
      });
      Alert.alert('Pedido Confirmado', 'O pedido foi enviado com sucesso!');
      router.push('/visualizarmesa');
    } catch (error) {
      console.error('[RevisarPedido] erro ao confirmar:', error);
      Alert.alert('Erro', 'Falha ao enviar o pedido. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Revisar Pedido</Text>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {itens.length === 0 ? (
          <Text style={styles.vazio}>Nenhum produto adicionado.</Text>
        ) : (
          itens.map((item, i) => {
            const unidade = Number(item.preco ?? item.preco_unitario ?? 0) || 0;
            return (
              <View key={`${item.id_produto ?? i}-${i}`} style={styles.categoriaCard}>
                <View style={styles.itemTop}>
                  {item.imagem ? (
                    <Image source={{ uri: item.imagem }} style={styles.imagemProduto} />
                  ) : (
                    <View style={styles.imagemProdutoPlaceholder} />
                  )}

                  <View style={styles.nomeWrap}>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                  </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemQuantidade}>Quantidade: {item.quantidade}</Text>
                  <Text style={styles.itemPreco}>R$ {unidade.toFixed(2).replace('.', ',')}</Text>
                </View>
              </View>
            );
          })
        )}

        {/* Campo observações estilizado */}
        <View style={styles.observacoesContainer}>
          <Text style={styles.observacoesLabel}>Observações</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Ex.: sem cebola, trocar acompanhamento..."
            style={styles.observacoesInput}
            multiline
          />
        </View>
          </ScrollView>

          <View style={styles.rodape}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalTexto}>Total:</Text>
          <Text style={styles.totalValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </View>

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
          <Text style={styles.textoBotao}>Confirmar Pedido</Text>
        </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  titulo: { fontSize: 24, fontWeight: '700', color: '#004aad', textAlign: 'center', marginBottom: 20 },
  scroll: { flex: 1, marginBottom: 160 },
  categoriaCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  nomeCategoria: { fontSize: 18, fontWeight: '600', color: '#004aad', marginBottom: 8 },
  itemLinha: {
    // legacy - não usado no novo layout
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 6,
  },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemNome: { fontSize: 16, color: '#333', marginLeft: 4 },
  itemQuantidade: { fontSize: 15, color: '#555' },
  itemPreco: { fontSize: 16, color: '#000', fontWeight: '500' },
  // new layout styles
  itemTop: { flexDirection: 'row', alignItems: 'center' },
  nomeWrap: { flex: 1, justifyContent: 'center' },
  separator: { height: 1, backgroundColor: '#e6e6e6', marginVertical: 8, borderRadius: 1 },
  itemBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imagemProduto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#eef2f8'
  },
  imagemProdutoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#f0f3f8',
    borderWidth: 1,
    borderColor: '#e0e6f0'
  },
  rodape: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 10,
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalTexto: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalValor: { fontSize: 18, fontWeight: '700', color: '#004aad' },
  botaoConfirmar: {
    backgroundColor: '#004aad',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#777', fontSize: 16, marginTop: 40 },
  observacoesContainer: {
    backgroundColor: '#f4f8ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cdd7ee',
    shadowColor: '#004aad',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  observacoesLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#004aad',
    marginBottom: 8,
  },
  observacoesInput: {
    borderWidth: 1,
    borderColor: '#b0c4de',
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
  },
});
