import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles/Pages/Estoque/EstoqueContent.module.scss';
import LupaIcon from '../../../assets/icon_lupa.svg';
import { toast, ToastContainer } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';

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
        categoriaId: '',
        idImagem: ''
    });
    const [imagem, setImagem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const responseProdutos = await fetch('http://45.235.53.125:8080/api/produto');
                if (!responseProdutos.ok) {
                    throw new Error('Erro ao obter produtos: ' + responseProdutos.statusText);
                }
                const dataProdutos = await responseProdutos.json();
                setProdutos(dataProdutos);
                setCarregando(false);
            } catch (error) {
                console.error('Erro ao obter produtos:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const responseCategorias = await fetch('http://45.235.53.125:8080/api/categoria');
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
                const response = await fetch(`http://45.235.53.125:8080/api/produto/${produtoParaExcluir.id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erro ao excluir produto');
                }
                const updatedProdutos = produtos.filter(produto => produto.id !== produtoParaExcluir.id);
                setProdutos(updatedProdutos);
                setProdutoParaExcluir(null);
                toast.success('Produto excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                toast.error('Erro ao excluir produto.');
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (editedProduto.id) {
            try {
                // Primeiro, envie a imagem para o servidor e obtenha o ID da imagem
                const idImagem = await enviarImagemParaServidor();

                // Em seguida, atualize o produto com o ID da imagem
                const response = await fetch('http://45.235.53.125:8080/api/produto', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: editedProduto.id,
                        nome: editedProduto.nome,
                        quantidade: editedProduto.quantidade,
                        preco: editedProduto.preco,
                        categoria: {
                            id: editedProduto.categoriaId,
                            nome: categorias.find(categoria => categoria.id === editedProduto.categoriaId)?.nome || ''
                        },
                        descricao: editedProduto.descricao,
                        idImagem: idImagem, // Aqui você passa o ID da imagem
                    })
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                // Se o produto foi atualizado com sucesso, exibir mensagem e atualizar estado
                const contentType = response.headers.get('content-type');
                let updatedProduto;
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    updatedProduto = await response.json();
                } else {
                    const successMessage = await response.text();
                    console.log('Success message from server:', successMessage);
                    updatedProduto = {
                        ...editedProduto,
                        categoria: categorias.find(categoria => categoria.id === editedProduto.categoriaId),
                    };
                }

                const updatedProdutos = produtos.map(produto =>
                    produto.id === updatedProduto.id ? updatedProduto : produto
                );
                setProdutos(updatedProdutos);
                setProdutoParaEditar(null);
                closeModal();
                toast.success('Produto editado com sucesso!');
            } catch (error) {
                console.error('Erro ao editar produto:', error.message);
                toast.error(`Erro ao editar produto: ${error.message}`);
            }
        }
    };


    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProduto({
            ...editedProduto,
            [name]: name === 'quantidade' || name === 'preco' || name === 'categoriaId' ? Number(value) : value,
        });
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setProdutoParaEditar(null);
        setProdutoParaExcluir(null);
        setImagem(null);
    };

    const handleSearchChange = (event) => {
        setPesquisa(event.target.value);
    };

    const filtrarProdutos = (produto) => {
        return produto.nome.toLowerCase().includes(pesquisa.toLowerCase());
    };

    const produtosFiltrados = produtos.filter(filtrarProdutos);

    return (
        <>
            <div className={Styles.EstoqueContent}>
                {carregando ? (
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#3889F2', '#076DF2', '#0554F2', '#3889F2', '#0554F2']}
                    />
                ) : (
                    <div>
                        <div className={Styles.EstoqueContent__searchInput}>
                            <input
                                type="text"
                                placeholder="Pesquisar produtos..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                                className={Styles.EstoqueContent__searchInput__Styles}
                            />
                            <img className={Styles.EstoqueContent__searchInput__lupaIcon} src={LupaIcon} alt="Icone de Lupa" />
                        </div>
                        <h1 className={Styles.EstoqueContent__title}>Lista de Produtos</h1>
                        {produtosFiltrados.map(produto => (
                            <div className={Styles.EstoqueContent__gapBox} key={produto.id}>
                                <div className={Styles.EstoqueContent__gapBox__box}>
                                    <h2 className={Styles.EstoqueContent__text}>{produto.id}</h2>
                                    <h2 className={Styles.EstoqueContent__text}>{produto.nome}</h2>
                                    <p className={Styles.EstoqueContent__text}>Categoria: {produto.categoria.nome}</p>
                                    <p className={Styles.EstoqueContent__text}>Quantidade: {produto.quantidade}</p>
                                    <p className={Styles.EstoqueContent__text}>Preço: {produto.preco}</p>
                                    <div className={Styles.EstoqueContent__buttons}>
                                        <button className={Styles.EstoqueContent__buttons__edit_button} onClick={() => { setProdutoParaEditar(produto); setEditedProduto(produto); openModal(); }}>Editar</button>
                                        <button className={Styles.EstoqueContent__buttons__delete_button} onClick={() => { setProdutoParaExcluir(produto); openModal(); }}>Excluir</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <div className={Styles.modal__editar}>
                    <div className={Styles.modal__editar_content}>
                        <button className={Styles.modal__editar__close} onClick={closeModal}>X</button>
                        {produtoParaEditar && !produtoParaExcluir && (
                            <>
                                <h2 className={Styles.modal__editar__title}>Editar Produto</h2>
                                <form className={Styles.modal__editar__form} onSubmit={handleEdit}>
                                    <div className={Styles.modal__editar__content}>
                                        <label className={Styles.modal__editar__label}>Nome:</label>
                                        <input
                                            className={Styles.modal__editar__input}
                                            type="text"
                                            name="nome"
                                            value={editedProduto.nome}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={Styles.modal__editar__label}>Quantidade:</label>
                                        <input
                                            className={Styles.modal__editar__input}
                                            type="number"
                                            name="quantidade"
                                            value={editedProduto.quantidade}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={Styles.modal__editar__label}>Preço:</label>
                                        <input
                                            className={Styles.modal__editar__input}
                                            type="number"
                                            name="preco"
                                            value={editedProduto.preco}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={Styles.modal__editar__label}>Categoria:</label>
                                        <select
                                            className={Styles.modal__editar__select}
                                            name="categoriaId"
                                            value={editedProduto.categoriaId}
                                            onChange={handleEditInputChange}
                                        >
                                            <option className={Styles.modal__editar__option} value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={Styles.modal__editar__label}>Imagem:</label>
                                        <input
                                            className={Styles.modal__editar__input}
                                            type="file"
                                            onChange={(e) => setImagem(e.target.files[0])}
                                        />
                                    </div>
                                    <button className={Styles.modal__editar__save} type="submit">Salvar</button>
                                    <button className={Styles.modal__editar__cancel} type="button" onClick={closeModal}>Cancelar</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {produtoParaExcluir && (
                <div className={Styles.Modal} onClick={closeModal}>
                    <div className={Styles.Modal__content} onClick={(e) => e.stopPropagation()}>
                        <button className={Styles.Modal__close} onClick={closeModal}>X</button>
                        <div className={Styles.EstoqueExcluir}>
                            <h2 className={Styles.EstoqueExcluir__title}>Confirmar Exclusão</h2>
                            <p className={Styles.EstoqueExcluir__subtitle}>Deseja realmente excluir o produto <span className={Styles.EstoqueExcluir__span}>"{produtoParaExcluir.nome}"?</span></p>
                            <button className={Styles.EstoqueExcluir__yes} onClick={handleDelete}>Sim</button>
                            <button className={Styles.EstoqueExcluir__no} onClick={closeModal}>Não</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default GetEstoque;