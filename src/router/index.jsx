import React, { Component } from 'react';
import { connect } from 'react-redux'

import { HashRouter as Router,
         Route,
         Switch,
         Redirect,
       } from 'react-router-dom';
import NotFound from './notfound';
import { ajax } from '../commons/ajax'
import {userCheckLogin} from '../actions'
import md5 from 'md5';
// 导入异步加载组件
import asyncComponent from './components/asynccomponent';

const AsyncLogin = asyncComponent(() => import('./login'));
const AsyncContent = asyncComponent(() => import('./content'));
// import Login from './login';
// import Content from './content';



Date.prototype.Format = function(format) {
   var o = {
       "M+": this.getMonth() + 1,
       // month
       "d+": this.getDate(),
       // day
       "h+": this.getHours(),
       // hour
       "m+": this.getMinutes(),
       // minute
       "s+": this.getSeconds(),
       // second
       "q+": Math.floor((this.getMonth() + 3) / 3),
       // quarter
       "S": this.getMilliseconds()
       // millisecond
   };
   if (/(y+)/.test(format) || /(Y+)/.test(format)) {
       format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
   }
   for (var k in o) {
       if (new RegExp("(" + k + ")").test(format)) {
           format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
       }
   }
   return format;
};


class YunweiRouter extends Component {

  componentDidMount() {
    if(window.isLogin === undefined){
      this.checkLogin()
    }
  }
  componentWillMount() {
    if(sessionStorage.token){
      this.props.dispatch(this.props.userCheckLogin())
    }
  }
  checkLogin(){
    if(sessionStorage.token === undefined){
      let params={
        MsgType: "ACTION_CHECK_USER_LOGIN",
        Sign: md5("ACTION_CHECK_USER_LOGINSIGN"),
      }
      ajax('/api',params).then((resp)=>{
        if(resp.status===200 && resp.statusText==="OK" && resp.data.resultCode==="10000" && resp.data.hasOwnProperty('userInfo')){
          this.props.dispatch(this.props.userCheckLogin(resp.data))
        }else{
          console.log(resp.data.hasOwnProperty('resultMsg')?resp.data.resultMsg:'请求失败，或者用户未登陆。');
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
              window.isLogin?<Redirect to="/content" />:<AsyncLogin {...props} />
            )} />
          <Route path="/content" render={(props)=>(
              window.isLogin?<AsyncContent {...props}  />:<Redirect to="/login" />
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


