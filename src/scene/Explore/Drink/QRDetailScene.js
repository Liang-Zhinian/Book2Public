import React, {Component} from 'react'
import {BackHandler, BVLinearGradient, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {screen} from '../../../common';
import {commonStyle} from "../../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";
import {Heading2} from "../../../widget/Text";
import {color} from "../../../widget";
import Panel from "../../Common/Panel";
import DrinkDetailDataUtils from "./DrinkDetailDataUtils";
import {getAllProducer} from "../../../api";
import {RefreshState} from "react-native-refresh-list-view";
import StarRating from "../../Common/StarRating";

export default class QRDetailScene extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props: Props) {
        super(props);
        this.state = {
            data:{},
            Producer:null,
            isLoading:false,
        }

    }

    subString(str){
        if (str.length*13>screen.width*0.9-80){
            str = str.substring(0,Math.round((screen.width)/13))+'... ';
        }
        return str;
    }
    onBackAndroid = () => {
        this.props.navigation.state.params.restartScan();
    };
    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentDidMount(){
        let {data} = this.props.navigation.state.params;
        this._getAllProducer('', '', 1, 10, 1, data[0].ProducerId);
    }
    _getAllProducer = async (name,letterT,page,size, type,id) => {
        this.setState({isLoading:true});
        await  getAllProducer(name,letterT,page,size, type,id)
            .then((msg) => {
                let data = DrinkDetailDataUtils.requestProducerData(msg);
                this.setState({
                    isLoading:false,
                    Producer:data,
                });
            })
            .catch((e) => {
                console.warn(e);
            });
    };

    renderContent() {
        let {data} = this.props.navigation.state.params;
        // let item = data[Math.floor(Math.random()*100)];
        let item = data[0];
        let contentView = data.length > 0
            ? <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={() => {
                    // this.props.navigation.navigate('QRWineDetail', {info: item})
                }}>
                    <View style={{flexDirection: 'column',}}>
                        {(item.imageUrl !== null && item.imageUrl !== 'null') ?
                            <Image source={{uri: item.imageUrl}} style={styles.icon}/>
                            : <Image source={require('../../../img/public/WineIcon.png')} style={styles.icon}/>}
                    </View>

                    <View style={styles.rightContainer}>
                        <Heading2 style={{paddingTop: 5, paddingLeft: 10}}>{item.title}</Heading2>
                        <View style={{flexDirection: 'row'}}>
                            <Heading2 style={{paddingLeft: 10, fontFamily: 'arial', fontSize: 16}}>
                                Color:
                            </Heading2>
                            <Text style={{paddingLeft: 10, fontFamily: 'arial', fontSize: 16}}>{item.Colour}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Heading2 style={{paddingLeft: 10, fontFamily: 'arial', fontSize: 16}}>
                                Appellation:
                            </Heading2>
                            <Text style={{
                                paddingLeft: 10,
                                fontFamily: 'arial',
                                fontSize: 16
                            }}>{this.subString(item.Appellation)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {this.renderProducer()}
                <View style={{width:screen.width,height:5}}/>
                <Panel title={'DETAIL'} expanded={false}>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Classification:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>NA</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Type:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>Sparkling</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Sweetness:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>Dry</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Country Sweetness:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>NA (France)</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Tannin:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>Light</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                            Holding Company:
                        </Heading2>
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: 'arial',
                            fontSize: 16
                        }}>abbaye de Frontfroide</Text>
                    </View>
                </Panel>

            </View>
            : <View style={{alignItems:'center',flexDirection:'column'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    Sorry, QR code can't find the relevant content...
                </Text>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    Please scan or replace QR code again...
                </Text>
            </View>;
        return contentView;
    }
    renderProducer(){
        let {Producer} = this.state;
        let info =  Producer&& Producer[0];
        return (
            Producer===null
                ?<View/>
                : <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flexDirection: 'row',
                        backgroundColor:'#fff',
                        width:screen.width*0.95,
                        paddingTop: 20,
                        alignItems:'center',
                        justifyContent:'center',
                        alignSelf:'center',
                        paddingBottom: 20
                    }}
                    onPress={()=>{
                        this.props.navigation.navigate('ProducerDetail', {info:info})
                    }}
                >
                    <View style={{flexDirection: 'column', width: screen.width * 0.15}}>
                        <View style={{alignItems: 'center',alignSelf:'center',justifyContent:'center'}}>
                            {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                                <Image source={{uri: info.imageUrl}} style={[{
                                    width: screen.width * 0.2 * 0.5,
                                    height: screen.width * 0.2 * 0.5,
                                    resizeMode: 'cover',
                                }]}/>
                                : <Image source={require('../../../img/public/shop.png')}
                                         style={[{
                                             tintColor: '#696969',
                                             width: screen.width * 0.2* 0.5,
                                             resizeMode: 'contain',
                                         }]}/>}
                        </View>
                    </View>
                    <View style={{width: screen.width * 0.65}}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, fontFamily: 'arial', color: '#000'}}>
                                {info.title}
                            </Text>
                        </View>
                        {(info.URL !== null && info.URL !== '') && <View style={{}}>
                            <Text style={{lineHeight: 25}}>
                                Website: {info.URL}
                            </Text>
                            <Text>
                                Away from you: 254km
                            </Text>
                        </View>}
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
                    </View>
                    <View style={{flexDirection: 'column', width: screen.width * 0.1}}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                            this.setState({
                                loveTintColor: this.state.loveTintColor === '#696969' ? '#ff4b1a' : '#696969'
                            })
                        }}>
                            <Image source={require('../../../img/public/collection.png')} style={[{
                                width: screen.width * 0.08,
                                zIndex:10,
                                resizeMode: 'contain',
                                tintColor: this.state.loveTintColor
                            }]}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
        )
    }

    render = () => {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient, {}]}>
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }]}>
                    <View style={{alignItems: 'center', flexDirection: 'row', width: screen.width, marginTop: 5}}>
                        <TouchableOpacity style={{
                            zIndex: 999,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingRight: 50,
                            paddingLeft: screen.width * 0.025
                        }} onPress={() => {
                            this.onBackAndroid();
                            this.props.navigation.goBack();//返回按钮图片
                        }}>
                            <Image source={require('../../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderContent()}
            </LinearGradient>
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