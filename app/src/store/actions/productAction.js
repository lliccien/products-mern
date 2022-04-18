import { v4 as uuidv4 } from 'uuid'
import { types } from "../types/types"
import { setError } from "./uiAction";
import { startLoading, endLoading } from "./uiAction";

const REACT_APP_BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:4000/api";


export const productLoad = (products = []) => { 
    return {
        type: types.productsLoad,
        payload: products
    }
}


export const startLoadingProducts = () => {
    return (dispatch) => {
        dispatch(startLoading())
        const token = localStorage.getItem('access')
        const url = `${REACT_APP_BACKEND_API}/products`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
                response.json().then(data => {
                    dispatch(setError(data.message))
                    dispatch(endLoading())
                })
                return
            }
            return response.json()            
        })
        .then(data => {
            dispatch(productLoad(data.data))
            dispatch(endLoading())
        })
        .catch(err => {
            dispatch(setError(err.message))
            dispatch(setError());
            dispatch(endLoading())
        })
    }
}

export const productAdd = (formData) => {
    return (dispatch) => {
        dispatch(startLoading())
        const token = localStorage.getItem('access')
        const _id = uuidv4()
        const url = `${REACT_APP_BACKEND_API}/products/${_id}`
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
             body: formData
            }
            fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    response.json().then(data => {
                        dispatch(setError(data.message));
                        dispatch(endLoading())
                    })
                    return
                }
                return response.json()            
            })
            .then(data => {
                dispatch(startLoadingProducts())
                dispatch(endLoading())
            })
            .catch(err => {
                dispatch(setError(err.message))
                dispatch(setError());
                dispatch(endLoading())
            })

        }
}

export const startProductRemove = (_id) => {
    return (dispatch) => {
        dispatch(startLoading())
        const token = localStorage.getItem('access')
        const url = `${REACT_APP_BACKEND_API}/products/${_id}`
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            }
            fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    response.json().then(data => {
                        dispatch(setError(data.message));
                        dispatch(endLoading())
                    })
                    return
                }
                return response.json()            
            })
            .then(data => {
                dispatch(productRemove(_id))
                dispatch(endLoading())
            })
            .catch(err => {
                dispatch(setError(err.message))
                dispatch(setError());
                dispatch(endLoading())
            })

        }
}

export const productRemove = (_id) => { 
    return {
        type: types.productRemove,
        payload: _id
    }
}


export const startProductUpdate = (formDataUpdate, _id) => {
    return (dispatch) => {
        dispatch(startLoading())
        const token = localStorage.getItem('access')
        const url = `${REACT_APP_BACKEND_API}/products/${_id}`
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
             body: formDataUpdate
            }
            fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    response.json().then(data => {
                        dispatch(setError(data.message));
                        dispatch(endLoading())
                    })
                    return
                }
                return response.json()            
            })
            .then(data => {
                dispatch(startLoadingProducts())
                dispatch(endLoading())
            })
            .catch(err => {
                dispatch(setError(err.message))
                dispatch(setError());
                dispatch(endLoading())
            })

        }
}


export const productUpdate = (product) => { 
    return {
        type: types.productUpdate,
        payload: product
    }
}