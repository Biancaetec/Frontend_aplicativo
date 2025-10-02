import React from 'react';    
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { MesaProvider } from '../../MesaContext';
import { CategoriaProvider } from '../../CategoriaContext';
import { AdicionalProvider } from '../../AdicionalContext';
import { ProdutoProvider } from '../../ProdutoContext';

// ================= HEADER CUSTOMIZADO =================
function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={headerStyles.headerWrapper}>
      <View style={headerStyles.headerContainer}>
        {/* Botão de Menu + Texto */}
        <TouchableOpacity
          style={headerStyles.leftContainer}
          onPress={() => navigation.toggleDrawer()}
        >
          <FontAwesome5 name="bars" size={18} color="#fff" />
          <Text style={headerStyles.headerTitle}>Filtrar</Text>
        </TouchableOpacity>

        {/* Ícones da direita */}
        <View style={headerStyles.rightIcons}>
          <TouchableOpacity style={headerStyles.iconButton}>
            <FontAwesome5 name="clock" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.iconButton}>
            <FontAwesome5 name="pen" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#004aad',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
});

// ================= DRAWER CUSTOMIZADO =================
function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* Perfil no topo */}
      <View style={styles.areaperfil}>
        <Image style={styles.imagemperfil} />
        <Text style={styles.nomeusuario}>
          {user?.restaurante?.nome || 'Nome do Usuário'}
        </Text>
      </View>

      {/* Lista de Itens */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botão Sair */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signOut();
          router.replace('/');
        }}
      >
        <Text style={{ color: 'white', fontSize: 15 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// ================= LAYOUT PRINCIPAL =================
export default function Layout() {
  const { user } = useAuth();

  if (!user?.authenticated) {
    router.replace('/');
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MesaProvider>
        <CategoriaProvider>
          <AdicionalProvider> 
             <ProdutoProvider>
      <Drawer
        screenOptions={{
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
            header: () => <CustomHeader />, // header só na página Início
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="administracao"
          options={{
            drawerLabel: 'Administração',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="admin-panel-settings" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="pedidosfechados"
          options={{
            drawerLabel: 'Pedidos Fechados',
            drawerIcon: () => (
              <FontAwesome5 name="box" size={20} color="#545454" />
            ),
          }}
        />
        <Drawer.Screen
          name="visualizacao"
          options={{
            drawerLabel: 'Visualização',
            drawerIcon: () => (
              <FontAwesome5 name="eye" size={20} color="#545454" />
            ),
          }}
        />
        <Drawer.Screen
          name="categoria"
          options={{
            drawerLabel: 'categoria',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="novacategoria"
          options={{
            drawerLabel: 'novacategoria',
            drawerItemStyle: { display: 'none' },
          }}
        />
         <Drawer.Screen
          name="mesa"
          options={{
            drawerLabel: 'Mesa',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="novamesa"
          options={{
            drawerLabel: 'novamesa',
            drawerItemStyle: { display: 'none' },
          }}
        />
         {/* adicional */}
    <Drawer.Screen
      name="adicional"
      options={{
        drawerLabel: 'adicional',
        drawerItemStyle: { display: 'none' },
      }}
    />
    <Drawer.Screen
      name="novoadicional"
      options={{
        drawerLabel: 'novoadicional',
        drawerItemStyle: { display: 'none' },
      }}
    />
      {/* produto */}
    <Drawer.Screen
      name="produto"
      options={{
        drawerLabel: 'produto',
        drawerItemStyle: { display: 'none' },
      }}
    />
    <Drawer.Screen
      name="novoproduto"
      options={{
        drawerLabel: 'novoproduto',
        drawerItemStyle: { display: 'none' },
      }}
    />
      </Drawer>
           </ProdutoProvider>
         </AdicionalProvider>
        </CategoriaProvider>
       </MesaProvider>
    </GestureHandlerRootView>
  );
}

// ================= ESTILOS DO DRAWER =================
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
});
