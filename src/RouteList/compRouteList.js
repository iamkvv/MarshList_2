import React, { Component } from 'react'
import { Modal, Divider, Table, Row, Col } from 'antd'

import AddRouteList from '../AddRouteList/addRouteList'
import ChangeRouteList from '../ChangeRouteList/changeRouteList'


class RouteList extends Component {
    state = {
        selectedRowIndex: 0,
        showDeleteModal: false,
        changeMarshListvisible: false
    }

    onCancelDelete = () => {
        this.setState({ showDeleteModal: false })
    }

    deleteMarshList = () => {
        console.log("ForDELETE", this.props.auth, this.props.selectedMarshList);
        this.props.deleteMarshList(this.props.auth, this.props.selectedMarshList.ID);
        setTimeout(() => {
            this.setState({ showDeleteModal: false, selectedRowIndex: 0 })
        }, 300)
        //переместить курсор и удалить дочерние !!!
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.marshListData)
            return false
        else
            return true
    }

    createColumns = () => {
        if (this.props.marshListFields) {

            const { marshListFields } = this.props;
            let cols = Object.keys(marshListFields)
                .map(fld => ({ title: marshListFields[fld].NAME, dataIndex: fld, key: fld.toLocaleLowerCase() }))

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
            let res = cols.filter(c => c.title !== "ID Исполнителя" && c.title !== "Название")
            return res;
        }
    }

    manageVisible = () => {
        if (!this.props.users.length) {
            this.props.getUsers(this.props.auth)
        }

        setTimeout(() => {
            this.setState({
                changeMarshListvisible: !this.state.changeMarshListvisible
            });

        }, 300)

    }

    render() {
        const { marshListData, marshList, marshListFields, auth } = this.props;
        console.log("RouteList Component", this.props)
        return (
            <div>
                {true ?///this.props.marshListFields ?
                    <div>
                        <AddRouteList />
                        <ChangeRouteList manageVisible={this.manageVisible} changeMarshListvisible={this.state.changeMarshListvisible} />

                        <Modal
                            visible={this.state.showDeleteModal}
                            title="Удаление  маршрутного листа"
                            centered
                            okText="Да"
                            cancelText="Нет"
                            onOk={this.deleteMarshList}
                            onCancel={this.onCancelDelete}
                        >
                            <p>Вы хотите удалить эту запись?</p>
                        </Modal>

                        <Table style={{ backgroundColor: "#fdfdfd" }}
                            rowClassName={(record, index) => {
                                if (index == this.state.selectedRowIndex) return "selected-routelist"
                            }}
                            pagination={{ pageSize: 5 }}
                            size="small"
                            //  scroll={{ scrollToFirstRowOnChange: true }}
                            scrollToFirstRowOnChange={true}
                            //  rowSelection={rowSelection}
                            rowKey={rec => (rec.ID)}
                            columns={this.createColumns()}
                            dataSource={marshListData}

                            onRow={(record, rowIndex) => {
                                var self = this;
                                return {
                                    onClick: event => {
                                        console.log("rowIndex", rowIndex);
                                        //console.log("Click by ROW", this.props, event.target.text == 'Удалить', record, rowIndex);

                                        self.setState({ selectedRowIndex: rowIndex });//, selectedMarshList: record })
                                        self.props.selectMarshList(record)

                                        if (event.target.text == 'Удалить') {
                                            self.setState({
                                                showDeleteModal: true,
                                            });
                                        }

                                        if (event.target.text == 'Изменить') {
                                            self.manageVisible()
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    :
                    null

                }
            </div>
        )

    }
}

export default RouteList