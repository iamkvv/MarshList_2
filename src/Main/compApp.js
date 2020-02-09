import '../App.css'
import React, { Component } from 'react'
import { Row, Col, Icon } from 'antd'
import { LocaleProvider, ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';

import ListsNotFound_Create from '../ListsNotFound/contListsNotFound'
import RouteList_CRUD from '../RouteList/contRouteList'
import TaskList from '../TaskList/taskList'

import Test from './test'
//import ReactDOMServer from 'react-dom/server'

const BlockLoading = () => {
    return (
        <div style={{
            position: 'absolute',
            backgroundColor: 'white',
            opacity: 0.4,
            zIndex: 10000,
            width: '100%',
            height: '100%',
            display: 'none'

        }}>
            <Icon style={{
                position: 'absolute',
                width: 100,
                height: 100,
                fontSize: '50px',
                color: '1890ff',
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)'
            }} type="loading" />
        </div>
    )
}
//
//По Yandex -- https://yandex.ru/dev/yandex-apps-launch/maps/doc/concepts/yandexmaps-web-docpage/#yandexmaps-web__search
//Это может сработать для маршрута  -- https://yandex.ru/maps/?whatshere[point]=61.3991244,55.1633244&whatshere[zoom]=17


class App extends Component {
    componentWillMount() {
        //this.props.checkAuth();
    }
    onClick = () => {
        //      const html = ReactDOMServer.renderToString(<Test data={[1, 2, 3]} />)
        debugger
    }


    render() {
        const { listsError, marshList, taskList, creatingLists, createLists } = this.props;

        // const showLoading = () => (
        //     creatingLists && <Icon type="loading" />
        // );

        const showListsError = () => (
            listsError && <p>При обращении к Универсальным Спискам произошла ошибка: {listsError}</p>
        );

        console.log("props MainApp", this.props)

        return (
            <ConfigProvider locale={ruRU}>
                <div className="App">

                    {showListsError()
                    }

                    <BlockLoading />

                    <Row style={{ marginTop: 10 }} type="flex" justify="start" align="middle">
                        <Col span={18} offset={3}>
                            <ListsNotFound_Create />
                            {this.props.marshListFields &&
                                <RouteList_CRUD />}
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" align="middle">
                        <Col span={18} offset={3}>
                            {this.props.taskListFields &&
                                <TaskList />
                            }
                        </Col>
                    </Row>


                </div>
            </ConfigProvider>
        )
    }
}

export default App