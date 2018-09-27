import React, {PureComponent} from 'react'
import {
    Dimensions,
    Image,
    InteractionManager,
    RefreshControl, SafeAreaView,
    ScrollView,
    StatusBar, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {Separator} from '../../../../widget/index'
import {screen} from '../../../../common'
import StarRating from "../../../Common/StarRating";
import {commonStyle} from "../../../../widget/commonStyle";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import ProducerCell from "./ProducerCell";
import {getWineByProducer} from "../../../../api";
import ContentWaterfall from "../../../Common/Waterfall/ContentWaterfall";
import MasonryList from "../../../Common/Waterfall/MasonryList";
import PlacehoderImage from "../../../Common/Waterfall/PlaceholderImage";
import {Heading2} from "../../../../widget/Text";

type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}




//酒详情
export default class WineDetail extends PureComponent<Props, State> {

    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            refreshState: false,
            loveTintColor: '#696969',
            handerBgc: '#69696900',
            WinedList:[],
            refreshStateRe: RefreshState.Idle,
            refreshing:false,

        }
    }

    componentWillUnmount() {
        StatusBar.setBackgroundColor("#0F143A00");
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // this.requestData();
        })

    }
    requestData = async () => {
        // this._getWine();
    };


    _keyExtractor = (item, index) => {
        return item.text + index;
    };



    renderHeader = () => {
        let info = this.props.navigation.state.params.info;
        return (
            <View>
                <View>
                    {(info.AdditionalLocationImages !== null && info.AdditionalLocationImages !== 'null') ?
                        <Image source={{uri: info.AdditionalLocationImages}} style={commonStyle.banner}/>
                        : <Image source={require('../../../../img/public/What2Book.png')} style={commonStyle.banner}/>}
                    <View style={{flexDirection: 'row', paddingTop: 20, paddingBottom: 20}}>
                        <View style={{flexDirection: 'column', width: screen.width * 0.2}}>
                            <View style={{alignItems: 'center'}}>
                                {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                                    <Image source={{uri: info.imageUrl}} style={[{
                                        width: screen.width * 0.2 * 0.5,
                                        height: screen.width * 0.2 * 0.5,
                                        resizeMode: 'cover',
                                    }]}/>
                                    : <Image source={require('../../../../img/public/timgMin.jpg')}
                                             style={[{
                                                 // tintColor: '#696969',
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
                            {/*<View style={{}}>*/}
                            {/*<Text style={{lineHeight: 25}}>*/}
                            {/*{info.subtitle}*/}
                            {/*</Text>*/}
                            {/*<Text>*/}
                            {/*Expires:14 days after purchase*/}
                            {/*</Text>*/}
                            {/*</View>*/}
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
                        {/*<View style={{flexDirection: 'column', width: screen.width * 0.1}}>*/}
                        {/*<TouchableOpacity activeOpacity={0.8} onPress={() => {*/}
                        {/*this.setState({*/}
                        {/*loveTintColor: this.state.loveTintColor === '#696969' ? '#ff4b1a' : '#696969'*/}
                        {/*})*/}
                        {/*}}>*/}
                        {/*<Image source={require('../../../../img/public/collection.png')} style={[{*/}
                        {/*width: screen.width * 0.08,*/}
                        {/*resizeMode: 'contain',*/}
                        {/*tintColor: this.state.loveTintColor*/}
                        {/*}]}/>*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                    </View>
                    <Separator/>
                    <View style={{
                        width: screen.width * 0.95,
                        flexDirection: 'column',
                        // alignItems:'center'
                    }}>
                        <View style={{flexDirection: 'row'}}>
                            <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                                Colour:
                            </Heading2>
                            <Text style={{
                                paddingLeft: 5,
                                fontFamily: 'arial',
                                fontSize: 16
                            }}>{info.Colour}</Text>
                        </View>
                        <View style={{flexDirection: 'row', width: screen.width * 0.8}}>
                            <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                                Appellation:
                            </Heading2>
                            <Text numberOfLines={2} style={{
                                paddingLeft: 5,
                                fontFamily: 'arial',
                                fontSize: 16,
                            }}>{info.Appellation}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Heading2 style={{paddingLeft: 5, fontFamily: 'arial', fontSize: 16}}>
                                Classification:
                            </Heading2>
                            <Text style={{
                                paddingLeft: 5,
                                fontFamily: 'arial',
                                fontSize: 16,
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
                    </View>
                </View>

            </View>
        )
    };

    render() {
        return (
            <View style={[commonStyle.container,{backgroundColor:'#fff'}]}>
                <View style={{
                    position: 'absolute',
                    top: screen.statusBarHeight,
                    zIndex: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: screen.width,
                    backgroundColor: this.state.handerBgc,
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}
                               style={[commonStyle.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={{color: '#fff'}}>WINE DETAILS</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../../../img/public/share.png')}
                               style={[commonStyle.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    onScroll={(msg) => {
                        let dy = msg.nativeEvent.contentOffset.y;
                        if (dy >= 0) {
                            let opacity = Math.round(dy > 255 ? 255 : dy).toString(16);
                            this.setState({handerBgc: "#0F143A" + ((opacity.length === 1) ? '0' + opacity : opacity)});
                            StatusBar.setBackgroundColor("#0F143A" + ((opacity.length === 1) ? '0' + opacity : opacity));
                        }
                    }}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshState}
                            onRefresh={() => this.requestData()}
                            tintColor='gray'
                        />
                    }
                >
                    {this.renderHeader()}
                </ScrollView>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:screen.width,
        height:500,
        backgroundColor:'#0064ff'
    },
    item: {
        margin: 4,
    },
    itemText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 30,
        backgroundColor: '#ff4f70',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
});