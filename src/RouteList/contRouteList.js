import { connect } from 'react-redux'
import RouteList from './compRouteList'

const deleteMarshList = (authData, id) => {
    return { type: "DELETE_MARSHLIST", auth: authData, id: id }
}
const getUsers = (authData) => {
    return { type: "START_GET_USERS", auth: authData }
}
const selectedMarshList = (ml) => {
    return { type: "SELECTED_MARSHLIST", selectedMarshList: ml }
}

const DtoP = (dispatch) => {
    return {
        deleteMarshList: (a, id) => dispatch(deleteMarshList(a, id)),
        selectMarshList: (ml) => dispatch(selectedMarshList(ml)),
        getUsers: (a) => dispatch(getUsers(a))
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