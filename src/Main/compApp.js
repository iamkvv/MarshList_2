import '../App.css'
import React, { Component } from 'react'
import { Row, Col, Icon } from 'antd'
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import Measure from 'react-measure'

import ListsNotFound_Create from '../ListsNotFound/contListsNotFound'
import RouteList_CRUD from '../RouteList/contRouteList'
import TaskList from '../TaskList/taskList'
import BlockLoading from './blockLoading'

//
//По Yandex -- https://yandex.ru/dev/yandex-apps-launch/maps/doc/concepts/yandexmaps-web-docpage/#yandexmaps-web__search
//Это может сработать для маршрута  -- https://yandex.ru/maps/?whatshere[point]=61.3991244,55.1633244&whatshere[zoom]=17

const MainApp = (props) => {
    return (
        <ConfigProvider locale={ruRU}>
            <div className="App">
                {/** <h2>{props.psize}</h2>  */}
                {/**   {showListsError()}  */}
                <BlockLoading />

                <Row style={{ marginTop: 10 }} type="flex" justify="start" align="middle">
                    <Col span={18} offset={3}>
                        <ListsNotFound_Create />
                        {props.marshListFields &&
                            <RouteList_CRUD />}
                    </Col>
                </Row>
                <Row type="flex" justify="start" align="middle">
                    <Col span={18} offset={3}>
                        {props.taskListFields &&
                            <TaskList />
                        }
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    )
}

/*
class ControlResize extends Component {
    constructor(props) {
        super(props)
        this.state = { size: 0 }
        this.ResRef = React.createRef();

        // this.ONResize = this.ONResize.bind(this);
    }


    componentDidMount() {
        const el = this.ResRef.current;
        // let n = React.findDOMNode(el);
        // debugger;
        // el.addEventListener("resize", (event) => console.log(event.detail))

        el.onresize = (ev) => console.log("!!!", ev)

        window.addEventListener("resize", this.ONResize);

    }
    ONResize = (e) => {
        console.log(this.ResRef.current.scrollHeight, this.ResRef.current.clientHeight, this.ResRef.current);
        this.ResRef.current.onresize()
        //el.onresize();
        //console.log("onResize", e)
        //this.setState({ size: e.currentTarget.innerHeight })

        if (window.BX24) {
            console.log('FRAME', BX24.getScrollSize());
            // BX24.resizeWindow(contentRect.width, contentRect.height + 10)
            //???!!!    BX24.fitWindow()
            BX24.resizeWindow(BX24.getScrollSize().scrollWidth, this.ResRef.current.clientHeight)// contentRect.height + 50)
        }

    }
    render() {
        return (
            this.props.children(this.ResRef)//this.state.size)
        )
    }
}


class App extends Component {

    render() {
        return (
            <ControlResize>
                {(resRef) => (
                    <div ref={resRef}>
                        <MainApp  {...this.props} />
                    </div>
                )
                }
            </ControlResize>
        )
    }
}
*/



class App extends Component {
    //https://github.com/souporserious/react-measure
    //https://stackoverflow.com/questions/37775020/trigger-resize-event-on-component
    render() {
        return (
            <Measure
                bounds
                onResize={contentRect => {
                    if (window.BX24) {
                        console.log('FRAME', BX24.getScrollSize());
                        // BX24.resizeWindow(contentRect.width, contentRect.height + 10)
                        //???!!!    BX24.fitWindow()
                        //BX24.resizeWindow(contentRect.width, BX24.getScrollSize().scrollHeight + 50)// contentRect.height + 50)
                    }

                }}
            >

                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <MainApp {...this.props} />
                    </div>
                )}

            </Measure>
        )
    }
}

export default App