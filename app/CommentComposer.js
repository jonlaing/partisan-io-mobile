'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  View,
  Text
} from 'react-native';

import Api from './Api';

import Layout from './Layout';
import Colors from './Colors';

class CommentComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { comment: '', submitting: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.comment !== nextState.comment;
  }

  focus() {
    this.refs.textInput.focus();
  }

  blur() {
    this.refs.textInput.blur();
  }

  _handleSubmit() {
    if(this.state.submitting === false) {
      this.setState({ submitting: true });
      this.blur();

      Api.comments(this.props.token).create(this.props.postID, this.state.comment)
      .then(res => JSON.parse(res))
      .then(data => this.props.onFinish(data))
      .then(() => this.setState({ comment: '', submitting: false }))
      .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.inner} >
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({ comment: val })}
            value={this.state.comment}
            autoFocus={this.props.autoFocus}
            multiline={true}
            placeholder="Write a comment..."
            keyboardAppearance="dark"
            ref="textInput"
          />
          <TouchableHighlight underlayColor={this._underlayColor()} style={this._buttonStyle()} onPress={this._handleSubmit.bind(this)}>
            <Text style={this._buttonTextStyle()}>Post</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _underlayColor() {
    if(this.state.comment.length < 1) {
      return Colors.grey;
    }

    return Colors.actionHighlight;
  }

  _buttonStyle() {
    if(this.state.comment.length < 1) {
      return [styles.button, {backgroundColor: Colors.grey}];
    }

    return styles.button;
  }

  _buttonTextStyle() {
    if(this.state.comment.length < 1) {
      return [styles.buttonText, {color: Colors.darkGrey}];
    }

    return styles.buttonText;
  }
}

CommentComposer.propTypes = {
  token: React.PropTypes.string.isRequired,
  postID: React.PropTypes.number.isRequired,
  autoFocus: React.PropTypes.bool,
  onFinish: React.PropTypes.func
};

CommentComposer.defaultProps = {
  onFinish: () => {}
};

const styles = StyleSheet.create({
  container: {
    padding: Layout.lines(0.5),
    backgroundColor: Colors.grey
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    height: Layout.lines(3),
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    marginRight: Layout.lines(0.5),
    borderRadius: Layout.lines(0.25),
    backgroundColor: 'white',
    fontSize: Layout.lines(1)
  },
  button: {
    flexDirection: 'row',
    width: Layout.lines(5),
    height: Layout.lines(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.action
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = CommentComposer;
