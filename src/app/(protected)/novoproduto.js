import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { ProdutoContext } from '../../ProdutoContext'; // Contexto dos produtos
import { CategoriaContext } from '../../CategoriaContext'; // Contexto das categorias
import * as ImagePicker from 'expo-image-picker'; // Biblioteca para escolher imagens da galeria
import { router } from 'expo-router'; // Router para navegação
import Produtos from './produto';

export default function NovoProduto() {
  // Contextos
  const { adicionarProduto } = useContext(ProdutoContext);
  const { categorias } = useContext(CategoriaContext);

  // Estados dos campos do produto
  const [imagem, setImagem] = useState(null); // URL da imagem selecionada
  const [nome, setNome] = useState(''); // Nome do produto
  const [descricao, setDescricao] = useState(''); // Descrição do produto
  const [tipo, setTipo] = useState('1/2'); // Tipo: 1/2 ou Inteira
  const [valor, setValor] = useState(''); // Valor do produto
  const [custo, setCusto] = useState(''); // Custo do produto
  const [adicionais, setAdicionais] = useState([]); // Lista de adicionais do produto
  const [adicionalNome, setAdicionalNome] = useState(''); // Nome do adicional sendo digitado
  const [adicionalCusto, setAdicionalCusto] = useState(''); // Custo do adicional sendo digitado
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(''); // Categoria escolhida

  // ================= FUNÇÕES =================

  // Selecionar imagem da galeria
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Pede permissão
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria para selecionar uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Somente imagens
      quality: 1, // Máxima qualidade
    });

    if (!result.canceled) setImagem(result.assets[0].uri); // Se selecionou, salva a URI
  };

  // Adicionar novo adicional à lista
  const adicionarNovoAdicional = () => {
    if (!adicionalNome) { // Validação de nome
      Alert.alert('Erro', 'Informe o nome do adicional.');
      return;
    }
    const novoAdicional = { nome: adicionalNome, custo: adicionalCusto || '0' };
    setAdicionais(prev => [...prev, novoAdicional]); // Adiciona sem apagar os anteriores
    setAdicionalNome(''); // Limpa campo
    setAdicionalCusto(''); // Limpa campo
  };

  // Salvar produto
  const salvarProduto = () => {
    if (!nome || !valor) { // Validação obrigatória
      Alert.alert('Erro', 'Informe nome e valor do produto.');
      return;
    }
    if (!categoriaSelecionada) { // Validação da categoria
      Alert.alert('Erro', 'Selecione uma categoria.');
      return;
    }

    const produto = { 
      imagem, 
      nome, 
      descricao, 
      tipo, 
      valor, 
      custo, 
      adicionais, 
      categoria: categoriaSelecionada 
    };

    adicionarProduto(produto); // Adiciona no contexto
    Alert.alert('Sucesso', 'Produto cadastrado!', [
      { text: 'OK', onPress: () => router.push('/produto') }, // Volta para a página anterior
    ]);
  };

  // ================= LAYOUT =================
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Seção da imagem */}
      <TouchableOpacity style={styles.imagemContainer} onPress={escolherImagem}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagem} /> // Mostra imagem selecionada
        ) : (
          <Text style={styles.imagemTexto}>Selecionar Imagem</Text> // Texto quando não há imagem
        )}
      </TouchableOpacity>

      {/* Campos do produto */}
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Tipo (1/2 ou Inteira)" value={tipo} onChangeText={setTipo} />
      <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={valor} onChangeText={setValor} />
      <TextInput style={styles.input} placeholder="Custo" keyboardType="numeric" value={custo} onChangeText={setCusto} />

      {/* Seção de categorias */}
      {categorias && categorias.length > 0 ? (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Categoria referente:</Text>
          {categorias.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.checkboxContainer}
              onPress={() => setCategoriaSelecionada(cat.nome)} // Seleciona categoria
            >
              <View style={[styles.checkbox, categoriaSelecionada === cat.nome && styles.checkboxSelecionado]} /> 
              <Text style={{ marginLeft: 8 }}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        // Caso não haja categoria cadastrada
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Text>Nenhuma categoria cadastrada</Text>
          <TouchableOpacity
            style={{ marginLeft: 10, backgroundColor: '#004aad', padding: 5, borderRadius: 5 }}
            onPress={() => router.push('/categoria')} // Vai para cadastro
          >
            <Text style={{ color: '#fff' }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Seção de adicionais */}
      <View style={styles.adicionaisSection}>
        <Text style={styles.titulo}>Adicionais</Text>
        {adicionais.map((item, i) => (
          <Text key={i}>{item.nome} - R$ {item.custo}</Text>
        ))}
        <TextInput style={[styles.input, { marginTop: 10 }]} placeholder="Nome do adicional" value={adicionalNome} onChangeText={setAdicionalNome} />
        <TextInput style={styles.input} placeholder="Custo do adicional" keyboardType="numeric" value={adicionalCusto} onChangeText={setAdicionalCusto} />
        <TouchableOpacity style={styles.botaoAdicional} onPress={adicionarNovoAdicional}>
          <Text style={styles.botaoTexto}>Adicionar Adicional</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProduto}>
        <Text style={styles.botaoTexto}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ================= ESTILOS =================
const styles = StyleSheet.create({
  container: { padding: 16 },
  imagemContainer: { width: '100%', height: 180, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderRadius: 12 },
  imagemTexto: { color: '#555' },
  imagem: { width: '100%', height: '100%', borderRadius: 12 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, marginBottom: 10 },
  adicionaisSection: { marginTop: 10 },
  titulo: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  botaoAdicional: { backgroundColor: '#004aad', padding: 10, borderRadius: 10, marginTop: 5, alignItems: 'center' },
  botaoSalvar: { backgroundColor: 'green', padding: 14, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#555', borderRadius: 4 },
  checkboxSelecionado: { backgroundColor: '#004aad' },
});
