import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { AppBar, Panel, Navigation } from 'react-toolbox/components/index.js';
import { themr } from 'react-css-themr';
import defaultTheme from './Room.scss';
import CardGame from 'components/game/CardGame';
import RoomLobbyModal from 'components/ui/modal/RoomLobbyModal';
import { Button } from 'react-toolbox/components/button';
import HelpModal from 'components/ui/modal/HelpModal';

@themr('Room', defaultTheme)
class Room extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    params: PropTypes.object,
    game: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    buttonAction: PropTypes.func.isRequired,
    setupRoom: PropTypes.func.isRequired,
    updateGame: PropTypes.func.isRequired,
    playerTurnEnd: PropTypes.func.isRequired,
    kickPlayer: PropTypes.func.isRequired,
    addBot: PropTypes.func.isRequired,
    setupRound: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }
  
  state = {
    helpOpen: false
  }
  
  componentDidMount() {
    const { params } = this.props;
    this.props.setupRoom(params.roomID);
  }
  
  handleOnDone = () => {
    this.props.router.push('/');
  }
  
  handleToggleHelp = () => {
    this.setState({...this.state, helpOpen:!this.state.helpOpen});
  }
  
  renderPage = (status, players) => {
    const { kickPlayer, addBot, setupRound } = this.props;
    const { helpOpen } = this.state;
    if(status === 'WAITING'){
      return (
        <RoomLobbyModal
          players={players}
          kickPlayer={kickPlayer}
          addBot={addBot}
          setupRound={setupRound}
        />
      );
    }
    return (
      <CardGame ref="game" {...this.props}
        onDone={this.handleOnDone}
        helpOpen={helpOpen}
      />
    );
  }

  render() {
    const { params, room, theme } = this.props;
    const { helpOpen } = this.state;
    return (
      <Panel>
        <AppBar flat title={`Room: ${params.roomID}`} >
          <Navigation type="horizontal">
            <Button icon="live_help" inverse onClick={this.handleToggleHelp}>Help</Button>
          </Navigation>
        </AppBar>
        { this.renderPage(room.status, room.players) }
        <HelpModal open={helpOpen} onDone={this.handleToggleHelp}/>
      </Panel>
    );
  }
}

export default Room;
