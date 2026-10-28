import { NavLink, Route, Switch } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Generos from "./pages/Generos";
import Directores from "./pages/Directores";
import Productoras from "./pages/Productoras";
import Tipos from "./pages/Tipos";
import Medias from "./pages/Medias";

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg app-nav sticky-top">
        <div className="container">
          <NavLink exact to="/" className="navbar-brand">Cine IUDigital</NavLink>
          <div className="navbar-nav ms-auto">
            <NavLink exact to="/" className="nav-link" activeClassName="active">Inicio</NavLink>
            <NavLink to="/generos" className="nav-link" activeClassName="active">Géneros</NavLink>
            <NavLink to="/directores" className="nav-link" activeClassName="active">Directores</NavLink>
            <NavLink to="/productoras" className="nav-link" activeClassName="active">Productoras</NavLink>
            <NavLink to="/tipos" className="nav-link" activeClassName="active">Tipos</NavLink>
            <NavLink to="/medias" className="nav-link" activeClassName="active">Media</NavLink>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Switch>
          <Route exact path="/" component={Inicio} />
          <Route path="/generos" component={Generos} />
          <Route path="/directores" component={Directores} />
          <Route path="/productoras" component={Productoras} />
          <Route path="/tipos" component={Tipos} />
          <Route path="/medias" component={Medias} />
        </Switch>
      </main>
    </>
  );
}
