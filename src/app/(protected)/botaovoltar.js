import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function BotaoVoltar({ destino }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.botaoContainer}
      onPress={() => navigation.navigate(destino)}
      activeOpacity={0.7}
    >
      <View style={styles.conteudo}>
        <MaterialIcons name="arrow-back" size={24} color="#004aad" />
        <Text style={styles.texto}>Voltar</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botaoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e6f0ff', // leve destaque azul claro
    alignSelf: 'flex-start',
    margin: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  texto: {
    color: '#004aad',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
