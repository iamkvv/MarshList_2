import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'

const { Option } = Select;
const { TextArea } = Input;


// const getUsers = (authData) => {
//     return { type: "START_GET_USERS", auth: authData }
// }

const addNewUserTask = (authData, ut_params, lt_params) => {
    return { type: "ADD_NEW_USERTASK", auth: authData, userTaskParams: ut_params, listTaskParams: lt_params }
}

// const addTaskList = (authData, params) => {
//     return { type: "ADD_TASKLIST", auth: authData, params: params }
// }

const DtoP = (dispatch) => {
    return {
        // addTaskList: (a, p) => dispatch(addTaskList(a, p)),
        addNewUserTask: (a, utpars, ltpars) => dispatch(addNewUserTask(a, utpars, ltpars))
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        marshListFields: state.marshListFields, //метаданные полей MarshList
        taskListFields: state.taskListFields,
        //  marshListData: state.marshListData, //все марш. листы,
        selectedMarshList: state.selectedMarshList,
        companies: state.companies,
        companyFields: state.companyFields
    }
}

const Add_Task = Form.create({ name: 'addTask_modal' })(

    class extends React.Component {
        //  state = { visible: false }

        onCancel = () => {
            this.props.manageAddTask_Visible()
            this.props.form.resetFields()
        }


        BProp = (title) => {
            for (let fld of Object.keys(this.props.marshListFields)) {
                if (this.props.marshListFields[fld].NAME === title) return fld
            }
        }
        BPropTL = (title) => {
            for (let fld of Object.keys(this.props.taskListFields)) {
                if (this.props.taskListFields[fld].NAME === title) return fld
            }
        }
        BPropComp = (title) => {
            for (let fld of Object.keys(this.props.companyFields)) {
                if (this.props.companyFields[fld].formLabel === title) return fld
            }
        }

        handleSubmit = e => {
            e.preventDefault();
            let self = this;

            this.props.form.validateFields((err, values) => {
                if (!err) {
                    let company = this.props.companies.filter(comp => comp.ID === values.company)[0];

                    //Сначала добавляем задачу и получаем ее статус и ID 
                    //С этими данными содаем задание в списке

                    let UserTaskParams = {//данные для Б24-задачи
                        responsible_id: this.props.selectedMarshList[this.BProp("ID Исполнителя")],
                        address: company[this.BPropComp("Адрес")].split('|')[0],
                        gis: company[this.BPropComp("2ГИС-адрес")],
                        company_id: company.ID,
                        task: "<p>" + values.task.replace(/\n/g, "<br/>") + "</p>"
                    }

                    let TaskListParams = {//данные для List-задачи
                        name: "Задание",
                        fk: this.props.selectedMarshList.ID,
                        date: this.props.selectedMarshList[this.BProp("Дата")],
                        responsible_id: this.props.selectedMarshList[this.BProp("ID Исполнителя")],
                        responsible: this.props.selectedMarshList[this.BProp("Исполнитель")],
                        company_id: company.ID,
                        company: company.TITLE,
                        address: company[this.BPropComp("Адрес")].split('|')[0],
                        gis: company[this.BPropComp("2ГИС-адрес")],
                        phone: (company.hasOwnProperty("PHONE") ? company.PHONE[0].VALUE : " "),
                        task: "<p>" + values.task.replace(/\n/g, "<br/>") + "</p>",
                        task_id: null,
                        task_status: null
                    }

                    this.props.addNewUserTask(this.props.auth, UserTaskParams, TaskListParams)

                    //ГОВОНОКОДИЩЕ  - сделать редюсеры
                    setTimeout(() => {
                        self.props.form.resetFields();
                        this.props.manageAddTask_Visible();

                    }, 500)
                    //this.props.onCreate(formvals, this.props.form);
                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        render() {
            const { visible, companies, onCancel, onCreate, form } = this.props;
            const Companies = companies.map((comp) =>
                (<Option key={comp.ID}>{`${comp.TITLE}`}</Option>)
            );

            const { getFieldDecorator } = form;
            return (
                <React.Fragment>

                    <Modal
                        visible={visible}
                        title="Новый маршрут"
                        okText="Создать"
                        onCancel={this.onCancel}
                        onOk={this.handleSubmit} //{onCreate}
                    >
                        <Form layout="vertical" >
                            <Form.Item label="Компания">
                                {getFieldDecorator('company', {
                                    rules: [{ required: true, message: 'Выберите компанию' }],
                                })(
                                    <Select>
                                        {Companies}
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item label="Задание">
                                {getFieldDecorator('task')(<TextArea rows={2} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </React.Fragment>
            )
        }
    }
)

const AddTask = connect(StoP, DtoP)(Add_Task)
export default AddTask;

