import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem,MenuList } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import classNames from 'classnames';

import {ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';

import back from '../../images/back.jpg';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbartitle: {
    padding:0,
    paddingLeft:5,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
  menus: {
    paddingTop:1,
    paddingBottom:1,
  },
  avatar: {
    marginRight: 20,
  },
  bigAvatar: {
    cursor: 'pointer',
    width: 45,
    height: 45,
  },
  typflex: {
    flex:1,
    padding:0,
  },
   menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});
class Content extends Component {
  constructor(props, context){
    super(props, context);
    this.state={
      openmenu: false,
      anchorEl: null,
    }
  }
  handleOpenUserMenu(event){
    this.setState({ anchorEl: event.currentTarget,openmenu: true });
  }
  handleClose(){
    this.setState({ anchorEl: null,openmenu: false });
  }
  openReport(){
    console.log(this.props)
    this.props.history.push('/notfound11')
  }
  render() {
    console.log(this.props)
    const { classes } = this.props;
    const { openmenu, anchorEl } = this.state;
    return (
    <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbartitle}>
          <IconButton  color="inherit"  aria-label="open drawer" >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.typflex} noWrap>
            运维支撑工具
          </Typography>
          <Avatar alt="用户"
                  src={back}
                  onClick={this.handleOpenUserMenu.bind(this)}
                  className={classNames(classes.avatar, classes.bigAvatar)}
            />
          <Menu
            classes={{menu: classes.menus}}
            anchorEl={anchorEl}
            anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openmenu}
            onClose={this.handleClose.bind(this)}  >
            <MenuItem onClick={this.handleClose.bind(this)}>用户属性</MenuItem>
            <MenuItem onClick={this.handleClose.bind(this)}>etyn</MenuItem>
            <Divider />
            <MenuItem onClick={this.handleClose.bind(this)}>注销</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent"
              classes={{paper: classes.drawerPaper}} >
        <div className={classes.toolbar} />
        <MenuList>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <SendIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="套餐查询" />
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="订购报文" />
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="模块日志" />
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="操作记录" />
          </MenuItem>
        </MenuList>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
      </main>
    </div>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);