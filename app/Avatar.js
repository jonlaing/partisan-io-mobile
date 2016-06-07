'use strict';

import React, {
  Component,
  Image
} from 'react-native';

class Avatar extends Component {
  render() {
    let url = this.props.url;

    if(url != null && url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <Image
          source={{uri: url}}
          style={this.props.style}
        />
      );
    }

    return (
      <Image
        source={require('./images/defaultAvatar.png')}
        style={this.props.style}
      />
    );
  }
}

module.exports = Avatar;
