import React from 'react';
import {BVLinearGradient, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {screen} from '../../common/index'
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs'
import Button from "../../widget/Button";

export default class SettingScene extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props: Props) {
        super(props);

        this.state = {
            LeftWidth:screen.width*0.95/2,
            sliderWidth:20,
        };

        this.count = 0;
    }

    fun01() {
        let result = null;
        let path = RNFS.DocumentDirectoryPath + '/scheduleItem.json';

        RNFS.readFile(path, 'utf8')
            .then((res) => {
                console.log(res);
                alert('success')
                // this.fun03(res)
            })
            .catch((error) => {
                console.warn(error)
            });

    }

    fun03(){
        let path = RNFS.DocumentDirectoryPath + '/scheduleItem.json';
        RNFS.writeFile(path, '', 'utf8')
            .then((success) => {
                alert('success')
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    fun02(){

        RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then((result) => {
                // console.log('GOT RESULT', result);
              // console.log(RNFS.readFile(result[1].path, 'utf8'))  ;
                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((result) => {
                // console.log('statResult',result)
                if (result[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(result[0], 'utf8');
                }

                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                // console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                <View style={{
                    // position: 'absolute',
                    // top: screen.statusBarHeight,
                    // zIndex: 10,
                    alignItems: 'center',
                    justifyContent:'space-between',
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
                    <Text style={{color:'#fff'}}>FAQ</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <View  style={[styles.callbackIcon, {}]}/>
                    </TouchableOpacity>
                </View>
                {/*<Button title={'测试写入'} onPress={()=>{this.fun01()}}/>*/}
                <Button title={'测试读取'} titleStyle={{color:'#fff',backgroundColor:'#407dff',borderRadius:50,padding:5}} style={{margin:5,}} onPress={()=>{this.fun01()}}/>
                <Button title={'测试清除'} titleStyle={{color:'#fff',backgroundColor:'#407dff',borderRadius:50,padding:5}} style={{margin:5,}} onPress={()=>{this.fun03()}}/>

            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6697ff',
    },
    linearGradient: {
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
});