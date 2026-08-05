import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [form, setForm] = useState({

    email: "",
    password: ""

  });



  const manejarCambio = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };



  const iniciarSesion = async (e) => {


    e.preventDefault();


    try {


      const respuesta = await fetch(
        "http://localhost:8080/usuarios"
      );


      const usuarios = await respuesta.json();



      const usuarioEncontrado = usuarios.find(

        (usuario) =>

          usuario.email === form.email &&

          usuario.password === form.password

      );



      if(!usuarioEncontrado){


        alert(
          "Correo o contraseña incorrectos"
        );


        return;

      }



      login(usuarioEncontrado);



      const ruta = localStorage.getItem(
        "rutaPendiente"
      );



      if(ruta){


        localStorage.removeItem(
          "rutaPendiente"
        );


        navigate(ruta);


      }else{


        navigate("/");


      }



    }catch(error){


      console.error(
        "Error al iniciar sesión:",
        error
      );


      alert(
        "No se pudo conectar con SINNERS"
      );


    }


  };




  return (

    <div className="login-container">


      <div className="login-card">


        <h1>SINNERS</h1>


        <h2>Iniciar sesión</h2>



        <form onSubmit={iniciarSesion}>


          <input

            name="email"

            type="email"

            placeholder="Correo electrónico"

            value={form.email}

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

            Entrar

          </button>



        </form>



        <p>

          ¿No tienes cuenta?{" "}

          <Link to="/registro">

            Crear cuenta

          </Link>

        </p>



      </div>


    </div>

  );

}


export default Login;