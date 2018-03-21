import React, { Component } from 'react';
import { connect } from 'react-redux'
// Router party
import { HashRouter as Router,
         Route,
         Switch,
         Redirect,
       } from 'react-router-dom';

import Login from './login';
import Content from './content';
import NotFound from './notfound';



class YunweiRouter extends Component {
  constructor(props){
    super(props);
    window.isLogin=this.props.userAuthenticated;
  }
  render(){
    return (
      <Router >
        <Switch>
          <Route exact path="/" render={(props)=>(
            window.isLogin?<Redirect to="/content" {...props} />:<Redirect to="/login" {...props}/>
            )} />
          <Route path="/login" render={(props)=>(
              window.isLogin?<Redirect to="/content" {...props} />:<Login {...props} />
            )} />
          <Route path="/content" render={(props)=>(
              window.isLogin?<Content {...props} />:<Redirect to="/login" {...props} />
            )} />
          <Route render={(props)=>(
              window.isLogin?<NotFound {...props}/>:<Redirect to="/login" {...props}/>
            )} />
        </Switch>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.default.LoginReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch:dispatch
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps
  )(YunweiRouter);