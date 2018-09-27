import React, {PureComponent} from 'react'
import {screen} from '../../common'
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import {Paragraph} from '../../widget/Text'
import {color} from '../../widget'

export default class Header extends PureComponent<Props, State> {

    static navigationOptions = ({navigation}: any) => ({})

    _onBackBtn(e) {
        this.props.nav.pop();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.cellfixed]}>
                    <TouchableOpacity style={styles.searchBar} onPress={() => {
                        //跳转到搜索页面
                        alert('一点点')
                    }}>

                    </TouchableOpacity>
                    <Image source={require('../../img/home/search_icon.png')} style={styles.searchIcon}/>
                    <Paragraph>一点点</Paragraph>
                </View>
                <View style={styles.cell}>
                    <Text style={[styles.title]}>{this.props.title}</Text>
                </View>
                <View style={[styles.cellfixed]}>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper
    },
    searchBar: {
        width: screen.width * 0.7,
        height: 30,
        borderRadius: 19,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    searchIcon: {
        width: 20,
        height: 20,
        margin: 5,
    }
})


