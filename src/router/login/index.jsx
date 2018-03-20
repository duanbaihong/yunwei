
import React, { Component }  from 'react';
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
import Snackbar from 'material-ui/Snackbar';
import { FormControl } from 'material-ui/Form';

import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import back from '../../images/back.jpg';
import user from '../../images/user.png';


const styles = theme => ({
  root: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    height: "100%",
    backgroundImage: `url(${back})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    textAlign: 'center',
  },
  loginlayer: {
    width: 320,
    height:400,
    margin: 'auto',
    position: 'absolute',
    left:0,
    top:0,
    bottom:0,
    right:0,
  },
  useravater: {
    width: 140,
    height: 140,
    margin:'auto',
    marginBottom:20
  },
  forms:{
    marginTop:20
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    left: '50%',
    marginLeft: -19,
  },
});

const theme = createMuiTheme({
  typography: {
    htmlFontSize: 14,
  },
  palette: {
    primary: blue,
  },
});

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      display: false,
      showPassword: false,
      isloginStatus: false,
    }
  }
  initloginstatus(){
    this.setState({isloginStatus:!this.state.isloginStatus})
  }
  handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  }
  componentDidMount() {
    this.setState({ display: true})
  }
  loginCheck(){
    this.setState({isloginStatus:!this.state.isloginStatus})
    setTimeout(this.initloginstatus.bind(this),2000);
  }
  render(){
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <Zoom in={this.state.display} timeout={600}>
          <div className={classes.loginlayer}>
            <Avatar src={user} className={classes.useravater} />
            <FormControl fullWidth >
              <InputLabel htmlFor="adornment-user">用户帐号</InputLabel>
              <Input id="adornment-user" 
                 />
            </FormControl>
            <FormControl fullWidth className={classes.forms} >
              <InputLabel htmlFor="adornment-password">用户密码</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="显示密码"
                      onClick={this.handleClickShowPasssword.bind(this)}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                } />
            </FormControl>
            <div className={classes.forms} >
              <Button variant='raised' color="primary" fullWidth disabled={this.state.isloginStatus}  className={classes.button} onClick={this.loginCheck.bind(this)}>
                {this.state.isloginStatus?"登陆中...":"登陆"}
              </Button>
              {this.state.isloginStatus && <CircularProgress size={38} className={classes.buttonProgress} />}
            </div>
          </div>
        </Zoom>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.state.isloginStatus}
        onClose={this.handleClose}
        message={<span id="message-id">用户认证失败！</span>}
      />
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);