import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "../../hooks/useForm"
import { productAdd, startProductUpdate } from "../../store/actions/productAction"
import { clearError } from "../../store/actions/uiAction"
export const NewProduct = () => {

    const dispatch = useDispatch();

    const { ui, products } = useSelector(state => state)

    const productEditable = !!products.productEditable? products.productEditable :{
        "_id": "49ade180-932f-492f-aeb5-92b801aef423",
        "name": "product",
        "description": "example product",
        "quantity": 100,
        "amount": 12.3,
        "image": "upload/5c22ceff-54e3-4368-989f-984fff81b291.png"
    };
 
    const [ formValues, handleInputChange, reset ] = useForm(productEditable)
    const { name, description, quantity, amount} = formValues 

    const editableId = useRef(products.productEditable?._id)
    useEffect(() => {
        if(products.productEditable?._id !== editableId.current){
            reset(products.productEditable)
            editableId.current = products.productEditable?._id
        }
    
    }, [products.productEditable, reset])
    
    const handleProduct = (e) => {
        e.preventDefault()

        if (editableId.current) {
            const fileImageUpdate = e.target?.image?.files[0]
            const formDataUpdate = new FormData()
            formDataUpdate.append('name', name)
            formDataUpdate.append('description', description)
            formDataUpdate.append('quantity', quantity)
            formDataUpdate.append('amount', amount)
            formDataUpdate.append('image', fileImageUpdate)
            dispatch(startProductUpdate(formDataUpdate, editableId.current))
        } else {
            const fileImage = e.target.image.files[0]
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('quantity', quantity)
            formData.append('amount', amount)
            formData.append('image', fileImage)
           dispatch(productAdd(formData))
           reset()
        }
    }

    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    return(
         <>
             <div className="col-md-6 offset-md-3">
                <h2>Create Pew Product</h2>
                <form onSubmit={handleProduct}>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="name" placeholder="Name" value={name} onChange={handleInputChange} />
                        <label className="form-label">Name of product:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="description" placeholder="Description" value={description} onChange={handleInputChange} />
                        <label className="form-label">Description of product:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" name="quantity" placeholder="Quantity" value={quantity} onChange={handleInputChange} />
                        <label className="form-label">Quantity of product:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" name="amonut" placeholder="Amonut" value={amount} onChange={handleInputChange} />
                        <label className="form-label">Amount of product:</label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload image of product:</label>
                        <input className="form-control" type="file" name="image"/>
                    </div>
                    {
                        ui.messageError &&
                        (
                            <div className="alert alert-danger text-center" role="alert">
                                {ui.messageError}
                            </div>
                        )
                    }
                    <button type="submit" className="btn btn-primary btn-block float-md-end">
                        Save
                    </button>

                </form>
            </div>
        </>
    )
}