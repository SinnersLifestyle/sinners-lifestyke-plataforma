import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import Promotions from "./components/Promotions";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import AccesoReservaciones from "./pages/AccesoReservaciones";

import "./App.css";


function Home() {

  return (

    <>
      <Header />
      <Hero />
      <Events />
      <Gallery />
      <Promotions />
      <Footer />
    </>

  );

}



function App() {

  return (

    <BrowserRouter basename="/sinners-lifestyke-plataforma">

      <Routes>


        {/* Página principal */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Registro */}

        <Route
          path="/registro"
          element={<Registro />}
        />


        {/* Reservaciones */}

        <Route
           path="/reservaciones"
           element={<AccesoReservaciones />}
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;