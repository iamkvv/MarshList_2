import React, { Component } from 'react'
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'react-redux'

const { Option } = Select;
const { TextArea } = Input;


const getUsers = (authData) => {
    return { type: "START_GET_USERS", auth: authData }
}
const addMarshList = (authData, params) => {
    return { type: "ADD_MARSHLIST", auth: authData, params: params }
}

const DtoP = (dispatch) => {
    return {
        getUsers: (a) => dispatch(getUsers(a)),
        addMarshList: (a, p) => dispatch(addMarshList(a, p))   //{ type: "ADD_MARSHLIST", auth: a, params: p })//addMarshList(a, p)),
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        marshListFields: state.marshListFields, //метаданные полей MarshList
        marshListData: state.marshListData, //все марш. листы,
        users: state.users
    }
}

////////////
const AddRoute_List = Form.create({ name: 'addMarshList_modal' })(

    class extends React.Component {
        state = { visible: false }


        onCancel = () => {
            this.setState({ visible: false });
            this.props.form.resetFields()
        }

        onCreateButtonClick = () => {
            //ВЫЧИСТИТЬ ГОВНОКОД
            if (!this.props.users.length) {
                this.props.getUsers(this.props.auth)
                this.setState({ visible: true })
            }
            let self = this;
            setTimeout(() => {
                if (self.props.users.length > 0) {
                    self.setState({ visible: true })
                }
            }, 200)
        }

        BProp = (title) => {
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

                    let params = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&" + "fields[" + this.BProp("Название") + "]" + "=МЛ" + "&" +
                        "fields[" + this.BProp("Исполнитель") + "]" + "=" + formvals.user.LAST_NAME + " " + formvals.user.NAME + "&" +
                        "fields[" + this.BProp("ID Исполнителя") + "]" + "=" + formvals.user.ID + "&" +
                        "fields[" + this.BProp("Дата") + "]" + "=" + formvals.date + "&" +
                        "fields[" + this.BProp("Комментарий") + "]" + "=" + formvals.comment + "&" +
                        "fields[" + this.BProp("Расстояние") + "]" + "=0" + "&" +
                        "ELEMENT_CODE=" + (new Date().getTime())

                    this.props.addMarshList(this.props.auth, params);
                    //ГОВОНОКОДИЩЕ  - сделать редюсеры
                    setTimeout(() => {
                        self.setState({ visible: false });
                        self.props.form.resetFields()
                    }, 500)
                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        render() {
            const { users, onCancel, onCreate, form } = this.props;
            const { visible } = this.state;

            // ///???? value
            const Users = users.map((user) =>
                (<Option key={user.ID}>{`${user.LAST_NAME} ${user.NAME}`}</Option>)
            );

            const { getFieldDecorator } = form;
            return (
                <React.Fragment>
                    <React.Fragment>
                        <div style={{ marginBottom: '5px' }}>
                            <Button onClick={this.onCreateButtonClick} type="primary" style={{ marginLeft: 8 }}>
                                Новый маршрутный лист
                            </Button>
                        </div>

                        <Modal
                            visible={visible}
                            title="Новый маршрутный лист"
                            okText="Создать"
                            onCancel={() => this.onCancel()}
                            onOk={this.handleSubmit} //{onCreate}
                        >

                            <Form layout="vertical" >
                                <Form.Item label="Дата">
                                    {getFieldDecorator('date', {
                                        rules: [{ required: true, message: 'Укажите дату маршрутного листа' }],
                                    })(<DatePicker format="DD.MM.YYYY" />)}
                                </Form.Item>

                                <Form.Item label="Исполнитель">
                                    {getFieldDecorator('user', {
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
                                    {getFieldDecorator('comment')(<Input />)}
                                </Form.Item>
                            </Form>
                        </Modal>
                    </React.Fragment>
                </React.Fragment>

            );
        }
    },
);

const AddRouteList = connect(StoP, DtoP)(AddRoute_List)

export default AddRouteList;