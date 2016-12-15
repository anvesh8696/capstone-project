import React, { Component, PropTypes } from 'react'; 
import { themr } from 'react-css-themr';
import theme from './PlayerButtonBar.scss';
import { Button } from 'react-toolbox/components/button';
import ReactDOM from 'react-dom';

@themr('PlayerButtonBar', theme)
export default class PlayerButtonBar extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onDraw: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    disableDone: PropTypes.bool.isRequired
  }
  
  state = {
  }
  
  /**
   * Set focus on createTab when Modal opens
   *
   */
  componentDidMount(){
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.focus).focus();
    }, 250);
  }
  
  render() {
    const { theme, onDraw, onDone, disableDone } = this.props;
    return (
      <div className={theme.buttonBar}>
        <Button ref="focus" label="Draw" raised primary theme={theme} onClick={onDraw}/>
        <Button label="Done" raised primary theme={theme} disabled={disableDone} onClick={onDone}/>
      </div>
    );
  }
}
