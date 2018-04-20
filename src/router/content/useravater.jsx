import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'md5';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import user from '../../images/user.png';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {withRouter} from 'react-router-dom';
import Button from 'material-ui/Button';
import { bindActionCreators } from 'redux'
import Tooltip from 'material-ui/Tooltip';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import {userLoginOut} from '../../actions'

import { ajax } from '../../commons/ajax'

const styles = theme=>({
  avatarRoot:{
    position:"absolute",
    right:0
  },
  avatar: {
    marginRight: 20,
  },
  bigAvatar: {
    cursor: 'pointer',
    width: 45,
    height: 45,
  },

})
class UserAvater extends Component {
 
  constructor(props){
    super(props);
    this.state={
      openmenu: false,
      anchorEl: null,
      opendialog: false
    }
  }

  handleOpenUserMenu(event){
    this.setState({ anchorEl: event.currentTarget,openmenu: true });
  }
  
  handleUserExit(){
    this.setState({ opendialog: true });
    
  }
  handleExitSuccess(){
    this.props.userLoginOut()
  }
  handleUserClose(){
    this.setState({ opendialog: false });
    let params={
      MsgType: "ACTION_USER_LOGOUT",
      Token: this.props.userInfo.token,
      Sign: md5('ACTION_USER_LOGOUT'+this.props.userInfo.token),
    }
    ajax('/api',params).then(this.handleExitSuccess.bind(this))
                       .catch(this.handleExitSuccess.bind(this));
    
  }
  handleClose(url=""){
    if(url!=="") this.props.history.replace(url);
    this.setState({ anchorEl: null,openmenu: false ,opendialog: false });
  }
  render() {
    const {classes} =this.props;
    const {openmenu,anchorEl} =this.state;

    return (
      <div className={classes.avatarRoot}>
        <Tooltip title={this.props.userInfo.loginuser}>
          <Avatar alt="用户"
                  src={this.props.userInfo.avaterimg||user}
                  onClick={this.handleOpenUserMenu.bind(this)}
                  className={classNames(classes.avatar, classes.bigAvatar)} />
        </Tooltip>
        <Menu anchorEl={anchorEl} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
          transformOrigin={{ vertical: 'top', horizontal: 'right'}}
          open={openmenu}
          onClose={this.handleClose.bind(this)}  >
              <MenuItem onClick={this.handleClose.bind(this,'/content/userinfo')} >
                用户属性
              </MenuItem>
          <MenuItem onClick={this.handleClose.bind(this,'/content/password')}>修改密码</MenuItem>
          <Divider />
          <MenuItem onClick={this.handleUserExit.bind(this)}>注销-{this.props.userInfo.loginuser}</MenuItem>
        </Menu>
        <Dialog
          open={this.state.opendialog}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"退出登陆"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              你确定要退出用户[{this.props.userInfo.username}]登陆吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              取消
            </Button>
            <Button onClick={this.handleUserClose.bind(this)} color="primary" autoFocus>
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
UserAvater.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    userLoginOut: bindActionCreators(userLoginOut, dispatch),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(withRouter(UserAvater)));
