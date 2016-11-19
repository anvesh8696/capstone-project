import React, { Component, PropTypes } from 'react';
import { AppBar, Panel } from 'react-toolbox';
import { themr } from 'react-css-themr';
import defaultTheme from './Landing.scss';

@themr('Landing', defaultTheme)
class Landing extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      toggleDrawerActive: PropTypes.func.isRequired,
    }
  
    render() {
      const { theme } = this.props;
      return (
        <Panel>
          <AppBar title = {'Home'} leftIcon = {'menu'} onLeftIconClick = {this.props.toggleDrawerActive} />
          <div className = {theme.page}>
            Hello Home Page
          </div>
        </Panel>
      );
    }
}
export default Landing;
