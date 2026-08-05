import heroImage from "../assets/hero.jpg";
import { useNavigate } from "react-router-dom";


function Hero() {

  const navigate = useNavigate();


  const validarReservacion = () => {


    localStorage.setItem(
      "rutaPendiente",
      "/reservaciones"
    );


    const usuarioRegistrado =
      localStorage.getItem("usuario");


    if(usuarioRegistrado){

      navigate("/login");


    }else{

      navigate("/registro");

    }


  };


  return (

    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`
      }}
    >


      <div className="hero-overlay">


        <h1>
          SINNERS
        </h1>


        <p>
          Donde la noche se convierte en experiencia
        </p>


        <button
          onClick={validarReservacion}
        >
          RESERVACIONES
        </button>


      </div>


    </section>

  );

}


export default Hero;