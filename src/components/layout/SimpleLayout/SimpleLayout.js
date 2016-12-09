import React, { Component } from 'react';
import { Layout } from 'react-toolbox/components/index.js';
import { withRouter } from 'react-router';

export default function (Wrapped){
  
  class SimpleLayout extends Component {
    
    static propTypes = {
      router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
      }).isRequired
    }
    
    render() {
      return (
        <Layout>
          <Wrapped {...this.props}/>
        </Layout>
      );
    }
  }
  return withRouter(SimpleLayout, { withRef: true });
}
