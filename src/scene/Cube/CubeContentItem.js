import React, {PureComponent} from 'react'
import {StyleSheet, ImageBackground, View, Text, TouchableHighlight} from 'react-native'
import {screen} from '../../common/index'

type
Props = {
    onPress: Function,
    img: any,
    title: string,
    tag: string,
    prompt: string,
}

class CubeContentItem extends PureComponent<Props> {
    render() {
        return (
            //,width:screen.width*0.8,height:screen.width*0.8
            <TouchableHighlight activeOpacity={0.9} underlayColor={'#d6d6d6'} style={styles.surface}
                                onPress={this.props.onPress}>
                <ImageBackground source={this.props.img}
                                 style={[styles.pageImg, {
                                     flexDirection: 'column',
                                     justifyContent: 'center',
                                     alignSelf: 'center',
                                     alignItems: 'center'
                                 }]}>
                    {this.props.sign ? <View style={{
                        flexDirection: 'column',
                        backgroundColor: '#24242451',
                        padding: 5,
                        width: screen.width,
                        height: screen.width / 3
                    }}>
                        {/*<Text style={{fontSize: 17,color: '#fff',fontFamily: 'arial'}}>{this.props.tag}</Text>*/}
                        {/*<Text style={{fontSize: 40,color: '#fff',fontFamily: 'arial'}}>{this.props.title}</Text>*/}
                        {/*<Text style={{fontSize: 17,color: '#fff',fontFamily: 'arial'}}>{this.props.prompt}</Text>*/}
                    </View> : <View/>}

                </ImageBackground>
            </TouchableHighlight>
        );
    }
}


const styles = StyleSheet.create({

    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    searchBar: {
        width: screen.width * 0.98,
        height: 45,
        borderBottomWidth: 0.3,
        borderBottomColor: 'white',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 30,
        height: 30,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    linearGradientStyle: {
        flex: 1,
        backgroundColor: '#202020',
        width: screen.width,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    cubeStyle: {
        width: screen.width,
        height: screen.width,
        backgroundColor: '#E7EAE3',
    },
    pageImg: {
        width: screen.width,
        height: screen.width,
        // resizeMode: 'contain',// 设置图片填充模式
        borderRadius: 5,
        flexDirection: 'row',
        // backgroundColor: '#889DAD',
    },
    surface: {
        width: screen.width,
        height: screen.width,
        justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#282828a3',
        backgroundColor: '#ffffff',
        flex: 1,
    },
    tabViewStyle: {
        flexDirection: 'row',
    },
    tabTextInfoStyle: {
        width: screen.width * 0.3,
        height: 50,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#ffffff65',
    },
    tabTextStyle: {
        height: 50,
        fontSize: 14,
        fontFamily: 'arial',
        color: '#ffffff',
        textAlignVertical: 'center',
    },
});


export default CubeContentItem;
