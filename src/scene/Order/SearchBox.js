import React, {Component} from 'react';
import {Keyboard, Platform, StyleSheet, TextInput, View,} from 'react-native';
import {screen} from "../../common";

export default class SearchBox extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputBox}>
                    {/*<View style={styles.inputIcon}>*/}
                    {/*<Image source={require('../../img/mine/icon_search_arrow.png')} style={styles.searchIcon}/>   */}
                    {/*</View>*/}
                    <TextInput style={styles.inputText}
                               underlineColorAndroid="transparent"
                               onChangeText={this.props.onChangeText}
                               onSubmitEditing={Keyboard.dismiss}
                    >
                    </TextInput>
                </View>
            </View>
        )
    }
    //获取value值调用的方法
    getValue = (text) =>{
       var value = text;
    //    console.log(value)
       this.setState({
           show: true,
           value: value
       })
   }
}
const styles = StyleSheet.create({
    container: {
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#ffffff40',
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 40 : 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderRadius:5,
        borderBottomColor: '#cdcdcd40',
        paddingBottom:5,
        width: screen.width * 0.95,
    },
    inputBox: {
        height: Platform.OS === 'ios' ? 30 : 40,
        // marginLeft: 5,
        // marginRight: 5,
        flex: 1,
        flexDirection: 'row',

        // backgroundColor: '#ffffff40',
    },
    inputIcon: {
        margin: Platform.OS === 'ios' ? 0: 5,
    },
    inputText: {
        flex: 1,
        height: Platform.OS === 'ios' ? 30 : 40,
        fontSize: 18,
        lineHeight: 20,
        color:'#fff',
    },
    searchIcon: {//搜索图标    
        height: 20,
        width: 20,
        marginTop: 2,
        marginLeft: 5,
        resizeMode: 'stretch'
    },
});
