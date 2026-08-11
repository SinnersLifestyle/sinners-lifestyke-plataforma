import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "https://sinners-api.onrender.com";

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

  // Solicitar código OTP
  const solicitarOtp = async (datosUsuario) => {
    const respuesta = await fetch(
      `${API_URL}/usuarios/solicitar-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
      }
    );

    if (!respuesta.ok) {
      throw new Error(
        "No pudimos completar la solicitud de verificación."
      );
    }

    const codigo = await respuesta.text();

    return codigo;
  };

  // Verificar código OTP y crear usuario
  const verificarOtp = async (telefono, codigo) => {
    const respuesta = await fetch(
      `${API_URL}/usuarios/verificar-otp?telefono=${encodeURIComponent(
        telefono
      )}&codigo=${encodeURIComponent(codigo)}`,
      {
        method: "POST"
      }
    );

    if (!respuesta.ok) {
      throw new Error(
        "El código es incorrecto o ya expiró."
      );
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
        solicitarOtp,
        verificarOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}