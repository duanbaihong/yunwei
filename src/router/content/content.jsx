import React, { Component }  from 'react';
import immutable from 'immutable';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { Route,
         Switch,
         Redirect,
       } from 'react-router-dom';

import SideMenu from './sidemenu';
import TopMenu from './topmenu';
import Password from './password';
import UserInfo from './userinfo';
import PackageInfo from './packageinfo';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
});
class Content extends Component {
  constructor(props){
    super(props);
  }
  openReport(){
    this.props.history.push('/notfound')
  }
  render() {
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <TopMenu
        userLoginOut={this.props.userLoginOut} 
        history={this.props.history}
      />
      <SideMenu history={this.props.history} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container >
            <Switch>
              <Route path="/content/password" render={(props)=>(
                  window.isLogin?<Password {...props}  />:<Redirect to="/login" />
                )} />
              <Route path="/content/userinfo" render={(props)=>(
                  window.isLogin?<UserInfo {...props}  />:<Redirect to="/login" />
                )} />
              <Route path="/content/packageinfo" render={(props)=>(
                  window.isLogin?<PackageInfo {...props}  />:<Redirect to="/login" />
                )} />
            </Switch>
        </Grid>

      </main>
    </div>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Content);