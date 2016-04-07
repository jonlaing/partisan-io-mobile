'use strict';

import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import Layout from './Layout';
import Colors from './Colors';

class NotifBadge extends Component {
  render() {
    if(this.props.active !== true) {
      return <View />;
    }

    return <View style={styles.badge} />;
  }
}

NotifBadge.propTypes = {
  active: React.PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  badge: {
    height: Layout.lines(0.75),
    width: Layout.lines(0.75),
    backgroundColor: Colors.action,
    borderRadius: Layout.lines(0.37)
  }
});

module.exports = NotifBadge;
