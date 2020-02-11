import React, { Component } from 'react'
import { Icon } from 'antd'
import { connect } from 'react-redux'

const StoP = (state) => {
    return {
        //auth: state.auth,
        showLoading: state.showLoading
    }
}

const Block_Loading = (props) => {
    return (
        <div style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            //opacity: 0.2,
            zIndex: 10000,
            width: '100%',
            height: '100%',
            display: props.showLoading ? "block" : "none"

        }}>
            <Icon style={{
                position: 'absolute',
                width: 100,
                height: 100,
                fontSize: '100px',
                color: '#1890ff',  // '1890ff',
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)'
            }} type="loading" />
        </div>
    )
}

const BlockLoading = connect(StoP, null)(Block_Loading)

export default BlockLoading;