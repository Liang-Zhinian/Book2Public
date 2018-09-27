import React, {PureComponent} from 'react'
import {Image, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import testData from '../../testData'
import {Heading3} from '../../widget/Text'
import {screen} from '../../common'
import {amapStaticImg} from '../../api'
import GroupPurchaseCell from './GroupPurchaseCell'
import StarRating from "../Common/StarRating";
import LinearGradient from 'react-native-linear-gradient';
import ScheduleSceneChildDetail from "./ScheduleSceneChildDetail";


type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}

//服务详情
class ScheduleSceneChild extends PureComponent<Props, State> {

    static navigationOptions = () => ({
        header: null,
    })

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            refreshState: false,
            loveTintColor: '#696969',
            handerBgc: '#69696900',
            falseSwitchIsOn: false,
            center: {
                longitude: 116.404,
                latitude: 39.915
            },
            mapImgUrl: ''

        }
    }

    componentWillUnmount() {
        StatusBar.setBackgroundColor("#0F143A00");
    }

    componentDidMount() {

    }

    renderCell = (rowData: any) => {
        return (
            <GroupPurchaseCell
                info={rowData.item}
                onPress={() => this.props.navigation.navigate('GroupPurchase', {info: rowData.item})}
            />
        )
    }

    getaMap(Longitude, Latitude) {
        fetch(amapStaticImg(Longitude, Latitude))
            .then((response) => {
                this.setState({mapImgUrl: response.url})
            }).catch(() => {
        })

    }

    companyView(id) {
        let info = null;
        testData.testData.map((data) => {
            if (data.Id == id) {
                info = {
                    key: data.Id,
                    id: data.Id,
                    imageUrl: data.icon.uri,
                    title: data.title,
                    subtitle: data.address,
                    Latitude: data.LatLng.latitude,
                    Longitude: data.LatLng.longitude,
                    AdditionalLocationImages: data.icon.uri,
                    firmId: data.firmId,
                }
            }
        });
        return (
            //   显示店面
            <View>
                <View style={{flexDirection: 'row', paddingTop: 20, paddingBottom: 20, backgroundColor: '#fff'}}>
                    <View style={{flexDirection: 'column', width: screen.width * 0.2}}>
                        <View style={{alignItems: 'center'}}>
                            {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                                <Image source={{uri: info.imageUrl}} style={[{
                                    width: screen.width * 0.2 * 0.5,
                                    height: screen.width * 0.2 * 0.5,
                                    resizeMode: 'cover',
                                }]}/>
                                : <Image source={require('../../img/public/shop.png')}
                                         style={[{
                                             tintColor: '#696969',
                                             width: screen.width * 0.2 * 0.5,
                                             resizeMode: 'contain',
                                         }]}/>}
                        </View>
                    </View>
                    <View style={{width: screen.width * 0.7}}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                {info.title}
                            </Text>
                        </View>
                        <View style={{}}>
                            <Text style={{lineHeight: 25}}>
                                {info.subtitle}
                            </Text>
                            <Text>
                                Expires:14 days after purchase
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 10}}>
                            <StarRating
                                // style={{marginBottom: 5}}
                                maxStars={5}
                                rating={3.5}
                                disabled={true}
                                starSize={15}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />
                            <Text style={{paddingLeft: 10, fontSize: 12}}>123 reviews</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8}
                                          style={{flexDirection: 'row', marginTop: 10, marginBottom: 5}}
                        >
                            <Image style={{}} source={require('../../img/public/phone.png')}/>
                            <Text style={{marginLeft: 5, textDecorationLine: 'underline '}} onPress={() => {
                                Linking.openURL('tel:28058888')
                            }}>(852) 28058888</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'column', width: screen.width * 0.1}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {

                        }}>
                            <Image source={require('../../img/public/right_arrow.png')}
                                   style={[{
                                       width: screen.width * 0.08,
                                       resizeMode: 'contain',
                                       tintColor: '#696969'
                                   }]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: screen.width,
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../img/mine/icon_homepage_left_arrow.png')}
                               style={[styles.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                    <Text style={{color: '#fff', fontSize: 12, fontFamily: 'arial'}}
                          numberOfLines={1}>{this.props.navigation.state.params.service.title}</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <View style={[styles.callbackIcon, {}]}/>
                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor: '#fff', flex: 1}}>
                    <ScrollView>
                        {/*{this.companyView(this.props.navigation.state.params.commodityInfo.id)}*/}
                        {/*<View style={styles.tipHeader}>*/}
                            {/*<Heading3>Pick a Staff</Heading3>*/}
                        {/*</View>*/}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                padding: 10,
                                flexDirection: 'row',
                                width: screen.width,
                                justifyContent: 'space-between',
                                backgroundColor: '#fff'
                            }}
                            onPress={() => {

                            }}
                        >
                            <View style={{flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>
                                <Image style={[styles.arrow, {paddingLeft: 10}]}
                                       source={require('../../img/tabbar/Profile.png')}/>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                paddingTop: 5,
                                paddingBottom: 5
                            }}>
                                <Text style={{
                                    paddingLeft: 10,
                                    fontSize: 13,
                                    alignSelf: 'flex-start',
                                    fontFamily: 'arial'
                                }}>Dr.Hello</Text>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>
                                <Image style={styles.arrow} source={require('../../img/public/right_arrow.png')}/>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: screen.width,
                            position: 'absolute',
                            bottom: 0,
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('ScheduleSceneChildDetail'
                                , {
                                    service: this.props.navigation.state.params.service,
                                    commodityInfo:this.props.navigation.state.params.commodityInfo,
                                });
                        }}
                    >
                        <LinearGradient
                            colors={screen.gradualColorBottom}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={{
                                flex: 1, flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: screen.width,
                                paddingTop: 10,
                                paddingBottom: 10,
                            }}
                        >
                            <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                                VIEW SCHEDULE
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop: screen.statusBarHeight,
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
    tipHeader: {
        height: 50,
        width: screen.width,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f3f3f3'
    },
    arrow: {
        width: 20,
        height: 20,
        tintColor: '#5a5a5a',
    }
});


export default ScheduleSceneChild
