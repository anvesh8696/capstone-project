import React, { Component, PropTypes } from 'react';
import { Layout } from 'react-toolbox/components/index.js';
import { withRouter } from 'react-router';

export const validateRoomID = (nextState, replace, callback) => {
  const { roomID } = nextState.params;
  if(roomID && roomID.length <= 15){
    callback();
  }
  replace('/');
};

export default function (Wrapped){
  
  class RoomLayout extends Component {
    
    static propTypes = {
      params: PropTypes.object
    }
    
    render() {
      return (
        <Layout>
          <Wrapped {...this.props}/>
        </Layout>
      );
    }
  }
  return withRouter(RoomLayout, { withRef: true });
}
