import React, {PureComponent} from 'react'
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2} from '../../../../widget/Text'
import {screen} from '../../../../common'
import {color} from '../../../../widget'
import StarRating from "../../../Common/StarRating";
import {RefreshState} from "react-native-refresh-list-view";
import {commonStyle} from "../../../../widget/commonStyle";
import * as ScreenUtil from "../../../Common/ScreenUtil";
import LocalImage from "../../../../widget/LocalImage";

let count = 0

type Props = {
    info: Object,
    onPress: Function,
}


class VineyardCell extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            waiting: false
        }
    }
    subString(str){
        if (str.length*13>screen.width*0.9-80){
            str = str.substring(0,Math.round((screen.width)/13))+'... ';
        }
        return str;
    }
    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
    }
    toWait(){
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
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
        let {info,latLng} = this.props;
        // let imageUrl = info.imageUrl.replace('w.h', '160.0')
        let img=LocalImage.countryImgList[info.Country];
        let distance = this.getDistance(latLng.latitude, latLng.longitude, info.Latitude, info.Longitude);
        distance = Math.floor(distance / 1000) > 0 ? Math.floor(distance / 1000) + 'km' : Math.floor(distance) + 'm';
        let hot = [3,3.5,4,4.5,5];
        let reviews = Math.floor((Math.random()*1000));
        let rating = hot[Math.floor((Math.random()*10)%4)];
        return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.container}
                    onPress={() =>{
                        this.setState({waiting: true});
                        this.props.onPress(info,distance,reviews,rating );
                        this.toWait();
                    }}>
                    <View style={styles.rightContainer}>
                        <Heading2 style={{paddingTop: 5}}>{info.title}</Heading2>
                        {
                            distance !== 'NaNm' &&
                            <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                                <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Away from you: </Text>
                                <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{distance}</Text>
                            </View>
                        }
                        <View style={{flexDirection: 'row',paddingTop: 5, marginBottom: 0}}>
                            <Text style={{ fontSize: ScreenUtil.setSpText(12)}}>Number of Wines: </Text>
                            <Text style={{ fontSize: ScreenUtil.setSpText(12),color:'#019eff'}}>{info.WineCount}</Text>
                        </View>
                        {img && <View style={[{flexDirection: 'row',paddingTop: 5, justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'flex-start',}]}>
                            {/*<Text style={{fontSize: ScreenUtil.setSpText(12)}}>Country: </Text>*/}
                            <Image style={{width: 22.4, height: 14.7}} source={img}/>
                            <Text style={{
                                fontSize: ScreenUtil.setSpText(13),
                                color: '#000'
                            }}>  {info.Country} </Text>
                        </View>}
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 10}}>
                            <StarRating
                                maxStars={5}
                                rating={rating}
                                disabled={true}
                                starSize={15}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />
                            <Text style={{paddingLeft: 10, fontSize: ScreenUtil.setSpText(12),color:'#019eff'}}>{reviews} </Text>
                            <Text style={{ fontSize: ScreenUtil.setSpText(12)}}>reviews</Text>
                        </View>
                    </View>
                    <View style={[commonStyle.center,{flexDirection: 'column',}]}>
                        {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                            <Image source={{uri: info.imageUrl}} style={styles.icon}/>
                            : <Image source={require('../../../../img/public/VineyardIcon.png')} style={styles.icon}/>}
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
        backgroundColor: '#fff',
        borderRadius:3,
    },
    icon: {
        width: 50,
        height:50,
        // paddingBottom:100,
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
});


export default VineyardCell
