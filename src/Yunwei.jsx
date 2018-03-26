import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
// import createHistory from 'history/createBrowserHistory'

// meatrial-ui party
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

// comentnents party
import reducers from './reducers';
import YunweiRouter  from './router';

// 中间件
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

// const history=createHistory();

const middleware = [ thunk ]; // redux-thunk解决异步回调
// middleware.push(routerMiddleware(history));
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middleware.push(logger);
}
// Add the reducer to your store on the `routing` key
const store = createStore(
  reducers,{},
  applyMiddleware(...middleware)
)
// store.subscribe();
class Yunwei extends Component {
  constructor(props){
    super(props);
    this.state={theme: {
                  palette: {
                    primary: blue,
                  },
                }};
  }
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(this.state.theme)}>
        <Provider store={store}>
            <YunweiRouter />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default Yunwei;
