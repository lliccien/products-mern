import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector} from "react-redux"
import { startLoadingProducts } from "../../store/actions/productAction";
import { NewProduct } from "./NewProduct"
import { ProductsList } from "./ProductsList"

export const Gallery = () => {

    const dispatch = useDispatch();
    const isMounted = useRef(true);

    const { products } = useSelector(state => state.products)
    
    useEffect(() => {
        if ( isMounted.current ) {
            dispatch(startLoadingProducts())
        }

    }, [dispatch])

    return(
        <>
            <div className="row margin-bottom">
                <NewProduct />
            </div>
            <div className="row">
                <ProductsList products={products}/>
            </div>
        </>
    )
}