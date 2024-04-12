import React from 'react';
import './GestaoContent.css';

function GestaoContent() {
  return (
    <>
    <main className='GestaoContent'>
      <h2>Página de Gestão</h2>
      <p>Aqui você pode gerenciar suas operações.</p>

      <div className='GestaoContainer'>
        <div className='GestaoBox'>
        <a href="">Análise de Dados e Relatórios</a>
          <a href="">Gestão de Promoções e Descontos</a>
          <a href="">Gestão Financeira e Contabilidade</a>
        </div>
      </div>
    </main>
    </>
  );
}

export default GestaoContent;
