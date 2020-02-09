//import React, { Component } from 'react'
import { connect } from 'react-redux'

import ListsNotFound from './compListsNotFound'

const createLists = (authData) => {
    return { type: "CREATING_LISTS", auth: authData }
}

const DtoP = (dispatch) => {
    return {
        createLists: (a) => dispatch(createLists(a)),
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        marshList: state.marshList
    }
}

const ListsNotFound_Create = connect(StoP, DtoP)(ListsNotFound)
export default ListsNotFound_Create