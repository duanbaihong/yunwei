import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Content from './content'
import {userLoginOut,changeAvaterImg} from '../../actions'

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    userLoginOut: bindActionCreators(userLoginOut, dispatch),
    changeAvaterImg: bindActionCreators(changeAvaterImg, dispatch),
    dispatch:dispatch
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps,
  )(Content);