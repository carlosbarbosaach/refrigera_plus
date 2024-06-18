import React, { useState, useEffect } from 'react';
import styles from './ModalDetalhesProduto.module.scss';


const ModalDetalhesProduto = ({ productId, isOpen, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://45.235.53.125:8080/api/produto/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }

    }, [productId]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar produto: {error.message}</div>;
    }

    if (!product) {
        return <div>Nenhum produto encontrado</div>;
    }

    return (
        <>
            <div className={styles.Modal}>
                <div className={styles.Modal__Content}>
                    <button className={styles.Modal__closeButton} onClick={onClose}>x</button>
                    <div className={styles.Modal__Imagem}>
                        <img src={`http://45.235.53.125:8080/api/imagem/${product.idImagem}`} width="450" height="300" loading="lazy" alt="Imagem do produto" />
                    </div>
                    <h3 className={styles.Modal__Heading}>{product.nome}</h3>
                    <p className={styles.Modal__Paragraph}><span className={styles.Modal__Paragraph__span}>Categoria:</span> {product.categoria?.nome}</p>
                    <p className={styles.Modal__Paragraph}><span className={styles.Modal__Paragraph__span}>Descrição:</span> {product.descricao}</p>
                    <p className={styles.Modal__Paragraph}><span className={styles.Modal__Paragraph__span}>Preço:</span> R$ {product.preco.toFixed(2)}</p>
                    <p className={styles.Modal__Paragraph}><span className={styles.Modal__Paragraph__span}>Quantidade:</span> {product.quantidade} unidade</p>
                </div>
            </div>
        </>

    );
};

export default ModalDetalhesProduto;
