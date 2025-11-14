import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import BotaoVoltar from './botaovoltar';

export default function EditarCategoria() {
  const navigation = useNavigation();
  const route = useRoute();

  // Recebe o objeto categoria diretamente
  const categoriaEditando = route.params?.categoriaEditando || null;

  const [nome, setNome] = useState('');
  const { editarCategoria, carregarCategorias, loading } = useContext(CategoriaContext);

  // Atualiza o input quando categoriaEditando mudar
  useEffect(() => {
    if (categoriaEditando) {
      setNome(categoriaEditando.nome);
    }
  }, [categoriaEditando]);

  // Atualiza a lista de categorias ao abrir
  useEffect(() => {
    carregarCategorias();
  }, []);

  const salvarEdicao = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode ficar vazio.');
      return;
    }

    try {
      await editarCategoria(categoriaEditando.id_categoria, nome);
      Alert.alert('Sucesso', 'Categoria atualizada!');
      navigation.goBack();
    } catch (error) {
      console.error('[EditarCategoria] erro ao editar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a categoria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Categoria</Text>
      <BotaoVoltar destino="categoria" />

      <TextInput
        placeholder="Nome da categoria"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, loading && { opacity: 0.6 }]}
        onPress={salvarEdicao}
        disabled={loading}
      >
        <Text style={styles.textoBotao}>Salvar Alterações</Text>
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
    marginTop: 10,
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
    marginTop: 30,
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
