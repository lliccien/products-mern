import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'products', timestamps: true } })
class Product {
  @prop({ type: String, default: '' })
  public _id: string

  @prop({ type: String, required: true, unique: true })
  public name: string

  @prop({ type: String })
  public description: string

  @prop({ type: Number })
  public quantity: number

  @prop({ type: Number })
  public amount: number

  @prop({ type: String })
  public image: string

  public createdAt?: Date

  public updatedAt?: Date
}

const ProductModel = getModelForClass(Product)

export default ProductModel
