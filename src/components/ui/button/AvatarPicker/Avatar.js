import React, { Component, PropTypes } from 'react';

import Avatar0 from '-!babel!svg-react!static/svg/avatar0.svg';
import Avatar1 from '-!babel!svg-react!static/svg/avatar1.svg';
import Avatar2 from '-!babel!svg-react!static/svg/avatar2.svg';
import Avatar3 from '-!babel!svg-react!static/svg/avatar3.svg';
import Avatar4 from '-!babel!svg-react!static/svg/avatar4.svg';
import Avatar5 from '-!babel!svg-react!static/svg/avatar5.svg';
import Avatar6 from '-!babel!svg-react!static/svg/avatar6.svg';
import AvatarBot from '-!babel!svg-react!static/svg/noavatar.svg';

export const Avatarlist = [
  {desc:'Male Black Shirt', svg: Avatar0},
  {desc:'Girl White Shirt', svg: Avatar1},
  {desc:'Male Orange Shirt', svg: Avatar2},
  {desc:'Girl Purple Shirt', svg: Avatar3},
  {desc:'Male Blue Shirt', svg: Avatar4},
  {desc:'Girl Blue Shirt', svg: Avatar5},
  {desc:'Male Santa', svg: Avatar6}
];

export default class Avatar extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }
  
  render() {
    const {index, width, height} = this.props;
    const A = Avatarlist[index].svg;
    return (
      <A width={width} height={height} role="presentation" aria-hidden="true"/>
    );
  }
}
