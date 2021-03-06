import React, {Component} from 'react'
import {Dimensions, ListView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {screen} from '../../common';
import md5 from '../Common/react-native-md5'
import Toast from '../../../src/scene/demo&test/react-native-city/ToastUtil'

export default class LogOutScene extends Component {

    constructor(props: Props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataList:null,
            SignToken:null,
            timestamp:new Date().getTime(),
            nonce:Math.floor(Math.random() * 10000000000),

            dataSource: ds.cloneWithRows(
                [
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '},
                    {title: 'row1',area:'abcdefg hello good good '},
                    {title: 'row2',area:'abcdefg hello good good '}
                ]),
            letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }

    }


    componentWillMount() {
        fetch('http://demo.atpath.com:17509/api/Service/GetToken?appid=123456789&appsecret=123456789', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'timestamp': this.state.timestamp,
                'appid': '123456789',
                'nonce':  this.state.nonce
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({SignToken:responseJson.Data.SignToken});
            })
            .catch((error) => {
                console.warn('请求错误',error);
            });
    }


     stringToBytes(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for(var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if(c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }

    //  byteToString(arr) {
    //     if(typeof arr === 'string') {
    //         return arr;
    //     }
    //     var str = '',
    //         _arr = arr;
    //     for(var i = 0; i < _arr.length; i++) {
    //         var one = _arr[i].toString(2),
    //             v = one.match(/^1+?(?=0)/);
    //         if(v && one.length == 8) {
    //             var bytesLength = v[0].length;
    //             var store = _arr[i].toString(2).slice(7 - bytesLength);
    //             for(var st = 1; st < bytesLength; st++) {
    //                 store += _arr[st + i].toString(2).slice(2);
    //             }
    //             str += String.fromCharCode(parseInt(store, 2));
    //             i += bytesLength - 1;
    //         } else {
    //             str += String.fromCharCode(_arr[i]);
    //         }
    //     }
    //     return str;
    // }

    GetAppellation(){
        let timeStamp = this.state.timestamp,
            nonce =this.state.nonce,
            appid = '123456789',
            SignToken = this.state.SignToken,
            data = 'id=1';

        let signStr = timeStamp.toString() +nonce.toString()+ appid + SignToken + data;
        let signStrMD5 = md5.hex_md5(signStr);
        // let strByte=this.stringToBytes(signStr);
        // console.log(signStr);
        // console.log(signStrMD5);
        //1534831887010177366844012345678940b8cd00-d4c9-4e67-87b4-7d816c99f1aeid1namewahaha

        // console.log(signStr,timeStamp);

        fetch('http://demo.atpath.com:17509/api/Region/GetRegion?type=country', {
            method: 'GET',
            data:{type:'country'},
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            })
            .catch((error) => {
                console.warn('请求错误',error);
            });
    }

     hexCharCodeToStr(hexCharCodeStr) {
        var trimedStr = hexCharCodeStr.trim();
        var rawStr =
            trimedStr.substr(0,2).toLowerCase() === "0x"
                ?
                trimedStr.substr(2)
                :
                trimedStr;
        var len = rawStr.length;
        if(len % 2 !== 0) {
            alert("Illegal Format ASCII Code!");
            return "";
        }
        var curCharCode;
        var resultStr = [];
        for(var i = 0; i < len;i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
            resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
    }



    componentDidMount(){


    }
    //                 <Button title={'测试获取数据'}
    //                         titleStyle={{color: '#fff', backgroundColor: '#407dff', borderRadius: 50, padding: 5}}
    //                         style={{margin: 5,}} onPress={() => {
    //                     this.GetAppellation()
    //                 }}/>
    //                 <Button title={'测试获取数据2'}
    //                         titleStyle={{color: '#fff', backgroundColor: '#407dff', borderRadius: 50, padding: 5}}
    //                         style={{margin: 5,}} onPress={() => {
    //                     this.stringToBytes('abc')
    //                 }}/>
    _renderRow(rowData, sectionID, rowID, highlightRow){
        return (
            <TouchableOpacity style={styles.rowView} onPress={() => {
                that._cityNameClick(cityJson)
            }}>
                <View style={styles.rowdata}>
                    <Text style={styles.rowdatatext}>{rowData.title}</Text>
                    <Text style={styles.rowdatatext}>{rowData.area}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View style={{height:1,backgroundColor:'black'}}>

            </View>
        )
    }
    _renderHeader(){
        return (
            <View style={[{height:30}, {backgroundColor:'red'},{justifyContent: 'center'}]}>
                <Text style={[{textAlign: 'center'}]}>头部视图</Text>
            </View>
        );
    }
    _renderRightLetters(letter, index) {
        return (
            <TouchableOpacity key={'letter_idx_' + index} activeOpacity={0.6} onPress={() => {
                // this._scrollTo(index, letter)
            }}>
                <View style={styles.letter}>
                    <Text style={styles.letterText}>{letter}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.listContainner}>
                    <ListView style={{marginTop: 20, width: screen.width, height: screen.height}}
                              dataSource={this.state.dataSource}
                              renderRow={this._renderRow.bind(this)}
                              renderSeparator={this._renderSeparator.bind(this)}
                              // renderHeader={this._renderHeader.bind(this)}
                    />
                    <View style={styles.letters}>
                        {this.state.letters.map((letter, index) => this._renderRightLetters(letter, index))}
                    </View>
                </View>
                <Toast ref="toast" position='top' positionValue={200} fadeInDuration={750} fadeOutDuration={1000}
                       opacity={0.8}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: 50,
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
    letters: {
        position: 'absolute',
        height: screen.height,
        top: 0,
        bottom: 0,
        right: 10,
        backgroundColor: 'transparent',
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start'
        alignItems: 'center',
        justifyContent: 'center'
    },
    letter: {
        // height: screen.height  / 25,
        // width: screen.width  / 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    letterText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#e75404',
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
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
        borderBottomColor: '#f4519b',
        borderBottomWidth: 0.5
    },
    rowdata: {
        paddingTop: 10,
        paddingBottom: 2
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
    }
});