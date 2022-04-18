import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'; 
import { authReducer } from "./reducers/authReducer";
import { uiReducer } from "./reducers/uiReducer";
import { productReducer } from "./reducers/productReducer";

const reducers = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    products: productReducer
});

export const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk)
))