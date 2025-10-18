"use client"

import React from 'react'
import styles from './footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <h3>Atendimento</h3>
            <p>Segunda a Sexta: 9h às 18:30h</p>
            <p>Domingo: 9h às 12h</p>
          </div>
          <div>
            <h3>Entrega</h3>
            <p>Frete grátis acima de R$ 199</p>
            <p>Entrega em até 24h</p>
          </div>
          <div>
            <h3>Pagamento</h3>
            <p>12x sem juros no cartão</p>
            <p>PIX com 5% de desconto</p>
          </div>
          <div>
            <h3>Garantia</h3>
            <p>Produtos originais da marca</p>
            <p>Garantia do fabricante</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 Solucell. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
