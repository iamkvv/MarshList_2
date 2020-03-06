import React, { Component } from 'react'
import { Modal, Button, Table, Row, Col, Select, Divider } from 'antd';
import { connect } from 'react-redux'

import AddTask from './addTask'
import UpdateTask from './changeTask'
import YandexRoutes from './YandexRoutes'

const ButtonGroup = Button.Group;
const { Option } = Select;

const getCompanies = (authData) => {
    return { type: "GET_ALLCOMPANIES", auth: authData }
}

const startingTasks = (taskRecords) => {
    return { type: "STARTING_TASKS", taskRecords: taskRecords }
}

const selectTaskList = (tl) => {
    return { type: "SELECTED_TASKLIST", selectedTaskList: tl }
}

const deleteTaskList = (record) => {
    return { type: "DELETE_TASKLIST", taskListRecord: record }
}

// const getLids = (authData) => {
//     return { type: "GET_LIDS", auth: authData }
// }

const BProp = (metaTsk, title) => {//Возврашает PROPERTY_n по русс. имени поля
    for (let fld of Object.keys(metaTsk)) {
        if (metaTsk[fld].NAME === title) return fld
    }
}

const DtoP = (dispatch) => {
    return {
        getCompanies: () => dispatch(getCompanies()),
        //  getLids: (a) => dispatch(getLids(a)),

        startingTasks: (taskRecords) => dispatch(startingTasks(taskRecords)),

        deleteTaskList: (rec) => dispatch(deleteTaskList(rec)),
        selectTaskList: (tl) => dispatch(selectTaskList(tl))
    }
}

const StoP = (state) => {
    return {
        // auth: state.auth,
        taskListFields: state.taskListFields, //метаданные полей 
        taskListData: state.taskListData, //все задания,
        companies: state.companies,
        selectedMarshList: state.selectedMarshList,
        selectedTaskList: state.selectedTaskList,
        tasksByML: state.taskListData ?
            state.taskListData.filter(tsk => (tsk[BProp(state.taskListFields, "Внешний ключ")] == state.selectedMarshList.ID))
            : []
    }
}


class Task_List extends Component {
    state = {
        yandexRoutesVisible: false,
        addTaskformVisible: false,
        updateTaskformVisible: false,
        canAddTask: true,
        showDeleteModal: false,

        selectedTaskList: {}
    }

    createColumns = () => {
        if (this.props.taskListFields) {
            const { taskListFields } = this.props;
            let cols = Object.keys(taskListFields)
                .map(fld => ({ title: taskListFields[fld].NAME, dataIndex: fld, key: fld.toLocaleLowerCase(), render: text => <span dangerouslySetInnerHTML={{ __html: text }} /> }))

            cols.unshift({
                title: 'ID',
                dataIndex: 'ID',
                key: 'id',
                render: text => <b> {text}</b>,
            })

            cols.push({
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a>Изменить</a>
                        <Divider type="vertical" />
                        <a>Удалить</a>
                    </span>
                )
            })
            let res = cols.filter(c => c.title !== "ID Исполнителя" &&
                c.title !== "Название" &&
                c.title !== "Исполнитель" &&
                c.title !== "Внешний ключ" &&
                c.title !== "ID Исполнителя" &&
                c.title !== "ID Компании" &&
                c.title !== "Гис" &&
                c.title !== "Телефон"
            )
            return res;
        }
    }

    showAddTask_Form = () => {
        this.setState({ addTaskformVisible: true })
    }

    warning = (txt) => {
        Modal.warning({
            title: 'Ошибка',
            content: txt,
        });
    }

    manageAddTask_Visible = () => {
        if (!this.props.selectedMarshList || !Object.keys(this.props.selectedMarshList).length) {
            this.warning("Не выбран маршрутный лист.")
            return
        }

        if (!this.props.companies.length) { //Если компании еще не получены, сага должна их получить
            this.props.getCompanies();//this.props.auth)
        }

        setTimeout(() => {
            this.setState({
                addTaskformVisible: !this.state.addTaskformVisible
            });
        }, 300)
    }

    manageUpdateTask_Visible = () => {
        if (this.props.selectedTaskList[BProp(this.props.taskListFields, "Статус")] !== '-') {
            this.warning("Задача выполняется. Изменить или удалить ее нельзя.");
            return
        }

        if (!this.props.companies.length) { //Если компании еще не получены, сага должна их получить
            this.props.getCompanies()
        }

        setTimeout(() => {
            this.setState({
                updateTaskformVisible: !this.state.updateTaskformVisible
            });

        }, 300)
    }

    manageYandexRoute_Visible = () => {
        if (!this.props.selectedMarshList) {
            this.warning("Не выбран маршрутный лист.")
            return
        }

        if (!this.props.tasksByML.length) {
            this.warning("Нет данных для построения маршрута.")
            return
        }

        setTimeout(() => {
            this.setState({
                yandexRoutesVisible: !this.state.yandexRoutesVisible
            });
        }, 300)
    }


    StartingUserTasks = () => {
        if (!this.props.selectedMarshList) {
            this.warning("Не выбран маршрутный лист.")
            return
        }

        this.props.startingTasks(this.props.tasksByML);
    }

    //Это потом удалить, оставить только BProp
    BPropTL = (title) => {
        for (let fld of Object.keys(this.props.taskListFields)) {
            if (this.props.taskListFields[fld].NAME === title) return fld
        }
    }

    deletetaskList = () => {
        if (this.props.selectedTaskList[BProp(this.props.taskListFields, "Статус")] !== '-') {
            this.warning("Задача выполняется. Изменить или удалить ее нельзя.");
            return
        }

        this.props.deleteTaskList(this.props.selectedTaskList);  //this.state.selectedTaskList.ID);

        setTimeout(() => {
            this.setState({ showDeleteModal: false })
        }, 500)
    }

    onCancelDelete = () => {
        this.setState({ showDeleteModal: false })
    }

    render() {
        return (
            <div>
                <AddTask visible={this.state.addTaskformVisible}
                    manageAddTask_Visible={this.manageAddTask_Visible}
                />
                <UpdateTask visible={this.state.updateTaskformVisible}
                    manageUpdateTask_Visible={this.manageUpdateTask_Visible} />

                <YandexRoutes visible={this.state.yandexRoutesVisible}
                    manageYandexRoute_Visible={this.manageYandexRoute_Visible}
                />

                <Row style={{ marginTop: 15, marginBottom: 5 }}>
                    <Col span={12}>
                        {/** <ButtonGroup >  */}
                        <Button style={{ marginLeft: 10, width: 150 }} type="primary" size="small" onClick={this.manageAddTask_Visible}>Добавить маршрут</Button>
                        <Button style={{ marginLeft: 10, width: 150 }} type="primary" size="small" onClick={this.StartingUserTasks}>Поставить задачи</Button>
                        {/** </ButtonGroup>  */}

                    </Col>
                    <Col span={8} offset={4}>
                        <Button style={{ float: "right" }} type="primary" size="small" onClick={this.manageYandexRoute_Visible}>Маршруты в Yandex-картах</Button>
                    </Col>
                </Row>

                <Modal
                    visible={this.state.showDeleteModal}
                    title="Удаление  маршрута"
                    centered
                    okText="Да"
                    cancelText="Нет"
                    onOk={this.deletetaskList}
                    onCancel={this.onCancelDelete}
                >
                    <p>Вы хотите удалить эту запись?</p>
                </Modal>


                <Table style={{ backgroundColor: "#fdfdfd" }}
                    pagination={{ pageSize: 5 }}
                    size="small"
                    rowKey={rec => (rec.ID)}
                    columns={this.createColumns()}
                    dataSource={this.props.tasksByML}
                    onRow={(record, rowIndex) => {

                        return {
                            onMouseEnter: event => {
                                this.props.selectTaskList(record);
                            },
                            onClick: event => {
                                this.props.selectTaskList(record);

                                if (event.target.text === 'Удалить') {
                                    this.setState(
                                        {
                                            showDeleteModal: true,
                                            selectedTaskList: record
                                        }
                                    )
                                }

                                if (event.target.text === 'Изменить') {
                                    this.manageUpdateTask_Visible();
                                }
                            }
                        }
                    }
                    }
                />
            </div>

        )
    }
}

const TaskList = connect(StoP, DtoP)(Task_List)

export default TaskList