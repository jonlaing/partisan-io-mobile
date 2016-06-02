'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from './Layout';
import Colors from './Colors';

export default class ActionButton extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.container} onPress={this.props.onPress}>
        <View style={styles.iconContainer}>
          <Icon name={this.props.icon} size={32} color="white"/>
        </View>
      </TouchableHighlight>
    );
  }
}

ActionButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func
};

ActionButton.defaultProps = {
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Layout.lines(2),
    right: Layout.lines(1),
    width: Layout.lines(3),
    height: Layout.lines(3),
    backgroundColor: Colors.action,
    borderRadius: Layout.lines(1.5),
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


module.exports = ActionButton;
