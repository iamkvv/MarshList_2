const checkAuth = () => { //вынести в Helper
    let conf;
    if (!window.BX24) {
        conf = {
            auth: {
                token: 'a804455e004416ca0031392000000001201c03f06745047720e2368eb44f8b41bfa3b5',
                expires_in: new Date().valueOf(),
                refresh_token: "123456",
                domain: "anywhere.bitrix24.ru"
            }
        }
    }
    else {
        let a = BX24.getAuth();
        // BX24.resizeWindow(860, 1100)
        conf = {
            auth: {
                domain: a.domain,
                token: a.access_token,
                expires_in: a.expires_in,
                refresh_token: a.refresh_token
            }
        }
        console.log("auth Refresh", conf.auth.token)
    }
    return conf
}

const iniState = {
    auth: {
        domain: null,
        token: null,
        expires_in: 98,
        refresh_token: null,
    },
    marshList: -1, //метаданные списка MarshList
    taskList: -1, //метаданные списка TaskList
    marshListFields: null, //метаданные полей MarshList
    taskListFields: null, //метаданные полей TaskList
    companyFields: null,
    marshListData: null, //все марш. листы
    taskListData: null,//все задания
    selectedMarshList: null, //выбранный маршю лист (по умолч. 1-й )
    users: [],
    companies: [],
    selectedTaskList: null,
    // creatingLists: false, //строятся ли листы
    listsError: null, //опиание ошибки при работе со списками
    newUserTask: null,// вновь созданная марш-ая задача (создается перед созданием записи в списке)
    showLoading: false
}

const reducerApp = (state = iniState, action) => {
    switch (action.type) {
        case "CHECK_AUTH":
            return Object.assign({}, state, checkAuth());

        case "LISTS_ERROR":
            return Object.assign({}, state, { listsError: action.description });

        case "LISTS_METADATA":
            return Object.assign({}, state, { marshList: action.marshList, taskList: action.taskList });

        case "NOTFOUND_LISTS":
            return Object.assign({}, state, { marshList: false, taskList: false });

        case "LISTSFIELDS_METADATA":
            return Object.assign({}, state, { marshListFields: action.marshListFields, taskListFields: action.taskListFields });

        case "MARSHLIST_DATA_GET":
            return Object.assign({}, state, { marshListData: action.marshListData });

        case "TASKLIST_DATA_GET":
            return Object.assign({}, state, { taskListData: action.taskListData });

        case "SELECTED_MARSHLIST":
            return Object.assign({}, state, { selectedMarshList: action.selectedMarshList });
        case "SELECTED_TASKLIST":
            return Object.assign({}, state, { selectedTaskList: action.selectedTaskList });


        case "GET_USERS":
            return Object.assign({}, state, { users: action.users });

        case "GET_COMPANIES":
            return Object.assign({}, state, { companies: action.companies });

        case "COMPANY_FIELDS":
            return Object.assign({}, state, { companyFields: action.companyFields });

        case "NEW_USERTASK":
            return Object.assign({}, state, { newUserTask: action.newUserTask });

        case "SHOW_LOADING":
            return Object.assign({}, state, { showLoading: action.showLoading });


        // case "ADD_MARSHLIST": //потом использовать для progress
        //     debugger
        //     return state;


        // case "CREATING_LISTS":
        //     return Object.assign({}, state, { creatingLists: action.creatingLists })

        default:
            return state;
    }
}

export default reducerApp 