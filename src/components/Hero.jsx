import heroImage from "../assets/hero.jpg";

function Hero() {
  return (
    <section 
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`
      }}
    >

      <div className="hero-overlay">

        <h1>SINNERS</h1>

        <p>
          Donde la noche se convierte en experiencia
        </p>

        <button>
          Reservaciones
        </button>

      </div>

    </section>
  );
}

export default Hero;