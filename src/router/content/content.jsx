import React, { Component }  from 'react';
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
import OrderMessage from './ordermessage';
import ModuleLogs from './modulelogs';

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topmenu:{
    position:"relative",
  },
  bottomcontent:{
    display:"flex",
    height:"100%"
  },
  content: {
    flexGrow: 1,
    overflow:"auto",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
});
class Content extends Component {
  openReport(){
    this.props.history.push('/notfound')
  }
  render() {
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <div className={classes.topmenu}>
        <TopMenu />
      </div>
      <div className={classes.bottomcontent} >
        <SideMenu />
        <main className={classes.content}>
          <Grid container >
              <Switch>
                <Route path="/content/password" render={(props)=>(
                    window.isLogin?<Password userLoginOut={this.props.userLoginOut}   />:<Redirect to="/login" />
                  )} />
                <Route path="/content/userinfo" render={(props)=>(
                    window.isLogin?<UserInfo   />:<Redirect to="/login" />
                  )} />
                <Route path="/content/packageinfo" render={(props)=>(
                    window.isLogin?<PackageInfo userLoginOut={this.props.userLoginOut}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/ordermessage" render={(props)=>(
                    window.isLogin?<OrderMessage {...props}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/modulelogs" render={(props)=>(
                    window.isLogin?<ModuleLogs {...props}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/operateresults" render={(props)=>(
                    window.isLogin?<PackageInfo {...props}  />:<Redirect to="/login" />
                  )} />
              </Switch>
          </Grid>
        </main>
      </div>
    </div>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Content);