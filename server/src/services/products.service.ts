import { HttpException } from '@exceptions/HttpException'
import fs from 'fs-extra'
import path from 'path'
import productModel from '@models/products.models'
import { isEmpty } from '@utils/util'
import { Product } from '@/interfaces/products.interface'
import { CreateProductDto } from '@/dtos/products.dto'

class ProductService {
  // public products = productModel

  public async findAllUser(): Promise<Product[]> {
    const products: Product[] = await productModel.find()

    return products
  }

  public async findProductById(productId: string): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, 'Product id required')

    const findProduct: Product | null = await productModel.findOne({ _id: productId })

    if (!findProduct) throw new HttpException(404, 'Product no found')

    return findProduct
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, 'Product data not sent')

    const findProduct: Product | null = await productModel.findOne({
      $or: [{ _id: productData._id }, { name: productData.name }]
    })

    if (findProduct) throw new HttpException(409, `Product id or name already exists`)

    const createProductData: Product = await productModel.create({ ...productData })

    return createProductData
  }

  public async updateProduct(productId: string, productData: CreateProductDto): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, 'Product id required')

    if (isEmpty(productData)) throw new HttpException(400, 'Product data no found')

    const updateProductById: Product | null = await productModel.findByIdAndUpdate(productId, {
      ...productData
    })

    if (!updateProductById) throw new HttpException(404, 'Product no found')

    return updateProductById
  }

  public async deleteProduct(productId: string): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, 'Product id required')

    const deleteProductById: Product | null = await productModel.findByIdAndDelete(productId)

    if (!deleteProductById) throw new HttpException(404, 'Product no found')

    if (deleteProductById && deleteProductById.image) {
      await fs.unlink(path.resolve(deleteProductById.image))
    }

    return deleteProductById
  }
}

export default ProductService
