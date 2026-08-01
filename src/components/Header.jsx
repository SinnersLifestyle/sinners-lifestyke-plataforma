import Logo from "../assets/Logo.png";


function Header(){

return(

<header>

<img src={Logo} className="logo"/>


<nav>

<a>Inicio</a>
<a>Eventos</a>
<a>Reservaciones</a>
<a>Productos</a>

</nav>


</header>

)

}


export default Header;