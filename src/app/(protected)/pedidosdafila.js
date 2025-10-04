import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MesaContext } from '../../MesaContext';
import { FilaContext } from '../../FilaContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function PedidosDaFila() {
  const params = useLocalSearchParams(); 
  const { filaNome } = params; 
  const [abaAtiva, setAbaAtiva] = useState('Em preparo');

  const { mesas } = useContext(MesaContext);
  const { filas } = useContext(FilaContext);

  const filaSelecionada = filas.find(f => f.nome === filaNome);
  const pedidos = filaSelecionada?.pedidos || [];
  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  // Função para determinar a cor da linha da aba
  const linhaAbaCor = (aba) => {
    if (abaAtiva !== aba) return 'transparent';
    return aba === 'Em preparo' ? '#1E56A0' : '#006400'; // azul ou verde escuro
  };

  // Função para determinar a cor do texto da aba
  const textoAbaCor = (aba) => {
    if (abaAtiva !== aba) return '#333';
    return aba === 'Em preparo' ? '#1E56A0' : '#006400';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header com o nome da fila */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{filaNome}</Text>
      </View>

      {/* Menu de abas */}
      <View style={styles.abaContainer}>
        {['Em preparo', 'Pronto'].map((aba) => (
          <TouchableOpacity
            key={aba}
            style={[styles.aba, { borderBottomColor: linhaAbaCor(aba), borderBottomWidth: 2 }]}
            onPress={() => setAbaAtiva(aba)}
          >
            <Text style={[styles.abaTexto, { color: textoAbaCor(aba) }]}>{aba}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da aba */}
      <View style={styles.conteudo}>
        {abaAtiva === 'Em preparo' ? (
          pedidos.filter(p => p.status === 'em preparo').length === 0 ? (
            <View style={styles.semFilasContainer}>
              <FontAwesome5 name="clock" size={48} color="#0D3A87" />
              <Text style={styles.semFilasTexto}>
                Não há pedidos em espera.
              </Text>
            </View>
          ) : (
            <FlatList
              data={pedidos.filter(p => p.status === 'em preparo')}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.pedidoBox}>
                  <Text style={styles.pedidoTexto}>{item.nomeProduto}</Text>
                  <Text style={styles.pedidoTexto}>Qtd: {item.quantidade}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )
        ) : pedidos.filter(p => p.status === 'pronto').length === 0 ? (
          <View style={styles.semFilasContainer}>
            <FontAwesome5 name="check-circle" size={48} color="#006400" />
            <Text style={styles.semFilasTexto}>
             Os pedidos prontos aparecerão aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={pedidos.filter(p => p.status === 'pronto')}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.mesaBox}>
                <Text style={styles.mesaTexto}>{item.numeroMesa}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#838383ff', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  abaContainer: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  aba: { paddingVertical: 12, flex: 1, alignItems: 'center' },
  abaTexto: { fontWeight: 'bold', fontSize: 16 },
  conteudo: { flex: 1, padding: 16 },
  mesaBox: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#0D3A87' },
  pedidoBox: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0D3A87',
  },
  pedidoTexto: { fontSize: 16, color: '#0D3A87' },
  semFilasContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  semFilasTexto: { fontSize: 16, color: '#555', marginTop: 10, textAlign: 'center' },
});
