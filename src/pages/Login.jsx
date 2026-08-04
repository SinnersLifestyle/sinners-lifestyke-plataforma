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


  const iniciarSesion = (e) => {

    e.preventDefault();


    const usuarioGuardado =
      JSON.parse(localStorage.getItem("usuario"));


    if(!usuarioGuardado){

      alert("Usuario no registrado");

      navigate("/registro");

      return;

    }


    if(
      usuarioGuardado.email === form.email &&
      usuarioGuardado.password === form.password
    ){

      login(usuarioGuardado);


      const ruta =
        localStorage.getItem("rutaPendiente");


      if(ruta){

        localStorage.removeItem("rutaPendiente");

        navigate(ruta);

      }else{

        navigate("/");

      }


    }else{

      alert("Correo o contraseña incorrectos");

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
onChange={manejarCambio}
/>


<input
name="password"
type="password"
placeholder="Contraseña"
onChange={manejarCambio}
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