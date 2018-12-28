import React, {Component} from 'react'
import {
    ActivityIndicator,
    BVLinearGradient,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {screen} from '../../../../common';
import {getWineByName} from "../../../../api";
import {color} from "../../../../widget";
import {commonStyle} from "../../../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";
import {Heading2} from "../../../../widget/Text";
import RefreshListView, {RefreshState} from "react-native-refresh-list-view";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import StarRating from "../../../Common/StarRating";
import LocalImage from "../../../../widget/LocalImage";
import * as ScreenUtil from "../../../Common/ScreenUtil";

//酒庄列表
export default class WineScene extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            WineList:[],
            NoData:false,
            searchKey: null,
            isLoading:false,
            onSearch:false,
            center:null,
            waiting:false,
        }
    }

    componentWillMount() {
    }
    page = 1;
    dataLength=0;
    size=50;
    _getWineByName = async (name) => {
        this.setState({
            onSearch:true,
            isLoading:true
        });
        await getWineByName(name,this.page,this.size)
            .then((msg) => {
                if (msg !== undefined) {
                    this.dataLength = this.state.WineList.length;
                    let data = DrinkDetailDataUtils.requestWineData(msg);
                    // data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                    this.setState({
                        refreshing: false,
                        isLoading: false,
                        WineList: this.state.WineList.concat(data),
                        refreshStateRe: RefreshState.Idle,
                    }, () => {
                        if (this.state.WineList.length === this.dataLength) {
                            this.setState({refreshStateRe: RefreshState.NoMoreData})
                        }
                    });
                    // console.log(this.state.WineList)
                }else {
                    this.setState({
                        refreshing: false,
                        isLoading:false,
                        refreshStateRe: RefreshState.NoMoreData,
                    });
                }
            })
            .catch((e) => {
                console.log('_getWine--->error', e);
            });
    };

    componentDidMount() {

    }
    toWait(){
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }
    renderCell = (rowData: any) => {
        let {waiting} = this.state;
        let img=LocalImage.countryImgList[rowData.item.Country];
        let hot = [3,3.5,4,4.5,5];
        let reviews = Math.floor((Math.random()*1000));
        let rating = hot[Math.floor((Math.random()*10)%4)];
        return (
            <TouchableOpacity
                disabled={waiting}
                activeOpacity={0.9}
                style={styles.container2}
                onPress={() => {
                    this.setState({waiting: true});
                    this.props.navigation.navigate('WineDetail', {info: rowData.item,reviews,rating});//跳到商品详情
                    this.toWait();
                }}
            >
                <View style={styles.rightContainer}>
                    <Heading2 style={{paddingTop: 5}}>{rowData.item.title}</Heading2>
                    <View style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
                        <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Color: </Text>
                        <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{rowData.item.Colour}</Text>
                    </View>
                    {img && <View style={[{flexDirection: 'row',paddingTop: 5,justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'flex-start',}]}>
                        {/*<Text style={{fontSize: ScreenUtil.setSpText(12)}}>Country: </Text>*/}
                        <Image style={{width: 22.4, height: 14.7}} source={img}/>
                        <Text style={{
                            fontSize: ScreenUtil.setSpText(13),
                            color: '#019eff'
                        }}>  {rowData.item.Country} </Text>
                    </View>}
                    <View style={{flexDirection: 'row',paddingTop: 5, marginBottom: 10}}>
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
                <View style={[commonStyle.center, {flexDirection: 'column',}]}>
                    {(rowData.item.imageUrl !== null && rowData.item.imageUrl !== 'null') ?
                        <Image source={{uri: rowData.item.imageUrl}} style={styles.icon}/>
                        : <Image source={require('../../../../img/public/WineIcon.png')} style={styles.icon}/>}
                </View>
            </TouchableOpacity>
        )
    };
    requestData = async () => {
        this.page=1;
        this.setState({
            WineList:[],
            refreshState:RefreshState.HeaderRefreshing
        });
        let {searchKey} = this.state;
        this._getWineByName(searchKey);
    };
    nextPage=async()=>{
        ++this.page;
        //叠加翻页数据
        this.setState({refreshState: RefreshState.FooterRefreshing});
        let {searchKey} = this.state;
        this._getWineByName(searchKey);
    };
    showNoDataMsg() {
        return (
            <View style={{alignItems:'center',
            backgroundColor:'#0000'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    No matched searching result is returned.
                </Text>
            </View>
        )
    }
    showNoSearchMsg() {
        return (
            <View style={{alignItems:'center',
            backgroundColor:'#0000'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please enter keywords to search.
                </Text>
            </View>
        )
    }
    showNoSelectLetter() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please scroll to left to select a letter to search...
                </Text>
            </View>
        )
    }
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }

    renderWineList(){
        return (
            (this.state.WineList.length > 0
                    ? <RefreshListView
                        style={{
                            width: screen.width,
                            marginTop: 5,
                            backgroundColor: '#ffffff00'
                        }}
                        data={this.state.WineList}
                        renderItem={this.renderCell}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
                        onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                        footerTextStyle={{color: '#ffffff'}}
                        footerRefreshingText={'loading...'}
                        footerFailureText={'click refresh'}
                        footerNoMoreDataText={' '}
                        footerEmptyDataText={'empty data'}
                        // onEndReached={(info:{distanceFromEnd: number}) => {
                        //     // this.nextPage();
                        //     console.log('onEndReached');
                        //     // this.setState({
                        //     //     refreshState:RefreshState.EmptyData
                        //     // });
                        // }}
                    />
                    : (this.state.isLoading ? this.showLoading() : (this.state.NoData && this.showNoDataMsg()))
            )
        )
    }
    render = () => {
        let {searchKey,waiting,WineList} =this.state;
        console.log(WineList);
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient]}>
                <View style={[commonStyle.center]}>
                    <View style={commonStyle.Bar}>
                        <TouchableOpacity
                            disabled={waiting}
                            style={commonStyle.BarLeftIcon}
                            onPress={() => {
                                this.setState({waiting: true});
                                this.props.navigation.goBack();//返回按钮图片
                                this.toWait();
                            }}
                        >
                            <Image source={LocalImage.goBackIcon}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={waiting}
                            activeOpacity={0.8}
                            style={commonStyle.BarTitle}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'arial',
                            }}>Wine</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        disabled={waiting}
                        activeOpacity={0.9}
                        style={[commonStyle.searchBar]}
                        underlineColorAndroid='white'
                        onPress={() => {
                            this.setState({waiting: true});
                            this.props.navigation.navigate('Drink2SearchScene'
                                , {
                                    category:'wine',
                                    callback: (msg) => {
                                        if (this.state.refreshState === RefreshState.NoMoreData) {
                                            this.page = 1
                                        }
                                        this.setState({
                                            searchKey: msg,
                                            WineList:[],
                                            // WineList: [{
                                            //     key: 123,
                                            //     id: 123,
                                            //     imageUrl: null,
                                            //     title: 'info.WineName',
                                            //     AdditionalLocationImages: null,
                                            //     firmId: 2,
                                            //     Appellation:3,
                                            //     Colour:'red',
                                            //     ProducerId:33,
                                            //     Country:'Spain'
                                            // }],
                                            // onSearch: true,
                                            // LocationSearchKey: null,
                                            // isLoading: false,
                                            // refreshState: RefreshState.NoMoreData,
                                        });
                                            this._getWineByName(msg);
                                    }
                                });
                            this.toWait();
                        }}
                    >
                        <Image source={require('../../../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={commonStyle.searchText}>{(searchKey === null || searchKey === '') ? 'What to' : searchKey} </Text>
                        {(searchKey === null || searchKey === '') ?<Text style={commonStyle.searchText2}>search?</Text> : <Text/>}
                    </TouchableOpacity>
                </View>
                {!this.state.onSearch ? this.showNoSearchMsg() : this.renderWineList()}
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container2: {
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
    rightContainer: {
        flex: 1,
        backgroundColor:"#9dff4f00",
        justifyContent:'space-between'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F4F4F400',
    },
    listContainner: {
        height: Dimensions.get('window').height,
        marginBottom: 10
    },
    contentContainer: {
        flexDirection: 'row',
        width: screen.width,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    letterText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ffffff',
        fontFamily:'arial'
    },
    sectionView: {
        paddingTop: 5,
        paddingBottom: 5,
        height: 30,
        paddingLeft: 10,
        width: screen.width,
        backgroundColor: '#F4F4F4'
    },
    sectionText: {
        color: '#e75404',
        fontWeight: 'bold'
    },
    rowView: {
        marginBottom:5,
        backgroundColor:'#fff',
        borderRadius:4,
        width:screen.width*0.95
    },
    rowdata: {
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
    },

    rowdatatext: {
        color: 'gray',
        width: screen.width
    },

    rowViewBox: {
        height: 40,
        width: (screen.width - 30) / 3,
        flexDirection: 'row',
        backgroundColor: '#ffffff'
    },
    rowdataBox: {
        borderWidth: 1,
        borderColor: '#DBDBDB',
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 2,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowDataTextBox: {
        marginTop: 5,
        flex: 1,
        height: 20
    },
    pickerContainer: {
        flexDirection:'row',
        paddingTop:0,
        paddingBottom:0,
        width:screen.width
    },
    picker: {
        flex: 1,
    },
    icon: {
        width: 50,
        height:50,
        // paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
});