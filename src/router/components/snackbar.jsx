import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Errors from 'material-ui-icons/Error';
import lightBlue from 'material-ui/colors/lightBlue';
import red from 'material-ui/colors/red';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
const styles = theme=>({
  snackbarcontent:{
    backgroundColor: lightBlue[700],
    padding: "0px 8px 0px 8px",
    marginTop:5,
    marginBottom:10,
    opacity:0.9,
    [theme.breakpoints.down('sm')]:{
      flexGrow:0
    }
  },
  iconbutton:{
    width:36,
    height:36,
    marginTop:-1
  },
  iconinfo:{
    float:"left",
    marginTop:-1,
    color: red[400],
    marginRight:5,
  }
})
class Snack extends Component {
    constructor(props) {
        super(props);
        this.state={open:false}
    }
    c
    componentWillReceiveProps(nextProps) {
      if(nextProps.title !== ""){
        this.setState({open:true})
      }
    }
    handleBarClose(){
      this.setState({open:false});
    }
    
    handleOpenUserMenu(event){
      this.setState({ anchorEl: event.currentTarget,openmenu: true });
    }
    render() {
        const { classes,title } = this.props;
        const vertical=this.props.vertical|| 'top'
        return (
          <Snackbar
            anchorOrigin={{ vertical: vertical, horizontal: 'center' }}
            open={ this.state.open }
            onClose={this.handleBarClose.bind(this)}
            SnackbarContentProps={{
                className: classes.snackbarcontent,
              }}
            message={<span id="message-id">{title}<Errors className={classes.iconinfo} /></span>}
            action={[
              <IconButton
                key="close"
                size="small"
                aria-label="Close"
                color="inherit"
                className={classes.iconbutton}
                onClick={this.handleBarClose.bind(this)} >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        );
    }
}
Snack.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Snack);
