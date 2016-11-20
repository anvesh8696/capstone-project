import React, { Component, PropTypes } from 'react';
import { Sidebar } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
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
        <List selectable ripple>
          <ListSubHeader caption="Card Actions" />
          <ListItem caption="Deal" leftIcon="delete" />
          <ListItem caption="Shuffle" leftIcon="delete" />
          <ListItem caption="Fan" leftIcon="delete" />
          <ListItem caption="Flip" leftIcon="delete" />
          <ListItem caption="Hand: Select Random" leftIcon="delete" />
          <ListDivider />
          <ListSubHeader caption="Game Actions" />
          <ListItem caption="Start" leftIcon="delete" />
          <ListItem caption="End" leftIcon="delete" />
          <ListDivider />
          <ListSubHeader caption="Player Actions" />
          <ListItem caption="EndTurn" leftIcon="delete" />
          <ListDivider />
          <ListSubHeader caption="Bot Actions" />
          <ListItem caption="EndTurn" leftIcon="delete" />
          <ListDivider />
        </List>
        </Sidebar>
      );
    }
}
export default EditorSideBar;
