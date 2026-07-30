import './App.css'
import logo from './assets/logo.png'

function App() {

  return (
    <div className="home">

      <nav className="navbar">

        <div className="logo">
          SINNERS
        </div>

        <div className="menu">
          <span>Eventos</span>
          <span>Productos</span>
          <span>Reservaciones</span>
        </div>

      </nav>


      <section className="hero">

        <h1>SINNERS</h1>

        <p>
          Lifestyle • Events • Experience
        </p>

      </section>


      <section className="club">

        <h2>Sobre el Club</h2>

      </section>


      <section className="gallery">

        <h2>Eventos Pasados</h2>

        <div className="photos">

          <div className="photo"></div>
          <div className="photo"></div>
          <div className="photo"></div>
          <div className="photo"></div>

        </div>

      </section>


      <footer>

        <div className="social">

          <span>Instagram</span>
          <span>Facebook</span>
          <span>TikTok</span>
          <span>WhatsApp</span>

        </div>

      </footer>


    </div>
  )
}

export default App