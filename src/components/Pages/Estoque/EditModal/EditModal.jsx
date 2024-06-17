import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EditModal.module.scss';

const EditModal = ({ product, onSave, onClose }) => {
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [categorias, setCategorias] = useState([]);
    const [novaImagem, setNovaImagem] = useState(null);
    const [isProdutoSelecionado, setIsProdutoSelecionado] = useState(false);

    useEffect(() => {
        fetch('http://45.235.53.125:8080/api/categoria')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar categorias');
                }
                return response.json();
            })
            .then(data => {
                console.log('Categorias recebidas:', data);
                setCategorias(data);
            })
            .catch(error => {
                console.error('Erro ao buscar categorias:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`handleChange: ${name} => ${value}`);
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log('Nova imagem selecionada:', file);
        setNovaImagem(file);
    };

    const handleSave = () => {
        console.log('Dados do produto a serem salvos:', editedProduct);

        const produtoAtualizado = {
            id: editedProduct.id,
            categoria: {
                id: editedProduct.categoria.id,
                nome: editedProduct.categoria.nome
            },
            descricao: editedProduct.descricao,
            idImagem: editedProduct.idImagem,
            nome: editedProduct.nome,
            preco: editedProduct.preco,
            quantidade: editedProduct.quantidade
        };

        if (novaImagem) {
            console.log('Nova imagem selecionada:', novaImagem.name);

            const formData = new FormData();
            formData.append('file', novaImagem);

            fetch(`http://45.235.53.125:8080/api/produto/addImagem/${editedProduct.id}`, {
                method: 'PATCH',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao adicionar nova imagem');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Nova imagem adicionada com sucesso. ID da imagem:', data.id);
                    
                    produtoAtualizado.idImagem = data.id;
                    atualizarProduto(produtoAtualizado);
                })
                .catch(error => {
                    console.error('Erro ao adicionar nova imagem:', error);
                    alert('Erro ao adicionar nova imagem. Verifique o console para mais detalhes.');
                });
        } else {
            console.log('Nenhuma nova imagem selecionada. Salvando apenas os dados do produto.');
            atualizarProduto(produtoAtualizado);
        }
    };

    const atualizarProduto = (produtoAtualizado) => {
        console.log('Dados do produto a serem atualizados:', produtoAtualizado);

        fetch(`http://45.235.53.125:8080/api/produto`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoAtualizado),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar produto');
                }
                onSave(editedProduct);
                onClose();
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
                alert('Erro ao atualizar produto. Verifique o console para mais detalhes.');
            });
    };

    useEffect(() => {
        setIsProdutoSelecionado(!!editedProduct.id);
    }, [editedProduct]);

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalContent__Heading}>Editar Produto</h2>
                <form>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="nome">Nome:</label>
                        <input className={styles.modalContent__formGroup__Input} type="text" id="nome" name="nome" value={editedProduct.nome} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="preco">Preço:</label>
                        <input className={styles.modalContent__formGroup__Input} type="number" id="preco" name="preco" value={editedProduct.preco} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="quantidade">Quantidade:</label>
                        <input className={styles.modalContent__formGroup__Input} type="number" id="quantidade" name="quantidade" value={editedProduct.quantidade} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="categoria">Categoria:</label>
                        <select className={styles.modalContent__formGroup__Select} id="categoria" name="categoria" value={editedProduct.categoria.id} onChange={handleChange}>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="descricao">Descrição</label>
                        <textarea className={styles.modalContent__formGroup__TextArea} type="text" id="descricao" name="descricao" value={editedProduct.descricao} onChange={handleChange} />
                    </div>
                    <div className={styles.modalContent__formGroup}>
                        <label className={styles.modalContent__formGroup__Label} htmlFor="imagem">Adicionar Nova Imagem:</label>
                        <input className={styles.modalContent__formGroup__Input} type="file" id="imagem" name="imagem" onChange={handleImageChange} />
                    </div>
                    <button type="button" onClick={handleSave} className={styles.modalContent__buttonSave}>Salvar</button>
                    <button type="button" onClick={onClose} className={styles.modalContent__buttonCancel}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

EditModal.propTypes = {
    product: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditModal;
