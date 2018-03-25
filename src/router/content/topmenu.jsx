import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import UserAvater from './useravater';

const styles = theme =>({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbartitle: {
    padding:0,
    paddingLeft:5,
  },
  typflex: {
    flex:1,
    padding:0,
  }
})
class TopMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {classes} = this.props
        return (
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbartitle}>
              <IconButton  color="inherit"  aria-label="open drawer" >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.typflex} noWrap>
                运维支撑工具
              </Typography>
              <UserAvater
                userLoginOut={this.props.userLoginOut}
                history={this.props.history} />
            </Toolbar>
          </AppBar>
        );
    }
}

TopMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TopMenu);
