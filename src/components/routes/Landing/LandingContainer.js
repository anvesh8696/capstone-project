import { connect } from 'react-redux';
import Landing from './Landing';
import { userLogin, modeChanged } from 'components/game/Flow/FlowModule';

const mapStateToProps = (state) => {
  return {
    me: state.flow.me,
    players: state.flow.room.players,
    modeIndex: state.flow.room.teamMode === '2V2' ? 0 : 1
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (name, avatar) => dispatch(userLogin({name, avatar})),
    onModeClick: (index) => dispatch(modeChanged(index))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
