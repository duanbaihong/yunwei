import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia,CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import back from '../../images/back.jpg';
const styles = {
  card: {
    width: 360,
    margin:"0 auto",
    marginTop: 50
  },
  media: {
    height: 300,
  },
  tabothalign: {
    width:90,
    display: "inline-block",
    fontSize:"1.1rem",
    textAlign:"justify",
    "&>i":{
      display: "inline-block",
      width:"100%"
    }
  }
};

function UserInfo(props) {
  console.log(props)
  const { classes } = props;
  return (
      <Card className={classes.card}>
        <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                U
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
        <CardMedia
          className={classes.media}
          image={back}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="display1">
             {props.userInfo.username}-{props.userInfo.loginuser}
          </Typography>
          <Typography  >
            <span className={classes.tabothalign}>部门<i></i></span><span style={{display:"inline-block"}}>{props.userInfo.department}</span>
          </Typography>
          <Typography >
            <span className={classes.tabothalign}>上次登陆IP<i></i></span>{props.userInfo.lastloginip}
          </Typography>
          <Typography >
            <span className={classes.tabothalign}>登陆时间<i></i></span>{props.userInfo.logintime}
          </Typography>
        </CardContent>
       </Card>
  );
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
export default connect(mapStateToProps,null)(withStyles(styles)(UserInfo));