import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PedidoContext } from '../../PedidoContext';
import { MesaContext } from '../../MesaContext';
import { ProdutoContext } from '../../ProdutoContext';
import BotaoVoltar from './botaovoltar';

export default function VisualizarMesa() {
    const router = useRouter();
    const { pedidosCompleto, carregarPedidosCompleto, atualizarStatusPedido, limparPedidosDaMesa } = useContext(PedidoContext);
    const { mesaSelecionada } = useContext(MesaContext);
    const { produtos, loading: produtosLoading } = useContext(ProdutoContext);
    const [filtroStatus, setFiltroStatus] = useState("aberto");

    useEffect(() => {
        carregarPedidosCompleto();
    }, []);

    if (!mesaSelecionada) {
        return (
            <View style={styles.container}>
                <Text style={styles.vazio}>Nenhuma mesa selecionada.</Text>
            </View>
        );
    }

    // Filtrar apenas os pedidos daquela mesa
    const pedidosMesa = (pedidosCompleto ?? []).filter(
        p => p.id_mesa === mesaSelecionada.id_mesa
    );

    // Filtrar pelo status selecionado
    const pedidosFiltrados = pedidosMesa.filter(pedido => {
        if (filtroStatus === "aberto") {
            return ["pendente", "em_preparo", "entregue"].includes(pedido.status);
        } else {
            return pedido.status === "fechado";
        }
    });

    return (
        <View style={styles.container}>
        <BotaoVoltar destino="home" />
            <Text style={styles.titulo}>Mesa {mesaSelecionada.numero}</Text>

            {/* ---------- FILTRO ABERTO / FECHADO + LIMPAR ---------- */}
            <View style={styles.filtroContainer}>
                <TouchableOpacity
                    style={[styles.filtroBotao, filtroStatus === "aberto" && styles.filtroAtivo]}
                    onPress={() => setFiltroStatus("aberto")}
                >
                    <Text style={[styles.filtroTexto, filtroStatus === "aberto" && styles.filtroTextoAtivo]}>Aberto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filtroBotao, filtroStatus === "fechado" && styles.filtroAtivo]}
                    onPress={() => setFiltroStatus("fechado")}
                >
                    <Text style={[styles.filtroTexto, filtroStatus === "fechado" && styles.filtroTextoAtivo]}>Fechado</Text>
                </TouchableOpacity>

                {/* BOTÃO VERMELHO PARA LIMPAR PEDIDOS */}
                <TouchableOpacity
                    style={styles.botaoLimpar}
                    onPress={() => {
                        Alert.alert(
                            "Confirmar",
                            "Deseja realmente limpar todos os pedidos desta mesa?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                { text: "Sim", style: "destructive", onPress: () => limparPedidosDaMesa(mesaSelecionada.id_mesa) }
                            ]
                        );
                    }}
                >
                    <Text style={styles.botaoLimparTexto}>Limpar</Text>
                </TouchableOpacity>
            </View>


            {pedidosFiltrados.length === 0 ? (
                <Text style={styles.vazio}>Nenhum pedido nesta categoria.</Text>
            ) : (
                <FlatList
                    data={pedidosFiltrados}
                    keyExtractor={(item) => item.id_pedido.toString()}
                    renderItem={({ item }) => {
                        // pedido.id e itens (sem log para produção)

                        return (
                            <View style={styles.pedidoCard}>
                                <View style={styles.pedidoHeader}>
                                    <Text style={styles.pedidoId}>Pedido #{item.id_pedido}</Text>
                                    <Text style={styles.pedidoData}>
                                        {new Date(item.data_abertura).toLocaleString()}
                                    </Text>
                                </View>

                                <FlatList
                                    data={item.itens?.filter(i => i)}
                                    keyExtractor={(prod, index) => `${prod?.id_produto ?? index}`}
                                    renderItem={({ item: prod }) => {
                                        // Tentar obter nome direto do item ou procurar no catálogo de produtos pelo id
                                        const lookupNome = produtos?.find(p => Number(p.id_produto) === Number(prod?.id_produto))?.nome;
                                        let nomeProduto = prod?.nome || prod?.nome_produto || prod?.produto?.nome || prod?.produto?.nome_produto || prod?.nomeProduto || lookupNome;
                                        if (!nomeProduto) {
                                            nomeProduto = produtosLoading ? 'Carregando...' : 'Produto';
                                        }
                                        const quantidade = prod?.quantidade ?? 1;
                                        const precoUnit = Number(prod?.preco_unitario ?? prod?.preco ?? 0);
                                        return (
                                            <View style={styles.produtoLinha}>
                                                <Text style={styles.produtoNome}>{nomeProduto}</Text>
                                                <Text style={styles.produtoQtd}>x{quantidade}</Text>
                                                <Text style={styles.produtoPreco}>
                                                    R$ {(precoUnit * quantidade)
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                />

                                {/* Observações destacadas */}
                                {item.observacoes ? (
                                    <View style={styles.observacoesBox}>
                                        <View style={styles.observacoesLinha} />
                                        <Text style={styles.observacoesTitulo}>Observações</Text>
                                        <Text style={styles.observacoesTexto}>{item.observacoes}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.totalContainer}>
                                    <Text style={styles.totalTexto}>Total:</Text>
                                    <Text style={styles.totalValor}>
                                        R$ {item.valor_total.toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>

                                {/* Status: vermelho se fechado */}
                                <Text style={[
                                    styles.status,
                                    item.status === "fechado" && { color: "red" }
                                ]}>
                                    Status: {item.status}
                                </Text>

                                {/* ---------- BOTÕES DE STATUS ---------- */}
                                {item.status !== "fechado" && (
                                    <View style={styles.botoesContainer}>
                                        <TouchableOpacity
                                            style={[styles.botaoStatus, { backgroundColor: '#FFA500' }]}
                                            onPress={() => atualizarStatusPedido(item.id_pedido, "em_preparo")}
                                        >
                                            <Text style={styles.botaoStatusTexto}>Em Preparo</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.botaoStatus, { backgroundColor: '#007b00' }]}
                                            onPress={() => atualizarStatusPedido(item.id_pedido, "entregue")}
                                        >
                                            <Text style={styles.botaoStatusTexto}>Entregue</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.botaoStatus, { backgroundColor: '#444' }]}
                                            onPress={() => atualizarStatusPedido(item.id_pedido, "fechado")}
                                        >
                                            <Text style={styles.botaoStatusTexto}>Fechado</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {/* -------------------------------------- */}

                            </View>
                        );
                    }}
                />
            )}

            <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => router.push('/visualizacao')}
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
        marginBottom: 10,
    },
    filtroContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    filtroBotao: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#004aad',
        marginHorizontal: 5,
    },
    filtroAtivo: {
        backgroundColor: '#004aad',
    },
    filtroTexto: {
        color: '#004aad',
        fontWeight: '600',
    },
    filtroTextoAtivo: {
        color: '#fff',
        fontWeight: '700',
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
    produtoNomePlaceholder: {
        fontSize: 15,
        color: '#888',
        fontStyle: 'italic',
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
    observacoesTexto: {
        marginTop: 6,
        fontStyle: 'italic',
        color: '#222',
        marginBottom: 8,
        fontSize: 15,
        backgroundColor: '#f4f8ff',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#cdd7ee',
    },
    observacoesBox: {
        marginTop: 12,
        marginBottom: 10,
        paddingHorizontal: 2,
    },
    observacoesLinha: {
        borderTopWidth: 1,
        borderTopColor: '#cdd7ee',
        marginBottom: 8,
    },
    observacoesTitulo: {
        fontWeight: '700',
        fontSize: 16,
        color: '#004aad',
        marginBottom: 4,
        marginLeft: 2,
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
        marginTop: 10,
        fontStyle: 'italic',
        color: '#333',
        fontWeight: '600',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    botaoStatus: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    botaoStatusTexto: {
        color: '#fff',
        textAlign: 'center',
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
    botaoLimpar: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'red',
        marginLeft: 10,
    },
    botaoLimparTexto: {
        color: '#fff',
        fontWeight: '700',
    },

});
