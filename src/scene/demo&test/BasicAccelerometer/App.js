import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Accelerometer} from "react-native-sensors";
import * as ScreenUtil from "../../Common/ScreenUtil";

const Value = ({name, value}) => (
    <View style={styles.valueContainer}>
        <Text style={styles.valueName}>{name}:</Text>
        <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
    </View>
);

export default class App extends Component {
    constructor(props) {
        super(props);

        new Accelerometer({
            updateInterval: 400 // defaults to 100ms
        })
            .then(observable => {
                observable.subscribe(({x, y, z}) => this.setState({x, y, z}));
            })
            .catch(error => {
                console.log("The sensor is not available");
            });

        this.state = {x: 0, y: 0, z: 0};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headline}>Accelerometer values</Text>
                <Value name="x" value={this.state.x}/>
                <Value name="y" value={this.state.y}/>
                <Value name="z" value={this.state.z}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    headline: {
        fontSize: ScreenUtil.setSpText(30),
        textAlign: "center",
        margin: 10
    },
    valueContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    valueValue: {
        width: 200,
        fontSize: ScreenUtil.setSpText(20)
    },
    valueName: {
        width: 50,
        fontSize: ScreenUtil.setSpText(20),
        fontWeight: "bold"
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});
