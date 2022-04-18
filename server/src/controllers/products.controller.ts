import { NextFunction, Request, Response } from 'express'
import { Product } from '@/interfaces/products.interface'
import ProductService from '@/services/products.service'
import { CreateProductDto } from '@/dtos/products.dto'

class ProductsController {
  public productService = new ProductService()

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProductsData: Product[] = await this.productService.findAllUser()

      res.status(200).json({ data: findAllProductsData, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productsId: string = req.params._id
      const findOneProductData: Product = await this.productService.findProductById(productsId)

      res.status(200).json({ data: findOneProductData, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params._id
      const productImage: string | undefined = req.file?.path

      const productData: CreateProductDto = {
        _id: productId,
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        amount: req.body.amount,
        image: productImage
      }
      await this.productService.createProduct(productData)

      res.status(201).json({ message: 'Created' })
    } catch (error) {
      next(error)
    }
  }

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params._id
      const productData: CreateProductDto = req.body
      await this.productService.updateProduct(productId, productData)

      res.status(200).json({ message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params._id
      await this.productService.deleteProduct(productId)

      res.status(200).json({ message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default ProductsController
