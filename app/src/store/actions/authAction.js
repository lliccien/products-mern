import decode from "jwt-decode";
import { types } from "../types/types"
import { setError } from "./uiAction";
import { startLoading, endLoading } from "./uiAction";

const REACT_APP_BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:4000/api";

export const login = (uuid, email) => { 
    return {
        type: types.login,
        payload: {
            uuid,
            email
       }
    }
}

export const startLoginEmailPassword = (email, password) => {
    return (dispatch) => {
        dispatch(startLoading())
        const url = `${REACT_APP_BACKEND_API}/login`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
            }
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
                let message
                response.json().then(data => {
                    message = data.message
                    localStorage.removeItem("access")
                    localStorage.removeItem("refresh")
                    dispatch(setError(message))
                    dispatch(endLoading())
                })
                return
            }
            return response.json()            
        })
        .then(data => {
            localStorage.setItem("access", data.token.access)
            localStorage.setItem("refresh", data.token.refresh)
            const { _id } = decode(data.token.access)
            dispatch(login(_id, email))
            dispatch(endLoading())
        })
        .catch(err => {
            dispatch(setError(err.message))
            dispatch(endLoading())
        })
    }
}

export const startSignupEmailPassword = (_id, email, password) => {
    return (dispatch) => {
        dispatch(startLoading())
        const url = `${REACT_APP_BACKEND_API}/signup`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                email,
                password
            })
            }
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
                let message
                response.json().then(data => {
                    message = data.message
                    localStorage.removeItem("access")
                    localStorage.removeItem("refresh")
                    dispatch(setError(message))
                    dispatch(endLoading())
                })
                return
            }
            return response.json()
        })
        .then(data => {
            localStorage.setItem("access", data.token.access)
            localStorage.setItem("refresh", data.token.refresh)
            const { _id } = decode(data.token.access)
            dispatch(login(_id, email))
            dispatch(endLoading())
        })
        .catch(err => {
            dispatch(setError(err.message))
            dispatch(endLoading())
        })
    }
}

export const startLogout = () => {
    return (dispatch) => {
        dispatch(startLoading())
        const token = localStorage.getItem('access')
        const url = `${REACT_APP_BACKEND_API}/logout`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
                response.json().then(data => {
                    localStorage.removeItem("access")
                    localStorage.removeItem("refresh")
                    dispatch(logout());
                    dispatch(endLoading())
                })
                return
            }
            return response.json()            
        })
        .then(data => {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            dispatch(logout());
            dispatch(endLoading())
        })
        .catch(err => {
            dispatch(setError(err.message))
            dispatch(logout());
            dispatch(endLoading())
        })
    }
}


export const logout = () => ({
    type: types.logout
})
