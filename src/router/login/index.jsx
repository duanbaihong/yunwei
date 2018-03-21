
import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Zoom from 'material-ui/transitions/Zoom';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Error from 'material-ui-icons/Error';
import { CircularProgress } from 'material-ui/Progress';

import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

import { withStyles } from 'material-ui/styles';
import lightBlue from 'material-ui/colors/lightBlue';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import back from '../../images/back.jpg';
import user from '../../images/user.png';


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
    marginLeft: -95,
    marginTop:-20,
  },
  snackbarcontent:{
    backgroundColor: lightBlue[700],
    padding: "0px 8px 0px 8px",
    marginTop:5,
    opacity:0.9
  },
  iconbutton:{
    width:36,
    height:36,
    marginTop:-1
  },
  iconinfo:{
    float:"left",
    marginTop:-1,
    color: red[400],
    marginRight:5,
  }
});
const theme = createMuiTheme({
  typography: {
    htmlFontSize: 16,
  },
  palette: {
    primary: lightBlue,
  }
});

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      ActionStatus:"用户认证失败！"
    }
    this._isMounted=false
  }
  initloginstatus(){
    this.setState({
      showPassword: false,
      SnackbarStatus: false,
      isloginStatus: false,
      ActionStatus: "用户认证失败！"
    })
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
  handleBarClose(){
    this.setState({SnackbarStatus: false})
  }
  loginCheck(){
    this.setState({isloginStatus:!this.state.isloginStatus,
                   SnackbarStatus: !this.state.SnackbarStatus})
    setTimeout(this.initloginstatus.bind(this),2000);
  }
  render(){
    const { classes } = this.props;
    console.log(this.props)
    const { showPassword,SnackbarStatus,isloginStatus,ActionStatus,display } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
      </div>
      <div>
        <Zoom in={display} timeout={700}>
          <div className={classes.loginlayer}>
          {isloginStatus && <CircularProgress size={190} 
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
            />
            <FormControl fullWidth className={classes.forms} required={true}>
              <InputLabel htmlFor="login_password">用户密码</InputLabel>
              <Input
                id="login_password"
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={SnackbarStatus}
        onClose={this.handleBarClose.bind(this)}
        SnackbarContentProps={{
            className: classes.snackbarcontent,
          }}
        message={<span id="message-id">{ActionStatus}<Error className={classes.iconinfo} /></span>}
        action={[
          <IconButton
            key="close"
            size="small"
            aria-label="Close"
            color="inherit"
            className={classes.iconbutton}
            onClick={this.handleBarClose.bind(this)} >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);