import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL = "https://sinners-api.onrender.com";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    telefono: "",
    password: ""
  });

  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      setCargando(true);

      const respuesta = await fetch(
        `${API_URL}/usuarios`
      );

      if (!respuesta.ok) {
        throw new Error(
          "No se pudo consultar la API."
        );
      }

      const usuarios = await respuesta.json();

      console.log(
        "USUARIOS API:",
        usuarios
      );

      const usuarioEncontrado = usuarios.find(
        (usuario) =>
          usuario.telefono === form.telefono &&
          usuario.password === form.password
      );

      console.log(
        "USUARIO ENCONTRADO:",
        usuarioEncontrado
      );

      if (!usuarioEncontrado) {
        alert(
          "Teléfono o contraseña incorrectos."
        );

        return;
      }

      const usuarioSesion = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        apellidos: usuarioEncontrado.apellidos,
        email: usuarioEncontrado.email,
        telefono: usuarioEncontrado.telefono,
        usuario: usuarioEncontrado.usuario
      };

      console.log(
        "USUARIO GUARDADO EN SESIÓN:",
        usuarioSesion
      );

      login(usuarioSesion);

      const ruta =
        localStorage.getItem(
          "rutaPendiente"
        );

      if (ruta) {
        localStorage.removeItem(
          "rutaPendiente"
        );

        navigate(ruta);
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      alert(
        "No se pudo conectar con SINNERS."
      );

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          SINNERS
        </h1>

        <h2>
          Iniciar sesión
        </h2>

        <form
          onSubmit={iniciarSesion}
        >

          <input
            name="telefono"
            type="tel"
            placeholder="Número de celular"
            value={form.telefono}
            onChange={manejarCambio}
            maxLength="10"
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

          <button
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Entrando..."
              : "Entrar"}
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