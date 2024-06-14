import React, { useState, useEffect } from 'react';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import GenerateReportButton from './GenerateReportButton';
import styles from '../../../Styles/Pages/Estoque/ListaEstoque.module.scss';

const ListaEstoque = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await fetch('http://45.235.53.125:8080/api/produto');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProdutos(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    const handleDelete = (id) => {
        setProdutos(produtos.filter((produto) => produto.id !== id));
    };

    const handleEdit = (produto) => {
        console.log('Editando produto:', produto);
    };

    const handleGenerateReport = () => {
        const header = ['ID', 'Nome', 'Preço', 'Descrição', 'Quantidade'];
        const rows = produtos.map(produto => [
            produto.id,
            produto.nome,
            `R$ ${produto.preco.toFixed(2)}`,
            produto.descricao,
            produto.quantidade
        ]);

        const csvContent = [
            header.join(';'),
            ...rows.map(row => row.join(';'))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'relatorio_estoque.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar produtos: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <GenerateReportButton onClick={handleGenerateReport} />
            <table className={styles.table}>
                <thead className={styles.table__tSection}>
                    <tr className={styles.table__tRow}>
                        <th className={styles.table__tHeader}>ID</th>
                        <th className={styles.table__tHeader}>Nome</th>
                        <th className={styles.table__tHeader}>Preço</th>
                        <th className={styles.table__tHeader}>Descrição</th>
                        <th className={styles.table__tHeader}>Quantidade</th>
                        <th className={styles.table__tHeader__Button}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr className={styles.table__tRow} key={produto.id}>
                            <td className={styles.table__tDetailed}>{produto.id}</td>
                            <td className={styles.table__tDetailed}>{produto.nome}</td>
                            <td className={styles.table__tDetailed}>R$ {produto.preco.toFixed(2)}</td>
                            <td className={styles.table__tDetailed}>{produto.descricao}</td>
                            <td className={styles.table__tDetailed}>{produto.quantidade}</td>
                            <td className={styles.table__tDetailed__Buttons}>
                                <EditButton product={produto} onEdit={handleEdit} />
                                <DeleteButton productId={produto.id} productName={produto.nome} onDelete={handleDelete} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaEstoque;
