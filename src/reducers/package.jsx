import immutable from 'immutable';

const initialState = immutable.Map({
  packageinfo:{}
});

export const PackageReducer = (state = initialState , action) => {
  switch (action.type) {
    case 'FIND_PACKAGE_INFO':
      return {
        ...state.toJS()
      }
    case 'FIND_USER_INFO':
      return {
        ...state.toJS()
      }
    default:
      return state
  }
}