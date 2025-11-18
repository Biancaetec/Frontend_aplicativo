import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PedidoContext } from '../../PedidoContext'; // ajuste o caminho conforme sua estrutura
import { MesaContext } from '../../MesaContext';

export default function VisualizarMesa() {
    const router = useRouter();
    const { pedidosFinalizados } = useContext(PedidoContext);
    const { mesaSelecionada } = useContext(MesaContext);

    const pedidosMesa = pedidosFinalizados.filter(
        p => p.numeroMesa === mesaSelecionada?.numero
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Mesa {mesaSelecionada?.numero}</Text>
            {pedidosMesa.length === 0 ? (
                <Text style={styles.vazio}>Nenhum pedido realizado ainda.</Text>
            ) : (
                <FlatList
                    data={pedidosMesa}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.pedidoCard}>
                            <View style={styles.pedidoHeader}>
                                <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                                <Text style={styles.pedidoData}>{item.data}</Text>
                            </View>

                            <FlatList
                                data={item.produtos}
                                keyExtractor={(prod) => prod.id_produto.toString()}
                                renderItem={({ item: prod }) => (
                                    <View style={styles.produtoLinha}>
                                        <Text style={styles.produtoNome}>{prod.nome}</Text>
                                        <Text style={styles.produtoQtd}>x{prod.quantidade}</Text>
                                        <Text style={styles.produtoPreco}>
                                            R$ {(prod.preco * prod.quantidade).toFixed(2).replace('.', ',')}
                                        </Text>
                                    </View>
                                )}
                            />

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalTexto}>Total:</Text>
                                <Text style={styles.totalValor}>
                                    R$ {item.total.toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            <Text style={styles.status}>{item.status}</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => router.push('/visualizacao')} // ajuste o caminho da tela inicial
            >
                <Text style={styles.textoBotao}>Adicionar Pedido</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    titulo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#004aad',
        textAlign: 'center',
        marginBottom: 20,
    },
    pedidoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    pedidoId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#004aad',
    },
    pedidoData: {
        fontSize: 14,
        color: '#666',
    },
    produtoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    produtoNome: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    produtoQtd: {
        width: 40,
        textAlign: 'center',
        color: '#555',
    },
    produtoPreco: {
        fontSize: 15,
        fontWeight: '500',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
        paddingTop: 6,
    },
    totalTexto: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalValor: {
        fontSize: 16,
        fontWeight: '700',
        color: '#004aad',
    },
    status: {
        marginTop: 8,
        fontStyle: 'italic',
        color: '#007b00',
        fontWeight: '600',
    },
    botaoAdicionar: {
        backgroundColor: '#004aad',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    vazio: {
        textAlign: 'center',
        color: '#777',
        marginTop: 50,
        fontSize: 16,
    },
});
