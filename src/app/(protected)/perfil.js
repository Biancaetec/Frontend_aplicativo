import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PerfilVisual() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image style={styles.imagem} />
        {/* Para placeholder de imagem */}
        <View style={styles.imagemVazia}>
          <Text style={styles.imagemVaziaTexto}>Sem imagem</Text>
        </View>
      </View>

      <Text style={styles.label}>Nome do Restaurante</Text>
      <Text style={styles.texto}>Restaurante Exemplo</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.texto}>exemplo@email.com</Text>

      <Text style={styles.label}>Telefone</Text>
      <Text style={styles.texto}>1234-5678</Text>

      <TouchableOpacity 
        style={styles.botaoEditar} 
        onPress={() => navigation.navigate('editarperfil', { perfilEditando: {
          nome: 'Restaurante Exemplo',
          email: 'exemplo@email.com',
          telefone: '1234-5678',
          imagem: null
        }})}
      >
        <Text style={styles.textoBotao}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
  imagemContainer: { alignItems: 'center', marginBottom: 20 },
  imagem: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  imagemVazia: { 
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', 
    justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 
  },
  imagemVaziaTexto: { color: '#888' },
  label: { fontWeight: 'bold', color: '#0D3A87', marginTop: 10 },
  texto: { fontSize: 16, marginBottom: 10, color: '#333' },
  botaoEditar: { backgroundColor: '#0D3A87', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
