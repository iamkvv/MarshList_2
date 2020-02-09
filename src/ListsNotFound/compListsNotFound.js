import React, { Component } from 'react'
import { message, Card, Button, Icon } from 'antd';

class ListsNotFound extends Component {
    state = { start: false }

    componentDidUpdate(prevProps) {
        if (prevProps.marshList === false) {
            if (Object.keys(this.props.marshList).length > 0) {
                message.success('Списки успешно созданы');
            }
        }
    }
    render() {
        console.log("innerProps", this.props)
        return (
            <div>
                {
                    (!this.props.marshList) ?
                        <Card style={{ width: 300, margin: "100px auto" }}>
                            <p><strong>Внимание!</strong>
                                <Icon style={{ display: this.state.start ? "inline" : "none", fontSize: 30, color: 'blue', float: 'right' }} type="loading" />
                            </p>
                            <p>Не созданы необходимые для работы приложения Универсальные Списки.</p>
                            <p>После создания списков работа будет продолжена автоматически.</p>
                            <p></p>
                            <p></p>
                            <hr />
                            <p>
                                <Button
                                    type="primary"
                                    style={{ float: 'right', marginTop: 10 }}
                                    onClick={() => {
                                        this.setState({ start: true })
                                        this.props.createLists(this.props.auth)
                                    }}>
                                    Создать списки
                                </Button>
                            </p>
                        </Card>

                        :
                        null
                }
            </div>
        )
    }

}
export default ListsNotFound