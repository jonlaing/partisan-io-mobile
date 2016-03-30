'use strict';

import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Colors from './Colors';
import Layout from './Layout';

class PostComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  _changeText(text) {
    this.setState({value: text});
  }

  _handlePost() {
    Api.posts(this.props.token).create(this.state.value)
    .then(res => JSON.parse(res._bodyInit)) // not sure, but i think if there was a problem, it would fail here
    .then(() => this.props.navigator.props.eventEmitter.emit('post-success'))
    .then(() => this.props.navigator.pop());
  }

  _handleCancel() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableHighlight style={styles.navBarLeft} onPress={this._handleCancel.bind(this)}>
            <Text style={styles.navBarLeftText}>Cancel</Text>
          </TouchableHighlight>
          <View style={styles.navBarTitle}>
            <Text style={styles.navBarTitleText}>Write a Post</Text>
          </View>
          <TouchableHighlight style={styles.navBarRight} onPress={this._handlePost.bind(this)}>
            <Text style={styles.navBarRightText}>Post</Text>
          </TouchableHighlight>
        </View>
        <TextInput
          style={styles.text}
          multiline={true}
          onChangeText={this._changeText.bind(this)}
          value={this.state.value}
          autoFocus={true}
          keyboardType="twitter"
          returnKeyType="done"
        />
        <View style={styles.postFooter}>
          <TouchableHighlight style={styles.camera}>
            <Icon name="camera-retro" color={Colors.darkGrey} size={24} />
          </TouchableHighlight>
        </View>
        <View style={styles.textBuffer}></View>
      </View>
    );
  }
}

PostComposer.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  navBar: {
    height: Layout.lines(4),
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
  navBarLeftText: {
    fontSize: 16,
    color: 'white'
  },
  navBarTitle: {
    flex: 1
  },
  navBarTitleText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  navBarRightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Layout.lines(4),
    backgroundColor: Colors.lightGrey
  },
  postFooter: {
    height: Layout.lines(3),
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(0.75)
  },
  camera: {
    width: 24,
    height: 24,
    alignSelf: 'flex-end'
  },
  text: {
    flex: 1,
    fontSize: 18,
    lineHeight: Layout.lines(1.5),
    height: 200,
    padding: Layout.lines(0.75),
    color: 'black',
    backgroundColor: 'white'
  },
  textBuffer: {
    flex: 1
  }
});

module.exports = PostComposer;
