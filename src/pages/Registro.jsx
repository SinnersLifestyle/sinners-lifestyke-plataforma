import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Registro.css";


function Registro() {

  const navigate = useNavigate();

  const { registrar, login } = useAuth();


  const [form, setForm] = useState({

    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    usuario: "",
    password: ""

  });



  const manejarCambio = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };



  const registrarUsuario = (e) => {

    e.preventDefault();


    // Guarda la cuenta del usuario
    registrar(form);


    // Crea sesión automáticamente después del registro
    login(form);


    alert("Bienvenido a SINNERS");



    // Recupera la pantalla que el usuario quería abrir
    const rutaPendiente = localStorage.getItem("rutaPendiente");



    if (rutaPendiente) {


      // Limpia la ruta pendiente

      localStorage.removeItem("rutaPendiente");


      // Regresa al módulo solicitado

      navigate(rutaPendiente);



    } else {


      // Si no había módulo pendiente, va al inicio

      navigate("/");


    }


  };



  return (

    <div className="registro-container">


      <div className="registro-card">


        <h1>SINNERS</h1>

        <h2>Crear cuenta</h2>



        <form onSubmit={registrarUsuario}>


          <input

            name="nombre"

            type="text"

            placeholder="Nombre(s)"

            onChange={manejarCambio}

            required

          />



          <input

            name="apellidos"

            type="text"

            placeholder="Apellidos"

            onChange={manejarCambio}

            required

          />



          <input

            name="email"

            type="email"

            placeholder="Correo electrónico"

            onChange={manejarCambio}

            required

          />



          <input

            name="telefono"

            type="tel"

            placeholder="Teléfono"

            onChange={manejarCambio}

            required

          />



          <input

            name="usuario"

            type="text"

            placeholder="Usuario"

            onChange={manejarCambio}

            required

          />



          <input

            name="password"

            type="password"

            placeholder="Contraseña"

            onChange={manejarCambio}

            required

          />



          <button type="submit">

            Registrarme

          </button>



        </form>



        <p>

          ¿Ya tienes cuenta?{" "}

          <Link to="/login">

            Inicia sesión

          </Link>

        </p>



      </div>


    </div>

  );

}


export default Registro;