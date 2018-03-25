import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Content from './content'
import {userLoginOut} from '../../actions'

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    userLoginOut: bindActionCreators(userLoginOut, dispatch),
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps,
  )(Content);