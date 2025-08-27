import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Adicional() {
  const navigation = useNavigation();
  const route = useRoute();
  const [listaAdicionais, setListaAdicionais] = useState([]);

  useEffect(() => {
    if (route.params?.listaAdicionais) {
      setListaAdicionais(route.params.listaAdicionais);
    }
  }, [route.params?.listaAdicionais]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Adicional</Text>
      </View> */}

      <FlatList
        data={listaAdicionais}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome} - {item.preco}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('novoadicional')}>
        <Text style={styles.botaoTexto}>+ Criar novo adicional</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // header: { backgroundColor: '#004aad', height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  // headerText: { color: '#fff', fontSize: 18, marginLeft: 10 },
  botao: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#004aad', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  itemText: { fontSize: 16, color: '#004aad' },
});
