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
import { CategoriaContext } from '../../CategoriaContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import BotaoVoltar from './botaovoltar';

export default function EditarProduto() {
  const { editarProduto, loading } = useContext(ProdutoContext);
  const { categorias } = useContext(CategoriaContext);

  const navigation = useNavigation();
  const route = useRoute();

    let produtoEditando = route.params?.produtoEditando || null;
    console.log("PRODUTO EDITANDO ===>", produtoEditando);


  if (typeof produtoEditando === "string") {
    produtoEditando = JSON.parse(produtoEditando);
  }

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [tipo_preparo, setTipo_Preparo] = useState('');
  const [id_categoria, setIdCategoria] = useState('');
  const [imagem, setImagem] = useState('');

  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome ?? '');
      setDescricao(produtoEditando.descricao ?? '');
      setPreco(produtoEditando.preco ? String(produtoEditando.preco) : '');
      setTipo_Preparo(produtoEditando.tipo_preparo ?? '');
      setIdCategoria(
        produtoEditando.id_categoria ? String(produtoEditando.id_categoria) : ''
      );
      setImagem(produtoEditando.imagem ?? '');
    }
  }, []);

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
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao escolher imagem:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const handleSalvar = async () => {
  if (!produtoEditando?.id_produto) {
    Alert.alert("Erro", "ID do produto não encontrado.");
    return;
  }

  try {
    await editarProduto(produtoEditando.id_produto, {
      nome,
      descricao,
      preco: Number(preco),
      tipo_preparo,
      imagem,
      id_categoria: Number(id_categoria),
    });

    Alert.alert("Sucesso", "Produto atualizado!");
    navigation.goBack();
  } catch (e) {
    console.log("Erro ao editar:", e);
    Alert.alert("Erro", "Não foi possível atualizar o produto.");
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>
      <BotaoVoltar destino="produto" />

      <TouchableOpacity style={styles.imagemContainer} onPress={escolherImagem}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagem} />
        ) : (
          <Text style={styles.imagemPlaceholder}>Selecionar imagem</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        placeholder="Ex: Pizza Calabresa"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#A9A9A9"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Ex: massa fina, molho artesanal..."
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholderTextColor="#A9A9A9"
        multiline
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        placeholder="Ex: 25.90"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />


      {/* 🔵 LISTA DE CATEGORIAS IGUAL AO NOVO PRODUTO */}
      {categorias && categorias.length > 0 ? (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5, color: "#0D3A87" }}>
            Categoria referente:
          </Text>

          {categorias.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.checkboxContainer}
              onPress={() => {
                setTipo_Preparo(cat.nome);
                setIdCategoria(String(cat.id_categoria));
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  Number(id_categoria) === Number(cat.id_categoria) && styles.checkboxSelecionado
                ]}
              />
              <Text style={{ marginLeft: 8 }}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text>Nenhuma categoria cadastrada.</Text>
      )}

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
  imagem: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  imagemPlaceholder: {
    color: "#7a8797",
    fontSize: 16,
    fontWeight: "600",
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#0D3A87",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  checkboxSelecionado: {
    backgroundColor: "#0D3A87",
    borderColor: "#062c66",
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
