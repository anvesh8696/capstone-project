import React, { Component, PropTypes } from 'react';
import { Sidebar } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list';
import { themr } from 'react-css-themr';
import defaultTheme from './Editor.scss';

@themr('Editor', defaultTheme)
class EditorSideBar extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      dealCards: PropTypes.func.isRequired,
      shuffleCards: PropTypes.func.isRequired,
      sortCards: PropTypes.func.isRequired,
      fanCards: PropTypes.func.isRequired,
      flipCards: PropTypes.func.isRequired,
      randomCards: PropTypes.func.isRequired,
      handSelectRandomCards: PropTypes.func.isRequired
    }
    
    state = {
      sidebarPinned: true
    }
  
    render() {
      const {dealCards, shuffleCards, sortCards, fanCards, flipCards, randomCards, handSelectRandomCards} = this.props;
      return (
        <Sidebar pinned={ this.state.sidebarPinned } width={ 5 }>
        <List selectable ripple>
          <ListSubHeader caption="Card Actions" />
          <ListItem caption="Deal" leftIcon="delete" onClick={dealCards} />
          <ListItem caption="Shuffle" leftIcon="delete" onClick={shuffleCards} />
          <ListItem caption="Sort" leftIcon="delete" onClick={sortCards} />
          <ListItem caption="Fan" leftIcon="delete" onClick={fanCards} />
          <ListItem caption="Flip" leftIcon="delete" onClick={flipCards} />
          <ListItem caption="Random" leftIcon="delete" onClick={randomCards} />
          <ListItem caption="Hand: Select Random" leftIcon="delete" onClick={handSelectRandomCards} />
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
