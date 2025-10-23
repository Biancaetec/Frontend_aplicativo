import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MesaContext } from '../../MesaContext'; // ajuste o caminho se necessário
import { FilaContext } from '../../FilaContext';

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
          style={[styles.linha, abaAtiva === 'Pedidos' && styles.linhaAtiva]}
          onPress={() => setAbaAtiva('Pedidos')}
        >
          <Text style={[styles.texto, abaAtiva === 'Pedidos' && styles.textoAtivo]}>
            Pedidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linha, abaAtiva === 'Mesa' && styles.linhaAtiva]}
          onPress={() => setAbaAtiva('Mesa')}
        >
          <Text style={[styles.texto, abaAtiva === 'Mesa' && styles.textoAtivo]}>
            Mesa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Área de conteúdo */}
      <View style={styles.dentroLinhaAtiva}>
        {abaAtiva === 'Pedidos' ? (
          <Text>📋 Lista de pedidos aqui...</Text>
        ) : (
          <FlatList
            data={mesasOrdenadas}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3} // 3 mesas por linha, ajuste como quiser
            columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.mesaquadradinho}>
                <Text style={styles.mesaTexto}>{item.numero}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Botão Novo Pedido */}
      <TouchableOpacity style={styles.botaopedido}>
        <Text style={styles.textobotao}>+ Novo pedido</Text>
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
  linha: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  linhaAtiva: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E56A0',
  },
  texto: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  textoAtivo: { color: '#1E56A0' },
  dentroLinhaAtiva: {
    flex: 1,
    padding: 16,
  },
  botaopedido: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E56A0',
    paddingVertical: 10,
    width: '50%',
    borderRadius: 25,
    alignItems: 'center',
  },
  textobotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mesaquadradinho: {
    width: '28%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#00ad00ff",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#000000ff' },
});
