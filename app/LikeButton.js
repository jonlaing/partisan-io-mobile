'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from './Layout';
import Colors from './Colors';
import formatter from './utils/formatter';

class LikeButton extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.container} underlayColor="white" onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <Icon name="star" color={this.props.active ? Colors.accent : Colors.grey} size={Layout.lines(1.5)} style={styles.icon} />
          <Text style={[styles.text, this.props.color === 'light' ? styles.textLight : {}]} >{formatter.count(this.props.count)}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

LikeButton.propTypes = {
  color: React.PropTypes.oneOf(['dark', 'light']),
  onPress: React.PropTypes.func,
  active: React.PropTypes.bool,
  count: React.PropTypes.number
};

LikeButton.defaultProps = {
  color: 'dark',
  onPress: () => {},
  active: false,
  count: 0
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: Layout.lines(2)
  },
  icon: {
    width: Layout.lines(1.5)
  },
  text: {
    fontSize: Layout.lines(0.75)
  },
  textLight: {
    color: 'white'
  }
});

module.exports = LikeButton;
