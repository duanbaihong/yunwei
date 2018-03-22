

import {combineReducers} from 'redux';
import { routerReducer,
         // routerMiddleware,
        } from 'react-router-redux';
import {LoginReducer} from './login'
import {PackageReducer} from './package'

const Reducers = combineReducers({
  login:LoginReducer,
  content:PackageReducer,
  routing: routerReducer,
})

export default Reducers;



