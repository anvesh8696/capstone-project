import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { AppBar, Panel } from 'react-toolbox';
import { themr } from 'react-css-themr';
import defaultTheme from './Room.scss';
import CardGame from 'components/game/CardGame';

@themr('Room', defaultTheme)
class Room extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    params: PropTypes.object,
    game: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    buttonAction: PropTypes.func.isRequired,
    setupRound: PropTypes.func.isRequired,
    updateGame: PropTypes.func.isRequired,
    playerTurnEnd: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }
  
  componentDidMount() {
    this.props.setupRound(findDOMNode(this.refs.game));
  }
  
  handleOnDone = () => {
    this.props.router.push('/');
  }

  render() {
    const { params } = this.props;
    return (
      <Panel>
        <AppBar flat title={`Room: ${params.roomID}`}/>
        <CardGame ref="game" {...this.props} onDone={this.handleOnDone}/>
      </Panel>
    );
  }
}

export default Room;
