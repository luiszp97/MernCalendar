export const Navbar = () => {
  return (
    <div className="navbar navbar-dark bg-dark mb-b px-4">
        <span className="navbar-brand">
            <i className="fas fa-calendar-alt"></i>
            &nbsp;
            Luis Zambrano
        </span>

        <button className="btn btn-outline-danger">
            <i className="fas fa-sign-out-alt"></i>
            <span>Salir</span>
        </button>
    </div>
  )
}