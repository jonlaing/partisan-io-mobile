'use strict';

import React, {
  Component
} from 'react-native';

import ActionButton from './ActionButton';

export default class PostComposeButton extends Component {
  render() {
    return (
      <ActionButton icon="create" onPress={this.props.onPress}/>
    );
  }
}

PostComposeButton.propTypes = {
  onPress: React.PropTypes.func
};

PostComposeButton.defaultProps = {
  onPress: () => {}
};

module.exports = PostComposeButton;
