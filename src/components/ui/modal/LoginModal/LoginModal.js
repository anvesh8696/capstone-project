import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './LoginModal.scss';
import Dialog from 'react-toolbox/components/dialog';
import {Button} from 'react-toolbox/components/button';
import Input from 'react-toolbox/components/input';
import AvatarPicker from 'components/ui/button/AvatarPicker';
import utils from 'react-toolbox/components/utils/utils';

@themr('LoginModal', defaultTheme)
class LoginModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      onDone: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.number.isRequired
    }
    
    state = {
      name: '',
      nameError: '',
      avatar: 0
    }
    
    constructor(props) {
      super(props);
      this.state = {...this.state, ...props};
    }
    
    handleChange = (name, value) => {
      let errorKey = 'nameError';
      let error = '';
      
      // code only allows alpha-numeric
      if(name == 'name'){
        error = this.state.nameError;
        value = value.replace(/[^a-z0-9]/gi,'');
        if(value.length == 0){
          error = 'Invalid Name!';
        }else if(error != ''){
          error = '';
        }
      }
      this.setState({...this.state, [name]: value, [errorKey]: error});
    }
    
    handleAvatarChange = (type, value) => {
      type = type == 'value' ? 'avatar' : type;
      this.setState({...this.state, [type]: value});
    }
  
    render() {
      const { theme, open, onDone } = this.props;
      const { name, avatar } = this.state;
      const ariakey = `avatarpicker_${utils.ruuid()}`;
      return (
        <Dialog active={open} theme={theme}>
          <div className={theme.dialogContent}>
            <h3 id={ariakey}>Who are you?</h3>
            <AvatarPicker ariakey={ariakey} botToggle={false} value={avatar} onChange={this.handleAvatarChange}/>
            <Input
              type="text"
              label="Your UserName"
              icon="face"
              value={name}
              error={this.state.nameError}
              onChange={(value) => this.handleChange('name', value)}
              maxLength={8}
              className={theme.code}
            />
          </div>
          <div className={theme.buttons}>
            <Button label="Next" raised primary
              onClick={() => onDone(this.state.name, this.state.avatar)}
              disabled={this.state.nameError != '' || this.state.name == ''}
            />
          </div>
        </Dialog>
      );
    }
}
export default LoginModal;
