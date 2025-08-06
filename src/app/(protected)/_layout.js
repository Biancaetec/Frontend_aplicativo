import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.areaperfil}>
        <Image
          //source={require('../../../src/assets/images/usuario.png')} // adicione sua imagem aqui
          style={styles.imagemperfil}
        />
        <Text style={styles.nomeusuario}>Nome do Usuário</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Sair clicado');
          // aqui você pode adicionar lógica de logout, ex: limpar token e redirecionar
        }}
      >
        <Text style={{ color: 'white', fontSize: 15 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Início',
            headerTitle: 'Início',
            drawerIcon: () => <MaterialIcons name="home" size={28} color="#3e3e3e" />,
          }}
        />
        <Drawer.Screen
          name="administração"
          options={{
            drawerLabel: 'Administração',
            headerTitle: 'Administração',
            drawerIcon: () => <MaterialIcons name="admin-panel-settings" size={24} color="#3e3e3e" />,
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
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default function Layout() {
  return <DrawerLayout />;
}

const styles = StyleSheet.create({
  areaperfil: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004aad',
    paddingVertical: 40,
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
});
