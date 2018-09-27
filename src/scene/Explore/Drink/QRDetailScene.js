import React, {Component} from 'react'
import {BackHandler, BVLinearGradient, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {screen} from '../../../common';
import {commonStyle} from "../../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";
import {Heading2} from "../../../widget/Text";
import {color} from "../../../widget";
import Panel from "../../Common/Panel";

export default class QRDetailScene extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props: Props) {
        super(props);
        this.state = {
            data:{}
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

    renderContent() {
        let {data} = this.props.navigation.state.params;
        let item = data[Math.floor(Math.random()*100)];
        let contentView = data.length > 0
            ? <View>
                <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={() => {
                    this.props.navigation.navigate('QRWineDetail', {info: item})
                }}>
                    <View style={{flexDirection: 'column',}}>
                        {(item.imageUrl !== null && item.imageUrl !== 'null') ?
                            <Image source={{uri: item.imageUrl}} style={styles.icon}/>
                            : <Image source={require('../../../img/public/timg.jpg')} style={styles.icon}/>}
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