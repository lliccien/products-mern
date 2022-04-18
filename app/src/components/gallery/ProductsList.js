

import { ProductItem } from "./ProductItem"

export const ProductsList = ({products}) => {

    return(
        <>
            <div className="col-md-10 offset-1">
                <hr />
                <h2>Products list</h2>
                {
                    products.length === 0 ? 
                    (
                        <div className="alert alert-info text-center" role="alert">
                            Products no Found
                        </div>
                    )
                    :
                    (
                        <ul className="product-list">
                            {products.map(product => (
                                <ProductItem key={product?._id} product={product}/>
                            ))}
                        </ul>
                    )
                }

            </div>
        </> 
    )
}