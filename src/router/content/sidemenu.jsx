import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import { MenuItem,MenuList } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import {ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';
import {withRouter} from 'react-router-dom';

const drawerWidth = 210;
const styles = theme => ({
  drawer:{
    
  },
  drawerPaper: {
    width: drawerWidth,
    height:"100%",
    position: 'static',
    display:"block",
    transition: "all .5s",
    [theme.breakpoints.down('sm')]:{
      width: 65,
    }
  },
  toolbar: theme.mixins.toolbar,
  typflex: {
    flex:1,
    padding:0,
  },
  menuItem: {
    height:"100%",
  },
  menuactive:{
    backgroundColor: theme.palette.primary.main,
    '& $primary, & $icon': {
      color: theme.palette.common.white,
    },
    "&:hover":{
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    }
  },
  primary:{},
  icon:{
    transition: "all .5s",
    [theme.breakpoints.down('sm')]:{
      height:35,
      width:35,
    }
  }
});
class SideMenu extends Component {
    constructor(props){
      super(props);
      this.state={
        activemenu:0
      }
    }
    handleClickLink(url="/content/packageinfo",actmenu=1){
      this.setState({activemenu:actmenu})
      this.props.history.replace(url)
    }
    render() {
      let {classes} = this.props
      return (
        <Drawer variant="permanent"
            classes={{paper: classes.drawerPaper}} className={classes.drawer} >
          <MenuList className={classes.menuItem}>
          <MenuItem className={this.state.activemenu===1?classes.menuactive:""} 
                    onClick={this.handleClickLink.bind(this,'/content/packageinfo',1)} >
              <ListItemIcon className={classes.icon}>
                <SendIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} 
                inset 
                primary="套餐查询" />
            </MenuItem>
            <MenuItem className={this.state.activemenu===2?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/ordermessage',2)} >
              <ListItemIcon className={classes.icon}>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="订购报文" />
            </MenuItem>
            <MenuItem className={this.state.activemenu===3?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/modulelogs',3)}  >
              <ListItemIcon className={classes.icon}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="模块日志" />
            </MenuItem>
            <MenuItem className={this.state.activemenu===4?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/operateresults',4)}>
              <ListItemIcon className={classes.icon}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="操作记录" />
            </MenuItem>
          </MenuList>
        </Drawer>
      );
    }
}
SideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(withRouter(SideMenu));
