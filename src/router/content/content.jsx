import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { Route,
         Switch,
         Redirect,
       } from 'react-router-dom';
import asyncComponent from '../components/asynccomponent';

const AsyncSideMenu = asyncComponent(() => import('./sidemenu'));
const AsyncTopMenu = asyncComponent(() => import('./topmenu'));
const AsyncPassword = asyncComponent(() => import('./password'));
const AsyncUserInfo = asyncComponent(() => import('./userinfo'));
const AsyncPackageInfo = asyncComponent(() => import('./packageinfo'));
const AsyncOrderMessage = asyncComponent(() => import('./ordermessage'));
const AsyncHomeMessage = asyncComponent(() => import('./homemessage'));
const AsyncAnalogMessage = asyncComponent(() => import('./analogmessage'));
const AsyncModuleLogs = asyncComponent(() => import('./modulelogs'));

// import SideMenu from './sidemenu';
// import TopMenu from './topmenu';
// import Password from './password';
// import UserInfo from './userinfo';
// import PackageInfo from './packageinfo';
// import OrderMessage from './ordermessage';
// import HomeMessage from './homemessage';
// import AnalogMessage from './analogmessage';
// import ModuleLogs from './modulelogs';

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
        <AsyncTopMenu />
      </div>
      <div className={classes.bottomcontent} >
        <AsyncSideMenu />
        <main className={classes.content}>
          <Grid container >
              <Switch>
                <Route path="/content/password" render={(props)=>(
                    window.isLogin?<AsyncPassword userLoginOut={this.props.userLoginOut}   />:<Redirect to="/login" />
                  )} />
                <Route path="/content/userinfo" render={(props)=>(
                    window.isLogin?<AsyncUserInfo userLoginOut={this.props.userLoginOut}   />:<Redirect to="/login" />
                  )} />
                <Route path="/content/packageinfo" render={(props)=>(
                    window.isLogin?<AsyncPackageInfo userLoginOut={this.props.userLoginOut}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/ordermessage" render={(props)=>(
                    window.isLogin?<AsyncOrderMessage userLoginOut={this.props.userLoginOut}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/homemessage" render={(props)=>(
                    window.isLogin?<AsyncHomeMessage {...props} userLoginOut={this.props.userLoginOut}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/modulelogs" render={(props)=>(
                    window.isLogin?<AsyncModuleLogs {...props}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/operateresults" render={(props)=>(
                    window.isLogin?<AsyncPackageInfo {...props}  />:<Redirect to="/login" />
                  )} />
                <Route path="/content/analogmessage" render={(props)=>(
                    window.isLogin?<AsyncAnalogMessage {...props} userLoginOut={this.props.userLoginOut}  />:<Redirect to="/login" />
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