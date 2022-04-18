import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import{ useSelector } from "react-redux";

import { Gallery } from "../components/gallery/Gallery"
import { Login } from "../components/login/Login"
import { Signup } from "../components/signup/Signup"
import { Navbar } from "../components/ui/Navbar";
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

export const AppRouter = () => {
    const state = useSelector(state => state)
    const auth  = !!state.auth.uuid
    return(
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/*" element={
                    <PrivateRoute isAuthenticated={auth} >
                        <Gallery />
                    </PrivateRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute isAuthenticated={auth} >
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute isAuthenticated={auth} >
                        <Signup/>
                    </PublicRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

