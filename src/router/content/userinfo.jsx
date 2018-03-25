import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import back from '../../images/back.jpg';
const styles = {
  card: {
    width: 345,
    margin:"0 auto"
  },
  media: {
    height: 300,
  },
};

function UserInfo(props) {
  const { classes } = props;
  return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={back}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            xxxx用户
          </Typography>
          <Typography component="b">
            部门:
          </Typography>
          <Typography component="b">
            登陆IP:
          </Typography>
          <Typography component="b">
            登陆IP:
          </Typography>
        </CardContent>
       </Card>
  );
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserInfo);