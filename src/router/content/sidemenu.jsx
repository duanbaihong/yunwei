import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { MenuItem,MenuList } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import {ListItemIcon, ListItemText } from 'material-ui/List';
import DraftsIcon from 'material-ui-icons/Drafts';
import Healing from 'material-ui-icons/Healing';
import Cast from 'material-ui-icons/Cast';
import Camera from 'material-ui-icons/Camera';
import PieChart from 'material-ui-icons/PieChart';
import Report from 'material-ui-icons/Report';
import {withRouter} from 'react-router-dom';

const drawerWidth = 210;
const styles = theme => ({
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
    boxSizing: "border-box"
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
            classes={{paper: classes.drawerPaper}} >
          <MenuList className={classes.menuItem}>
          <MenuItem className={this.state.activemenu===1?classes.menuactive:""} 
                    onClick={this.handleClickLink.bind(this,'/content/packageinfo',1)} >
              <ListItemIcon className={classes.icon}>
                <PieChart />
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
                      onClick={this.handleClickLink.bind(this,'/content/homemessage',3)}  >
              <ListItemIcon className={classes.icon}>
                <Healing />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="家开报文" />
            </MenuItem>
            <Divider />
            <MenuItem className={this.state.activemenu===4?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/analogmessage',4)}>
              <ListItemIcon className={classes.icon}>
                <Report />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="模拟报文" />
            </MenuItem>
            <MenuItem className={this.state.activemenu===5?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/modulelogs',5)}  >
              <ListItemIcon className={classes.icon}>
                <Cast />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="模块日志" />
            </MenuItem>
            <MenuItem className={this.state.activemenu===6?classes.menuactive:""} 
                      onClick={this.handleClickLink.bind(this,'/content/operateresults',6)}>
              <ListItemIcon className={classes.icon}>
                <Camera />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="操作记录" />
            </MenuItem>
            <Divider />
          </MenuList>
        </Drawer>
      );
    }
}
SideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(withRouter(SideMenu));
