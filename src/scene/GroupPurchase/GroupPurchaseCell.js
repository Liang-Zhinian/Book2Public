import React, {PureComponent} from 'react'
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2, Paragraph} from '../../widget/Text'
import {screen} from '../../common'
import {color} from '../../widget'
import StarRating from "../Common/StarRating";

let count = 0

type Props = {
    info: Object,
    onPress: Function,
}


class GroupPurchaseCell extends PureComponent<Props> {

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
        // let imageUrl = info.imageUrl.replace('w.h', '160.0')
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.container}
                onPress={() => this.props.onPress(info)}>

                <View style={styles.rightContainer}>
                    <Heading2 style={{paddingTop:5}}>{info.title}</Heading2>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Paragraph numberOfLines={0} style={{
                            marginTop: 5,
                            width: screen.width * 0.9 - 80
                        }}>{info.subtitle!==null?this.subString(info.subtitle):'This is a fixed demo data, including telephone and comment.'} - 7.2KM</Paragraph>

                    </View>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}
                    >
                        <Image style={{}} source={require('../../img/public/phone.png')}/>
                        <Text style={{marginLeft: 5, textDecorationLine: 'underline '}} onPress={() => {
                            Linking.openURL('tel:'+info.phone!==null?info.phone:'020-888888888')
                        }}>{info.phone!==null?info.phone:'020-888888888'}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 0, marginBottom: 10}}>
                        <StarRating
                            // style={{marginBottom: 5}}
                            maxStars={5}
                            rating={3.5}
                            disabled={true}
                            starSize={15}
                            onStarChange={(value) => this.onStarRatingPress(value)}
                        />
                        <Text style={{paddingLeft:10,fontSize:12}}>456 reviews</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'column',}}>
                    {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                        <Image source={{uri: info.imageUrl}} style={styles.icon}/>
                        : <Image source={require('../../img/public/notfoundlogo.png')} style={styles.icon}/>}
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        width:screen.width*0.95,
        alignSelf:'center',
        // alignItems:'center',
        // marginLeft:screen.width*0.05,
        // marginRight:screen.width*0.05,
        marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
        borderRadius:3,
    },
    icon: {
        width: 50,
        paddingBottom:100,
        // height: 50,
        // borderRadius: 5,
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // alignItems: 'center',
        // alignSelf: 'flex-start',
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
    rightContainer: {
        flex: 1,
        backgroundColor:"#9dff4f00",
        justifyContent:'space-between'
    },
    price: {
        color: color.primary
    }
})


export default GroupPurchaseCell
