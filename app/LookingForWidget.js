'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

import Layout from './Layout';
import Colors from './Colors';

class LookingForWidget extends Component {
  _isHighlighted(i) {
    // bitshift looking for by the index to figure
    // out whether this button is checked
    // Friends: 0, Love: 1, Enemies: 2
    return (this.props.value & 1 << i) !== 0;
  }

  _textStyle() {
    return [styles.itemText, {color: this.props.color === 'light' ? 'white' : 'black' }];
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Icon name="torsos-all-female" color={this._isHighlighted(0) ? Colors.action : Colors.grey} size={Layout.lines(1.5)} />
          <Text style={this._textStyle()}>Friends</Text>
        </View>
        <View style={styles.item}>
          <Icon name="heart" color={this._isHighlighted(1) ? Colors.action : Colors.grey} size={Layout.lines(1.5)} />
          <Text style={this._textStyle()}>Love</Text>
        </View>
        <View style={styles.item}>
          <Icon name="skull" color={this._isHighlighted(2) ? Colors.action : Colors.grey} size={Layout.lines(1.5)} />
          <Text style={this._textStyle()}>Enemies</Text>
        </View>
      </View>
    );
  }
}

LookingForWidget.propTypes = {
  value: React.PropTypes.number.isRequired,
  color: React.PropTypes.oneOf(['light', 'dark'])
};

LookingForWidget.defaultProps = {
  color: 'dark'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Layout.lines(4)
  },
  itemText: {
    fontSize: Layout.lines(0.75)
  }
});

module.exports = LookingForWidget;
