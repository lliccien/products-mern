import React, { useEffect } from 'react';
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid'
import validator from "validator";
import { useForm } from "../../hooks/useForm"
import { startSignupEmailPassword } from "../../store/actions/authAction"
import { setError, clearError } from "../../store/actions/uiAction"

export const Signup = () => {

    const dispatch = useDispatch();

    const state = useSelector(state => state)

    const [ formValues, handleInputChange ] = useForm({
        email: "lliccien@example.com",
        password: "12345Aa@"
    })

    const { email, password } = formValues 

    const handleSignup = (e) => {
        e.preventDefault()
        if (isFormValid()) {
            const _id = uuidv4()
            dispatch(startSignupEmailPassword(_id, email, password))
        }
    }

    const isFormValid = () => {

        if(!validator.isEmail(email)) {
            dispatch(setError("Email is not valid"))
            return false 
        } else if(!validator.isLength(password, {min: 8, max: undefined})) {
            dispatch(setError("Password should be at least 8 characters"))
            return false
        } else if(!validator.matches(password, '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})')) {
            dispatch(setError("Password should contain at least one lowercase letter, one uppercase letter, one number and one special character"))
            return false
        }

        dispatch(clearError())
        return true
    }

    
    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])
    return(
        <>
            <div className="col-md-6 offset-md-3">
                <h1>Sign up</h1>
                <form onSubmit={handleSignup}>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" name="email"  autoComplete="off" value={email} onChange={handleInputChange}/>
                        <label className="form-label">Email:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" name="password" autoComplete="off" value={password} onChange={handleInputChange}/>
                        <label className="form-label">Password:</label>
                    </div>
                    {
                        state.ui.messageError &&
                        (
                            <div className="alert alert-danger text-center" role="alert">
                                {state.ui.messageError}
                            </div>
                        )
                    }
                    <div className="btn-login">
                        <Link to="/login" className="link" >
                            Login    
                        </Link>
                        <button type="submit" className="btn btn-primary btn-block" disabled={state.ui.loading}>
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}