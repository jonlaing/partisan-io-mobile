'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from './Layout';
import Colors from './Colors';

class LikeButton extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.container} underlayColor="white" onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <Icon name="star" color={this.props.active ? Colors.accent : Colors.grey} size={14} style={styles.icon} />
          <Text style={styles.text} >Favorites ({this.props.count})</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

LikeButton.propTypes = {
  onPress: React.PropTypes.func,
  active: React.PropTypes.bool,
  count: React.PropTypes.number
};

LikeButton.defaultProps = {
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
    flexDirection: 'row'
  },
  icon: {
    width: 14,
    marginRight: Layout.lines(0.5)
  },
  text: {
    fontSize: 12
  }
});

module.exports = LikeButton;
