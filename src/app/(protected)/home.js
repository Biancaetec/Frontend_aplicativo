import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MesaContext } from '../../MesaContext';
import { router } from 'expo-router';

export default function TelaPedidos() {
  const [abaAtiva, setAbaAtiva] = useState('Pedidos');
  const { mesas, selecionarMesa } = useContext(MesaContext); // adiciona selecionarMesa do contexto

  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  function handleSelecionarMesa(mesa) {
    selecionarMesa(mesa); // salva no contexto
    router.push('/visualizarmesa'); // navega pra tela
  }

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
            keyExtractor={(item) => item.id_mesa.toString()}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.mesaquadradinho}
                onPress={() => handleSelecionarMesa(item)}
              >
                <Text style={styles.mesaTexto}>{item.numero}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Botão Novo Pedido */}
      <TouchableOpacity
        onPress={() => router.push('/visualizacao')}
        style={styles.botaopedido}
      >
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
  dentroLinhaAtiva: { flex: 1, padding: 16 },
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
    borderColor: '#00ad00ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#000000ff' },
});
