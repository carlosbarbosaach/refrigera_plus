import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="Header">
      <div className="container">
        <h1>Refrigera PluS</h1>
        <form>
          <input type="text" placeholder="Pesquisar produtos..." />
          <button className='btn_pesquisa' type="submit">Pesquisar</button>
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
