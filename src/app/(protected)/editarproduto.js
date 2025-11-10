import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProdutoContext } from '../../ProdutoContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditarProduto() {
  const { editarProduto, loading, id_restaurante } = useContext(ProdutoContext);
  const navigation = useNavigation();
  const route = useRoute();

  // Recebe o produto (desserializa)
  const produtoEditando = route.params?.produtoEditando
    ? JSON.parse(route.params.produtoEditando)
    : null;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [id_categoria, setIdCategoria] = useState('');
  const [imagem, setImagem] = useState('');

  // Preenche apenas uma vez (sem travar campos)
  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome || '');
      setDescricao(produtoEditando.descricao || '');
      setPreco(produtoEditando.preco ? produtoEditando.preco.toString() : '');
      setIdCategoria(produtoEditando.id_categoria ? produtoEditando.id_categoria.toString() : '');
      setImagem(produtoEditando.imagem || '');
    }
  }, []); // ← executa apenas uma vez

  // Escolher imagem da galeria
  const escolherImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImagem(uri);
      }
    } catch (error) {
      console.error('Erro ao escolher imagem:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const handleSalvar = async () => {
    if (!produtoEditando) {
      Alert.alert('Erro', 'Nenhum produto selecionado para edição.');
      return;
    }

    if (!nome.trim() || !preco.trim() || isNaN(Number(preco))) {
      Alert.alert('Erro', 'Informe nome e preço válidos para o produto.');
      return;
    }

    if (!id_restaurante) {
      Alert.alert('Erro', 'Usuário não autenticado. Aguarde carregar a sessão.');
      return;
    }

    try {
      const dadosAtualizados = {
        nome,
        descricao,
        preco: Number(preco),
        id_categoria: id_categoria ? Number(id_categoria) : null,
        imagem,
      };

      console.log('🔹 Editando produto:', {
        id_produto: produtoEditando.id_produto,
        ...dadosAtualizados,
        id_restaurante,
      });

      await editarProduto(produtoEditando.id_produto, dadosAtualizados);

      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>

      {/* Imagem do produto */}
      <TouchableOpacity style={styles.imagemContainer} onPress={escolherImagem}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagem} />
        ) : (
          <Text style={styles.imagemPlaceholder}>Selecionar imagem</Text>
        )}
      </TouchableOpacity>

      {/* Nome */}
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        placeholder="Ex: Pizza Calabresa"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#A9A9A9"
      />

      {/* Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Ex: Massa fina, molho artesanal, borda recheada..."
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholderTextColor="#A9A9A9"
        multiline
      />

      {/* Preço */}
      <Text style={styles.label}>Preço</Text>
      <TextInput
        placeholder="Ex: 25.90"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      {/* Categoria */}
      <Text style={styles.label}>ID da Categoria (opcional)</Text>
      <TextInput
        placeholder="Ex: 2"
        style={styles.input}
        value={id_categoria}
        onChangeText={setIdCategoria}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, loading && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F6FA',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D3A87',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    color: '#0D3A87',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  imagemContainer: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0D3A87',
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagemPlaceholder: {
    color: '#666',
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 25,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
