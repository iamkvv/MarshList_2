import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'

const { Option } = Select;
const { TextArea } = Input;

const updateUserTask = (ut_params, lt_params) => {
    return { type: "UPDATE_USERTASK", userTaskParams: ut_params, listTaskParams: lt_params }
}

const DtoP = (dispatch) => {
    return {
        updateUserTask: (utpars, ltpars) => dispatch(updateUserTask(utpars, ltpars))
    }
}

const StoP = (state) => {
    return {
        //auth: state.auth,
        //??marshListFields: state.marshListFields, //метаданные полей MarshList
        taskListFields: state.taskListFields,
        marshListFields: state.marshListFields, //метаданные полей MarshList
        selectedMarshList: state.selectedMarshList,
        //  marshListData: state.marshListData, //все марш. листы,
        selectedTaskList: state.selectedTaskList,
        companies: state.companies,
        companyFields: state.companyFields
    }
}

const Update_Task = Form.create({ name: 'changeTask_modal' })(

    class extends React.Component {

        onCancel = () => {
            this.props.manageUpdateTask_Visible()
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

                    let UserTaskParams = {//данные для Б24-задачи
                        responsible_id: this.props.selectedMarshList[this.BProp("ID Исполнителя")],
                        address: company[this.BPropComp("Адрес")].split('|')[0],
                        gis: company[this.BPropComp("2ГИС-адрес")],
                        company_id: company.ID,
                        task: "<p>" + values.task.replace(/\n/g, "<br/>") + "</p>"
                    }

                    let TaskListParams = {//данные для List-задачи
                        id: this.props.selectedTaskList.ID,
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
                        task_id: this.props.selectedTaskList[this.BPropTL("ID Задачи")],
                        task_status: this.props.selectedTaskList[this.BPropTL("Статус")]
                    }

                    this.props.updateUserTask(UserTaskParams, TaskListParams)

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
            const { visible, companies, form } = this.props;
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

