import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import Promotions from "./components/Promotions";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reservaciones from "./pages/Reservaciones";
import ReservacionesAutorizar from "./pages/ReservacionesAutorizar";

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

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/reservaciones"
          element={<Reservaciones />}
        />

        <Route
          path="/reservaciones-autorizar"
          element={<ReservacionesAutorizar />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;