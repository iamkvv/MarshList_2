import React, { Component } from 'react'

class PrintMarshList extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div style={{ width: "95%" }}>
                <h2 style={{ textAlign: "center" }}>Маршрутный лист</h2>
                <div style={{ margin: "20 auto" }}>
                    <table className="task-list-print">
                        <tbody>
                            <tr>
                                <th>№</th>
                                <th>Компания</th>
                                <th>Адрес</th>
                                <th>Телефон</th>
                                <th>Задание</th>
                            </tr>
                            {this.props.data.map(tsk => (
                                <tr>
                                    <td>{tsk.num}</td>
                                    <td>{tsk.company}</td>
                                    <td>{tsk.address.split('|')[0]}</td>
                                    <td>{tsk.tel}</td>
                                    <td dangerouslySetInnerHTML={{ __html: tsk.task }}></td>
                                </tr>))
                            }
                        </tbody>
                    </table>

                    <h3>Длина маршрута {this.props.dist} км</h3>

                </div>
            </div>
        )
    }
}

export default PrintMarshList
