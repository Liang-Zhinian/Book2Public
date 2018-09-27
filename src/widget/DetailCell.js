

import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity, ViewPropTypes} from 'react-native'
import {Heading2, Heading3, Paragraph} from './Text'
import Separator from './Separator'
import {screen, system} from '../common'
import I18n, {getLanguages} from "react-native-i18n";
import en from  '../scene/demo&test/react-native-i18n_example/translations/en'
import es from  '../scene/demo&test/react-native-i18n_example/translations/es'
import fr from  '../scene/demo&test/react-native-i18n_example/translations/fr'
import frCA from  '../scene/demo&test/react-native-i18n_example/translations/fr-CA'
import cn from  '../scene/demo&test/react-native-i18n_example/translations/cn'

type Props = {
    image?: any,
    style?: ViewPropTypes.style,
    title: string,
    subtitle?: string,
}
I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr':fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN':cn,
};
class DetailCell extends PureComponent<Props> {
    state = { languages: [] };
    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({ languages });
        });
    }
    render() {
        let icon = this.props.image && <Image style={styles.icon} source={this.props.image} />
        let {info} = this.props
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.props.onPress(info)}
                >
                    <View style={[styles.content, this.props.style]}>
                        {icon}
                        <Heading3  style={{color: '#555555'}}>{I18n.t(info.title)}</Heading3>
                        <View style={{flex: 1, backgroundColor: 'blue'}} />
                        <Paragraph style={{color: '#999999'}}>{info.subtitle}</Paragraph>
                        <Image style={styles.arrow} source={require('../img/public/right_arrow.png')} />
                    </View>
                    <Separator />
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    content: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    arrow: {
        width: 16,
        height: 16,
        marginLeft: 5,
        tintColor:'#5a5a5a'
    }
})


export default DetailCell
