'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

import Router from '../Router';
import Layout from '../Layout';
import Colors from '../Colors';

class AvatarFTUE extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Upload an Avatar</Text>
        <TouchableHighlight style={styles.actionButton} onPress={() => this.props.navigator.push(Router.feed(this.props.token))}>
          <View style={styles.buttonInner}>
            <Icon name="check" color={Colors.base} size={Layout.lines(1.5)} style={{flex: 2}} />
            <Text style={styles.actionText}>Finish</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: Layout.lines(2)
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: Layout.lines(2),
    fontWeight: '200',
    color: Colors.darkGrey
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.base,
    borderRadius: Layout.lines(0.5),
    padding: Layout.lines(1),
    maxHeight: Layout.lines(4)
  },
  actionText: {
    flex: 3,
    fontSize: Layout.lines(1.5),
    fontWeight: "bold",
    color: Colors.base
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: Layout.lines(2)
  }
});

module.exports = AvatarFTUE;
