import React, {
  Component,
} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Platform,
    ViewPropTypes,
    TouchableWithoutFeedback, Animated, TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import {screen} from "../../common";
import Icon from "react-native-vector-icons/FontAwesome";
const Sound = require('react-native-sound');
const defaultForegroundColor = '#ababab';
const defaultForegroundWeight = '200';
const defaultItemWidth = 30;
const loggingEnabled = false;
// export const DURATION = {LENGTH_LONG: 2000, LENGTH_SHORT: 500};

const itemPropTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  style: Text.propTypes.style,
  foregroundColor: PropTypes.string,
    foregroundWeight: PropTypes.string,
};
const itemDefaultProps = {
    foregroundColor: defaultForegroundColor,
    foregroundWeight: defaultForegroundWeight,
};

function log(message, ...optionalParams) {
  if (loggingEnabled) {
    console.log(message, optionalParams);
  }
}

class HorizontalPickerItem extends Component {

  constructor(props) {
    super(props);
    this.state = intialState;
      Sound.setCategory('Ambient', true); // true = mixWithOthers
  }
}

const propTypes = {
    style: ViewPropTypes.style,
    selectedValue: PropTypes.any,
    selectedStyle: ViewPropTypes.style,
    children: PropTypes.array, // TODO: Make it HorizontalPicker.Item[]
    itemWidth: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    renderOverlay: PropTypes.func,
    foregroundColor: PropTypes.string,
    foregroundWeight: PropTypes.string,
    inactiveItemOpacity: PropTypes.number
};

const defaultProps = {
    foregroundColor: defaultForegroundColor,
    foregroundWeight: defaultForegroundWeight,
};
// const OPACITY=0.6;
const intialState = {
    selectedItem: null,
    bounds: null,
    padding: {left: 0, right: 0},
    scrollXIndex: 0,
    arrowColor:'#ababab',
    SelectLetterBGC:'#f4cad8',
    // opacityLeftValue:new Animated.Value(OPACITY),
    // opacityRightValue:new Animated.Value(OPACITY),
    // isShow: false,
};

class HorizontalPicker extends Component {

    constructor(props) {
        super(props);
        this.state = intialState;
        this.isScrolling = false;
        this.scrollX = -1;
        this.ignoreNextScroll = false;
        this.snapDelay = 200;

    }

    static Item = HorizontalPickerItem;

    componentWillReceiveProps(nextProps) {
        log('componentWillReceiveProps (isScrolling:', this.isScrolling, ')', this.props.selectedValue, '->', nextProps.selectedValue);
        const valueChanged = this.props.selectedValue !== nextProps.selectedValue;

        const index = this.getIndexForValue(nextProps.selectedValue, nextProps.children);
        const previousIndex = this.getIndexForValue(nextProps.selectedValue, this.props.children);
        const rangeChanged = index !== previousIndex;
        log('current index', index);
        log('previous index', previousIndex);

        log('x:', this.scrollX);
        log('current value:', nextProps.selectedValue);
        const visibleValue = this.getValueAt(this.scrollX);
        const visualsChanged = nextProps.selectedValue !== visibleValue;
        log('visible value:', visibleValue);

        log('valueChanged:', valueChanged);
        log('rangeChanged:', rangeChanged);
        log('visualsChanged:', visualsChanged);

        if (rangeChanged) {
            // The given children have changed
            log('rangeChanged -> resposition');
            if (Platform.OS === 'android') {
                // Android fix; For some reason it only scroll a small distance. Looks
                // pretty awful and needs a better solution, this is just to fix the
                // out-of-sync issue.
                setTimeout(() => {
                    this.scrollToIndex(index, false);
                }, 1);
            } else {
                this.scrollToIndex(index, false);
            }
        } else if (valueChanged) {
            log('valueChanged -> scroll');
            this.scrollToIndex(index, true);
        } else if (visualsChanged) {
            // Check if the current value is even possible.
            // If not, we don't know where to scroll, so ignore.
            const indexForSelectedValue = this.getIndexForValue(nextProps.selectedValue, nextProps.children);
            log('visualsChanged -> scroll');
            if (indexForSelectedValue !== -1) {
                this.scrollToIndex(indexForSelectedValue, true);
            }
        }
    }

    componentDidMount() {
        this.scrollToValue(this.props.selectedValue, false);
    }

    getItemWidth = () => this.props.itemWidth && this.props.itemWidth > 0
        ? this.props.itemWidth : defaultItemWidth;

    getComponentWidth = () =>
        this.state.bounds ? this.state.bounds.width : 0;

    getValueAt = (x) => {
        const child = this.getChildren()[this.getIndexAt(x)];
        return child ? child.props.value : null;
    };

    getIndexAt = (x) => {
        const dx = this.getComponentWidth() / 2 - this.state.padding.left;
        return Math.floor((x + dx) / this.getItemWidth());
    };

    getIndexForValue = (item, children = this.getChildren()) => {
        const index = children.findIndex(e => e.props.value === item);
        log('getIndexForValue, value:', item, 'index:', index);
        return index;
    };

    getChildren = (children = this.props.children) => React.Children.toArray(children);

    scrollToValue = (itemValue, animated = true) => {
        log('scrollToValue ->', itemValue);
        const index = this.getIndexForValue(itemValue);
        this.scrollToIndex(index, animated);
    };

    scrollToIndex = (index, animated = true, initial = false) => {
        log('scrollToIndex ->', index);

        if (index < 0) {
            // Error; invalid index.
            return;
        }

        this.isScrolling = true;

        const snapX = index * this.getItemWidth();
        // Make sure the component hasn't been unmounted
        if (this.refs.scrollview) {
            log('scroll ->', snapX);
            this.setState({
                // arrowColor:'#7c7c7c'
            });
            this.refs.scrollview.scrollTo({x: snapX, y: 0, animated});

            // iOS fix
            if (!initial && Platform.OS === 'ios') {
                log('ignoreNextScroll');
                this.ignoreNextScroll = true;
            }
        }
    };
    playSoundBundle = () => {
        const s = new Sound('frog.wav', Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error', e);
            } else {
                s.setSpeed(0);
                console.log('duration', s.getDuration());
                s.play(() => s.release()); // Release when it's done so we're not using up resources
            }
        });
    };
    scrollXTemp=0;
    onScroll = (event) => {
        // Sometimes onMomentumScrollBegin event seems to be missing and onMomentumScrollEnd
        // is sent twice. However, if we receive an onScroll after onMomentumScrollEnd, we
        // can assume that the momentum scroll is continued.
        this.isScrolling = true;
        this.scrollX = event.nativeEvent.contentOffset.x;
        this.scrollXTemp = this.scrollX;

        log('onScroll, x:', this.scrollX);
        // if ( this.scrollXTemp<this.scrollX) {
        //   console.log('opacityLeftValue')
        //     this.state.opacityLeftValue.setValue(0);
        // }else {
        //     console.log('opacityRightValue')
        //     this.state.opacityRightValue.setValue(0);
        // }
        // this.scrollXTemp=this.scrollX;

        let scrollXIndex = Math.round(this.scrollX / this.getItemWidth());

        let letter = this.props.children[scrollXIndex].props.label;
        // console.log('this.scrollX', this.scrollX, 'scrollXIndex*this.getItemWidth()', scrollXIndex * this.getItemWidth());
        if (Math.floor(this.scrollX) === scrollXIndex * this.getItemWidth()) {
            this.onChange(letter);
            // this.onScrollChange(letter)
            // this.playSoundBundle()
        }
        this.setState({
            scrollXIndex: scrollXIndex,
            // arrowColor:'#ead7e6'
        });
        // this.timer && clearTimeout(this.timer);
        // this.timer = setTimeout(() => {
        //     this.setState({
        //         arrowColor:'#7c7c7c'
        //     });
        // },100);
        // this.show();
        // this.state.opacityLeftValue.setValue(OPACITY);
        // this.close();
        this.cancelDelayedSnap();
    };

    arrowOnPressRight = () => {
        this.isScrolling = true;
        let scrollX = this.scrollXTemp / this.getItemWidth();
        let x = scrollX + 1;
        // let letter = this.props.children[x].props.label;
        // this.onChange(letter);
        this.scrollToIndex(x, true);
    };
    arrowOnPressLeft = () => {
        this.isScrolling = true;
        let scrollX = this.scrollXTemp / this.getItemWidth();
        let x = scrollX - 1;
        // let letter = this.props.children[x].props.label;
        // this.onChange(letter);
        this.scrollToIndex(x, true);
    };


    // show(duration) {
    //     if (duration >= DURATION.LENGTH_LONG) {
    //         this.duration = DURATION.LENGTH_LONG;
    //     } else {
    //         this.duration = DURATION.LENGTH_SHORT;
    //     }
    //     this.setState({
    //         isShow: true,
    //     });
    //     this.isShow = true;
    //     // this.state.opacityLeftValue.setValue(OPACITY);
    //     // this.state.opacityRightValue.setValue(OPACITY);
    //     this.closeLeft();
    //     this.closeRight();
    // }
    //
    // closeLeft() {
    //     if (!this.isShow) return;
    //     this.timer && clearTimeout(this.timer);
    //     this.timer = setTimeout(() => {
    //         Animated.timing(
    //             this.state.opacityLeftValue,
    //             {
    //                 toValue: 0.0,
    //                 duration: 1000,
    //             }
    //         ).start(() => {
    //             this.setState({
    //                 isShow: false,
    //             });
    //             this.isShow = false;
    //         });
    //     }, this.duration);
    // }
    // closeRight() {
    //     if (!this.isShow) return;
    //     this.timer && clearTimeout(this.timer);
    //     this.timer = setTimeout(() => {
    //         Animated.timing(
    //             this.state.opacityRightValue,
    //             {
    //                 toValue: 0.0,
    //                 duration: 1000,
    //             }
    //         ).start(() => {
    //             this.setState({
    //                 isShow: false,
    //             });
    //             this.isShow = false;
    //         });
    //     }, this.duration);
    // }

    componentWillUnmount() {
        // this.timer && clearTimeout(this.timer);
    }

    onScrollBeginDrag = (event) => {
        log('onScrollBeginDrag', this.scrollStart);
        this.isScrolling = true;
        this.scrollStart = event.nativeEvent.contentOffset.x;
        this.cancelDelayedSnap();
        this.ignoreNextScroll = false;
    };

    onScrollEndDrag = (/*event*/) => {
        log('onScrollEnd');
        this.isScrolling = false;
        if (this.ignoreNextScroll) {
            log('onScrollEnd, ignored');
            this.ignoreNextScroll = false;
            return;
        }
        this.delayedSnap();
    };

    onMomentumScrollBegin = (event) => {
        log('onMomentumScrollBegin', event.nativeEvent);
        this.isScrolling = true;
        this.cancelDelayedSnap();
    };

    onMomentumScrollEnd = (/*event*/) => {
        log('onMomentumScrollEnd');
        this.isScrolling = false;
        if (this.ignoreNextScroll) {
            log('onMomentumScrollEnd, ignored');
            this.ignoreNextScroll = false;
            return;
        }
        this.delayedSnap();
    };

    delayedSnap = () => {
        log('delayedSnap, cancelling previous...');
        this.cancelDelayedSnap();
        log('scheduling the snap');
        log('delayedSnap');
        this.snapNoMomentumTimeout =
            setTimeout(() => {
                const index = this.getIndexAt(this.scrollX);
                const item = this.getChildren()[index];
                log('doing the snap ->', item.props.value);
                this.onChange(item.props.value);
                this.scrollToIndex(index);
            }, this.snapDelay);
    };

    cancelDelayedSnap = () => {
        if (this.snapNoMomentumTimeout) {
            log('cancelled the delayed snap');
            log('cancelDelayedSnap');
            // this.setState({
            //     arrowColor:'#ababab'
            // });
            clearTimeout(this.snapNoMomentumTimeout);
            this.snapNoMomentumTimeout = null;
        }

    };

    onChange = (itemValue) => {
        this.setState({
            SelectLetterBGC:'#f4cad8'
        });
        log('onChange', itemValue);
        if (this.props.onChange) {
            this.props.onChange(itemValue);
        }

    };
    onScrollChange=(itemValue)=>{
        if (this.props.onScrollChange) {
            this.props.onScrollChange(itemValue);
        }
    };

    handleItemPress = (value) => {
        return () => {
            if (value && this.props.onChange) {
                this.props.onChange(value);
            }
        };
    };

    renderChildren = (children) => {
        return children.map(this.renderChild);
    };

  renderChild = (child) => {
      const itemValue = child.props.value;
      //this.getChoseTintColor(LeftTitle)
      const color = this.getChoseColor(itemValue);
      const fontWeight = this.getChoseWeight(itemValue);
      const opacity = this.props.inactiveItemOpacity && itemValue !== this.props.selectedValue ? this.props.inactiveItemOpacity : 1;
      return (
          <TouchableWithoutFeedback key={itemValue} onPress={this.handleItemPress(itemValue)}>
              <View style={[styles.itemContainer, {width: this.getItemWidth()}]}>
                  <Text style={[styles.itemText, child.props.style, {
                      color,
                      fontWeight,
                      opacity
                  }]}>{child.props.label}</Text>
              </View>
          </TouchableWithoutFeedback>
      );
  };
    getChoseColor(itemValue){
        return this.props.selectedValue===itemValue?this.props.foregroundColor:defaultForegroundColor
    }
    getChoseWeight(itemValue){
        return this.props.selectedValue===itemValue?this.props.foregroundWeight:defaultForegroundWeight
    }
  onLayout = (event) => {
    log('onLayout');
    const {nativeEvent: {layout: {x, y, width, height}}} = event;
    const bounds = {width, height};
    const leftItemWidth = this.getItemWidth();
    const rightItemWidth = this.getItemWidth();
    const padding = {
      left: !bounds ? 0 : ((bounds.width - leftItemWidth) / 2),
      right: !bounds ? 0 : ((bounds.width - rightItemWidth) / 2)
    };

    this.setState({
      bounds,
      padding
    });

    const index = this.getIndexForValue(this.props.selectedValue);
    log('onLayout -> scrollToIndex');
    this.scrollToIndex(index, false);
  };


    renderDefaultOverlay = () => {
        const color = this.props.foregroundColor;
        return (
            <View style={{flex: 1}}/>
        );
    };
    letterTemp = null;

    _onSelectLetter() {
        this.props.onSelectLetter();
        this.setState({
            SelectLetterBGC: '#a5b2ff'
        })
    }

    render() {
      let letter = this.props.children[this.state.scrollXIndex].props.label;
      if (this.letterTemp !== letter && this.letterTemp !== null) {
          // this.onChange(letter);
          // this.playSoundBundle();
      }
      this.letterTemp = letter;
      const bounds = this.state.bounds;
      const renderOverlay = this.props.renderOverlay || this.renderDefaultOverlay;
      return (
          <View style={[this.props.style,{alignItems:'center'}]}>
              <ScrollView
                  ref='scrollview'
                  decelerationRate={'fast'}
                  scrollEventThrottle={16}
                  contentContainerStyle={{paddingLeft: this.state.padding.left, paddingRight: this.state.padding.right}}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  onScroll={this.onScroll}
                  onScrollBeginDrag={this.onScrollBeginDrag}
                  onScrollEndDrag={this.onScrollEndDrag}
                  onMomentumScrollBegin={this.onMomentumScrollBegin}
                  onMomentumScrollEnd={this.onMomentumScrollEnd}
                  onLayout={this.onLayout}
                  style={[this.scrollView, {
                      paddingTop:12,
                      paddingBottom:12,
                      width: screen.width * 0.85,
                      marginLeft: screen.width * 0.05,
                      marginRight: screen.width * 0.05,
                  }]}>
                  <View style={styles.contentContainer}>
                      {bounds && this.renderChildren(this.props.children)}
                  </View>
              </ScrollView>
              <View style={styles.overlay} pointerEvents='none'>
                  <View style={[{flex: 1, width: this.getItemWidth()}]}>
                      {renderOverlay()}
                  </View>
              </View>
              <View style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: screen.width,
                  alignItems: 'center',
                  justifyContent: 'center'
              }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                          activeOpacity={0.8}
                          style={{
                              backgroundColor: this.state.SelectLetterBGC,
                              // borderLeft: 1,
                              // borderRight: 1,
                              // borderColor: '#fff',
                              padding:5,
                              margin:15,
                              width: 30,
                              height: 30,
                              borderRadius: 40,
                              alignItems: 'center',
                          }}
                          onPress={() => {
                              this._onSelectLetter();
                          }}
                      />
                  </View>
              </View>
              <View style={{
                  position: 'absolute',
                  justifyContent: 'space-between',
                  top: 0,
                  bottom: 0,
                  alignItems: 'center',
                  width: screen.width,
                  flexDirection: 'row'
              }}>
                  <Icon
                      name='caret-left'
                      size={20}
                      color={this.state.arrowColor}
                      onPress={() => {
                          this.arrowOnPressLeft()
                      }}
                      style={{
                          paddingLeft: screen.width * 0.03,
                      }}
                  />
                  <Icon
                      name='caret-right'
                      size={20}
                      color={this.state.arrowColor}
                      onPress={() => {
                          this.arrowOnPressRight()
                      }}
                      style={{paddingRight: screen.width * 0.03,}}
                  />
              </View>
              <View
                  style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: screen.width,
                      alignItems: 'center',
                      justifyContent: 'center'
                  }}
                  // onPress={() => {
                  //     this._onSelectLetter();
                  // }}
              >
                  <TouchableOpacity
                      onPress={() => {
                          this._onSelectLetter();
                      }}
                      >
                  <Text style={{fontSize: 17, color: '#313131'}}>
                      {letter}
                  </Text>
                  </TouchableOpacity>
              </View>

          </View>
      );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1
  },
  touchArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
    scrollView: {
        flex: 1,
        zIndex: 999,

    },
  contentContainer: {
    flexDirection: 'row'
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'yellow'
  },
  itemText: {
    fontSize: 17,
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center'
  }
});

HorizontalPickerItem.propTypes = itemPropTypes;
HorizontalPickerItem.defaultProps = itemDefaultProps;

HorizontalPicker.propTypes = propTypes;
HorizontalPicker.defaultProps = defaultProps;

export default HorizontalPicker;
