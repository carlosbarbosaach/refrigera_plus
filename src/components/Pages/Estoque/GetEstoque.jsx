import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles/Pages/Estoque/EstoqueContent.module.scss';
import './GetEstoque.css';

const GetEstoque = () => {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [produtoParaEditar, setProdutoParaEditar] = useState(null);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const [editedProduto, setEditedProduto] = useState({
        id: '',
        nome: '',
        quantidade: 0,
        preco: 0,
        categoriaId: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const responseProdutos = await fetch('http://45.235.53.125:8080//api/produto');
                if (!responseProdutos.ok) {
                    throw new Error('Erro ao obter produtos: ' + responseProdutos.statusText);
                }
                const dataProdutos = await responseProdutos.json();
                setProdutos(dataProdutos);
            } catch (error) {
                console.error('Erro ao obter produtos:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const responseCategorias = await fetch('http://45.235.53.125:8080//api/categoria');
                if (!responseCategorias.ok) {
                    throw new Error('Erro ao obter categorias: ' + responseCategorias.statusText);
                }
                const dataCategorias = await responseCategorias.json();
                setCategorias(dataCategorias);
            } catch (error) {
                console.error('Erro ao obter categorias:', error);
            }
        };

        fetchProdutos();
        fetchCategorias();
    }, []);

    const handleDelete = async () => {
        if (produtoParaExcluir) {
            try {
                const response = await fetch(`http://45.235.53.125:8080//api/produto/${produtoParaExcluir.id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erro ao excluir produto');
                }
                // Atualiza a lista de produtos após a exclusão
                const updatedProdutos = produtos.filter(produto => produto.id !== produtoParaExcluir.id);
                setProdutos(updatedProdutos);
                setProdutoParaExcluir(null); // Fecha o modal de confirmação
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        }
    };

    const handleEdit = async () => {
        if (editedProduto.id) {
            try {
                const response = await fetch(`http://45.235.53.125:8080//api/produto/${editedProduto.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedProduto)
                });
                if (!response.ok) {
                    throw new Error('Erro ao editar produto');
                }
                // Atualiza a lista de produtos após a edição
                const updatedProdutos = produtos.map(produto => {
                    if (produto.id === editedProduto.id) {
                        return editedProduto;
                    }
                    return produto;
                });
                setProdutos(updatedProdutos);
                setProdutoParaEditar(null); // Fecha o modal de edição
            } catch (error) {
                console.error('Erro ao editar produto:', error);
            }
        }
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProduto({
            ...editedProduto,
            [name]: value
        });
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setProdutoParaEditar(null); // Limpa os dados do produto a ser editado ao fechar o modal
        setProdutoParaExcluir(null); // Limpa os dados do produto a ser excluído ao fechar o modal
    };

    return (
        <>
            <div className={Styles.EstoqueContent}>
                <h1 className={Styles.EstoqueContent__title}>Lista de Produtos</h1>
                {produtos.map(produto => (
                    <div className={Styles.EstoqueContent__gapBox}>
                        <div className={Styles.EstoqueContent__gapBox__box} key={produto.id}>
                            <h2 className={Styles.EstoqueContent__text}>{produto.nome}</h2>
                            <p className={Styles.EstoqueContent__text}>Quantidade: {produto.quantidade}</p>
                            <p className={Styles.EstoqueContent__text}>Preço: {produto.preco}</p>
                            <div className={Styles.EstoqueContent__buttons}>
                                <button className={Styles.EstoqueContent__buttons__edit_button} onClick={() => { setProdutoParaEditar(produto); openModal(); }}>Editar</button>
                                <button className={Styles.EstoqueContent__buttons__delete_button} onClick={() => { setProdutoParaExcluir(produto); openModal(); }}>Excluir</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-editar">
                    <div className="modal-content-editar">
                        {produtoParaEditar && (
                            <>
                                <h2>Editar Produto</h2>
                                <form onSubmit={handleEdit}>
                                    <div>
                                        <label>Nome:</label>
                                        <input type="text" name="nome" value={editedProduto.nome} onChange={handleEditInputChange} />
                                    </div>
                                    <div>
                                        <label>Quantidade:</label>
                                        <input type="number" name="quantidade" value={editedProduto.quantidade} onChange={handleEditInputChange} />
                                    </div>
                                    <div>
                                        <label>Preço:</label>
                                        <input type="number" name="preco" value={editedProduto.preco} onChange={handleEditInputChange} />
                                    </div>
                                    <div>
                                        <label>Categoria:</label>
                                        <select name="categoriaId" value={editedProduto.categoriaId} onChange={handleEditInputChange}>
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit">Salvar</button>
                                    <button onClick={closeModal}>Cancelar</button>
                                </form>
                            </>
                        )}
                        {produtoParaExcluir && (
                            <>
                                <h2>Confirmar Exclusão</h2>
                                <p>Deseja realmente excluir o produto "{produtoParaExcluir.nome}"?</p>
                                <button onClick={handleDelete}>Sim</button>
                                <button onClick={closeModal}>Não</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default GetEstoque;
