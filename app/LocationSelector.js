'use strict';

import React, {
  Component,
  Dimensions,
  StyleSheet,
  View
} from 'react-native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';

let {height} = Dimensions.get('window');

export default class LocationSelector extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.show === true) {
      this.autoComplete.triggerFocus();
    }
  }

  _style() {
    if(this.props.show === true) {
      return [styles.container, {top: 0}];
    }

    return styles.container;
  }

  render() {
    return (
      <View style={this._style()}>
        <GooglePlacesAutocomplete
          ref={(c) => this.autoComplete = c}
          placeholder='Search'
          minLength={2}
          fetchDetails={true}
          onPress={this.props.onSelect}
          getDefaultValue={() => {
            return '';
          }}
          query={{
            key: 'AIzaSyDk-nSo6eXykAsoL5H92_X7N4I_MeCkN20',
            language: 'en' // language of the results
          }}
          styles={{
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: Colors.base
            }
          }}

          currentLocation={true}
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch'
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        />
        <NavBar
          title="Type the Location"
          rightButton={<Icon name="close" color="rgb(255,255,255)" size={24} />}
          rightButtonPress={() => {this.autoComplete.triggerBlur(); this.props.onCancel(); }}
        />
      </View>
    );
  }
}

LocationSelector.propTypes = {
  show: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

LocationSelector.defaultProps = {
  show: false,
  onSelect: () => {},
  onCancel: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height,
    paddingTop: Layout.lines(4),
    backgroundColor: 'white'
  }
});

module.exports = LocationSelector;
