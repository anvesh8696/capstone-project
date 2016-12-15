import React, { Component, PropTypes } from 'react';
import { Panel} from 'react-toolbox/components/index.js';
import { themr } from 'react-css-themr';
import defaultTheme from './Landing.scss';
import Dialog from 'react-toolbox/components/dialog';
import { Button } from 'react-toolbox/components/button';
import { Tab, Tabs } from 'react-toolbox/components/index.js';
import RoomCreateModal from 'components/ui/modal/RoomCreateModal';
import LoginModal from 'components/ui/modal/LoginModal';

@themr('Landing', defaultTheme)
class Landing extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
      }).isRequired,
      userLogin: PropTypes.func.isRequired,
      me: PropTypes.object.isRequired,
      players: PropTypes.array.isRequired
    }
    
    state = {
      loggingIn: false
    }
    
    handleOnDone = (name, avatar) => {
      this.props.userLogin(name, avatar);
      this.setState({...this.state, loggingIn: true});
    }
  
    render() {
      const { theme, router, me, players } = this.props;
      const { loggingIn } = this.state;
      return (
        <Panel>
          <div className={theme.page} role="application">
            <LoginModal open={!loggingIn} name={me.name} avatar={me.avatar} onDone={this.handleOnDone}/>
            <RoomCreateModal open={loggingIn} players={players} router={router}/>
          </div>
        </Panel>
      );
    }
}
export default Landing;
