import React from 'react';
import InputPesquisar from './components/InputPesquisar/InputPesquisar'
import BtnPesquisar from './components/BotaoPesquisar/BtnPesquisar'
import './Header.css';

function Header() {
  return (
    <header className="Header">
      <div className="container">
        <h1>Refrigera PluS</h1>
        <form>
          <InputPesquisar />
          <BtnPesquisar />
        </form>
        <nav>
          <ul>
            <li><a href="/">Página Inicial</a></li>
            <li><a href="/gestao">Gestão</a></li>
            <li><a href="/estoque">Estoque</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
