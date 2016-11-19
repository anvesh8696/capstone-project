import React, { Component, PropTypes } from 'react';
import { Sidebar, Button } from 'react-toolbox';
import { themr } from 'react-css-themr';
import defaultTheme from './Editor.scss';

@themr('Editor', defaultTheme)
class EditorSideBar extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired
    }
    
    state = {
      sidebarPinned: true
    }
  
    render() {
      const { theme } = this.props;
      return (
        <Sidebar pinned={ this.state.sidebarPinned } width={ 5 }>
          <Button icon="bookmark" label="Shuffle" raised />
        </Sidebar>
      );
    }
}
export default EditorSideBar;
