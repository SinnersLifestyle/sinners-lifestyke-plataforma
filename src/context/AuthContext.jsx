import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(() => {
    const sesionActiva = sessionStorage.getItem("sesion");
    return sesionActiva ? JSON.parse(sesionActiva) : null;
  });

  // Iniciar sesión
  const login = (datosUsuario) => {
    sessionStorage.setItem(
      "sesion",
      JSON.stringify(datosUsuario)
    );

    setUsuario(datosUsuario);
  };

  // Cerrar sesión
  const logout = () => {
    sessionStorage.removeItem("sesion");
    setUsuario(null);
  };

  // Registrar usuario en Spring Boot + MySQL
  const registrar = async (datosUsuario) => {

    const respuesta = await fetch(
      "https://sinners-api.onrender.com/usuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
      }
    );

    if (!respuesta.ok) {
      throw new Error("No pudimos acompletar su registro, por favor intentelo mas tarde");
    }

    const usuarioGuardado = await respuesta.json();

    return usuarioGuardado;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        registrar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}