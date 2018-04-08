import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

const suggestions = [
  {label: "一级家开",url: "http://192.168.20.16:8017/fcha/auth/fch/queryOrderDetails"},
  {label: "一级家开",url: "http://192.168.20.16:8017/fcha/auth/fch/normalRequestHandler"},
  {label: "云南BOSS",url: "http://192.168.20.16:8017/bossagent/auth/yn/normalRequestHandler"},
  {label: "山西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sx/normalRequestHandler"},
  {label: "上海BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sh/normalRequestHandler"},
  {label: "山东BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sd/normalRequestHandler"},
  {label: "四川BOSS",url: "http://192.168.20.16:8017/bossagent/auth/scsc/normalRequestHandler"},
  {label: "新四川BOSS",url: "http://192.168.20.16:8017/bossagent/auth/scscnew/normalRequestHandler"},
  {label: "test",url: "http://192.168.20.16:8017/bossagent/auth/ln/normalRequestHandler"},
  {label: "江西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/jx/normalRequestHandler"},
  {label: "江苏BOSS",url: "http://192.168.20.16:8017/bossagent/auth/js/normalRequestHandler"},
  {label: "河北BOSS",url: "http://192.168.20.16:8017/bossagent/auth/hebei/normalRequestHandler"},
  {label: "广州BOSS",url: "http://192.168.20.16:8017/bossagent/auth/gz/normalRequestHandler"},
  {label: "广西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/gx/normalRequestHandler"},
  {label: "安徽BOSS",url: "http://192.168.20.16:8017/bossagent/auth/ah/normalRequestHandler"},
];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        paddingTop:5,
        paddingBottom:5
      }}
    >
      {suggestion.label+"("+suggestion.url+")"}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 || suggestion.url.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) 

    if (keep) {
      count += 1;
    }

    return keep;
  });
}
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    padding:10
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight:250,
    overflow:"auto"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

function SelectUrl(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            请输入URL地址，或者选择URL
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: '请输入URL地址，或者选择URL',
                id: 'selecturl',
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.url }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    </div>
  );
}

SelectUrl.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectUrl);