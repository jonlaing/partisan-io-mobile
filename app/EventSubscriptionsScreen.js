'use strict';

import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from './Layout';

import EventList from './EventList';
import NavBar from './NavBar';

export default class EvenSusbcriptionsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <EventList token={this.props.token} navigator={this.props.navigator} subscriptions={true}/>
        <NavBar
          title="Event Subscriptions"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={32} /> }
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

EvenSusbcriptionsScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

EvenSusbcriptionsScreen.defaultProps = {
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: Layout.lines(4)
  }
});

module.exports = EvenSusbcriptionsScreen;
