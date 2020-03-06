import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'
import moment from 'moment';

const { Option } = Select;

const getUsers = (authData) => {
    return { type: "START_GET_USERS", auth: authData }
}
const updateMarshList = (params) => {
    return { type: "UPDATE_MARSHLIST", params: params }
}

const DtoP = (dispatch) => {
    return {
        getUsers: (a) => dispatch(getUsers(a)),
        updateMarshList: (p) => dispatch(updateMarshList(p))
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        marshListFields: state.marshListFields, //метаданные полей MarshList
        marshListData: state.marshListData, //все марш. листы,
        users: state.users,
        selectedMarshList: state.selectedMarshList
    }
}
////////////
const ChangeRoute_List = Form.create({ name: 'changeMarshList_modal' })(

    class extends React.Component {

        BProp = (title) => {//Возврашает PROPERTY_n по русс. имени поля
            for (let fld of Object.keys(this.props.marshListFields)) {
                if (this.props.marshListFields[fld].NAME === title) return fld
            }
        }

        handleSubmit = e => {
            e.preventDefault();
            let self = this;

            this.props.form.validateFields((err, values) => {
                if (!err) {

                    let userObj = this.props.users.filter(usr => usr.ID === values.user)[0];
                    let formvals = Object.assign({}, { user: userObj, comment: values.comment, date: values.date.format("DD.MM.YYYY") })

                    let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&ELEMENT_ID=" + this.props.selectedMarshList.ID + "&" +
                        "fields[" + this.BProp("Название") + "]" + "=МЛ" + "&" +
                        "fields[" + this.BProp("Исполнитель") + "]" + "=" + formvals.user.LAST_NAME + " " + formvals.user.NAME + "&" +
                        "fields[" + this.BProp("ID Исполнителя") + "]" + "=" + formvals.user.ID + "&" +
                        "fields[" + this.BProp("Дата") + "]" + "=" + formvals.date + "&" +
                        "fields[" + this.BProp("Комментарий") + "]" + "=" + formvals.comment + "&" +
                        "fields[" + this.BProp("Расстояние") + "]" + "=" + this.props.selectedMarshList[this.BProp("Расстояние")]

                    this.props.updateMarshList(params);
                    //ГОВОНОКОДИЩЕ  - сделать редюсеры
                    setTimeout(() => {
                        self.props.manageVisible();
                        self.props.form.resetFields();
                    }, 800)

                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        render() {
            const { users, form } = this.props;
            const Users = users.map((user) =>
                (<Option key={user.ID}>{`${user.LAST_NAME} ${user.NAME}`}</Option>)
            );
            const { getFieldDecorator } = form;

            return (
                <React.Fragment>
                    {this.props.changeMarshListvisible ?
                        <Modal
                            visible={this.props.changeMarshListvisible}
                            manageVisible={this.props.manageVisible}
                            title="Изменить маршрутный лист"
                            okText="Сохранить"
                            onCancel={() => this.props.manageVisible()}
                            onOk={this.handleSubmit}
                        >

                            <Form layout="vertical"  >
                                <Form.Item label="Дата">
                                    {getFieldDecorator('date', {
                                        initialValue: moment(this.props.selectedMarshList[this.BProp("Дата")], 'DD/MM/YYYY'),
                                        rules: [{ required: true, message: 'Укажите дату маршрутного листа' }],
                                    })(<DatePicker format="DD.MM.YYYY" />)}
                                </Form.Item>

                                <Form.Item label="Исполнитель">
                                    {getFieldDecorator('user', {
                                        initialValue: this.props.selectedMarshList[this.BProp("ID Исполнителя")],
                                        rules: [{ required: true, message: 'Выберите исполнителя' }],
                                    })(
                                        <Select filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                            {Users}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item label="Комментарий">
                                    {getFieldDecorator('comment',
                                        { initialValue: this.props.selectedMarshList[this.BProp("Комментарий")] })(<Input />)}
                                </Form.Item>
                            </Form>
                        </Modal>

                        :
                        null
                    }
                </React.Fragment>

            );
        }
    },
);

const ChangeRouteList = connect(StoP, DtoP)(ChangeRoute_List)

export default ChangeRouteList;