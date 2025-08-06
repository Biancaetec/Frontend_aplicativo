import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image
          //source={require('../../../src/assets/images/usuario.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Nome do Usuário</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.button} onPress={() => {
        
        console.log('Sair clicado');
      }}>
        <Text style={{ color: "white", fontSize: 15 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}> 
      // removi o index do Drawer para evitar conflito com o arquivo index.js
      <Drawer.Screen
      name="index"
      options={{
        drawerLabel: () => null,
        drawerItemStyle: { height: 0 },
      }}
    />
        <Drawer.Screen
          name="administração"
          options={{
            drawerLabel: "Administrador",
            headerTitle: "Administrador",
            drawerIcon: () => <MaterialIcons name="admin-panel-settings" size={24} color="#3e3e3e" />
          }}
        />
        <Drawer.Screen
          name="pedidosfechados"
          options={{
            drawerLabel: "Pedidos Fechados",
            headerTitle: "Pedidos Fechados",
            drawerIcon: () => <FontAwesome5 name="box" size={20} color="#545454" />
          }}
        />
        <Drawer.Screen
          name="visualizacao"
          options={{
            drawerLabel: "Visualização",
            headerTitle: "Visualização",
            drawerIcon: () => <FontAwesome5 name="eye" size={20} color="#545454" />
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
  profileContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 35,
    alignItems: "center",
    width: 200,
    marginBottom: 20,
    marginLeft: 35,
  },
});
