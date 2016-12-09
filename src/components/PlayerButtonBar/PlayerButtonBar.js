import React, { Component, PropTypes } from 'react'; 
import { themr } from 'react-css-themr';
import theme from './PlayerButtonBar.scss';
import { Button } from 'react-toolbox/components/button';

@themr('PlayerButtonBar', theme)
export default class PlayerButtonBar extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onDraw: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
  }
  
  state = {
  }
  
  render() {
    const { theme, onDraw, onDone } = this.props;
    return (
      <div className={theme.buttonBar}>
        <Button label="Draw" raised primary theme={theme} onClick={onDraw}/>
        <Button label="Done" raised primary theme={theme} onClick={onDone}/>
      </div>
    );
  }
}
