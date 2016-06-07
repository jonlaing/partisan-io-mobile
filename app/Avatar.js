'use strict';

import React, {
  Component,
  Dimensions,
  Image
} from 'react-native';

import Lightbox from 'react-native-lightbox';
import ExNavigator from '@exponent/react-native-navigator';

var {height, width} = Dimensions.get('window');

class Avatar extends Component {
  constructor(props) {
    super(props);

    this.state = {openLightbox: false};
  }

  // onOpen() {
  //   this.setState({openLightbox: true});
  // }

  // onClose() {
  //   this.setState({openLightbox: false});
  // }

  // _lightboxImageStyle() {
  //   if(this.state.openLightbox) {
  //     return [this.props.style, {resizeMode: "contain", height: height, width: width, backgroundColor: 'transparent', borderWidth: 0, borderRadius: 0, alignSelf: 'center'}];
  //   }

  //   return this.props.style;
  // }

  render() {
    let url = this.props.url;

    if(url != null && url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      if(this.props.lightbox && this.props.navigator != null) {
        return (
          <Lightbox navigator={this.props.navigator.parentNavigator} activeProps={
            {style: {
              width: width,
              height: height,
              resizeMode: "contain",
              backgroundColor: 'transparent',
              borderWidth: 0,
              borderRadius: 0}}} >
            <Image
              style={this.props.style}
              source={{uri: url}}
            />
          </Lightbox>
        );
      }

      return (
        <Image
          source={{uri: url}}
          style={this.props.style}
        />
      );
    }

    return (
      <Image
        source={require('./images/defaultAvatar.png')}
        style={this.props.style}
      />
    );
  }
}

Avatar.propTypes = {
  url: React.PropTypes.string,
  navigator: React.PropTypes.instanceOf(ExNavigator),
  lightbox: React.PropTypes.bool
};

Avatar.defaultProps = {
  url: '',
  lightbox: false
};

module.exports = Avatar;
