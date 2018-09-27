/*
用于cube添加边框 作为工具类使用
 */

import React, {PureComponent} from 'react'
import {Dimensions, StyleSheet, View} from 'react-native'

type Props = {
    navigation: any,
}
type State = {}
export default class Square extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={[styles.pageBOXRB, styles.box]}>
                        {this.props.contents && this.props.contents[0]}
                    </View>
                    <View style={[styles.pageBOXRB, styles.box]}>
                        {this.props.contents && this.props.contents[3]}
                    </View>
                    <View style={[styles.pageBOXR, styles.box]}>
                        {this.props.contents && this.props.contents[6]}
                    </View>
                </View>
                <View>
                    <View style={[styles.pageBOXRB, styles.box]}>
                        {this.props.contents && this.props.contents[1]}
                    </View>
                    <View style={[styles.pageBOXRB, styles.box]}>
                        {this.props.contents && this.props.contents[4]}
                    </View>
                    <View style={[styles.pageBOXR, styles.box]}>
                        {this.props.contents && this.props.contents[7]}
                    </View>
                </View>
                <View>
                    <View style={[styles.pageBOXB, styles.box]}>
                        {this.props.contents && this.props.contents[2]}
                    </View>
                    <View style={[styles.pageBOXB, styles.box]}>
                        {this.props.contents && this.props.contents[5]}
                    </View>
                    <View style={[styles.box]}>
                        {this.props.contents && this.props.contents[8]}
                    </View>
                </View>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        flexDirection: 'row',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').width / 3,
        borderColor: '#ffffffb0',
        // borderWidth: 1,
    },
    pageBOXRB: {
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    pageBOXB: {
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
    },
    pageBOXR: {
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 0,
    },

});
