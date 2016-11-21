import { connect } from 'react-redux';
import Editor from './Editor';

const mapStateToProps = (state) => {
  return {
    deckAction: state.editor.deckAction
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
