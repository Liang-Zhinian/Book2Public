import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class DateTimePickerTester extends Component {
    state = {
        isDateTimePickerVisible: true,
        date:''
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        this.setState({date:date})
        this._hideDateTimePicker();
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._showDateTimePicker}>
                    <View style={styles.button}>
                        <Text>Show DatePicker</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        datePickerModeAndroid={'date'}
                        mode={'date'}
                    />
                    <Text>{this.state.date.toString()}</Text>
                </View>

            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    }
})