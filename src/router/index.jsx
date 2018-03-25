import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// Router party
import { HashRouter as Router,
         Route,
         Switch,
         Redirect,
       } from 'react-router-dom';

import Login from './login';
import Content from './content';
import NotFound from './notfound';
import { ajax } from '../commons/ajax'
import {userCheckLogin} from '../actions'
import md5 from 'md5';

class YunweiRouter extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    this.checkLogin()
  }
  checkLogin(){
    if(window.isLogin === undefined){
      let params={
        msgtype: "ACTION_CHECK_USER_LOGIN",
        sign: md5("ACTION_CHECK_USER_LOGIN"+"SIGN"),
      }
      ajax('/api',params).then((resp)=>{
        if(resp.status===200 && resp.statusText==="OK" && resp.data.resultCode==="10000"){
          this.props.dispatch(this.props.userCheckLogin())
        }else{
          console.log('请求失败！');
        }
      }).catch(function(error){
        console.log(error)
      })
    }  
  }
  render(){
    return (
      <Router>
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
    userCheckLogin:userCheckLogin,
    dispatch:dispatch
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps,
  )(YunweiRouter);


