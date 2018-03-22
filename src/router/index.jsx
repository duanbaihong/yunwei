import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from "react-transition-group";
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
            window.isLogin?<Redirect to="/content" />:<Redirect to="/login" />
            )} />
          <Route path="/login" render={(props)=>(
              window.isLogin?<Redirect to="/content" />:<Login {...props} />
            )} />
          <Route path="/content" render={(props)=>(
              window.isLogin?<Content {...props}  />:<Redirect to="/login" />
            )} />
          <Route render={(props)=>(
              window.isLogin?<NotFound {...props}/>:<Redirect to="/login"/>
            )} />
        </Switch>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch:dispatch
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps,
  )(YunweiRouter);


