
import React, { Component }  from 'react';
import Snack from '../components/snackbar'
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Zoom from 'material-ui/transitions/Zoom';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

import { CircularProgress } from 'material-ui/Progress';
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

import { withStyles } from 'material-ui/styles';
import lightBlue from 'material-ui/colors/lightBlue';
import green from 'material-ui/colors/green';
import back from '../../images/back.jpg';
import user from '../../images/user.png';

import { ajax } from '../../commons/ajax'
import md5 from 'md5';

const styles = theme => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
    height: "100%",
    backgroundImage: `url(${back})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    textAlign: 'center',
    opacity:0.6
  },
  loginlayer: {
    width: 300,
    height:380,
    margin: 'auto',
    position: 'absolute',
    left:0,
    top:0,
    bottom:0,
    right:0,
    padding:25,
    borderRadius:6,
    backgroundColor: "#ffffff7d",
  },
  useravater: {
    width: 150,
    height: 150,
    margin:'auto',
    marginBottom:10
  },
  forms:{
    marginTop:10
  },
  formsubmit:{
    marginTop:50
  },
  buttonProgress: {
    color: green[300],
    position: 'absolute',
    left: '50%',
    marginLeft: -19,
  },
  buttonProgressAvater: {
    position: 'absolute',
    left: '50%',
    marginLeft: -97,
    marginTop:-22,
  }
});
const theme = createMuiTheme({
  typography: {
    htmlFontSize: 16,
  },
  palette: {
      primary: lightBlue,
  },
});

class Login extends Component {
  constructor(props){
    super(props);
    this.state={ SnackBarMsg:"" }
    this._isMounted=false
  }
  handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  }
  componentDidMount() {
    if(!this._isMounted){
      this.setState({ display: true})
    }
  }
  componentWillUnmount() {
    this._isMounted=false;
  }
  handleLoginSuccess(resp){
    console.log(resp)
    if(resp.status===200 && resp.statusText==="OK" && resp.data.resultCode==="10000"){
      console.log(this.props.userLoginIn(resp.data))
    }else{
      this.setState(
        { 
          SnackBarMsg:(resp.data.hasOwnProperty('resultMsg') && resp.data.hasOwnProperty('resultCode')?resp.data.resultMsg:"返回数据异常！"),
          isloginStatus:false
        })
    }
  }
  handleLoginFailed(error){
      console.log(error)
      this.setState(
        { 
          isloginStatus: !this.state.isloginStatus,
          SnackBarMsg:"请求异常,网络异常!"}
        );
  }
  loginCheck(){
    if(this.username.value === "") {
      this.setState({SnackBarMsg:"请输入用户名。"})
      this.username.focus();
      return false;

    }
    if(this.password.value === "") {
      this.setState({SnackBarMsg:"请输入用户密码。"})
      this.password.focus();
      return false;
    }

    this.setState({isloginStatus:!this.state.isloginStatus})
    let params={
      MsgType: "ACTION_USER_LOGIN",
      UserName: this.username.value,
      PassWord: md5(this.password.value),
      Sign: md5(this.username.value+"sign"+md5(this.password.value)),
    }
    ajax('/api',params).then(this.handleLoginSuccess.bind(this))
                       .catch(this.handleLoginFailed.bind(this));
    
  }
  render(){
    const { classes } = this.props;
    const { showPassword,isloginStatus,display } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
      </div>
      <div>
        <Zoom in={display} timeout={700}>
          <div className={classes.loginlayer}>
          {isloginStatus && <CircularProgress size={194} 
              className={classes.buttonProgressAvater} 
              color="secondary"
              variant="indeterminate"
              thickness={0.4} />}
            
            <Avatar src={user} className={classes.useravater} />
            
            <TextField
              id="login_user"
              label="用户帐号"
              placeholder="请输入用户帐号"
              required={true}
              fullWidth={true}
              autoFocus={true}
              inputRef={(c) => this.username = c}
            />
            <FormControl fullWidth className={classes.forms} required={true}>
              <InputLabel htmlFor="login_password">用户密码</InputLabel>
              <Input
                id="login_password"
                inputRef={(c) => this.password = c}
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入用户密码"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="显示密码"
                      onClick={this.handleClickShowPasssword.bind(this)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                } />
            </FormControl>
            <div className={classes.formsubmit} >
              <Button variant='raised' color="primary" fullWidth disabled={isloginStatus}  className={classes.button} onClick={this.loginCheck.bind(this)}>
                {isloginStatus?"登陆中...":"登陆"}
              </Button>
              {isloginStatus && <CircularProgress size={38} className={classes.buttonProgress} />}
            </div>
          </div>
        </Zoom>
      </div>
      <Snack title={this.state.SnackBarMsg} />
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
