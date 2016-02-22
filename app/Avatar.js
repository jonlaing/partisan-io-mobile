'use strict';

import React, {
  Component,
  Image,
  View
} from 'react-native';

class Avatar extends Component {
  render() {
    let url = this.props.user.avatar_thumbnail_url;

    if(url !== undefined && url.length > 0) {
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

    return (<View style={this.props.style} />);
  }
}

module.exports = Avatar;
