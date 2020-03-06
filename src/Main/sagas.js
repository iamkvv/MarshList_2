import { all, select, call, put, takeEvery } from 'redux-saga/effects';
import {
    MetaFields,
    fetchLists, getFields, addList, addFields,
    getUsers, getCompanies, getCompanyFields,
    getListData, addMarshList, deleteMarshList, updateMarshList,
    updateTaskListRecord, deleteTaskList,
    addNewUserTask, addTaskInList, deleteUserTask, startUserTask, updateUserTask,
    updateTaskListRecordFlds
} from '../bitrixApi'


function objValToVal(arr) {//значения полей PROPERTY_ являлись объектом = приводим из к простым значениям
    return arr.map(d => {
        Object.keys(d).forEach(p =>
            p.includes('PROPERTY_') ? d[p] = d[p][Object.keys(d[p])[0]] : d[p] = d[p]
        )
        return d
    })
}


function* watchGetLists() {
    yield takeEvery("CHECK_LISTS", getLists)
}

function* getLists() {//action) {
    try {
        const state = yield select();
        const data = yield call(fetchLists, state.auth);//  action.auth);

        if (data.error) {
            yield put({ type: "LISTS_ERROR", description: data.error_description });
        } else {
            //смотрим есть ли нужные списки
            let listsArr = data.result;

            if (listsArr.length > 0) {
                let marshlist = listsArr.filter(list => list.NAME === "MarshList")[0];
                let tasklist = listsArr.filter(list => list.NAME === "TaskList")[0];

                if (marshlist && tasklist) {
                    //списки есть - кладем в state
                    yield put({ type: "LISTS_METADATA", marshList: marshlist, taskList: tasklist })

                    // получить метаданные полей
                    const fldsML = yield call(getFields, state.auth, "ML1");    //action.auth, "ML1");
                    const fldsTL = yield call(getFields, state.auth, "TL1")   // action.auth, "TL1");

                    //!! Нужно сразу создать Объект (или MAP) типа {"ID Компании":"PROPERTY_526"}. ЭТо сократит кол-во кода

                    //полoжить их в module bitrixApi и в state
                    MetaFields.MarshList = fldsML.result
                    MetaFields.TaskList = fldsTL.result
                    yield put({ type: "LISTSFIELDS_METADATA", marshListFields: fldsML.result, taskListFields: fldsTL.result })

                    //получить все марш.листы, если их несколько, назначить 1-й текущим 
                    //затем получить все задания и отфильтровать их по ID текущего списка
                    const dataML = yield call(getListData, state.auth, "ML1") //action.auth, "ML1");
                    const dataTL = yield call(getListData, state.auth, "TL1")//action.auth, "TL1");

                    if (dataML.result.length > 0) {
                        let convML = objValToVal(dataML.result)

                        yield put({ type: 'MARSHLIST_DATA_GET', marshListData: convML }); //сохраним марш.листы
                        yield put({ type: 'SELECTED_MARSHLIST', selectedMarshList: convML[0] }); // и выбранный объ-т (1-й)
                    } else {
                        yield put({ type: 'MARSHLIST_DATA_GET', marshListData: [] })
                    }

                    if (dataTL.result.length > 0) {
                        let convTL = objValToVal(dataTL.result)
                        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });
                    } else {
                        yield put({ type: 'TASKLIST_DATA_GET', taskListData: [] });
                    }
                } else {//нет нужных списков
                    yield put({ type: "NOTFOUND_LISTS" })//это нужно здесь??? отследитьв рез-те user должен получить предлжение создать списки
                }
            } else {//вообще нет списков
                yield put({ type: "NOTFOUND_LISTS" })//в рез-те user должен получить предлжение создать списки

            }
        }
    } catch (error) {
        yield put({ type: "FETCH_FAILED", error })
    }
}

function* watchCreateLists() {
    //debugger
    yield takeEvery("CREATING_LISTS", createLists)
}


function* createLists(action) {
    try {
        const dataML = yield call(addList, action.auth, "ML1", "MarshList");
        const dataTL = yield call(addList, action.auth, "TL1", "TaskList");

        if (dataML.error || dataTL.error) {
            let errd = dataML.error ? dataML.error_description : "" + " " + dataTL.error ? dataTL.error_description : ""
            yield put({ type: "LISTS_ERROR", description: errd });
        } else {
            //теперь создать поля

            const flds = yield call(addFields, action.auth); //проверить на ошибку!!!

            //получить метанные нужных списков
            const lists = yield call(fetchLists, action.auth);

            //и получить метаданные полей по обоим спискам - lists.field.get

            let listsArr = lists.result;
            let mlist = listsArr.filter(list => list.NAME === "MarshList")[0];
            let tlist = listsArr.filter(list => list.NAME === "TaskList")[0];

            if (mlist && tlist) {//списки есть - кладем в state
                yield put({ type: "LISTS_METADATA", marshList: mlist, taskList: tlist })

                // получить метаданные полей ???
                const fldsML = yield call(getFields, action.auth, "ML1");
                const fldsTL = yield call(getFields, action.auth, "TL1");
                //полoжить их в state
                yield put({ type: "LISTSFIELDS_METADATA", marshListFields: fldsML.result, taskListFields: fldsTL.result })
            }
        }
    } catch (error) {
        yield put({ type: "QQQ", error })
    }
}


//Пользователи Б24 для создания МЛ
function* watchGetUsers() {//action) {
    yield takeEvery("START_GET_USERS", fetchUsers)
}

function* fetchUsers() {
    try {
        const state = yield select();
        const users = yield call(getUsers, state.auth);// action.auth);
        yield put({ type: "GET_USERS", users: users.result })
    } catch (error) {
        yield put({ type: "FETCH_FAILED", error })
    }
}

//Добавление Марш. листа в Список
function* watchAddMarshList(action) {
    yield takeEvery("ADD_MARSHLIST", addMarshlist)
}

function* addMarshlist(action) {
    try {
        const state = yield select();

        yield put({ type: 'SHOW_LOADING', showLoading: true });
        const addedmarsh = yield call(addMarshList, state.auth, action.params); ///action.auth, action.params); //Обрабатывать ошибки!!!

        //Обновляем марш. листы
        const dataML = yield call(getListData, state.auth, "ML1");
        //значения полей PROPERTY_ являлись объектом = приводим из к простым значениям
        var convML = dataML.result.map(d => {
            Object.keys(d).forEach(p =>
                p.includes('PROPERTY_') ? d[p] = d[p][Object.keys(d[p])[0]] : d[p] = d[p]
            )
            return d
        })

        yield put({ type: 'MARSHLIST_DATA_GET', marshListData: convML });
        yield put({ type: 'SHOW_LOADING', showLoading: false });

    } catch (error) {
        yield put({ type: "FETCH_FAILED", error })
        yield put({ type: 'SHOW_LOADING', showLoading: false });
    }
}

//-----Удаление марш. листа. Сначала удалются задания и Б24-задачи -----//
function* watchDeleteMarshList(action) {
    yield takeEvery("DELETE_MARSHLIST", removeMarshlist)
}

function* deleteTaskListAndUserTask(item, auth, metadata) {//  //action, metadata) {
    const deltsllist = yield call(deleteTaskList, auth, item.ID) //  action.auth, item.ID);
    const delusertsk = yield call(deleteUserTask, auth, item[BPropTL(metadata, "ID Задачи")]);//   action.auth, item[BPropTL(metadata, "ID Задачи")])
}

function* removeMarshlist(action) {
    try {
        yield put({ type: 'SHOW_LOADING', showLoading: true });

        const state = yield select();
        const metadata = state.taskListFields;
        const tasksByML = state.taskListData.filter(tsk => (tsk[BPropTL(metadata, "Внешний ключ")] === action.id))

        //определим, в какой позиции находился удаляемый марш. лист и выберем объект на одну позицию выше
        let deletedPos = 0;
        for (let i = 0; i < state.marshListData.length; i++) {
            if (state.marshListData[i].ID === action.id) {
                deletedPos = i
                break;
            }
        }
        const prevML = deletedPos == 0 ? {} : state.marshListData[deletedPos - 1]// Марш. лист перед удаляумым

        //Удаляем задания и задачи
        yield all(tasksByML.map(item => call(deleteTaskListAndUserTask, item, state.auth, metadata))); //item, action, metadata)));

        const delData = yield call(deleteMarshList, state.auth, action.id);//    action.auth, action.id); //ERRORS!!
        //Решить, на какую позицию должен переместиться курсор

        const dataML = yield call(getListData, state.auth, "ML1"); // action.auth, "ML1");

        let convML = objValToVal(dataML.result)
        yield put({ type: 'MARSHLIST_DATA_GET', marshListData: convML })

        const dataTL = yield call(getListData, state.auth, "TL1");//  action.auth, "TL1");
        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

        //назначим текущим тот, к-й был перед удаляемым
        yield put({ type: 'SELECTED_MARSHLIST', selectedMarshList: prevML });

        yield put({ type: 'SHOW_LOADING', showLoading: false });
    }
    catch (error) {
        yield put({ type: 'SHOW_LOADING', showLoading: false });
        yield put({ type: "FETCH_FAILED", error })
    }
}
//-----Удаление   МЛ -----//

//обновление Мар.листа
function* watchUpdateMarshList(action) {
    yield takeEvery("UPDATE_MARSHLIST", changeMarshlist)
}

function* changeMarshlist(action) {
    try {
        const state = yield select();
        const updateData = yield call(updateMarshList, state.auth, action.params); //DO ERRORS!!

        const dataML = yield call(getListData, state.auth, "ML1");
        // //значения полей PROPERTY_ являлись объектом = приводим иx к простым значениям
        // var convML = dataML.result.map(d => {
        //     Object.keys(d).forEach(p =>
        //         p.includes('PROPERTY_') ? d[p] = d[p][Object.keys(d[p])[0]] : d[p] = d[p]
        //     )
        //     return d
        // })

        let convML = objValToVal(dataML.result);

        yield put({ type: 'MARSHLIST_DATA_GET', marshListData: convML });
    }
    catch (error) {
        yield put({ type: "FETCH_FAILED", error })
    }
}

//Компании с фильтром по адресу
function* watchGetCompanies() {
    yield takeEvery("GET_ALLCOMPANIES", GetCompanies)
}

function* GetCompanies() {
    try {
        const state = yield select();
        const flds = yield call(getCompanyFields, state.auth);  //DO ERRORS!!
        yield put({ type: 'COMPANY_FIELDS', companyFields: flds.result })

        const compData = yield call(getCompanies, state.auth);//Получаем компании через List-method рекурсивно

        //уберем тех, у кого нет адреса
        let B24adr = null; //имя поля  в Б24
        for (let fld of Object.keys(flds.result)) {
            if (flds.result[fld].formLabel === "Адрес") B24adr = fld
        }

        if (B24adr) {
            let fltCompData = compData.filter(cmp => cmp.hasOwnProperty(B24adr) && cmp[B24adr])
            yield put({ type: 'GET_COMPANIES', companies: fltCompData });

        } else {
            yield put({ type: 'GET_COMPANIES', companies: compData });
        }
    } catch (err) {
        yield put({ type: "FETCH_FAILED", err })
    }
}

const BPropTL = (metadata, title) => {
    for (let fld of Object.keys(metadata)) {
        if (metadata[fld].NAME === title) return fld
    }
}

//Удаление задания из Списка и Б24-задачи
function* watchDeleteTaskList(action) {
    yield takeEvery("DELETE_TASKLIST", removeTasklist)
}
//Удаляем задание из списка и Б24-задачу
function* removeTasklist(action) {
    try {
        const state = yield select();
        yield put({ type: 'SHOW_LOADING', showLoading: true });

        const delData = yield call(deleteTaskList, state.auth, action.taskListRecord.ID);  //    action.id); //ERRORS!!

        //Удалить Б24-задачу
        const delTskdata = yield call(deleteUserTask,
            state.auth,
            action.taskListRecord[BPropTL(state.taskListFields, "ID Задачи")]);

        //Обновление
        const dataTL = yield call(getListData, state.auth, "TL1");
        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

        yield put({ type: 'SHOW_LOADING', showLoading: false });
    }
    catch (error) {
        yield put({ type: 'SHOW_LOADING', showLoading: false });
        yield put({ type: "FETCH_FAILED", error })
    }
}



/////////Добавляет новое задание в Список, сначала создав Б24-задачу//////////
function* watchAddNewUserTask(action) {
    yield takeEvery("ADD_NEW_USERTASK", add_NewUserTask)
}

function* add_NewUserTask(action) {
    try {
        const state = yield select();
        yield put({ type: 'SHOW_LOADING', showLoading: true });

        const dataTask = yield call(addNewUserTask, state.auth, action.userTaskParams);

        let ltp = action.listTaskParams;

        ltp.task_id = dataTask.result.task.id

        ltp.task_status = "-" //новая, нестартовавшая задача

        const dataTaskList = yield call(addTaskInList, state.auth, action.listTaskParams)//, state)

        const dataTL = yield call(getListData, state.auth, "TL1");

        //Снова получим весь список заданий но было б лучше просто добавить сохраненный объект в массив 
        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

        yield put({ type: 'SHOW_LOADING', showLoading: false });
    }
    catch (error) {
        alert("Ошибка" + error.message)
        console.log("error", error)
        yield put({ type: "FETCH_FAILED", error })
    }
}
//---------------------------------//



//Обновление задания и Б24-задачи
function* watchUpdateTaskList(action) {
    yield takeEvery("UPDATE_USERTASK", update_UserTask)
}

function* update_UserTask(action) {
    try {
        const state = yield select();
        yield put({ type: 'SHOW_LOADING', showLoading: true });

        //Обновляем Б24-задачу
        const updated_UserTask = yield call(updateUserTask,
            state.auth,
            action.listTaskParams.task_id,
            action.listTaskParams.responsible_id,
            action.listTaskParams.address,
            action.listTaskParams.task,
            action.listTaskParams.gis,
            action.listTaskParams.company_id
        )

        // обновляем запись в Списке 
        const updated_ListTask = yield call(updateTaskListRecord, state.auth, action.listTaskParams, action.listTaskParams.task_id)//      newdataTask.result)//, state.taskListFields);

        const dataTL = yield call(getListData, state.auth, "TL1");

        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });
        yield put({ type: 'SHOW_LOADING', showLoading: false });
    }
    catch (error) {
        yield put({ type: 'SHOW_LOADING', showLoading: false });
        yield put({ type: "FETCH_FAILED", error })
    }
}
///----------------------///

///Устанавливает задачам статус "Выполняется"
function* watchStartingTask(action) {
    yield takeEvery("STARTING_TASKS", Starting_Task)
}

function* Starting_Task(action) {
    try {
        const state = yield select();
        yield put({ type: 'SHOW_LOADING', showLoading: true });

        yield all(action.taskRecords.map(item => call(StartTask, item, action)));

        const dataTL = yield call(getListData, state.auth, "TL1");
        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

        yield put({ type: 'SHOW_LOADING', showLoading: false });
    } catch (err) {
        yield put({ type: 'SHOW_LOADING', showLoading: false });
        console.log(err)
    }
}

function* StartTask(item, action) {
    try {
        const state = yield select();

        const userTask = yield call(startUserTask, state.auth, item[BPropTL(state.taskListFields, "ID Задачи")])

        //Последнее свойство - это Status Б24 задачи
        item[Object.keys(item)[Object.keys(item).length - 1]] = 'выполняется'

        let pars = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=" + item.NAME + "&ELEMENT_ID=" + item.ID
        let flds = Object.keys(item)
        for (let i = 0; i < flds.length; i++) {
            if (flds[i].includes("PROPERTY_")) {
                pars += "&fields[" + flds[i] + "]=" + item[flds[i]]
            }
        }
        const updatetaskrec = yield call(updateTaskListRecordFlds, state.auth, pars);
    } catch (err) {
        yield put({ type: "FETCH_FAILED", err })
    }
}

///-----------

export default function* rootSaga() {
    yield all([
        watchGetLists(),
        watchCreateLists(),
        watchGetUsers(),
        watchAddMarshList(),
        watchDeleteMarshList(),
        watchUpdateMarshList(),
        watchGetCompanies(),
        // watchAddTaskList(),
        //   watchAddTask(),
        watchDeleteTaskList(),
        watchUpdateTaskList(),
        watchAddNewUserTask(),
        watchStartingTask(),

        //  watchGetLids()
    ])
}

///////////////////
/*
function* watchGetLids(action) {
    yield takeEvery("GET_LIDS", GetLids)
}
function* GetLids(action) {
    try {
        let lids = yield call(getLids, action.auth);
        debugger
    }
    catch (err) {
        debugger
        yield put({ type: "FETCH_FAILED", err })
    }
}
*/
/////////////////////



/*
function* Mytest(item, action) {//Убрать
    try {
        const state = yield select();

        const usertask = yield call(addUserTask,
            action.auth,
            item[BPropTL(state.taskListFields, "ID Исполнителя")],
            item[BPropTL(state.taskListFields, "Адрес")],
            item[BPropTL(state.taskListFields, "Задание")],
            item[BPropTL(state.taskListFields, "Гис")],
            item[BPropTL(state.taskListFields, "ID Компании")])

        //debugger
        //Последнее свойство - это Id Б24 задачи
        item[Object.keys(item)[Object.keys(item).length - 1]] = usertask.result.task.id

        // //праметры для обновления записи задания
        let pars = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=" + item.NAME + "&ELEMENT_ID=" + item.ID
        let flds = Object.keys(item)
        for (let i = 0; i < flds.length; i++) {
            if (flds[i].includes("PROPERTY_")) {
                pars += "&fields[" + flds[i] + "]=" + item[flds[i]]
            }
        }
        const updatetaskrec = yield call(updateTaskListRecord, action.auth, pars);
    } catch (err) {
        yield put({ type: "FETCH_FAILED", err })
    }

}
*/
// function* AddTask(action) { //УБРАТЬ!!
//     try {
//         yield all(action.taskRecords.map(item => call(Mytest, item, action)));

//         const dataTL = yield call(getListData, action.auth, "TL1");
//         let convTL = objValToVal(dataTL.result)
//         yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

//     } catch (err) {
//         console.log(err)
//     }
// }


/*
//Добавляет задание в список
function* watchAddTaskList(action) {
    yield takeEvery("ADD_TASKLIST", AddTaskList)
}
function* AddTaskList(action) {
    try {
        const addedtasklist = yield call(addTaskList, action.auth, action.params); //DO ERRORS!!!
        const dataTL = yield call(getListData, action.auth, "TL1");
        // debugger
        //Снова получим весь список заданий но было б лучше просто добавить сохраненный объект в массив
        let convTL = objValToVal(dataTL.result)
        yield put({ type: 'TASKLIST_DATA_GET', taskListData: convTL });

    } catch (err) {
        yield put({ type: "FETCH_FAILED", error })
    }
}
*/


//добавляет Б24-задачу --убрать
// function* watchAddTask(action) {
//     yield takeEvery("ADD_TASK", AddTask)
// }
