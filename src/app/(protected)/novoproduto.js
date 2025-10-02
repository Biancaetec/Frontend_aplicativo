import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ProdutoContext } from '../../ProdutoContext';
import { CategoriaContext } from '../../CategoriaContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function NovoProduto() {
  const { adicionarProduto } = useContext(ProdutoContext);
  const { categorias } = useContext(CategoriaContext);
  const navigation = useNavigation();
  const route = useRoute();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fila, setFila] = useState('');

  // Pegar a categoria enviada da tela anterior
  useEffect(() => {
    if (route.params?.categoriaId) {
      const cat = categorias.find(c => c.id === route.params.categoriaId);
      if (cat) setCategoriaSelecionada(cat);
    }
  }, [route.params, categorias]);

  const salvarProduto = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite o nome do produto.');
      return;
    }
    if (!categoriaSelecionada) {
      Alert.alert('Erro', 'Selecione uma categoria.');
      return;
    }

    adicionarProduto({
      id: Date.now().toString(),
      nome,
      descricao,
      tipo,
      categoriaId: categoriaSelecionada.id,
      preco,
      quantidade,
      fila,
    });

    Alert.alert('Sucesso', 'Produto cadastrado!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produto</Text>

      {/* Foto */}
      <TouchableOpacity style={styles.fotoContainer}>
        <Text style={styles.fotoTexto}>📷 Adicionar foto</Text>
      </TouchableOpacity>

      {/* Nome */}
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#A9A9A9"
      />

      {/* Descrição */}
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholderTextColor="#A9A9A9"
      />

      {/* Tipo / Medida */}
      <TextInput
        placeholder="Tipo/Medida"
        style={styles.input}
        value={tipo}
        onChangeText={setTipo}
        placeholderTextColor="#A9A9A9"
      />

      {/* Categoria selecionada */}
      {categoriaSelecionada && (
        <View style={styles.input}>
          <Text style={styles.categoriaSelecionada}>
            Categoria selecionada: {categoriaSelecionada.nome}
          </Text>
        </View>
      )}

      {/* Lista de categorias clicáveis */}
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Escolha uma categoria:</Text>
      {categorias?.length > 0 && categorias.map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.categoriaBotao,
            categoriaSelecionada?.id === cat.id && styles.categoriaSelecionadaBotao
          ]}
          onPress={() => setCategoriaSelecionada(cat)}
        >
          <Text
            style={[
              styles.categoriaTexto,
              categoriaSelecionada?.id === cat.id && styles.categoriaSelecionadaBotaoText
            ]}
          >
            {cat.nome}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Preço */}
      <TextInput
        placeholder="Preço"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      {/* Fila de preparo */}
      <TextInput
        placeholder="Fila de preparo"
        style={styles.input}
        value={fila}
        onChangeText={setFila}
        placeholderTextColor="#A9A9A9"
      />

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>Salvar produto</Text>
      </TouchableOpacity>
    </ScrollView>
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
  fotoContainer: {
    height: 120,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoTexto: { fontSize: 16, color: '#0D3A87' },
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
  categoriaSelecionada: { fontSize: 16, color: '#0D3A87', fontWeight: '500', padding: 12 },
  categoriaBotao: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0D3A87',
    borderRadius: 12,
    marginBottom: 8,
  },
  categoriaSelecionadaBotao: {
    backgroundColor: '#0D3A87',
  },
  categoriaTexto: {
    color: '#0D3A87',
    fontWeight: '500',
  },
  categoriaSelecionadaBotaoText: {
    color: '#fff',
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
