import { connect } from 'react-redux'
import RouteList from './compRouteList'

const deleteMarshList = (id) => { // (authData, id) => {
    return { type: "DELETE_MARSHLIST", id: id }// auth: authData, id: id }
}

const getUsers = () => {
    return { type: "START_GET_USERS" }
}

const selectedMarshList = (ml) => {
    return { type: "SELECTED_MARSHLIST", selectedMarshList: ml }
}

const DtoP = (dispatch) => {
    return {
        deleteMarshList: (id) => dispatch(deleteMarshList(id)),//  a, id)),
        selectMarshList: (ml) => dispatch(selectedMarshList(ml)),
        getUsers: () => dispatch(getUsers())
    }
}

const StoP = (state) => {
    return {
        auth: state.auth,
        users: state.users,
        marshList: state.marshList,
        marshListData: state.marshListData,
        marshListFields: state.marshListFields,
        selectedMarshList: state.selectedMarshList,
        //  taskListData: state.taskListData //TMP!!!
    }
}

const RouteList_CRUD = connect(StoP, DtoP)(RouteList)
export default RouteList_CRUD 