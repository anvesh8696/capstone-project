import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './ActionList.scss';

@themr('ActionList', defaultTheme)
class ActionList extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired
  }
  
  static defaultProps = {
    actions: []
  }
  
  renderAction(action) {
    return (
      <li aria-label={action}></li>
    );
  }
  
  render() {
    const { actions, theme } = this.props;
    return (
      <ul aria-live="assertive" aria-relevant="additions" className={theme.list}>
        {actions.map((a) => this.renderAction(a))}
      </ul>
    );
  }
}
export default ActionList;
