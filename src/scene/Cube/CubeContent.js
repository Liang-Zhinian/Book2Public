import React, {PureComponent} from 'react'
import CubeContentItem from "./CubeContentItem";

type Props = {
    menuInfos: Array<Object>,
    onMenuSelected: Function,
}

type State = {
    currentPage: number
}


class CubeContent extends PureComponent<Props, State> {


    constructor(props: Object) {
        super(props)

        this.state = {
            currentPage: 0
        }
    }

    render() {
        let {menuInfos, onMenuSelected} = this.props;
        let menuItems = menuInfos.map(
            (info, i) => (
                <CubeContentItem
                    ref={i}
                    key={i}
                    img={info.img}
                    tag={info.tag}
                    title={info.title}
                    onPress={() => {
                        onMenuSelected && onMenuSelected(info)
                    }}
                />
            )
        );

        console.log(menuItems);
        return menuItems
    }
}


export default CubeContent
