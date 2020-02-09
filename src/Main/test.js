import React, { Component } from 'react'
import { connect } from 'react-redux'


class Test extends Component {


    render() {

        return (
            <div>

                <React.Fragment>
                    <h1>СПИСКИ СОЗДАНЫ!!!</h1>
                    <h2>!!</h2>
                    <ul>
                        {this.props.data.map(d => <li>{d}</li>)}
                    </ul>
                </React.Fragment>

            </div>
        )
    }
}



export default Test