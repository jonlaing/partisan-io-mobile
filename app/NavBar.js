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
  _style() {
    if(this.props.transparent === true) {
      return [styles.navBar, {backgroundColor: 'rgba(0,0,0,0.25)'}];
    }

    return styles.navBar;
  }
  render() {
    return (
      <View style={this._style()}>
        <View style={styles.navBarTitle}>
          <Text style={styles.navBarTitleText}>{this.props.title}</Text>
        </View>
        <TouchableHighlight style={styles.navBarLeft} onPress={this.props.leftButtonPress}>
          <View style={styles.navBarActionInner}>
            {this.props.leftButton}
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.navBarRight} onPress={this.props.rightButtonPress}>
          <View style={styles.navBarActionInner}>
            {this.props.rightButton}
          </View>
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
  rightButtonPress: React.PropTypes.func,
  transparent: React.PropTypes.bool
};

NavBar.defaultProps = {
  leftButton: (<View />),
  leftButtonPress: () => {},
  rightButton: (<View />),
  rightButtonPress: () => {},
  transparent: false
};

const styles = StyleSheet.create({
  navBar: {
    height: Layout.lines(4),
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
  navBarTitle: {
    flex: 1,
    padding: Layout.lines(0.75)
  },
  navBarTitleText: {
    fontSize: Layout.lines(1.375),
    textAlign: 'center',
    color: 'white'
  },
  navBarLeft: {
    position: 'absolute',
    left: Layout.lines(0.75),
    top: Layout.lines(1),
    bottom: 0
  },
  navBarRight: {
    position: 'absolute',
    right: Layout.lines(0.75),
    top: Layout.lines(1),
    bottom: 0
  },
  navBarActionInner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});

module.exports = NavBar;
