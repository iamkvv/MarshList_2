import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'

const { Option } = Select;
const { TextArea } = Input;

// const getUsers = (authData) => {
//     return { type: "START_GET_USERS", auth: authData }
// }
const updateTaskList = (authData, params) => {
    return { type: "UPDATE_TASKLIST", auth: authData, params: params }
}

const DtoP = (dispatch) => {
    return {
        updateTaskList: (a, p) => dispatch(updateTaskList(a, p))
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        //??marshListFields: state.marshListFields, //метаданные полей MarshList
        taskListFields: state.taskListFields,
        //  marshListData: state.marshListData, //все марш. листы,
        selectedTaskList: state.selectedTaskList,
        companies: state.companies,
        companyFields: state.companyFields
    }
}

const Update_Task = Form.create({ name: 'changeTask_modal' })(

    class extends React.Component {
        //  state = { visible: false }

        onCancel = () => {
            this.props.manageUpdateTask_Visible()
            this.props.form.resetFields()
        }


        // BProp = (title) => {
        //     for (let fld of Object.keys(this.props.marshListFields)) {
        //         if (this.props.marshListFields[fld].NAME === title) return fld
        //     }
        // }

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

                    console.log('Company', values, company);

                    let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&ELEMENT_ID=" + this.props.selectedTaskList.ID + "&" +
                        "fields[" + this.BPropTL("Название") + "]" + "=Задание" + "&" +
                        "fields[" + this.BPropTL("Внешний ключ") + "]" + "=" + this.props.selectedTaskList[this.BPropTL("Внешний ключ")] + "&" +
                        "fields[" + this.BPropTL("Дата") + "]" + "=" + this.props.selectedTaskList[this.BPropTL("Дата")] + "&" +
                        "fields[" + this.BPropTL("ID Исполнителя") + "]" + "=" + this.props.selectedTaskList[this.BPropTL("ID Исполнителя")] + "&" +
                        "fields[" + this.BPropTL("Исполнитель") + "]" + "=" + this.props.selectedTaskList[this.BPropTL("Исполнитель")] + "&" +
                        "fields[" + this.BPropTL("ID Компании") + "]" + "=" + company.ID + "&" +
                        "fields[" + this.BPropTL("Компания") + "]" + "=" + company.TITLE + "&" +

                        //"fields[" + this.BPropTL("Адрес") + "]" + "=" + company[this.BPropComp("Юридический адрес")] + "&" +
                        "fields[" + this.BPropTL("Адрес") + "]" + "=" + company[this.BPropComp("Адрес")].split("|")[0] + "&" +

                        "fields[" + this.BPropTL("Гис") + "]" + "=" + company[this.BPropComp("2ГИС-адрес")] + "&" +
                        "fields[" + this.BPropTL("Телефон") + "]" + "=" + (company.hasOwnProperty("PHONE") ? company.PHONE[0].VALUE : " ") + "&" +
                        "fields[" + this.BPropTL("Задание") + "]" + "=" + "<p>" + values.task.replace(/\n/g, "<br/>") + "</p>" + "&" +
                        "fields[" + this.BPropTL("ID Задачи") + "]" + "=0" + "&" //+
                    //"ELEMENT_CODE=" + (new Date().getTime())

                    //debugger;
                    console.log(params)

                    this.props.updateTaskList(this.props.auth, params);

                    //ГОВОНОКОДИЩЕ  - сделать редюсеры
                    setTimeout(() => {
                        self.props.form.resetFields();
                        this.props.manageUpdateTask_Visible();

                    }, 500)
                    //this.props.onCreate(formvals, this.props.form);
                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        reformat = (val) => {
            let res = val.replace(/<br\/>/g, String.fromCharCode(10))
                .replace(/<p>/g, "")
                .replace(/<\/p>/g, "")
            return res
        }

        render() {
            const { visible, companies, onCancel, onCreate, form } = this.props;

            console.log("Modal Update Task props", this.props)

            const Companies = companies.map((comp) =>
                (<Option key={comp.ID}>{`${comp.TITLE}`}</Option>)
            );

            const { getFieldDecorator } = form;
            return (
                <React.Fragment>
                    <Modal
                        visible={visible}
                        title="Изменить маршрут"
                        okText="Сохранить"
                        onCancel={this.onCancel}
                        onOk={this.handleSubmit} //{onCreate}
                    >
                        <Form layout="vertical" >
                            <Form.Item label="Компания">
                                {getFieldDecorator('company', {
                                    initialValue: this.props.selectedTaskList ? this.props.selectedTaskList[this.BPropTL("ID Компании")] : null,
                                    rules: [{ required: true, message: 'Выберите компанию' }],
                                })(
                                    <Select>
                                        {Companies}
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item label="Задание">
                                {getFieldDecorator('task', {
                                    initialValue: this.props.selectedTaskList ? this.reformat(this.props.selectedTaskList[this.BPropTL("Задание")]) : null
                                })(<TextArea rows={2} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </React.Fragment>
            )
        }
    }
)

const UpdateTask = connect(StoP, DtoP)(Update_Task)

export default UpdateTask;

