'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

import api from '../API';
import Layout from '../Layout';
import Colors from '../Colors';

class LookingForFTUE extends Component {
  constructor(props) {
    super(props);

    this.state = {lookingFor: 0};
  }

  _handleToggle(i) {
    return () => {
      if(this._isHighlighted(i)) {
        this.setState({lookingFor: this.state.lookingFor ^ 1 << i}); // uncheck
      } else {
        this.setState({lookingFor: this.state.lookingFor | 1 << i}); // check
      }
    };
  }

  _handleSubmit() {
    let callback = () => {};

    if(this.props.onSubmit !== undefined) {
      callback = this.props.onSubmit;
    }

    api(this.props.navigator.environment).profile(this.props.token).updateLookingFor(this.state.lookingFor)
    .then(callback)
    .catch((err) => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>What are you looking for?</Text>
        <Text style={styles.paragraph}>Select what forms of contact you're comfortable with from other users</Text>
        <View style={styles.inputContainer}>
          <TouchableHighlight style={this._buttonStyle(0)} underlayColor='white' onPress={this._handleToggle(0)}>
            <View style={styles.buttonInner}>
              <Icon style={styles.buttonIcon} name="torsos-all-female" color={this._isHighlighted(0) ? Colors.action : 'white'} size={Layout.lines(1.5)} />
              <Text style={this._buttonTextStyle(0)}>Friends</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={this._buttonStyle(1)} underlayColor='white' onPress={this._handleToggle(1)}>
            <View style={styles.buttonInner}>
              <Icon style={styles.buttonIcon} name="heart" color={this._isHighlighted(1) ? Colors.action : 'white'} size={Layout.lines(1.5)} />
              <Text style={this._buttonTextStyle(1)}>Love</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={this._buttonStyle(2)} underlayColor='white' onPress={this._handleToggle(2)}>
            <View style={styles.buttonInner}>
              <Icon style={styles.buttonIcon} name="skull" color={this._isHighlighted(2) ? Colors.action : 'white'} size={Layout.lines(1.5)} />
              <Text style={this._buttonTextStyle(2)}>Enemies</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.horiztonalRule} />
        <TouchableHighlight style={styles.actionButton} onPress={this._handleSubmit.bind(this)}>
          <View style={styles.buttonInner}>
            <Icon name="check" color="white" size={Layout.lines(1.5)} style={{flex: 1}} />
            <Text style={styles.actionText}>OK</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _buttonStyle(i) {
    if(this._isHighlighted(i)) {
      return [styles.button, {backgroundColor: 'white'}];
    }

    return styles.button;
  }

  _buttonTextStyle(i) {
    if(this._isHighlighted(i)) {
      return [styles.buttonText, {color: Colors.action}];
    }

    return styles.buttonText;
  }

  _isHighlighted(i) {
    // bitshift looking for by the index to figure
    // out whether this button is checked
    // Friends: 0, Love: 1, Enemies: 2
    return (this.state.lookingFor & 1 << i) !== 0;
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: Layout.lines(2),
    backgroundColor: Colors.action
  },
  header: {
    paddingVertical: Layout.lines(1),
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "200",
    color: 'white'
  },
  paragraph: {
    textAlign: 'center',
    color: 'white'
  },
  inputContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginVertical: Layout.lines(1)
  },
  button: {
    flex: 1,
    paddingHorizontal: Layout.lines(2),
    marginVertical: Layout.lines(1),
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: Layout.lines(0.5),
    minHeight: Layout.lines(3.5),
    maxHeight: Layout.lines(6)
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: Layout.lines(2)
  },
  buttonIcon: {
    flex: 1
  },
  buttonText: {
    flex: 2,
    fontSize: Layout.lines(1.5),
    color: 'white'
  },
  horiztonalRule: {
    marginTop: Layout.lines(1),
    height: 1,
    backgroundColor: 'white'
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionText: {
    flex: 1,
    marginLeft: Layout.lines(1),
    textAlign: 'center',
    fontSize: Layout.lines(1.5),
    fontWeight: "bold",
    color: 'white'
  }
});

module.exports = LookingForFTUE;