import App from '@/app'
import Db from '@databases'
import IndexRoute from '@routes/index.route'
import UsersRoute from '@routes/users.route'
import AuthRoute from '@routes/auth.route'
import ProductsRoute from '@routes/products.route'
import validateEnv from '@utils/validateEnv'

validateEnv()

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new ProductsRoute()])
app.listen()

const db = new Db()
db.connetDB()
