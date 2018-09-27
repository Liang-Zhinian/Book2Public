import React, {PureComponent} from 'react'
import {
    Image,
    InteractionManager,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {screen} from '../../../common'
import {commonStyle} from "../../../widget/commonStyle";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import DrinkDetailDataUtils from "./DrinkDetailDataUtils";
import ProducerCell from "./Producer/ProducerCell";
import {getWineByProducer} from "../../../api";
import MasonryList from "../../Common/Waterfall/MasonryList";
import PlacehoderImage from "../../Common/Waterfall/PlaceholderImage";

type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}

const secToTime = (s) => {
    let h = 0, m = 0;
    if(s > 60){
        m = parseInt(s / 60);
        s = parseInt(s % 60);
        if(m > 60) {
            h = parseInt(i / 60);
            m = parseInt(i % 60);
        }
    }
    // 补零
    const zero = (v) => {
        return (v >> 0) < 10 ? ("0" + v) : v;
    };
    return (h === 0 ? [zero(m), zero(s)].join(":") : [zero(h), zero(m), zero(s)].join(":"));
};


const { width, height } = screen;
const itemWidth = (width - 16) / 2;

//QR详情()
export default class QRWineDetail extends PureComponent<Props, State> {

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
        // this.requestData();
        // this._onRefreshing();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // this.requestData();
            this._getWine();
        })

    }
    requestData = async () => {
        // this._getWine();
    };

    renderWineList(){
        return (
            <View style={commonStyle.container}>
                <RefreshListView
                    style={{
                        width: screen.width,
                        flexDirection:'row',
                        backgroundColor:'#b3ffa0'
                    }}
                    data={this.state.WinedList}
                    // ListHeaderComponent={this.GetADList()}//广告位
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshStateRe}
                    onHeaderRefresh={this.requestData}
                    footerTextStyle={{color: '#ffffff'}}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={'no more data'}
                    footerEmptyDataText={'empty data'}
                />
            </View>
        )
    }

    renderWineListFalls() {
        return (
            <SafeAreaView style={styles.container}>
                <MasonryList
                    data={this.state.WinedList}
                    numColumns={2}
                    renderItem={this._renderItem}
                    getHeightForItem={this._getHeightForItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefreshing}
                    onEndReachedThreshold={0.5}
                    onEndReached={this._onEndReached}
                    keyExtractor={this._keyExtractor}
                />
            </SafeAreaView>
        )
    }
    // _keyExtractor = (item, index) => {
    //     return item.text + index;
    // };
    _onEndReached = () => {
        // this.setState({
        //     refreshing: false,
        // });
    };
    _onRefreshing = () => {
        this._getWine();
        // this.setState({
        //     refreshing: false,
        // });
    };

    _onPressContent = (item) => {
        // this.props.navigation.navigate('WineDetail', {item});
    };
    _renderItem = ({item}) => {
        //null
        // firmId : 1
        // id : 1
        // imageUrl : null
        // key : 1
        // title : "Domaine de Cazaban Hors Serie N°1"

        const itemHeight = this._getHeightForItem({item});
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this._onPressContent(item)}
                style={styles.item}>
                <PlacehoderImage source={require('../../../../img/public/What2Book.png')}
                                 placeholder={{uri: 'placeholder'}}  style={{width: itemWidth, height: itemHeight, borderRadius: 4}}/>
                <View style={styles.itemText}>
                    {/*<Text style={{color: '#fff'}}>{secToTime(item.id)}</Text>*/}
                    {/*<Text style={{color: '#fff'}}>{item.title}</Text>*/}
                </View>
            </TouchableOpacity>
        )
    };
    _getHeightForItem = ({item}) => {
        return Math.max(itemWidth, itemWidth / 200 * 200);
    };


    _getWine = async () => {
        let {title} = this.props.navigation.state.params.info;
        await getWineByProducer(title,1,100)
            .then((msg) => {
                this.setState({
                    refreshing: false,
                    WinedList: DrinkDetailDataUtils.requestWineData(msg),
                    refreshStateRe: RefreshState.NoMoreData,
                });
            })
            .catch(() => {

            });
    };

    renderCell = (rowData: any) => {
        return (
            <ProducerCell
                info={rowData.item}
                onPress={() => {
                    console.log(rowData.item)
                    // let scene = this.state.title+'Scene';
                    // this.props.navigation.navigate(scene, {info: rowData.item})//跳到商品详情
                }}
            />
        )
    };

    renderHeader = () => {
        let info = this.props.navigation.state.params.info;
        console.log(info);
        return (
            <View>
                {/*<View>*/}
                    {/*{(info.AdditionalLocationImages !== null && info.AdditionalLocationImages !== 'null') ?*/}
                        {/*<Image source={{uri: info.AdditionalLocationImages}} style={commonStyle.banner}/>*/}
                        {/*: <Image source={require('../../../../img/public/What2Book.png')} style={commonStyle.banner}/>}*/}
                    {/*<View style={{flexDirection: 'row', paddingTop: 20, paddingBottom: 20}}>*/}
                        {/*<View style={{flexDirection: 'column', width: screen.width * 0.2}}>*/}
                            {/*<View style={{alignItems: 'center'}}>*/}
                                {/*{(info.imageUrl !== null && info.imageUrl !== 'null') ?*/}
                                    {/*<Image source={{uri: info.imageUrl}} style={[{*/}
                                        {/*width: screen.width * 0.2 * 0.5,*/}
                                        {/*height: screen.width * 0.2 * 0.5,*/}
                                        {/*resizeMode: 'cover',*/}
                                    {/*}]}/>*/}
                                    {/*: <Image source={require('../../../../img/public/shop.png')}*/}
                                             {/*style={[{*/}
                                                 {/*tintColor: '#696969',*/}
                                                 {/*width: screen.width * 0.2 * 0.5,*/}
                                                 {/*resizeMode: 'contain',*/}
                                             {/*}]}/>}*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<View style={{width: screen.width * 0.7}}>*/}
                            {/*<View style={{*/}
                                {/*flexDirection: 'row',*/}
                            {/*}}>*/}
                                {/*<Text style={{fontWeight: 'bold', fontSize: 15}}>*/}
                                    {/*{info.title}*/}
                                {/*</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{}}>*/}
                                {/*<Text style={{lineHeight: 25}}>*/}
                                    {/*{info.subtitle}*/}
                                {/*</Text>*/}
                                {/*<Text>*/}
                                    {/*Expires:14 days after purchase*/}
                                {/*</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{flexDirection: 'row', paddingTop: 10}}>*/}
                                {/*<StarRating*/}
                                    {/*// style={{marginBottom: 5}}*/}
                                    {/*maxStars={5}*/}
                                    {/*rating={3.5}*/}
                                    {/*disabled={true}*/}
                                    {/*starSize={15}*/}
                                    {/*onStarChange={(value) => this.onStarRatingPress(value)}*/}
                                {/*/>*/}
                                {/*<Text style={{paddingLeft: 10, fontSize: 12}}>123 reviews</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
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
                    {/*</View>*/}
                    {/*<Separator/>*/}
                {/*</View>*/}
                {/*{this.renderWineList()}*/}
                {/*<ContentWaterfall data={this.state.WinedList} onPressContent={(item) => {*/}
                    {/*this.props.navigation.navigate('WineDetail', {item});*/}
                {/*}}/>*/}

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
                        <Image source={require('../../../img/mine/icon_homepage_left_arrow.png')}
                               style={[commonStyle.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={{color: '#fff'}}>STUDIO DETAIL</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../../img/public/share.png')}
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