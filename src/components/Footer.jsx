import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="section">
          <h4>Hospital XYZ</h4>
          <p>Av. Saúde, 123 — Fortaleza, CE</p>
          <p>Telefone: (85) 99999-9999</p>
        </div>

        <div className="section">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>

        <div className="section">
          <h4>Desenvolvedores</h4>
          <p>Ana Nóbrega</p>
          <p>Lorena Rodrigues</p>
          <p>Maurício Gonçalves</p>
          <p>Vladimir Lima</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Hospital XYZ. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
