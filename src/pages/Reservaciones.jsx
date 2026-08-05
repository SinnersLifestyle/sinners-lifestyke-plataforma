import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";


function Reservaciones() {


  const { usuario } = useAuth();
  console.log("USUARIO SESION:", usuario);

  const [form, setForm] = useState({

    evento: "",
    fechaReserva: "",
    horaReserva: "",
    numeroMesas: "",
    personas: ""

  });



  const [mensaje, setMensaje] = useState("");



  const manejarCambio = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };




  const enviarReservacion = async (e) => {


    e.preventDefault();


    try {


      const respuesta = await fetch(

        `http://localhost:8080/reservaciones?usuarioId=${usuario.id}`,

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },


          body:JSON.stringify({

            ...form,

            numeroMesas:Number(form.numeroMesas),

            personas:Number(form.personas)

          })

        }

      );



      if(!respuesta.ok){

        throw new Error();

      }



      setMensaje(
        "Reservación enviada correctamente a SINNERS"
      );



    }catch(error){


      console.error(error);


      setMensaje(
        "No se pudo realizar la reservación"
      );


    }


  };




  return (


    <div className="section">


      <img
        src={Logo}
        className="logo"
        alt="SINNERS"
      />



      <h1>
        Reservación SINNERS
      </h1>



      <div>


        <h3>
          Datos del cliente
        </h3>



        <p>
          <b>Nombre:</b> {usuario?.nombre} {usuario?.apellidos}
        </p>


        <p>
          <b>Email:</b> {usuario?.email}
        </p>


        <p>
          <b>Teléfono:</b> {usuario?.telefono}
        </p>



      </div>





      <form onSubmit={enviarReservacion}>


        <select
          name="evento"
          value={form.evento}
          onChange={manejarCambio}
          required
        >

          <option value="">
            Selecciona evento
          </option>

          <option>
            Evento SINNERS
          </option>

          <option>
            Noche de parejas
          </option>

          <option>
            Evento privado
          </option>

        </select>





        <input

          name="fechaReserva"

          type="date"

          value={form.fechaReserva}

          onChange={manejarCambio}

          required

        />





        <input

          name="horaReserva"

          type="time"

          value={form.horaReserva}

          onChange={manejarCambio}

          required

        />





        <input

          name="numeroMesas"

          type="number"

          placeholder="Número de mesas"

          value={form.numeroMesas}

          onChange={manejarCambio}

          required

        />





        <input

          name="personas"

          type="number"

          placeholder="Número de personas"

          value={form.personas}

          onChange={manejarCambio}

          required

        />





        <button type="submit">

          Confirmar

        </button>



      </form>



      <p>

        {mensaje}

      </p>



    </div>


  );

}


export default Reservaciones;