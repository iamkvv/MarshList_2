import React, { Component } from 'react'
import { YMaps, Map } from 'react-yandex-maps';
import { Modal, Button, message } from 'antd';
import { connect } from 'react-redux'
import ReactDOMServer from 'react-dom/server'
import PrintMarshList from './printMarshList'

const BProp = (metaTsk, title) => {//Возврашает PROPERTY_n по русс. имени поля
    for (let fld of Object.keys(metaTsk)) {
        if (metaTsk[fld].NAME === title) return fld
    }
}

const updateMarshList = (authData, params) => {
    return { type: "UPDATE_MARSHLIST", auth: authData, params: params }
}

const DtoP = (dispatch) => {
    return {
        getCompanies: (a) => dispatch(getCompanies(a)),
        updateMarshList: (a, p) => dispatch(updateMarshList(a, p))
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        taskListFields: state.taskListFields, //метаданные полей 
        marshListFields: state.marshListFields,
        taskListData: state.taskListData, //все задания,
        companies: state.companies,
        selectedMarshList: state.selectedMarshList,
        tasksByML: state.taskListData ?
            state.taskListData.filter(tsk => (tsk[BProp(state.taskListFields, "Внешний ключ")] == state.selectedMarshList.ID))
            : false
    }
}

class Yandex_Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanse: 0,
            taskList: []
        }
    }

    mapInstance = null;
    ymapi = null;

    onLoadMap = (apiobj) => {
        this.ymapi = apiobj;
    }

    BProp = (metaTsk, title) => {//Возврашает PROPERTY_n по русс. имени поля
        for (let fld of Object.keys(metaTsk)) {
            if (metaTsk[fld].NAME === title) return fld
        }
    }

    createRoute = () => {
        const { tasksByML } = this.props;

        var RouteAddrs = [];

        for (var i = 0; i < tasksByML.length; i++) {
            if (i == 0) {
                //  RouteAddrs.push(tasksByRouteList[i].ADDRESS)
                RouteAddrs.push(tasksByML[i][BProp(this.props.taskListFields, "Адрес")])
            }
            if (i > 0 & i < tasksByML.length - 1) {
                RouteAddrs.push(Object.assign({}, { point: tasksByML[i][BProp(this.props.taskListFields, "Адрес")], type: 'viaPoint' }))
            }
            if (i == tasksByML.length - 1) {
                RouteAddrs.push(tasksByML[i][BProp(this.props.taskListFields, "Адрес")])
            }
        }

        //console.log("arrRoute", RouteAddrs)
        let self = this;
        this.ymapi.route(
            RouteAddrs
        ).then(function (route) {
            self.mapInstance.geoObjects.removeAll()
            self.mapInstance.geoObjects.add(route);

            var points = route.getWayPoints(),
                lastPoint = points.getLength() - 1;
            // Задаем стиль метки - иконки будут красного цвета, и
            // их изображения будут растягиваться под контент.
            points.options.set('preset', 'islands#redStretchyIcon');
            // Задаем контент меток в начальной и конечной точках.
            points.get(0).properties.set('iconContent', 'старт: ' + points.get(0).properties.get("name"));
            points.get(lastPoint).properties.set('iconContent', 'финиш: ' + points.get(lastPoint).properties.get("name"));
            // debugger;
            var moveList = 'Трогаемся,</br>',
                way, segments;
            var meters = 0;
            // Получаем массив путей.
            for (var i = 0; i < route.getPaths().getLength(); i++) {
                way = route.getPaths().get(i);
                segments = way.getSegments();
                for (var j = 0; j < segments.length; j++) {
                    var street = segments[j].getStreet();
                    meters += segments[j].getLength();
                    moveList += ('Едем ' + segments[j].getHumanAction() + (street ? ' на ' + street : '') + ', проезжаем ' + segments[j].getLength() + ' м.,');
                    moveList += '</br>'
                }
            }
            moveList += 'Останавливаемся.';

            //массив заданий для вывода под картой
            //  let tasks = tasksByRouteList.map(tsk => ({ Company: tsk.COMPANY, Tel: tsk.TEL, Address: tsk.ADDRESS, Task: tsk.TASK }))

            // console.log("PrintTasks!!", tasks);

            // self.setState({ taskList: tasks });
            // Выводим маршрутный лист.
            // $('#list').append(moveList);
            // $('#meters').append(meters/1000);
            //alert("Длина маршрута " + Math.round(meters / 1000) + " км")

            //(elementid,iblockid, name, user_id, fio, date, comment,path)

            self.setState({ distanse: Math.round(meters / 1000) })

            /*
            //Обновить расстояние марш.листа
            const { selectedMarshList, marshListFields } = self.props;

            let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&ELEMENT_ID=" + selectedMarshList.ID + "&" +
                "fields[" + self.BProp(marshListFields, "Название") + "]" + "=МЛ" + "&" +
                "fields[" + self.BProp(marshListFields, "Исполнитель") + "]" + "=" + selectedMarshList[self.BProp(marshListFields, "Исполнитель")] + "&" +
                "fields[" + self.BProp(marshListFields, "ID Исполнителя") + "]" + "=" + selectedMarshList[self.BProp(marshListFields, "ID Исполнителя")] + "&" +
                "fields[" + self.BProp(marshListFields, "Дата") + "]" + "=" + selectedMarshList[self.BProp(marshListFields, "Дата")] + "&" +
                "fields[" + self.BProp(marshListFields, "Комментарий") + "]" + "=" + selectedMarshList[self.BProp(marshListFields, "Комментарий")] + "&" +
                "fields[" + self.BProp(marshListFields, "Расстояние") + "]" + "=" + Math.round(meters / 1000) //+ " км"

            self.props.updateMarshList(self.props.auth, params);

            message.info(`Длина маршрута : ${Math.round(meters / 1000)} км`);
            //???  self.props.manageYandexRoute_Visible();
            */
        })
    }

    saveDistanse = () => {
        //Обновить расстояние марш.листа
        const { selectedMarshList, marshListFields } = this.props;

        let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&ELEMENT_ID=" + selectedMarshList.ID + "&" +
            "fields[" + this.BProp(marshListFields, "Название") + "]" + "=МЛ" + "&" +
            "fields[" + this.BProp(marshListFields, "Исполнитель") + "]" + "=" + selectedMarshList[this.BProp(marshListFields, "Исполнитель")] + "&" +
            "fields[" + this.BProp(marshListFields, "ID Исполнителя") + "]" + "=" + selectedMarshList[this.BProp(marshListFields, "ID Исполнителя")] + "&" +
            "fields[" + this.BProp(marshListFields, "Дата") + "]" + "=" + selectedMarshList[this.BProp(marshListFields, "Дата")] + "&" +
            "fields[" + this.BProp(marshListFields, "Комментарий") + "]" + "=" + selectedMarshList[this.BProp(marshListFields, "Комментарий")] + "&" +
            "fields[" + this.BProp(marshListFields, "Расстояние") + "]" + "=" + this.state.distanse//+ " км"

        this.props.updateMarshList(this.props.auth, params);

        message.info(`Длина маршрута : ${this.state.distanse} км`);
    }

    onClickCalc = () => {
        this.createRoute();
    }


    onCancel = () => {
        this.props.manageYandexRoute_Visible();
    }

    printMarshList = () => {
        // var content = document.getElementById(divId).innerHTML;
        const { taskListFields } = this.props;
        let tasks = this.props.tasksByML.map((item, i) => (
            {
                num: i + 1,
                company: item[this.BProp(taskListFields, "Компания")],
                address: item[this.BProp(taskListFields, "Адрес")],
                task: item[this.BProp(taskListFields, "Задание")]
            }
        ))

        const html = ReactDOMServer.renderToString(<PrintMarshList data={tasks} dist={this.state.distanse} />)

        var mywindow = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write('<html><head><style>');
        mywindow.document.write(".task-list-print { border-collapse: collapse;width:100%}")
        mywindow.document.write(".task-list-print tr, td, th {border: 1px solid gray; padding:10px}")
        mywindow.document.write('</style></head><body >');
        mywindow.document.write(html);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus()
        mywindow.print();
        mywindow.close();
    }

    render() {
        return (

            <Modal
                visible={this.props.visible}
                style={{ top: 20 }}
                bodyStyle={{ width: 650, padding: 0, minHeight: 600 }}
                width={650}
                centered
                title={<div>
                    <Button onClick={this.createRoute}>Построить маршрут</Button>
                    <Button style={{ margin: '0 7px' }} onClick={this.saveDistanse}>Сохранить расстояние</Button>
                    <Button onClick={this.printMarshList}>Распечатать</Button>
                </div>}
                onCancel={this.onCancel}
                onOk={this.onCancel} //{onCreate}
            >
                <YMaps query={{
                    lang: 'ru_RU',
                    mode: 'release',
                    apikey: 'a251630e-2cd2-42fb-a025-8e2f375579de',
                    load: 'package.full', width: 600, height: 600
                }}>
                    <div id="ymap" style={{ width: 605, heigth: 605, margin: '-5px auto' }}>

                        {/**   <div >
                            <Button onClick={this.createRoute}>Построить маршрут</Button>
                        </div>
                         */}
                        <Map defaultState={{
                            center: [55.15886, 61.40255],
                            zoom: 13
                        }}

                            style={{ margin: '20px auto', width: 600, height: 600 }}
                            instanceRef={(map) => this.mapInstance = map}
                            onLoad={(y) => {
                                this.onLoadMap(y)
                            }}
                        >
                        </Map>
                    </div>
                </YMaps>
            </Modal>
        )
    }
}

const YandexRoutes = connect(StoP, DtoP)(Yandex_Routes)

export default YandexRoutes