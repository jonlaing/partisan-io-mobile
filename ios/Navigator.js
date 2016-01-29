'use strict';
import React, {
  Component,
  Navigator,
  View
} from 'react-native';

class Container extends Component {
  render() {
    let Scene = this.props.route.component;

    return (
      <View
        ref={this.props.onLoadedScene}
      >
        <Scene ref="mainComponent"
          navigator={this.props.navigator}
          currentRoutes={this.props.route}
          {...this.props.route.passProps}
        />
      </View>
    );
  }
}

class NavigatorBar extends Component {
  renderScene(route, navigator) {
    return (
      <Container
        ref={this.onLoadedScene}
        route={route}
        navigator={navigator}
        {...this.props}
      />
    );
  }

  renderNavBar() {
    if(this.props.navBarHidden === true) {
      return null;
    }

    return (
      <Navigator.NavigationBar />
    );
  }

  render() {
    return (
      <View >
        <Navigator
          ref="navigator"
          renderScene={this.renderScene.bind(this)}
          navBarHidden={this.props.navBarHidden}
          initialRouteStack={this.props.routeStack.path}
          navigationBar={this.renderNavBar()}
        />
      </View>
    );
  }
}

module.exports = NavigatorBar;
