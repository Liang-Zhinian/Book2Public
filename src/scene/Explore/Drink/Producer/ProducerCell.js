import React, {PureComponent} from 'react'
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2, Paragraph} from '../../../../widget/Text'
import {screen} from '../../../../common'
import {color} from '../../../../widget'
import StarRating from "../../../Common/StarRating";


type Props = {
    info: Object,
    onPress: Function,
};


export default class ProducerCell extends PureComponent<Props> {

    subString(str){
        if (str.length*13>screen.width*0.9-80){
            str = str.substring(0,Math.round((screen.width)/13))+'... ';
        }
        return str;
    }
    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
    }
    render() {
        let {info} = this.props;
        // console.log(info);
        //AdditionalLocationImages
        // null
        // firmId
        // :
        // 2
        // id
        // :
        // 8
        // imageUrl
        // :
        // null
        // key
        // :
        // 8
        // subtitle
        // :
        // undefined
        // title
        // :
        // "Domaine de Cabrol Réquieu"
        return (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity activeOpacity={0.9}  style={styles.container} onPress={() => this.props.onPress(info)}>
                    <View style={{backgroundColor:'#ff9b9e',width:screen.width/3,height:50}}>

                    </View>
                </TouchableOpacity>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // paddingLeft: 10,
        // paddingRight: 10,
        width:screen.width/3,
        alignSelf:'center',
        // marginBottom:10,
        margin:5,
        // borderBottomWidth: screen.onePixel,
        // borderColor: color.border,
        // backgroundColor: 'white',
        // borderRadius:3,
    },
    icon: {
        width: 50,
        paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
    rightContainer: {
        // flex: 1,
        flexDirection:'row',
        backgroundColor:"#9dff4f00",
    },
    price: {
        color: color.primary
    }
})


