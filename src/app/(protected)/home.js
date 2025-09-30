import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { MesaContext } from '../../MesaContext'; // ajuste o caminho se necessário

export default function TelaPedidos() {
  const [abaAtiva, setAbaAtiva] = useState('Pedidos');
  const { mesas } = useContext(MesaContext); // pega mesas do contexto

  // Ordena mesas pelo número
  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Menu de Abas */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'Pedidos' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('Pedidos')}
        >
          <Text style={[styles.headerText, abaAtiva === 'Pedidos' && styles.textAtivo]}>
            Pedidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'Mesa' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('Mesa')}
        >
          <Text style={[styles.headerText, abaAtiva === 'Mesa' && styles.textAtivo]}>
            Mesa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Área de conteúdo */}
      <View style={styles.listArea}>
        {abaAtiva === 'Pedidos' ? (
          <Text>📋 Lista de pedidos aqui...</Text>
        ) : (
          <FlatList
            data={mesasOrdenadas}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3} // 3 mesas por linha, ajuste como quiser
            columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.mesaBox}>
                <Text style={styles.mesaTexto}>{item.numero}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Botão Novo Pedido */}
      <TouchableOpacity style={styles.newOrderButton}>
        <Text style={styles.newOrderText}>+ Novo pedido</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  tabAtiva: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E56A0',
  },
  headerText: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  textAtivo: { color: '#1E56A0' },
  listArea: {
    flex: 1,
    padding: 16,
  },
  newOrderButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E56A0',
    paddingVertical: 10,
    width: '50%',
    borderRadius: 25,
    alignItems: 'center',
  },
  newOrderText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mesaBox: {
    width: '28%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#0D3A87' },
});
