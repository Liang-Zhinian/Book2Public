import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';


class Spinner extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[this.props.style]}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                    color={'gray'}
                    {...this.props} />
            </View>
        )
    }
}

export default Spinner;