import { createContext, useContext, useState } from "react";


const AuthContext = createContext();


export function AuthProvider({ children }) {


  const [usuario, setUsuario] = useState(() => {


    const sesionActiva = sessionStorage.getItem("sesion");


    return sesionActiva
      ? JSON.parse(sesionActiva)
      : null;


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



  // Registrar usuario
  const registrar = (datosUsuario) => {


    localStorage.setItem(
      "usuario",
      JSON.stringify(datosUsuario)
    );


    setUsuario(datosUsuario);


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