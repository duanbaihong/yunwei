import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import { MenuItem,MenuList } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import {ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';
import {Link} from 'react-router-dom';
const drawerWidth = 200;
const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  typflex: {
    flex:1,
    padding:0,
  },
  menuItem: {
    '&>a:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    }
  },
  primary:{},
  icon:{}
});
class SideMenu extends Component {
    constructor(props) {
        super(props);
    }
    handleClick(){
      this.props.history.push('/content/packageinfo')
    }
    render() {
      let {classes} = this.props
      return (
        <Drawer variant="permanent"
            classes={{paper: classes.drawerPaper}} >
          <div className={classes.toolbar} />
          <MenuList>
          <MenuItem className={classes.menuItem} 
                    component={(c)=><li><Link {...c} to={"/content/packageinfo"} /></li>} >
              <ListItemIcon className={classes.icon}>
                <SendIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} 
                inset 
                primary="套餐查询" />
            </MenuItem>
            <MenuItem className={classes.menuItem} 
                      component={(c)=><li><Link {...c} to={"/content/ordermessage"} /></li>} >
              <ListItemIcon className={classes.icon}>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="订购报文" />
            </MenuItem>
            <MenuItem className={classes.menuItem}
                      component={(c)=><li><Link {...c} to={"/content/modulelogs"} /></li>} >
              <ListItemIcon className={classes.icon}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="模块日志" />
            </MenuItem>
            <MenuItem className={classes.menuItem}
                      component={(c)=><li><Link {...c} to={"/content/operateresults"} /></li>} >
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
export default withStyles(styles)(SideMenu);
