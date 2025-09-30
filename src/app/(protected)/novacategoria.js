import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';

export default function NovaCategoria() {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const { adicionarCategoria } = useContext(CategoriaContext);

  const salvarCategoria = () => {
    if (nomeCategoria.trim() === '') {
      Alert.alert('Erro', 'Digite o nome da categoria.');
      return;
    }
    adicionarCategoria({ nome: nomeCategoria });
    Alert.alert('Sucesso', 'Categoria cadastrada!');
    setNomeCategoria(''); // limpa o input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categoria</Text>

      <TextInput
        placeholder="Nome da categoria"
        style={styles.input}
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCategoria}>
        <Text style={styles.textoBotao}>Salvar Categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D3A87',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    color: '#333',
    fontSize: 16,
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
