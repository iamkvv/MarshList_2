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

//import Test from './test'
//import ReactDOMServer from 'react-dom/server'

//
//По Yandex -- https://yandex.ru/dev/yandex-apps-launch/maps/doc/concepts/yandexmaps-web-docpage/#yandexmaps-web__search
//Это может сработать для маршрута  -- https://yandex.ru/maps/?whatshere[point]=61.3991244,55.1633244&whatshere[zoom]=17


//class MainApp extends Component {

const MainApp = (props) => {

    // // render() {
    // const { listsError, marshList, taskList, creatingLists, createLists } = props// this.props;
    // const showListsError = () => (
    //     listsError && <p>При обращении к Универсальным Спискам произошла ошибка: {listsError}</p>
    // );

    return (
        <ConfigProvider locale={ruRU}>
            <div className="App">
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
//}


class App extends Component {
    // state = {
    //     dimensions: {
    //         width: -1,
    //         height: -1,
    //     },
    // }
    render() {
        return (
            <Measure
                bounds
                onResize={contentRect => {
                    if (window.BX24) {
                        console.log('FRAME', BX24.getScrollSize());
                        // BX24.resizeWindow(contentRect.width, contentRect.height + 10)
                        //ОК!!  BX24.fitWindow()
                        BX24.resizeWindow(contentRect.width, contentRect.height + 50)
                    }
                    console.log("Measure!! ", contentRect)
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