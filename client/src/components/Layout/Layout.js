import React from 'react';
import NavMenu from './NavMenu';

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <NavMenu />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
