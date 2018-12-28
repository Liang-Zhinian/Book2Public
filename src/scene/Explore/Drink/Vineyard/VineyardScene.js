import React, { Component } from 'react';
import {
    ActivityIndicator, AsyncStorage,
    BVLinearGradient,
    Image,
    InteractionManager,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import { screen } from '../../../../common'
import { commonStyle } from "../../../../widget/commonStyle";
import LocalImage from "../../../../widget/LocalImage";
import CountryListScene from "../Vineyard/CountryListScene";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import { getVineyardByGPS, getVineyardByName, getVineyardBySubAreaId } from "../../../../api";
import Drink2SearchScene from "../Drink2SearchScene";
import VineyardCell from "../Vineyard/VineyardCell";
// import EZSideMenu from "../../../Common/EZSideMenu";
import SideMenu from "react-native-side-menu";

var colorTemp = screen.colorTemp;
//葡萄园列表
export default class VineyardScene extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    _selectionMode = true;
    static navigationOptions = ({ navigation }: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            searchKey: null,
            LocationSearchKey: null,
            title: '',
            NoData: false,
            showSliderBar: false,
            isOpen: false,
            selectedItem: 'About',
            isLoading: false,
            VineyardList: [],
            subareaId: null,
            openMenuOffset: screen.width * (2 / 3),
            onSearch: false,
            waiting: false,//防多次点击
            LatLng: {},
            radius: 0,
            zoom: 12.5,
        };
        this.toggle = this._toggle.bind(this)
    }

    componentWillUnmount() {
    }
    showLoading() {
        return (
            <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    showNoDataMsg() {
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
                <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'arial' }}>
                    No matched search result is returned.
                </Text>
            </View>
        )
    }
    showNoSearchMsg() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'arial', paddingTop: 5 }}>
                    Please enter keywords to search.
                </Text>
            </View>
        )
    }

    requestData = async () => {
        this.page = 1;
        this.setState({
            refreshState: RefreshState.HeaderRefreshing
        });
        let { searchKey, LocationSearchKey, LatLng, radius } = this.state;
        if (searchKey !== null) {
            this.setState({ VineyardList: [] });
            this._getVineyardByName(searchKey);
        } else if (LocationSearchKey !== null) {
            this.setState({ VineyardList: [] });
            this._getVineyardByGPS(LatLng.latitude, LatLng.longitude, radius);
        }
        else {
            this.props.setShowSliderBar && this.props.setShowSliderBar(true);
            if (searchKey === null) {
                this._getVineyardByName('')
            } else {
                this._getVineyardByName(searchKey);
            }
        }
    };
    nextPage = async () => {
        ++this.page;
        if (this.state.refreshState === RefreshState.NoMoreData) return;
        //叠加翻页数据
        this.setState({ refreshState: RefreshState.FooterRefreshing });
        let { searchKey, subareaId } = this.state;
        // this.props.setShowSliderBar && this.props.setShowSliderBar(true);
        if (subareaId !== null) {
            // this._getVineyardBySubAreaId(subareaId);
            this.setState({ refreshState: RefreshState.NoMoreData })//暂时没有分页,临时停止翻页刷新
        } else {
            this._getVineyardByName(searchKey)
        }
    };

    _resetPage() {
        if (this.state.refreshState === RefreshState.NoMoreData) {
            this.page = 1;
            this.dataLength = 0;
        }
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
        });
    }

    _getVineyardBySubAreaId = async (vid) => {
        this.setState({ isLoading: true });
        await getVineyardBySubAreaId(vid, this.page, this.size)
            .then((msg) => {
                if (msg !== undefined && msg.length !== undefined) {
                    this.dataLength = this.state.VineyardList.length;
                    let data = DrinkDetailDataUtils.requestData(msg);
                    data.length > 0 ? this.setState({ NoData: false }) : this.setState({ NoData: true });
                    // data.pop();
                    this.setState({
                        isLoading: false,
                        VineyardList: this.state.VineyardList.concat(data),
                        refreshState: RefreshState.Idle,
                        openMenuOffset: screen.width * (2 / 3)
                    }, () => {
                        if (this.state.VineyardList.length === this.dataLength) {
                            this.setState({ refreshState: RefreshState.NoMoreData })
                        }
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshState: RefreshState.NoMoreData
                    })
                }
            })
            .catch((e) => {
                console.warn(e);
                this.setState({
                    refreshState: RefreshState.Failure,
                })
            });
    };
    _clearData() {
        this.setState({
            VineyardList: []
        })
    }
    page = 1;
    size = 25;
    dataLength = 0;
    _getVineyardByName = async (name) => {
        this.setState({
            onSearch: true,
            isLoading: true
        });
        await getVineyardByName('ByA', name, this.page, this.size)
            .then((msg) => {
                if (msg !== undefined && msg.length !== undefined) {
                    this.dataLength = this.state.VineyardList.length;
                    let data = DrinkDetailDataUtils.requestData(msg);
                    (data.length > 0 && data.length !== 1) ? this.setState({ NoData: false }) : this.setState({ NoData: true });
                    // if (this.page!==1&&data.length>0) data.shift();
                    // if(data.length=this.size){data.pop();}
                    // data.pop();
                    this.setState({
                        isLoading: false,
                        VineyardList: this.state.VineyardList.concat(data),
                        refreshState: RefreshState.Idle,
                    }, () => {
                        if (this.state.VineyardList.length === this.dataLength) {
                            this.setState({ refreshState: RefreshState.NoMoreData })
                        }
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshState: RefreshState.NoMoreData
                    })
                }
            })
            .catch((e) => {
                // console.warn(e);
                this.setState({
                    refreshState: RefreshState.Failure,
                })
            });
    };
    _getVineyardByGPS = async (latitude, longitude, radius) => {
        this.setState({
            onSearch: true,
            isLoading: true
        });
        await getVineyardByGPS(latitude, longitude, radius)
            .then((msg) => {
                if (msg !== undefined && msg.length !== undefined) {
                    this.dataLength = this.state.VineyardList.length;
                    let data = DrinkDetailDataUtils.requestData(msg);
                    data.length > 0 ? this.setState({ NoData: false }) : this.setState({ NoData: true });
                    this.setState({
                        isLoading: false,
                        VineyardList: this.state.VineyardList.concat(data),
                        refreshState: RefreshState.Idle,
                    }, () => {
                        if (this.state.VineyardList.length === this.dataLength) {
                            this.setState({ refreshState: RefreshState.NoMoreData })
                        }
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshState: RefreshState.NoMoreData
                    })
                }
            })
            .catch((error) => { })
    };

    componentWillMount() {
        let { category } = this.props.navigation.state.params;
        this.setState({ title: category });
        this.getLatLngLog();
    }
    getLatLngLog() {
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error, result) => {
                    if (error || result == null) {
                        console.log('取值失败');
                        this.setState({
                            isLoading: false,
                            refreshState: RefreshState.Failure,
                        })
                    } else {
                        let LatLngLog = JSON.parse(result);
                        this.setState({
                            LatLng: {
                                latitude: LatLngLog[0],
                                longitude: LatLngLog[1]
                            },
                            radius: parseFloat(LatLngLog[2] * 5),
                            zoom: parseFloat(LatLngLog[3] * 5),
                        });
                    }
                }
            );
        } catch (error) {
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度' + error);
        }
    }


    renderCell = (rowData: any) => {
        let { waiting } = this.state;
        return (
            <View>
                <VineyardCell
                    disabled={waiting}
                    info={rowData.item}
                    latLng={this.state.LatLng}
                    onPress={(info, distance, reviews, rating) => {
                        //跳到商品详情
                        this.setState({ waiting: true });
                        this.props.navigation.navigate('VineyardDetail', { info: rowData.item, distance: distance, reviews: reviews, rating: rating });//跳到商品详情
                        this.toWait();
                    }}
                />
            </View>
        )
    };
    renderVineyardList() {
        return (
            this.state.VineyardList.length > 0
                ? <RefreshListView
                    style={{
                        width: screen.width,
                        marginTop: 5,
                        backgroundColor: '#ffffff00'
                    }}
                    initialListSize={2}
                    data={this.state.VineyardList}
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
                    onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                    footerTextStyle={{ color: '#ffffff' }}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={' '}
                    footerEmptyDataText={'empty data'}
                />
                : (this.state.isLoading
                    ? this.showLoading()
                    : (this.state.NoData && this.showNoDataMsg()))
        )
    }

    setShowSliderBar(flag) {
        this.setState({ showSliderBar: flag })
    }


    updateMenuState(isOpen) {
        this.setState({ isOpen });
        if (!isOpen) {
        }
    }


    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item,
        });

    _getSubareaId = item => {
        this.setState({
            isOpen: false,
            openMenuOffset: 0,
            subareaId: item.id,
            isLoading: true,
            searchKey: null,
            onSearch: true
        });
        this._clearData();
        this._resetPage();
        InteractionManager.runAfterInteractions(() => {
            this._getVineyardBySubAreaId(this.state.subareaId);
        });

    };
    _onMove() { }

    _toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
        if (this.refs.menu) {
            this.state.isOpen ? this.refs.menu.close() : this.refs.menu.open()
        }
    }
    toWait() {
        setTimeout(() => {
            this.setState({ waiting: false })
        }, 1500);//设置的时间间隔由你决定
    }
    render() {
        let { searchKey, openMenuOffset, LocationSearchKey, isOpen, waiting } = this.state;
        const menu =
            <CountryListScene
                _toggle={this._toggle.bind(this)}
                getSubarea={this._getSubareaId}
            />;
        return (
            <SideMenu
                menu={menu}
                openMenuOffset={screen.width}
                isOpen={isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}
                menuPosition={'right'}
            >
                <LinearGradient colors={colorTemp}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[commonStyle.linearGradient, {}]}>
                    <View style={[commonStyle.center]}>
                        <View style={commonStyle.Bar}>
                            <TouchableOpacity
                                disabled={waiting}
                                style={commonStyle.BarLeftIcon}
                                onPress={() => {
                                    this.setState({ waiting: true });
                                    this.props.navigation.goBack();//返回按钮图片
                                    this.toWait();
                                }}>
                                <Image source={LocalImage.goBackIcon}
                                    style={[commonStyle.searchIcon, {}]} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={waiting}
                                activeOpacity={0.8}
                                style={commonStyle.BarTitle}>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontFamily: 'arial',
                                }}>Vineyard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={waiting}
                                style={commonStyle.BarRightIcon}
                                onPress={() => {
                                    this.setState({ waiting: true });
                                    this._toggle();
                                    this.toWait();
                                }}
                            >
                                <Image source={require('../../../../img/nearby/earch.png')}
                                    style={{
                                        tintColor: '#fff',
                                        width: 25,
                                        height: 25,
                                        alignSelf: 'flex-end',
                                    }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            disabled={waiting}
                            style={[commonStyle.searchBar, {}]} underlineColorAndroid='white'
                            onPress={() => {
                                this.setState({ waiting: true });
                                this.props.navigation.navigate('Drink2SearchScene'
                                    , {
                                        callback: (msg) => {
                                            this.setState({
                                                searchKey: msg,
                                                LocationSearchKey: null,
                                                VineyardList: [],
                                                // VineyardList: [{
                                                //     key: 'info.Vineyard_Id',
                                                //     id: 'info.Vineyard_Id',
                                                //     imageUrl: null,
                                                //     title: 'info.Vineyard_Id',
                                                //     subtitle: 'info.Vineyard_Id',
                                                //     phone: null,
                                                //     Latitude: 12,
                                                //     Longitude: 45,
                                                //     AdditionalLocationImages: null,
                                                //     firmId: 55,
                                                //     WineCount: 23,
                                                //     Country: 'United States'
                                                // }],
                                                // onSearch: true,
                                                // isLoading: false,
                                                // refreshState: RefreshState.NoMoreData,
                                            });
                                            this._clearData();
                                            this._resetPage();
                                            this._getVineyardByName(msg);
                                        },
                                        searchKey: searchKey
                                    });
                                this.toWait();
                            }}>
                            <Image source={LocalImage.searchIcon}
                                style={commonStyle.searchIcon} />
                            <Text
                                style={commonStyle.searchText}>{(searchKey === null || searchKey === '') ? 'What to' : searchKey} </Text>
                            {(searchKey === null || searchKey === '') ?
                                <Text style={commonStyle.searchText2}>search?</Text> : <Text />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={waiting}
                            style={commonStyle.searchBar} underlineColorAndroid='white'
                            onPress={() => {
                                this.setState({ waiting: true });
                                this.props.navigation.navigate('ExploreRangeScene'
                                    , {
                                        callbackLocation: (address, latitude, longitude, name, radius) => {
                                            this.setState({
                                                BeautyList: [],
                                                LocationSearchKey: address,
                                                searchKey: null,
                                                LatLng: {
                                                    latitude: latitude,
                                                    longitude: longitude
                                                },
                                                radius: radius
                                            }, () => {
                                                this.requestData()
                                            });
                                        },
                                        category: 'Vineyard',
                                        siteId: this.props.navigation.state.params.siteId,
                                    });
                                this.toWait();
                            }}
                        >
                            <Image source={LocalImage.locationIcon}
                                style={commonStyle.searchIcon} />
                            <Text
                                style={commonStyle.searchText}>{LocationSearchKey === null ? 'Select the' : LocationSearchKey} </Text>
                            {LocationSearchKey === null &&
                                <Text style={commonStyle.searchText2}>area</Text>}
                        </TouchableOpacity>
                    </View>
                    {!this.state.onSearch ? this.showNoSearchMsg() : this.renderVineyardList()}
                </LinearGradient>
            </SideMenu>
        );
    }
}

