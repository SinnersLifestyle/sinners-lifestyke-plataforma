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



  const registrarUsuario = async (e) => {

    e.preventDefault();


    try {


      // Guarda usuario en Spring Boot + MySQL

      const usuarioGuardado = await registrar(form);



      // Inicia sesión automáticamente

      login(usuarioGuardado);



      alert("Bienvenido a SINNERS");



      // Recupera pantalla pendiente

      const rutaPendiente = localStorage.getItem("rutaPendiente");



      if (rutaPendiente) {


        localStorage.removeItem("rutaPendiente");


        navigate(rutaPendiente);


      } else {


        navigate("/");


      }



    } catch (error) {


      console.error("Error al registrar usuario:", error);


      alert("No se pudo registrar el usuario");


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

            value={form.nombre}

            onChange={manejarCambio}

            required

          />



          <input

            name="apellidos"

            type="text"

            placeholder="Apellidos"

            value={form.apellidos}

            onChange={manejarCambio}

            required

          />



          <input

            name="email"

            type="email"

            placeholder="Correo electrónico"

            value={form.email}

            onChange={manejarCambio}

            required

          />



          <input

            name="telefono"

            type="tel"

            placeholder="Teléfono"

            value={form.telefono}

            onChange={manejarCambio}

            required

          />



          <input

            name="usuario"

            type="text"

            placeholder="Usuario"

            value={form.usuario}

            onChange={manejarCambio}

            required

          />



          <input

            name="password"

            type="password"

            placeholder="Contraseña"

            value={form.password}

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