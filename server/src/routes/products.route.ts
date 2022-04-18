import { Router } from 'express'
import ProductsController from '@controllers/products.controller'
import { CreateProductDto } from '@/dtos/products.dto'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import multer from '@utils/multer'
import authMiddleware from '@/middlewares/auth.middleware'

class ProductsRoute implements Routes {
  public path = '/products'
  public router = Router()
  public productsController = new ProductsController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    /**
     * @swagger
     * components:
     *  securitySchemes:
     *    bearerAuth:
     *      type: http
     *      scheme: bearer
     *      bearerFormat: JWT
     *
     *  schemas:
     *    Product:
     *      type: object
     *      properties:
     *        _id:
     *          type: string
     *          format: uuid
     *          description: The uuid unique for product.
     *        name:
     *          type: string
     *          description: The name unique for product.
     *        description:
     *          type: string
     *          description: The descripction for ptoduct.
     *        quantity:
     *          type: number
     *          description: The quantity existed of product.
     *        amount:
     *          type: number
     *          description: The value cost of product.
     *        image:
     *          type: string
     *          format: uri
     *          description: The uri of image of product.
     *      required:
     *        - name
     *      example:
     *        id: 49ade180-932f-492f-aeb5-92b801aef423
     *        name: product
     *        description: example product
     *        quantity: 100
     *        amount: 12.3
     *        image: upload/5c22ceff-54e3-4368-989f-984fff81b291.png
     *    ProductBody:
     *      type: object
     *      properties:
     *        name:
     *          type: string
     *          description: The name unique for product.
     *        description:
     *          type: string
     *          description: The descripction for ptoduct.
     *        quantity:
     *          type: number
     *          description: The quantity existed of product.
     *        amount:
     *          type: number
     *          description: The value cost of product.
     *        image:
     *          type: string
     *          format: binary
     *          description: The image of product.
     *      required:
     *        - name
     *      example:
     *        name: product
     *        description: example product
     *        quantity: 100
     *        amount: 12.3
     *        image: upload/5c22ceff-54e3-4368-989f-984fff81b291.png
     *    Error:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Error definicion.
     *    Message:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Message definicion.
     *
     *  parameters:
     *    idParam:
     *      name: _id
     *      in: path
     *      description: Identificator unique uuid.
     *      required: true
     *      schema:
     *        type: string
     *        format: uuid
     *
     */

    /**
     * @swagger
     *  tags:
     *    name: Products
     *    description: Products endpoints.
     */

    /**
     * @swagger
     * /products:
     *  get:
     *    summary: Return a Products list.
     *    security:
     *      - bearerAuth: []
     *    tags: [Products]
     *    responses:
     *      200:
     *        description: List of Products.
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: '#/components/schemas/Product'
     *      401:
     *        description: Unauthorized
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Wrong authentication token
     *      403:
     *        description: Forbidden
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Authentication token missing
     */
    this.router.get(`${this.path}`, authMiddleware, this.productsController.getProducts)

    /**
     * @swagger
     * /products/{_id}:
     *  get:
     *    summary: Returns a product by Id.
     *    security:
     *      - bearerAuth: []
     *    tags: [Products]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    responses:
     *      200:
     *        description: Found product
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/Product'
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product id required
     *      404:
     *        description: Not Found
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product no found
     */
    this.router.get(`${this.path}/:_id`, authMiddleware, this.productsController.getProductById)

    /**
     * @swagger
     * /products/{_id}:
     *  post:
     *    summary: Create new product
     *    security:
     *      - bearerAuth: []
     *    tags: [Products]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/ProductBody'
     *    responses:
     *      201:
     *        description: The product was successfully created
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Created
     *      400:
     *        description: Bad request
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product data not sent
     *      409:
     *        description: Conflict
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product id or name already exists
     */
    this.router.post(
      `${this.path}/:_id`,
      multer.single('image'),
      authMiddleware,
      validationMiddleware(CreateProductDto, 'params', true),
      validationMiddleware(CreateProductDto, 'body', true),
      this.productsController.createProduct
    )

    /**
     * @swagger
     * /prodructs{_id}:
     *  put:
     *    summary: Update product by Id
     *    security:
     *      - bearerAuth: []
     *    tags: [Products]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/ProductBody'
     *    responses:
     *      200:
     *        description: The product was updated
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Updated
     *      400:
     *        description: Bad request
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            examples:
     *              id:
     *                value:
     *                 message: Product id required
     *              data:
     *                value:
     *                  message: Product data not sent
     *      404:
     *        description: Not Fount
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product no found
     */
    this.router.put(
      `${this.path}/:_id`,
      authMiddleware,
      validationMiddleware(CreateProductDto, 'params', true),
      validationMiddleware(CreateProductDto, 'body', true),
      this.productsController.updateProduct
    )

    /**
     * @swagger
     * /products/{_id}:
     *  delete:
     *    summary: Delete product by Id
     *    security:
     *      - bearerAuth: []
     *    tags: [Products]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    responses:
     *      200:
     *        description: The product was deleted
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Deleted
     *      400:
     *        description: Bad request
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product id required
     *      404:
     *        description: Not Fount
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Product no found
     */
    this.router.delete(`${this.path}/:_id`, authMiddleware, this.productsController.deleteProduct)
  }
}

export default ProductsRoute
