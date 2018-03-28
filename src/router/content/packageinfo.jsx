import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SearchIcon from 'material-ui-icons/Search';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 0,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  paper:{
    paddingLeft:30,
  },
  textField:{
    minWidth:250,
    marginLeft:30,
  },
  search: {
    margin: 22,
    float: "right"
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function PackageInfo(props) {
  const { classes } = props;

  return (
    <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            查询方式：
            <TextField
              id="phone_imei"
              label="手机号"
              className={classes.textField}
              type="text"
              autoComplete="phone"
              margin="normal"
            /> 
            <TextField
              id="password-input"
              label="设备号MAC或IMEI号查询"
              className={classes.textField}
              type="text"
              autoComplete="macimei"
              margin="normal"
            />
            <Button variant="raised" color="secondary" className={classes.search}>
              <SearchIcon />
              查询
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell numeric>Calories</TableCell>
                  <TableCell numeric>Fat (g)</TableCell>
                  <TableCell numeric>Carbs (g)</TableCell>
                  <TableCell numeric>Protein (g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{n.name}</TableCell>
                      <TableCell numeric>{n.calories}</TableCell>
                      <TableCell numeric>{n.fat}</TableCell>
                      <TableCell numeric>{n.carbs}</TableCell>
                      <TableCell numeric>{n.protein}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
    </Grid>
  );
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PackageInfo);