import React, {
    Component,
} from 'react'
import {
    View,
    StyleSheet,
    Alert,
    Text, Image, TouchableOpacity
} from 'react-native'
import {screen} from '../../common';

import Barcode from 'react-native-smart-barcode'
import {commonStyle} from "../../widget/commonStyle";
import {getWineByQRCode} from "../../api";
import DrinkDetailDataUtils from "../Explore/Drink/DrinkDetailDataUtils";
import {RefreshState} from "react-native-refresh-list-view";
import QRDetailScene from "../Explore/Drink/QRDetailScene";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import LocalImage from "../../widget/LocalImage";

export default  class PrintInteractionScreen extends Component {
    static navigationOptions = ({navigation}: any) => ({
        headerMode: 'screen',
        headerTitle: 'QR Code',
        headerTitleStyle:{alignSelf:'center'},
        headerLeft:(
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    navigation.goBack();//返回按钮图片
                }}
            >
                {/*<Image source={LocalImage.goBackIcon}*/}
                       {/*style={[commonStyle.searchIcon, {}]}/>*/}
                <Icon name={'arrow-left'} size={15} color={'#fff'}
                      style={[{padding:10}]}/>
            </TouchableOpacity>
        ),
        headerTintColor:'#fff',
        headerStyle:{backgroundColor:'#1b1b1b',paddingTop:screen.statusBarHeight,paddingBottom:10,height:65}
    });
    // static navigationOptions = {
    //     header: {
    //         visible: true
    //     }
    // };


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            viewAppear: false,
            data:{},
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示

        };
    }

    // showData() {
    //     return (
    //         <Modal
    //             animationType={this.state.animationType}
    //             transparent={this.state.transparent}
    //             visible={this.state.modalVisible}
    //             onRequestClose={() => {
    //                 this._setModalVisible(false)
    //             }}
    //             // onShow={this.startShow}
    //         >
    //         </Modal>
    //     )
    // }

    // _setModalVisible = (visible) => {
    //     this.setState({modalVisible: visible});
    // };

    render() {
        return (
                <Barcode style={{flex: 1,}}
                         ref={component => this._barCode = component}
                         onBarCodeRead={this._onBarCodeRead}/>
        )
    }

    componentDidMount() {

            // this.props.navigation.navigate('QRDetailScene', {
            //     data:  [{
            //             key: 123,
            //             id: 123,
            //             imageUrl: null,
            //             title: 'info.WineName',
            //             AdditionalLocationImages: null,
            //             firmId: 2,
            //             Appellation:3,
            //             Colour:'red',
            //             ProducerId:33,
            //             Country:'Spain'
            //         }],
            //     restartScan: () => {
            //         this._startScan();
            //     }
            // });//跳到扫码页面
        // let viewAppearCallBack = (event) => {
        //     this.setTimeout( () => {
        //         this.setState({
        //             viewAppear: true,
        //         })
        //     }, 255)
        //
        // }
        // this._listeners = [
        //     this.props.navigator.navigationContext.addListener('didfocus', viewAppearCallBack)
        // ]

    }

    componentWillUnmount () {
        // this._listeners && this._listeners.forEach(listener => listener.remove());
    }

    _onBarCodeRead = (e) => {
        // console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`,e.nativeEvent)

        // alert(type);
        this._getDataByCode(e.nativeEvent.data.code)
        // alert( e.nativeEvent.data.code);
        this._stopScan();
        // Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
        //     {text: 'OK', onPress: () => this._startScan()},
        // ])
    };

    _startScan = (e) => {
        this._barCode.startScan()
    };

    _stopScan = (e) => {
        this._barCode.stopScan()
    };


    _getDataByCode = async (code) => {
        let {type} = this.props.navigation.state.params;
        await getWineByQRCode(code)
            .then((msg) => {
                this.setState({
                    data: msg,
                });
                let formatData = DrinkDetailDataUtils.requestWineData(msg);
                this.props.navigation.navigate('QRDetailScene', {
                    data: formatData,
                    restartScan: () => {
                        this._startScan();
                    }
                });//跳到扫码页面

            })
            .catch(() => {

            });
    };

}
