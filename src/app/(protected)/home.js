import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TelaPedidos() {
  const [abaAtiva, setAbaAtiva] = useState('Pedidos'); // Estado inicial

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

      {/* Área de conteúdo (muda conforme a aba) */}
      <View style={styles.listArea}>
        {abaAtiva === 'Pedidos' ? (
          <Text>📋 Lista de pedidos aqui...</Text>
        ) : (
          <Text>🍽 Lista de mesas aqui...</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E56A0',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  menuButton: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 6,
    backgroundColor: '#145DA0',
    borderRadius: 50,
  },
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
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  textAtivo: {
    color: '#1E56A0',
  },
  listArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newOrderButton: {
    marginTop: '-10',
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E56A0',
    paddingVertical: 10,
    width: '50%',
    borderRadius: 25,
    alignItems: 'center',
  },
  newOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
