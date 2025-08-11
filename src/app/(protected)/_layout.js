import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

// Importa o hook de autenticação que você criou
import { useAuth } from '../../hooks/Auth/useAuth';

function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.areaperfil}>
        <Image
          // source={require('../../../src/assets/images/usuario.png')}
          style={styles.imagemperfil}
        />
        <Text style={styles.nomeusuario}>
        {user?.restaurante?.nome || "Nome do Usuário"}
        </Text>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signOut();
          router.replace('/'); // redireciona para a página pública após logout
        }}
      >
        <Text style={{ color: 'white', fontSize: 15 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Layout() {
  const { user } = useAuth();

  // Se usuário não autenticado, redireciona para login e não mostra o Drawer
  if (!user?.authenticated) {
    router.replace('/'); // ajusta para sua rota de login
    return null; // não renderiza nada enquanto redireciona
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerTitle: '', // remove o "(Protected)" do header
          drawerActiveTintColor: '#004aad',
          drawerInactiveTintColor: '#555',
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: { backgroundColor: '#fff' },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: 'Início',
            headerTitle: 'Início',
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="administracao"
          options={{
            drawerLabel: 'Administração',
            headerTitle: 'Administração',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="admin-panel-settings" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="pedidosfechados"
          options={{
            drawerLabel: 'Pedidos Fechados',
            headerTitle: 'Pedidos Fechados',
            drawerIcon: () => <FontAwesome5 name="box" size={20} color="#545454" />,
          }}
        />
        <Drawer.Screen
          name="visualizacao"
          options={{
            drawerLabel: 'Visualização',
            headerTitle: 'Visualização',
            drawerIcon: () => <FontAwesome5 name="eye" size={20} color="#545454" />,
          }}
        />
        <Drawer.Screen
          name="categoria"
          options={{
            drawerLabel: 'categoria',
            headerTitle: 'categoria',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="novacategoria"
          options={{
            drawerLabel: 'novacategoria',
            headerTitle: 'novacategoria',
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  areaperfil: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004aad',
    paddingVertical: 90,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imagemperfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 12,
  },
  nomeusuario: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 35,
    alignItems: 'center',
    width: 200,
    marginBottom: 20,
    marginLeft: 35,
  },
  drawerHeader: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
