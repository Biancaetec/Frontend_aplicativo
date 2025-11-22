import { useNavigation } from "expo-router";
import { Text, StyleSheet, View, Pressable, Platform } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function BotaoVoltar({ destino }) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate(destino)}
      android_ripple={{ color: '#e6f0ff' }}
      style={({ pressed }) => [styles.botaoContainer, pressed && styles.pressed]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <View style={styles.conteudo}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="arrow-back" size={20} color="#0b4da0" />
        </View>
        <Text style={styles.texto}>Voltar</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botaoContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe9ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
    margin: 8,
    // sombra iOS
    shadowColor: '#0b3b78',
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    // elevação Android
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.997 }],
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#0b4da0',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 10,
  },
});
