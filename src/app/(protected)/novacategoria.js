import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';
import BotaoVoltar from './botaovoltar';

export default function NovaCategoria() {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const { adicionarCategoria, loading } = useContext(CategoriaContext);

  const salvarCategoria = async () => {
    if (nomeCategoria.trim() === '') {
      Alert.alert('Erro', 'Digite o nome da categoria.');
      return;
    }

    try {
      await adicionarCategoria({ nome: nomeCategoria });
      Alert.alert('Sucesso', 'Categoria cadastrada!');
      setNomeCategoria(''); // limpa o input
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar a categoria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categoria</Text>
      <BotaoVoltar destino="categoria" />

      <TextInput
        placeholder="Nome da categoria"
        style={styles.input}
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, loading && { opacity: 0.7 }]}
        onPress={salvarCategoria}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Salvar Categoria</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0D3A87', marginBottom: 20, textAlign: 'center', marginTop: 10 },
  input: { height: 50, borderWidth: 1.5, borderColor: '#0D3A87', borderRadius: 12, paddingHorizontal: 12, marginBottom: 20, color: '#333', fontSize: 16, marginTop: 30 },
  botaoSalvar: { backgroundColor: '#0D3A87', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
