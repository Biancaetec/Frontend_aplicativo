import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditarPerfilVisual() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [imagem, setImagem] = useState('');

  const escolherImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.canceled) setImagem(result.assets[0].uri);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSalvar = () => {
    console.log({ nome, email, telefone, imagem });
    alert('Salvo apenas visualmente!');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Editar Perfil (Visual)</Text>

          <TouchableOpacity style={styles.imagemContainer} onPress={escolherImagem}>
            {imagem ? (
              <Image source={{ uri: imagem }} style={styles.imagem} />
            ) : (
              <Text style={styles.imagemPlaceholder}>Selecionar imagem</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do Restaurante"
            placeholderTextColor="#A9A9A9"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#A9A9A9"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone"
            keyboardType="phone-pad"
            placeholderTextColor="#A9A9A9"
          />

          <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F5F6FA' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0D3A87', marginBottom: 25, textAlign: 'center' },
  label: { color: '#0D3A87', fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 25,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#fff'
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
    overflow: "hidden"
  },
  imagem: { width: "100%", height: "100%", borderRadius: 14 },
  imagemPlaceholder: { color: "#7a8797", fontSize: 16, fontWeight: "600" },
  botaoSalvar: { backgroundColor: '#0D3A87', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
