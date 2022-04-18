import { useDispatch } from "react-redux"
import NoImage from "../../assets/no-image.png"
import { startProductRemove, productUpdate } from "../../store/actions/productAction";

export const ProductItem = ({product}) => {

    const dispatch = useDispatch();

    const { _id, name, description, quantity, amount, image } = product;

    const setImage = (image) => {
        const publicUrl = process.env.REACT_APP_BACKEND_PUBLIC;
        if(image){
            return `${publicUrl}/${image}`
        }
        return NoImage

    }

    const handleUpdate = (e) => {
        e.preventDefault()
        dispatch(productUpdate(product))

    }

    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(startProductRemove(_id))

    }

    return(
        <>
            <div className="card product-item">
                <img src={setImage(image)} className="card-img-top" alt={name}/>
                <div className="card-body">
                    <h5 className="card-title">{name} </h5>
                    <p className="card-text">{description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Quantity: {quantity}</li>
                    <li className="list-group-item">Amont: {amount}</li>
                </ul>
                <div className="card-body">
                    <button className="btn btn-primary" onClick={handleUpdate}>Edit</button>
                    <button className="btn btn-danger float-end" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </>
    )
}