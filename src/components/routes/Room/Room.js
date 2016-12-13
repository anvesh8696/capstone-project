import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { AppBar, Panel } from 'react-toolbox/components/index.js';
import { themr } from 'react-css-themr';
import defaultTheme from './Room.scss';
import CardGame from 'components/game/CardGame';
import RoomLobbyModal from 'components/ui/modal/RoomLobbyModal';

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
  
  componentDidMount() {
    const { params } = this.props;
    this.props.setupRoom(params.roomID);
  }
  
  handleOnDone = () => {
    this.props.router.push('/');
  }
  
  renderPage = (status, players) => {
    const { kickPlayer, addBot, setupRound } = this.props;
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
      <CardGame ref="game" {...this.props} onDone={this.handleOnDone}/>
    );
  }

  render() {
    const { params, room } = this.props;
    return (
      <Panel>
        <AppBar flat title={`Room: ${params.roomID}`}/>
        { this.renderPage(room.status, room.players) }
      </Panel>
    );
  }
}

export default Room;
