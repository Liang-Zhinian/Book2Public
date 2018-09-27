import CommodityDetails from "../GroupPurchase/CommodityDetails";
import {RefreshState} from "react-native-refresh-list-view";

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

// var React = require('react');
// var ReactNative = require('react-native');
// var {
//     StyleSheet,
//     Text,
//     View,
// } = ReactNative;

// exports.framework = 'React';
// exports.title = 'Geolocation';
// exports.description = 'Examples of using the Geolocation API.';

// exports.examples = [
//     {
//         title: 'navigator.geolocation',
//         render: function(): ReactElement<any> {
//             return <GeolocationExample />;
//         },
//     }
// ];


class GeolocationExample extends PureComponent<{}> {
// var GeolocationExample = React.createClass({
    watchID=(null: ?number);

    constructor(props: Props) {
        super(props);

        this.state = {
            initialPosition:{},

        }
    }
    getInitialState () {
        return {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
        };
    }

    componentDidMount  () {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({lastPosition});
        });
    }

    componentWillUnmount () {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render () {
        return (
            <View>
                <Text>
                    <Text style={styles.title}>Initial position: </Text>
                    {this.state.initialPosition}
                </Text>
                <Text>
                    <Text style={styles.title}>Current position: </Text>
                    {this.state.lastPosition}
                </Text>
            </View>
        );
    }
};

var styles = StyleSheet.create({
    title: {
        fontWeight: '500',
    },
});

export default GeolocationExample
