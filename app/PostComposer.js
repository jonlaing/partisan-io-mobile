/*global fetch, FormData */
'use strict';

import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Text
} from 'react-native';

import Colors from './Colors';

class PostComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  _changeText(text) {
    this.setState({value: text});
    // this.props.onChange(text);
  }

  _handlePost() {
    var request = new FormData();
    request.append('body', this.state.value);

    fetch('http://localhost:4000/api/v1/posts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': this.props.token
      },
      body: request
    })
    .then(res => JSON.parse(res._bodyInit)) // not sure, but i think if there was a problem, it would fail here
    .then(() => this.props.navigator.props.eventEmitter.emit('post-success'))
    .then(() => this.props.navigator.pop());
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.text}
          multiline={true}
          onChangeText={this._changeText.bind(this)}
          value={this.state.value}
          autoFocus={true}
          keyboardType="twitter"
          returnKeyType="done"
        />
        <TouchableHighlight style={styles.button} onPress={this._handlePost.bind(this)}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 74,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: 'rgb(242,242,242)'
  },
  text: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    height: 200,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: 'white'
  },
  button: {
    height: 54,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: Colors.action
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24
  }
});

module.exports = PostComposer;
