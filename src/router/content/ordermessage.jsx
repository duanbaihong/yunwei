import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import QueryText from './othercomponents/querytext';
import Snack from '../components/snackbar';
import EnhancedTableHead from './othercomponents/enhancedtableheader';
import EnhancedTableToolbar from './othercomponents/enhancedtabletoolbar';
import md5 from 'md5';

import { ajax } from '../../commons/ajax'
let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

const styles = theme => ({
  rootdiv: {
    width: '100%',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class PackageInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('KitKat', 518, 26.0, 65, 7.0),
        createData('Lollipop', 392, 0.2, 98, 0.0),
        createData('Marshmallow', 318, 0, 81, 2.0),
        createData('Nougat', 360, 19.0, 9, 37.0),
        createData('Oreo', 437, 18.0, 63, 4.0),
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,
      msg: "",
      loading:"",
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  handleQuery(data){
    console.log(data)

    let macimei=data.macimei
    let phone=data.phone
    let orderno=data.orderno
    let params={
      MsgType: "ACTION_QUERY_BUYREPORTS_INFO",
      Token: sessionStorage.token,
    }
    if(phone!=="" && phone!== undefined){
      params['phone']= phone
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+phone);
    }else if(macimei!=="" && macimei!== undefined){
      params['macimei']= macimei
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+ macimei);
    }else{
      params['orderno']= orderno
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+ orderno);
    }
    ajax('/api',params).then((req,rsp,next)=>{

    }).catch(()=>{

    })

  }
  setStateMsg(msg){
    this.setState(msg);
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div className={classes.rootdiv}>
        <QueryText 
            setmsg={this.setStateMsg.bind(this)} 
            handleQuery={this.handleQuery.bind(this)}
            loading={this.state.loading} 
            disSearial={true}
            />
        <Paper className={classes.root} >
          <EnhancedTableToolbar numSelected={selected.length} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      // onClick={event => this.handleClick(event, n.id)}
                      // role="checkbox"
                      // aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell >{n.name}</TableCell>
                      <TableCell numeric>{n.calories}</TableCell>
                      <TableCell numeric>{n.fat}</TableCell>
                      <TableCell numeric>{n.carbs}</TableCell>
                      <TableCell numeric>{n.protein}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      'aria-label': '上一页',
                    }}
                    nextIconButtonProps={{
                      'aria-label': '下一页',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Snack title={this.state.msg} vertical={"bottom"} />
        </Paper>
      </div>
    );
  }
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PackageInfo);
