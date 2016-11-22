import React, { Component, PropTypes } from 'react';
import { AppBar, Panel } from 'react-toolbox';
import { themr } from 'react-css-themr';
import defaultTheme from './Editor.scss';
import Deck from 'components/Deck/Deck';
import deckTheme from 'components/Deck/Deck.scss';

@themr('Editor', defaultTheme)
class Editor extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      toggleDrawerActive: PropTypes.func.isRequired,
      deckAction: PropTypes.string.isRequired
    }
  
    render() {
      const { theme, deckAction } = this.props;
      return (
        <Panel>
          <AppBar title={'Editor'} leftIcon={'menu'} onLeftIconClick={this.props.toggleDrawerActive} />
          <div className={theme.page}>
            <Deck action={deckAction} theme={theme}/>
          </div>
        </Panel>
      );
    }
}
export default Editor;
