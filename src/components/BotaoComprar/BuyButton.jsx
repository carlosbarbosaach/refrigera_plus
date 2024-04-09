import React from 'react';
import './BuyButton.css';

function BuyButton({ onClick }) {
  return (
    <button className="BuyButton" onClick={onClick}>
      Comprar
    </button>
  );
}

export default BuyButton;
