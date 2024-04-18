import React from "react";

function Modal({ produtosNoCarrinho, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Produtos Comprados</h2>
                <ul>
                    {Object.keys(produtosNoCarrinho).map((produtoId) => (
                        <li key={produtoId}>
                            Produto: {produtoId} - Quantidade: {produtosNoCarrinho[produtoId]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Modal;