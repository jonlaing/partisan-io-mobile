'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Layout from './Layout';
import Colors from './Colors';

class NavBar extends Component {
  render() {
    return (
      <View style={styles.navBar}>
        <TouchableHighlight style={styles.navBarLeft} onPress={this.props.leftButtonPress}>
          {this.props.leftButton}
        </TouchableHighlight>
        <View style={styles.navBarTitle}>
          <Text style={styles.navBarTitleText}>{this.props.title}</Text>
        </View>
        <TouchableHighlight style={styles.navBarRight} onPress={this.props.rightButtonPress}>
          {this.props.rightButton}
        </TouchableHighlight>
      </View>
    );
  }
}

NavBar.propTypes = {
  title: React.PropTypes.string,
  leftButton: React.PropTypes.element,
  leftButtonPress: React.PropTypes.func,
  rightButton: React.PropTypes.element,
  rightButtonPress: React.PropTypes.func
};

NavBar.defaultProps = {
  leftButton: (<View />),
  leftButtonPress: () => {},
  rightButton: (<View />),
  rightButtonPress: () => {}
};

const styles = StyleSheet.create({
  navBar: {
    minHeight: Layout.lines(4),
    padding: Layout.lines(0.75),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // to offset the padding of the container
    backgroundColor: Colors.base,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  navBarLeft: {
    // width: 24
  },
  navBarTitle: {
    flex: 1
  },
  navBarTitleText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  navBarRight: {
    // width: 24
  }
});

module.exports = NavBar;
