import { Link } from "react-router-dom"
import { useDispatch, useSelector} from "react-redux"
import { startLogout } from '../../store/actions/authAction';

export const Navbar = () => {

    const dispatch = useDispatch();

    const state = useSelector(state => state)
    
    const handleLogout = () => {
        dispatch(startLogout())
    }

    return(
        <div>
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link className="navbar-brand" to="/">Products </Link>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

                        <span className="nav-item nav-link info"> Ludwring Liccien</span>
                        {
                            state.auth.uuid && 
                            (
                                <button className="nav-item nav-link btn" onClick={handleLogout}>Logout</button>
                            )
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}