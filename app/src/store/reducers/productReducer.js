import { types } from "../types/types";

const InitialState ={
    products: [],
    productEditable: null
}

export const productReducer = (state = InitialState, action) => {
    switch (action.type) {  
        case types.productsLoad:
            return {
                ...state,
                products: [ ...action.payload ]
            }
        case types.productRemove:
            return {
                ...state,
                products: state.products.filter(product => product._id !== action.payload)
        }
        case types.productUpdate:
            return {
                ...state,
                productEditable: action.payload
        } 
        default:
            return state
    }
}
