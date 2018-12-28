import React, {Component} from 'react';
import {Image, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View,} from 'react-native';
import {screen} from "../../common";
import Mater from "react-native-vector-icons/MaterialIcons";
import LocalImage from "../../widget/LocalImage";
let imgList={search:LocalImage.searchIcon,location:LocalImage.locationIcon};
export default class SearchBox extends Component {

    constructor(props) {
        super(props);

    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.inputBox,{backgroundColor:this.props.backgroundColor}]}>
                    <View style={styles.inputIcon}>
                    <Image source={imgList[this.props.img]} style={styles.searchIcon}/>
                    </View>
                    {/*<TextInput style={styles.inputText}*/}
                               {/*underlineColorAndroid="transparent"*/}
                               {/*onChangeText={this.props.onChangeText}*/}
                               {/*onSubmitEditing={Keyboard.dismiss}*/}
                    {/*>*/}
                    {/*</TextInput>*/}
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={this.props.placeholder}
                        autoFocus={this.props.autoFocus}
                        placeholderTextColor={'#d2d2d2'}
                        clearButtonMode={'while-editing'}
                        onFocus={this.props.onFocus}
                        style={[styles.inputText, {
                            // borderColor: '#fff8',
                            // borderBottomWidth: screen.onePixel,
                        }]}
                        selectionColor={'#fff'}
                        onChangeText={this.props.onChangeText}
                        onSubmitEditing={Keyboard.dismiss}
                        defaultValue={this.props.defaultValue}
                        textAlignVertical={'bottom'}
                        // style={{
                        //     height: Platform.OS === 'ios' ? 30 : 40,
                        //     fontSize: 18,
                        //     lineHeight: 20,
                        //     color: '#fff',
                        //     width: screen.width * 0.95,
                        //     backgroundColor: '#fff0',
                        //     borderColor: '#fff8',
                        //     borderBottomWidth: screen.onePixel
                        // }}
                    >
                    </TextInput>
                    {(this.props.defaultValue!==null&&this.props.defaultValue.length > 0)&& <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.inputIcon, {
                            paddingTop: Platform.OS === 'ios' ? 15 : 20,
                            paddingBottom: Platform.OS === 'ios' ? 15 : 20,
                        }]}
                        onPress={()=>{
                            this.props.clearValue()
                        }}
                    >
                        <Mater name={'close'} size={20} color={'#fff'}/>
                    </TouchableOpacity>}
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
        backgroundColor: '#ffffff50',
    },
    inputIcon: {
        alignSelf:'center',
        paddingRight: 5,
        // margin: Platform.OS === 'ios' ? 0: 5,
    },
    inputText: {
        flex: 1,
        height: Platform.OS === 'ios' ? 30 : 40,
        fontSize: 14,
        lineHeight: 20,
        color:'#fff',
    },
    searchIcon: {//搜索图标    
        width:15,
        height: 15,
        // alignItems:'center',
        alignSelf:'center',

        marginLeft: 5,
        resizeMode: 'stretch'
    },
});
