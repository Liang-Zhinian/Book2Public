import React, {PureComponent} from 'react'
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2, Paragraph} from '../../../widget/Text'
import {screen} from '../../../common'
import {color} from '../../../widget'
import StarRating from "../../Common/StarRating";


type Props = {
    info: Object,
    onPress: Function,
}

export default  class BeautyCell extends PureComponent<Props> {

    subString(str) {
        if (str.length * 13 > screen.width * 0.9 - 80) {
            str = str.substring(0, Math.round((screen.width) / 13)) + '... ';
        }
        return str;
    }

    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
    }

    getDistance(lat1, lng1, lat2, lng2) {
        let dis = 0;
        let radLat1 = toRadians(lat1);
        let radLat2 = toRadians(lat2);
        let deltaLat = radLat1 - radLat2;
        let deltaLng = toRadians(lng1) - toRadians(lng2);
        dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;

        function toRadians(d) {
            return d * Math.PI / 180;
        }
    }

    render() {
        let {info, latLng} = this.props;
        // let imageUrl = info.imageUrl.replace('w.h', '160.0')
        let distance = this.getDistance(latLng.latitude, latLng.longitude, info.Latitude, info.Longitude);
        distance = Math.floor(distance / 1000) > 0 ? Math.floor(distance / 1000) + 'KM' : Math.floor(distance) + 'M';
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.container}
                onPress={() => this.props.onPress(info)}>

                <View style={styles.rightContainer}>
                    <Heading2 style={{paddingTop: 5}}>{info.title}</Heading2>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Paragraph numberOfLines={0} style={{
                            marginTop: 5,
                            width: screen.width * 0.9 - 80
                        }}>{info.subtitle !== null ? this.subString(info.subtitle) : 'This is a fixed demo data, including telephone and comment.'} - {distance}</Paragraph>

                    </View>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}
                    >
                        <Image style={{}} source={require('../../../img/public/phone.png')}/>
                        <Text style={{marginLeft: 5, textDecorationLine: 'underline '}} onPress={() => {
                            Linking.openURL('tel:' + info.phone !== null ? info.phone : '888888888')
                        }}>{info.phone !== null ? info.phone : '852-888888888'}</Text>
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
                        <Text style={{paddingLeft: 10, fontSize: 12}}>456 reviews</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'column',}}>
                    {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                        <Image source={{uri: info.imageUrl}} style={styles.icon}/>
                        : <Image source={require('../../../img/public/notfoundlogo.png')} style={styles.icon}/>}
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
        marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
        borderRadius:3,
    },
    icon: {
        width: 50,
        paddingBottom:100,
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

