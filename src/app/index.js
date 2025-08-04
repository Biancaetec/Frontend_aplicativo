import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View style={styles.container}>
      {/* LOGO */}
      {/* <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')} // Substitua pelo caminho correto da logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View> */}

      <View style={styles.formulariocaixa}>
        <Text style={styles.titulo}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="restoon@gmail.com"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <Text style={styles.titulo}>Senha</Text>
        <View style={styles.senha}>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="senha"
            secureTextEntry={!mostrarSenha}
            style={styles.caixa}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Text style={styles.mostrarsenha}>{mostrarSenha ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.esquecisenha}>
          <Text style={styles.link}>esqueci a senha</Text>
        </TouchableOpacity>

        <Pressable style={styles.botaologin} onPress={() => console.log('Login')}>
          <Text style={styles.textologin}>LOGIN</Text>
        </Pressable>

        <View style={styles.rodape}>
          <Text style={styles.textorodape}>É novo por aqui?</Text>
          <TouchableOpacity onPress={() => console.log('Cadastrar')}>
            <Text style={styles.link}> se cadastre já</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052cc',
  },
  logoContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 90,
  },
  formulariocaixa: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  titulo: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: '#000',
  },
  senha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  caixa: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  mostrarsenha: {
    fontSize: 18,
    paddingHorizontal: 8,
    color: '#555',
  },
  esquecisenha: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  link: {
    color: '#0052cc',
    fontWeight: '600',
  },
  botaologin: {
    backgroundColor: '#0052cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textologin: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  textorodape: {
    color: '#555',
  },
});
