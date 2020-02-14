import React, { Component } from 'react'
import { Modal, Divider, Table, Pagination } from 'antd'

import AddRouteList from '../AddRouteList/addRouteList'
import ChangeRouteList from '../ChangeRouteList/changeRouteList'

class RouteList extends Component {
    state = {
        selectedRowIndex: 0,
        showDeleteModal: false,
        changeMarshListvisible: false,
        currentPage: 1
    }

    onCancelDelete = () => {
        this.setState({ showDeleteModal: false })
    }

    deleteMarshList = () => {
        this.props.deleteMarshList(this.props.auth, this.props.selectedMarshList.ID);
        setTimeout(() => {
            this.setState({ showDeleteModal: false })//, selectedRowIndex: 0 })
        }, 300)
        //переместить курсор и удалить дочерние !!!
    }

    componentDidUpdate = (prevProps, prevState) => {
        //Установка таблицы после удаления марш.листа
        if (this.props.selectedMarshList && prevProps.selectedMarshList) {
            if (this.props.selectedMarshList.ID !== prevProps.selectedMarshList.ID) {

                let prevPos = 0;
                for (let i = 0; i < this.props.marshListData.length; i++) {
                    if (this.props.marshListData[i].ID === this.props.selectedMarshList.ID) {
                        prevPos = i
                        break;
                    }
                }

                this.setState({ selectedRowIndex: prevPos - (this.state.currentPage - 1) * 5 })
            }
        }
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

    onPageChange = (page) => {
        this.props.selectMarshList(this.props.marshListData[(page - 1) * 5])
        this.setState({ currentPage: page, selectedRowIndex: 0 })
    }

    render() {
        const { marshListData } = this.props;

        return (
            <div>
                {this.props.marshListData ?
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
                            pagination={{ pageSize: 5, onChange: this.onPageChange }}
                            size="small"
                            //  scroll={{ scrollToFirstRowOnChange: true }}
                            scrollToFirstRowOnChange={true}
                            //  rowSelection={rowSelection}
                            rowKey={rec => (rec.ID)}
                            columns={this.createColumns()}
                            dataSource={marshListData}

                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                        this.setState({ selectedRowIndex: rowIndex });//, selectedMarshList: record })
                                        this.props.selectMarshList(record)

                                        if (event.target.text == 'Удалить') {
                                            this.setState({
                                                showDeleteModal: true,
                                            });
                                        }

                                        if (event.target.text == 'Изменить') {
                                            this.manageVisible()
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