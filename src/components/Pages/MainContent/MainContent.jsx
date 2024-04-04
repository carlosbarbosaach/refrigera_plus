import React from 'react';
import './MainContent.css';
import geladeiraBrastemp from '../../../assets/geladeira_brastemp.jpg'

function MainContent() {
  return (
    <main className="MainContent">
      <h2>Bem-vindo ao Refrigera Plus!</h2>

      <div className='ProductContainer'>
        <div className='ProductBox'>
          <div className='ImageContainer'>
        <img src={geladeiraBrastemp} alt="Geladeira BrasTemp" />
          </div>
          <div className='ProductContent'>
            <a href="">Geladeira BrasTemp 2024</a>
            <div className='MindContainer'>
              <div className='BrandContent'>
              <a href="">BrasTemp</a>
              </div>
              <div className='InfoContent'>
              <a href="" className='PriceContent'><small>R$</small> 1.989</a>
              <a href="" className='DescricaoProduct'>Descição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae vehicula nisl. Aenean ut condimentum ipsum. Cras a semper mi. Aenean luctus nibh eu lorem mattis, quis tincidunt diam consectetur. Nulla consectetur nibh ut neque efficitur dapibus. Mauris ultrices consequat vulputate. Vivamus condimentum sem vitae pharetra rutrum.</a>
              </div>
            </div>
            <div className='LowContainer'>
              <button>Comprar</button>
            </div>
          </div>
        </div>
      </div>

      <div className='ProductContainer'>
        <div className='ProductBox'>
          <div className='ImageContainer'>
        <img src={geladeiraBrastemp} alt="Geladeira BrasTemp" />
          </div>
          <div className='ProductContent'>
            <a href="">Geladeira BrasTemp 2024</a>
            <div className='MindContainer'>
              <div className='BrandContent'>
              <a href="">BrasTemp</a>
              </div>
              <div className='InfoContent'>
              <a href="" className='PriceContent'><small>R$</small> 1.989</a>
              <a href="" className='DescricaoProduct'>Descição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae vehicula nisl. Aenean ut condimentum ipsum. Cras a semper mi. Aenean luctus nibh eu lorem mattis, quis tincidunt diam consectetur. Nulla consectetur nibh ut neque efficitur dapibus. Mauris ultrices consequat vulputate. Vivamus condimentum sem vitae pharetra rutrum.</a>
              </div>
            </div>
            <div className='LowContainer'>
              <button>Comprar</button>
            </div>
          </div>
        </div>
      </div>

      <div className='ProductContainer'>
        <div className='ProductBox'>
          <div className='ImageContainer'>
        <img src={geladeiraBrastemp} alt="Geladeira BrasTemp" />
          </div>
          <div className='ProductContent'>
            <a href="">Geladeira BrasTemp 2024</a>
            <div className='MindContainer'>
              <div className='BrandContent'>
              <a href="">BrasTemp</a>
              </div>
              <div className='InfoContent'>
              <a href="" className='PriceContent'><small>R$</small> 1.989</a>
              <a href="" className='DescricaoProduct'>Descição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae vehicula nisl. Aenean ut condimentum ipsum. Cras a semper mi. Aenean luctus nibh eu lorem mattis, quis tincidunt diam consectetur. Nulla consectetur nibh ut neque efficitur dapibus. Mauris ultrices consequat vulputate. Vivamus condimentum sem vitae pharetra rutrum.</a>
              </div>
            </div>
            <div className='LowContainer'>
              <button className='BtnContent'>Comprarr</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
