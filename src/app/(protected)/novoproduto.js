import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { ProdutoContext } from '../../ProdutoContext'; // Contexto dos produtos
import { CategoriaContext } from '../../CategoriaContext'; // Contexto das categorias
import * as ImagePicker from 'expo-image-picker'; // Biblioteca para escolher imagens da galeria
import { router } from 'expo-router'; // Router para navegação
import Produtos from './produto';
import BotaoVoltar from './botaovoltar';

export default function NovoProduto() {
  // Contextos
  const { adicionarProduto } = useContext(ProdutoContext);
  const { categorias } = useContext(CategoriaContext);

  // console.log("🔹 Categorias disponíveis:", categorias);

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


  // useEffect(()=>console.log(categoriaSelecionada),[categoriaSelecionada])

  // Salvar produto
  const salvarProduto = async () => {
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
      tipo_preparo: categoriaSelecionada, 
      preco: parseFloat(valor, 10), 
      custo, 
      adicionais, 
      categoria: categoriaSelecionada,
      ativo: 1,
      id_categoria: categorias.find(cat => cat.nome === categoriaSelecionada)?.id_categoria || null
    };

    console.log("🔹 Dados do produto a salvar:", produto);

    await adicionarProduto(produto); // Adiciona no contexto
    Alert.alert('Sucesso', 'Produto cadastrado!', [
      { text: 'OK', onPress: () => router.push('/produto') }, // Volta para a página anterior
    ]);
  };

  // ================= LAYOUT =================
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulomaior}>Novo Produto</Text>
      <BotaoVoltar destino="produto" />

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
      {/*<TextInput style={styles.input} placeholder="Tipo (1/2 ou Inteira)" value={tipo} onChangeText={setTipo} />*/}
      <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={valor} onChangeText={setValor} />
    
      {/*<TextInput style={styles.input} placeholder="Custo" keyboardType="numeric" value={custo} onChangeText={setCusto} />*/}

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

      {/* Seção de adicionais 
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
      </View>*/}

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProduto}>
        <Text style={styles.botaoTexto}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ================= ESTILOS =================
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fc",
  },

  titulomaior: {
    fontSize: 24,
    fontWeight: "800",
    color: "#004aad",
    marginBottom: 20,
    textAlign: "center",
  },

  // --- IMAGEM ---
  imagemContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#e6ecf7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#c7d4e8",
    overflow: "hidden",
  },
  imagemTexto: {
    color: "#7a8797",
    fontSize: 16,
    fontWeight: "600",
  },
  imagem: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  // --- INPUTS ---
  input: {
    borderWidth: 1.5,
    borderColor: "#c7d4e8",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    fontSize: 15,
    elevation: 1,
  },

  // --- CHECKBOX CATEGORIA ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#004aad",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  checkboxSelecionado: {
    backgroundColor: "#004aad",
    borderColor: "#003580",
  },

  // --- SEÇÃO ADICIONAIS ---
  adicionaisSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c7d4e8",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#003580",
  },

  botaoAdicional: {
    backgroundColor: "#004aad",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
  },

  // --- BOTÃO SALVAR ---
  botaoSalvar: {
    backgroundColor: "#00a200",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    elevation: 2,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
