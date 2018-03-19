import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { createStore, combineReducers,applyMiddleware } from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
// import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { HashRouter as Router,
         Route,
         Switch,
         Redirect,
       } from 'react-router-dom';

import * as reducers from './reducers';
import { Login,Content,NotFound} from './router';
import { createLogger } from 'redux-logger'

const middleware = [ thunk ]; // redux-thunk解决异步回调
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

// const history = syncHistoryWithStore(Router, store)
// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ...reducers,
    // routing: routerReducer,    
  }),applyMiddleware(...middleware)
)



class Yunwei extends Component {
  constructor(props, context){
    super(props, context);
    this.state={isLogin: false,
                theme: {
                  palette: {
                    primary: blue,
                  },
                }};
  }
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={createMuiTheme(this.state.theme)}>
          <Router>
            <Switch>
              <Route exact path="/" render={(props)=>(
                this.state.isLogin?<Redirect to="/content" />:<Redirect to="/login" />
                )} />
              <Route path="/login" render={(props)=>(
                  this.state.isLogin?<Redirect to="/content" />:<Login {...props} />
                )} />
              <Route path="/content" render={(props)=>(
                  this.state.isLogin?<Content {...props} />:<Redirect to="/login" />
                )} />
              <Route render={(props)=>{
                  return this.state.isLogin?<NotFound {...props}/>:<Redirect to="/login" />
                }} />
            </Switch>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Yunwei;
