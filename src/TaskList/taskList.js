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

const addTask = (authData, selectedML_Id, taskRecords) => {
    //   resp_id, title, task, gis, company_id, taskRec) => {
    return { type: "ADD_TASK", auth: authData, selectedML_Id: selectedML_Id, taskRecords: taskRecords }//     resp_id: resp_id, title: title, task: task, gis: gis, company_id: company_id, taskRec: taskRec }
}

const selectTaskList = (tl) => {
    return { type: "SELECTED_TASKLIST", selectedTaskList: tl }
}

const deleteTaskList = (authData, id) => {
    return { type: "DELETE_TASKLIST", auth: authData, id: id }
}

const getLids = (authData) => {
    return { type: "GET_LIDS", auth: authData }
}


const BProp = (metaTsk, title) => {//Возврашает PROPERTY_n по русс. имени поля
    for (let fld of Object.keys(metaTsk)) {
        if (metaTsk[fld].NAME === title) return fld
    }
}

const DtoP = (dispatch) => {
    return {
        getCompanies: (a) => dispatch(getCompanies(a)),
        getLids: (a) => dispatch(getLids(a)),
        addTask: (a, selectedML_Id, taskRecords) => dispatch(addTask(a, selectedML_Id, taskRecords)),
        deleteTaskList: (a, id) => dispatch(deleteTaskList(a, id)),
        selectTaskList: (tl) => dispatch(selectTaskList(tl))

    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
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
        if (!this.props.selectedMarshList) {
            this.warning("Не выбран маршрутный лист.")
            return
        }

        if (!this.props.companies.length) { //Если компании еще не получены, сага должна их получить
            this.props.getCompanies(this.props.auth)
        }

        setTimeout(() => {
            this.setState({
                addTaskformVisible: !this.state.addTaskformVisible
            });

        }, 300)
    }

    manageUpdateTask_Visible = () => {
        // if (!this.props.selectedMarshList) {
        //     this.warning("Не выбран маршрутный лист.")
        //     return
        // }

        if (!this.props.companies.length) { //Если компании еще не получены, сага должна их получить
            this.props.getCompanies(this.props.auth)
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
        setTimeout(() => {
            this.setState({
                yandexRoutesVisible: !this.state.yandexRoutesVisible
            });

        }, 300)
    }


    buildTasks = () => {
        if (!this.props.selectedMarshList) {
            this.warning("Не выбран маршрутный лист.")
            return
        }


        console.log("this.props.tasksByML", this.props.tasksByML)

        this.setState({ canAddTask: false })

        this.props.addTask(this.props.auth,
            this.props.selectedMarshList.ID,
            this.props.tasksByML);

        let self = this;
        setTimeout(() => {
            self.setState({ canAddTask: true })
        }, 1500)


    }


    BPropTL = (title) => {
        for (let fld of Object.keys(this.props.taskListFields)) {
            if (this.props.taskListFields[fld].NAME === title) return fld
        }
    }

    deletetaskList = () => {
        this.props.deleteTaskList(this.props.auth, this.state.selectedTaskList.ID);

        setTimeout(() => {
            this.setState({ showDeleteModal: false })
        }, 1000)
    }

    onCancelDelete = () => {
        this.setState({ showDeleteModal: false })
    }

    // OnLids = () => {
    //     this.props.getLids(this.props.auth)
    // }

    render() {
        console.log("Все Свойства Заданий", this.props)
        //<button onClick={this.OnLids}>Лиды</button>
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
                        <Button disabled={!this.state.canAddTask} style={{ marginLeft: 10, width: 150 }} type="primary" size="small" onClick={this.buildTasks}>Поставить задачи</Button>
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
                        var self = this;
                        return {
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
                                    console.log(this.props, record, rowIndex);
                                    this.manageUpdateTask_Visible();
                                    // this.setState(
                                    //     {
                                    //         updateTaskformVisible: true
                                    //     })
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