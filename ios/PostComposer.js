'use strict';
import React, {
  Component,
  View,
  TextInput,
  StyleSheet
} from 'react-native';

class PostComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  _changeText(text) {
    this.setState({value: text});
    this.props.onChange(text);
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.text}
          multiLine={true}
          onChangeText={this._changeText.bind(this)}
          value={this.state.value}
          autoFocus={true}
          keyboardType="twitter"
          returnKeyType="done"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgb(242,242,242)'
  },
  text: {
    flex: 1,
    height: 200,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: 'white'
  }
});

module.exports = PostComposer;
