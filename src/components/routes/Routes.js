import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import PageLayout from 'components/layout/PageLayout';
import Empty from 'components/layout/PageLayout/Empty';
import SimpleLayout from 'components/layout/SimpleLayout';
import RoomLayout from 'components/layout/RoomLayout';
import { validateRoomID } from 'components/layout/RoomLayout/RoomLayout';
import Landing from 'components/routes/Landing';
import Room from 'components/routes/Room';
import Editor from 'components/routes/Editor';
import EditorSideBar from 'components/routes/Editor/EditorSideBarContainer';

export default class Routes extends Component {
  
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  
  state = {
    ready: false
  }
  
  renderLoading(){
    return (
      <div>LOADING</div>
    );
  }
  
  renderRoutes(){
    return (
      <Router history={ this.props.history }>
        <Route path="/" component={ SimpleLayout(Landing) } />
        <Route path="/room/:roomID" component={ RoomLayout(Room) } onEnter={validateRoomID}/>
        <Route path="/room" component={ RoomLayout(Room) } onEnter={validateRoomID}/>
        <Route path="/editor" component={ PageLayout(Editor, EditorSideBar) } />
        <Route path="*" component={Empty}/>
      </Router>
    );
  }
  
  componentDidMount(){
    this.setState({...this.state, ready: true});
  }
  
  render() {
    let content = this.state.ready ? this.renderRoutes() : this.renderLoading();
    return (
      <Provider store={this.props.store}>
        {content}
      </Provider>
    );
  }
}
