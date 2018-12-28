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
import LocalImage from "../../../widget/LocalImage";
import * as ScreenUtil from "../../Common/ScreenUtil";

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
        let hot = [3,3.5,4,4.5,5];
        let reviews = Math.floor((Math.random()*1000));
        let rating = hot[Math.floor((Math.random()*10)%4)];
        let contentView = data.length > 0
            ? <View style={commonStyle.center}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this.props.navigation.navigate('WineDetail', {info: item,reviews,rating });//跳到商品详情
                        this.toWait();
                    }}
                    style={{
                        paddingTop: 5,
                        flexDirection: 'row',
                        width: screen.width * 0.95,
                        justifyContent: 'space-between',
                        backgroundColor:'#Fff'
                    }}
                >
                    <View
                        activeOpacity={0.9}
                        style={styles.container2}
                    >
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                            <Text style={{fontSize: ScreenUtil.setSpText(15),color: '#000',fontWeight:'500'}}>Wine: </Text>
                            <Text style={{fontSize: ScreenUtil.setSpText(15),color: '#019eff',fontWeight:'500'}}>{item.title}</Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                            <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Color: </Text>
                            <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{item.Colour}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            paddingTop: 5,
                            marginBottom: 5
                        }}>
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
                    <View style={{flexDirection: 'column',}}>
                        <Image source={require('../../../img/public/WineIcon.png')} style={[styles.icon,{marginRight:10}]}/>
                    </View>
                </TouchableOpacity>
                {this.renderProducer()}
                {/*<View style={{width:screen.width,height:5}}/>*/}
                <Panel title={'Wine Details'} expanded={false} style={{borderRadius:0}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial',}}>
                            Classification:
                        </Text>
                        <Text style={styles.propertyText}>NA</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial', }}>
                            Type:
                        </Text>
                        <Text style={styles.propertyText}>Sparkling</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial', }}>
                            Sweetness:
                        </Text>
                        <Text style={styles.propertyText}>Dry</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial', }}>
                            Country Sweetness:
                        </Text>
                        <Text style={styles.propertyText}>{item.Country}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial', }}>
                            Tannin:
                        </Text>
                        <Text style={styles.propertyText}>Light</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingLeft: 5, fontFamily: 'arial', }}>
                            Holding Company:
                        </Text>
                        <Text style={styles.propertyText}>abbaye de Frontfroide</Text>
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
        let hot = [3,3.5,4,4.5,5];
        let reviews = Math.floor((Math.random()*1000));
        let rating = hot[Math.floor((Math.random()*10)%4)];
        return (
            Producer===null
                ?<View/>
                : <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flexDirection: 'row',
                        backgroundColor:'#fff',
                        width:screen.width*0.95,
                        paddingTop: 0,
                        alignItems:'center',
                        justifyContent:'space-between',
                        alignSelf:'center',
                        paddingBottom: 5,
                    }}
                    onPress={()=>{
                        this.props.navigation.navigate('ProducerDetail', {info:info,distance:123,reviews:reviews,rating:rating})
                    }}
                >
                    {/*<View style={{flexDirection: 'column', width: screen.width * 0.15}}>*/}
                        {/*<View style={{alignItems: 'center',alignSelf:'center',justifyContent:'center'}}>*/}
                            {/*/!*{(info.imageUrl !== null && info.imageUrl !== 'null') ?*!/*/}
                                {/*/!*<Image source={{uri: info.imageUrl}} style={[{*!/*/}
                                    {/*/!*width: screen.width * 0.2 * 0.5,*!/*/}
                                    {/*/!*height: screen.width * 0.2 * 0.5,*!/*/}
                                    {/*/!*resizeMode: 'cover',*!/*/}
                                {/*/!*}]}/>*!/*/}
                                {/*/!*: <Image source={require('../../../img/public/shop.png')}*!/*/}
                                         {/*/!*style={[{*!/*/}
                                             {/*/!*tintColor: '#696969',*!/*/}
                                             {/*/!*width: screen.width * 0.2* 0.5,*!/*/}
                                             {/*/!*resizeMode: 'contain',*!/*/}
                                         {/*/!*}]}/>}*!/*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    <View style={{marginLeft:10}}>
                        <View style={{height:screen.onePixel,width:screen.width,backgroundColor:'#797979'}}/>
                        {/*<View style={{*/}
                            {/*flexDirection: 'row',*/}
                            {/*paddingTop:5*/}
                        {/*}}>*/}
                            {/*<Text style={{fontWeight: 'bold', fontSize: ScreenUtil.setSpText(15), fontFamily: 'arial', color: '#000'}}>*/}
                                {/*Producer:*/}
                            {/*</Text>*/}
                            {/*<Text style={{fontWeight: 'bold', fontSize: ScreenUtil.setSpText(12), fontFamily: 'arial', color: '#019eff'}}>*/}
                                {/*{info.title}*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                            <Text style={{fontSize: ScreenUtil.setSpText(15),color: '#000',fontWeight:'500'}}>Producer: </Text>
                            <Text style={{fontSize: ScreenUtil.setSpText(15),color: '#019eff',fontWeight:'500'}}>{info.title}</Text>
                        </View>
                        {(info.URL !== null && info.URL !== '') && <View style={{}}>
                            <Text style={{lineHeight: 25}}>
                                Website: {info.URL}
                            </Text>
                            {/*<Text>*/}
                                {/*Away from you: 254km*/}
                            {/*</Text>*/}
                        </View>}
                        <View style={{flexDirection: 'row', paddingTop: 10}}>
                            <StarRating
                                // style={{marginBottom: 5}}
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
                    <View style={{flexDirection: 'column',marginRight:10}}>
                        <Image source={require('../../../img/public/ProducerIcon.png')} style={[{
                            width: screen.width * 0.08,
                            zIndex:10,
                            resizeMode: 'contain',
                            tintColor: this.state.loveTintColor
                        }]}/>
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
                <View style={[commonStyle.center]}>
                    <View style={commonStyle.Bar}>
                        <TouchableOpacity style={commonStyle.BarLeftIcon} onPress={() => {
                            this.onBackAndroid();
                            this.props.navigation.goBack();//返回按钮图片
                        }}>
                            <Image source={LocalImage.goBackIcon}
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
        // marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
        // borderRadius:3,
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: "#9e9e9e00",
        resizeMode: 'contain'
    },
    rightContainer: {
        // flex: 1,
        // backgroundColor: "#9dff4f00",
    },
    price: {
        color: color.primary
    },
    propertyText:{
        color:'#019eff',
        paddingLeft: 5,
        fontFamily: 'arial',
    },
    container2: {
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        width: screen.width * 0.7,
        alignSelf: 'center',
        marginBottom:0,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: '#fff',
        // borderRadius: 3,
    },
})