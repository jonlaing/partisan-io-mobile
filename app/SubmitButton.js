import React, {
  Component,
  StyleSheet,
  ActivityIndicatorIOS,
  View,
  Text
} from 'react-native';

import Layout from './Layout';
import Colors from './Colors';

export default class SubmitButton extends Component {
  render() {
    let style = !this.props.enabled || this.props.spinning ? [styles.text, {color: Colors.baseLight}] : styles.text;
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicatorIOS animating={this.props.spinning} color='white' size="small" />
        <Text style={style}>{this.props.label}</Text>
      </View>
    );
  }
}

SubmitButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  spinning: React.PropTypes.bool.isRequired,
  enabled: React.PropTypes.bool
};

SubmitButton.defaultProps = {
  enabled: true
};

const styles = StyleSheet.create({
  text: {
    marginLeft: Layout.lines(0.5),
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = SubmitButton;
