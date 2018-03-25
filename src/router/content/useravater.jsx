import React, { Component } from 'react';

import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import back from '../../images/back.jpg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const styles = theme=>({
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
  handleUserClose(){
    this.setState({ opendialog: false });
    this.props.userLoginOut()
  }
  handleClose(){
    this.setState({ anchorEl: null,openmenu: false ,opendialog: false });
  }
  render() {
    const {classes} =this.props;
    const {openmenu,anchorEl} =this.state;

    return (
      <div>
        <Avatar alt="用户"
                src={back}
                onClick={this.handleOpenUserMenu.bind(this)}
                className={classNames(classes.avatar, classes.bigAvatar)} />
        <Menu anchorEl={anchorEl} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
          transformOrigin={{ vertical: 'top', horizontal: 'right'}}
          open={openmenu}
          onClose={this.handleClose.bind(this)}  >
              <MenuItem onClick={this.handleClose.bind(this)} component={(c)=>{
                return <li><Link {...c} to="/content/userinfo" >用户属性</Link></li>
              }}  >
                
              </MenuItem>
          <MenuItem onClick={this.handleClose.bind(this)} component={(c)=>{
                return <li><Link {...c} to="/content/password" >修改密码</Link></li>
              }}></MenuItem>
          <Divider />
          <MenuItem onClick={this.handleUserExit.bind(this)}>注销</MenuItem>
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
              你确定要退出登陆吗？
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
export default withStyles(styles)(UserAvater);
