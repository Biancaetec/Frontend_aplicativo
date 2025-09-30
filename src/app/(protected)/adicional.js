import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AdicionalContext } from '../../AdicionalContext'; // ajusta o caminho se necessário

export default function Adicional() {
  const navigation = useNavigation();
  const { adicionais } = useContext(AdicionalContext); // pega direto do contexto

  return (
    <View style={styles.container}>
      <FlatList
        data={adicionais}
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
  botao: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#004aad', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  itemText: { fontSize: 16, color: '#004aad' },
});
