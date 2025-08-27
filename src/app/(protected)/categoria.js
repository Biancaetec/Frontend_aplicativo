import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CategoriaContext} from '../../CategoriaContext';

export default function Categoria() {
  const navigation = useNavigation();
  const { categorias } = useContext(CategoriaContext);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerText}>Categorias</Text>
      </View> */}

      <FlatList
        data={categorias}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoriaItem}>
            <Text style={styles.categoriaTexto}>{item.nome}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('novacategoria')}
      >
        <Text style={styles.botaoTexto}>+ Criar nova categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
  ,
  // header: { backgroundColor: '#004aad', height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  // headerText: { color: '#fff', fontSize: 18, marginLeft: 10 },
  botao: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#004aad', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  categoriaItem: { padding: 15, backgroundColor: '#E3F2FD', borderRadius: 12, marginBottom: 10 },
  categoriaTexto: { fontSize: 16, color: '#0D3A87', fontWeight: '500' },
});
