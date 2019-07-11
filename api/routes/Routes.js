import { userSignup, userLogin, getAllUsers } from '../controllers/singupControllers';

const routes = (app) => {
  app.route('/signup')
  .post(userSignup)

  app.route('/login')
  .post(userLogin)  
 
}

export default routes;
