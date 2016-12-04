import { connect } from 'react-redux';
import Landing from './Landing';
import { userLogin } from 'components/game/Flow/FlowModule';

const mapStateToProps = (state) => {
  return {
    me: state.flow.me,
    players: state.flow.room.players
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (name, avatar) => dispatch(userLogin({name, avatar}))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
