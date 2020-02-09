import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'

const { Option } = Select;
const { TextArea } = Input;


// const getUsers = (authData) => {
//     return { type: "START_GET_USERS", auth: authData }
// }
const addTaskList = (authData, params) => {
    return { type: "ADD_TASKLIST", auth: authData, params: params }
}

const DtoP = (dispatch) => {
    return {
        addTaskList: (a, p) => dispatch(addTaskList(a, p))
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

        // onCreateButtonClick = () => {
        //     //ВЫЧИСТИТЬ ГОВНОКОД
        //     if (!this.props.users.length) {
        //         this.props.getUsers(this.props.auth)
        //         this.setState({ visible: true })
        //     }
        //     let self = this;
        //     setTimeout(() => {
        //         if (self.props.users.length > 0) {
        //             self.setState({ visible: true })
        //         }
        //     }, 200)
        // }

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

                    console.log('Company', company);

                    let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&" +
                        "fields[" + this.BPropTL("Название") + "]" + "=Задание" + "&" +
                        "fields[" + this.BPropTL("Внешний ключ") + "]" + "=" + this.props.selectedMarshList.ID + "&" +
                        "fields[" + this.BPropTL("Дата") + "]" + "=" + this.props.selectedMarshList[this.BProp("Дата")] + "&" +
                        "fields[" + this.BPropTL("ID Исполнителя") + "]" + "=" + this.props.selectedMarshList[this.BProp("ID Исполнителя")] + "&" +
                        "fields[" + this.BPropTL("Исполнитель") + "]" + "=" + this.props.selectedMarshList[this.BProp("Исполнитель")] + "&" +
                        "fields[" + this.BPropTL("ID Компании") + "]" + "=" + company.ID + "&" +
                        "fields[" + this.BPropTL("Компания") + "]" + "=" + company.TITLE + "&" +

                        //"fields[" + this.BPropTL("Адрес") + "]" + "=" + company[this.BPropComp("Юридический адрес")] + "&" +
                        "fields[" + this.BPropTL("Адрес") + "]" + "=" + company[this.BPropComp("Адрес")].split('|')[0] + "&" +

                        "fields[" + this.BPropTL("Гис") + "]" + "=" + company[this.BPropComp("2ГИС-адрес")] + "&" +

                        "fields[" + this.BPropTL("Телефон") + "]" + "=" + (company.hasOwnProperty("PHONE") ? company.PHONE[0].VALUE : " ") + "&" +

                        "fields[" + this.BPropTL("Задание") + "]" + "=" + "<p>" + values.task.replace(/\n/g, "<br/>") + "</p>" + "&" +
                        "fields[" + this.BPropTL("ID Задачи") + "]" + "=0" + "&" +
                        "ELEMENT_CODE=" + (new Date().getTime())

                    console.log(params)

                    this.props.addTaskList(this.props.auth, params);

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

            console.log("Modal Add Task props", this.props)

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

