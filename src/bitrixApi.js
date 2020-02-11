const Get = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    }
}
const Post = {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    }
}

//метаданные всех списков
export function fetchLists(auth) {
    let addr = "rest/lists.get";
    let params = "&IBLOCK_TYPE_ID=lists"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`

    return fetch(request, Get)
        .then(response => response.json());
}

//метаданные полей списка
export function getFields(auth, iblock_code) {
    let addr = "rest/lists.field.get";
    let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=${iblock_code}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`

    return fetch(request, Get)
        .then(response => response.json());
}

//создает список
export function addList(auth, iblockCode, nameList) {
    let addr = "rest/lists.add";
    let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=${iblockCode}&fields[NAME]=${nameList}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`

    return fetch(request, Post)
        .then(response => response.json());
}

//создать поля - сразу для обоих списков ML1 и TL1
export function addFields(auth) {
    let addr = "rest/lists.field.add";
    let arrAddr = [
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&fields[NAME]=Исполнитель&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=Ispolnitel&fields[SORT]=20`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&fields[NAME]=ID Исполнителя&fields[IS_REQUIRED]=Y&fields[TYPE]=N&fields[CODE]=Ispolnitel_Id&fields[SORT]=30`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&fields[NAME]=Дата&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=Date&fields[SORT]=40`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&fields[NAME]=Комментарий&fields[IS_REQUIRED]=N&fields[TYPE]=S&fields[CODE]=Comment&fields[SORT]=50`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&fields[NAME]=Расстояние&fields[IS_REQUIRED]=N&fields[TYPE]=N&fields[CODE]=Distance&fields[SORT]=60`,

        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Внешний ключ&fields[IS_REQUIRED]=Y&fields[TYPE]=N&fields[CODE]=FK&fields[SORT]=20`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Дата&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=TDate&fields[SORT]=30`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=ID Исполнителя&fields[IS_REQUIRED]=Y&fields[TYPE]=N&fields[CODE]=TIspolnitel_Id&fields[SORT]=40`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Исполнитель&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=TIspolnitelt&fields[SORT]=50`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=ID Компании&fields[IS_REQUIRED]=Y&fields[TYPE]=N&fields[CODE]=Company_Id&fields[SORT]=60`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Компания&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=Company&fields[SORT]=70`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Адрес&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=address&fields[SORT]=80`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Гис&fields[IS_REQUIRED]=N&fields[TYPE]=S&fields[CODE]=Gis&fields[SORT]=90`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Телефон&fields[IS_REQUIRED]=N&fields[TYPE]=S&fields[CODE]=Telephone&fields[SORT]=100`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Задание&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=Task&fields[SORT]=110`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=ID Задачи&fields[IS_REQUIRED]=Y&fields[TYPE]=N&fields[CODE]=Task_Id&fields[SORT]=120`,
        `https://${auth.domain}/${addr}?auth=${auth.token}&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&fields[NAME]=Статус&fields[IS_REQUIRED]=Y&fields[TYPE]=S&fields[CODE]=Task_Status&fields[SORT]=140`
    ]
    try {
        //ПЕРЕДЛАТЬ НА saga all
        return fetch(arrAddr[0])
            .then(d => fetch(arrAddr[1]))
            .then(d => fetch(arrAddr[2]))
            .then(d => fetch(arrAddr[3]))
            .then(d => fetch(arrAddr[4]))

            .then(d => fetch(arrAddr[5]))
            .then(d => fetch(arrAddr[6]))
            .then(d => fetch(arrAddr[7]))
            .then(d => fetch(arrAddr[8]))
            .then(d => fetch(arrAddr[9]))
            .then(d => fetch(arrAddr[10]))
            .then(d => fetch(arrAddr[11]))
            .then(d => fetch(arrAddr[12]))
            .then(d => fetch(arrAddr[13]))
            .then(d => fetch(arrAddr[14]))
            .then(d => fetch(arrAddr[15]))
            .then(d => fetch(arrAddr[16]))
    } catch (err) {
        return err
    }
}

//получает все данные списка
export function getListData(auth, iblock_code) {
    let addr = "rest/lists.element.get";
    let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=${iblock_code}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`

    return fetch(request, Get)
        .then(response => response.json());
}

//Все пользователи
export function getUsers(auth) {
    let addr = "rest/user.get";
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}`

    return fetch(request, Get)
        .then(response => response.json());
}

//Добавление Марш листа
export function addMarshList(auth, params) {
    let addr = "rest/lists.element.add"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Post)
        .then(response => response.json())
}

//Удаление Марш листа
export function deleteMarshList(auth, elementid) {
    let addr = "rest/lists.element.delete";
    let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=ML1&ELEMENT_ID=${elementid}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Get)
        .then(response => response.json());
}

//Обновление Марш листа
export function updateMarshList(auth, params) {

    let addr = "rest/lists.element.update"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Post)
        .then(response => response.json())
}


const BProp = (title, fields) => {
    for (let fld of Object.keys(fields)) {
        if (fields[fld].NAME === title) return fld
    }
}

//Все компании
export function getCompanies(auth) {     // fields) {
    // let fld2gis = BProp("2ГИС-адрес", fields);
    // let uraddr = BProp("Юридический адрес", fields);//юр. адрес

    let addr = "rest/crm.company.list";
    let params = `&select[]=ID&select[]=TITLE&select[]=PHONE&select[]=UF_*`;  //   select[]=PHONE&select[]=UF_*` //${fld2gis}&select[]=${uraddr}`
    // debugger
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`

    // return fetch(request, Get)
    //     .then(response => response.json());


    let result = getBigList()(request, 0);
    return result
}

//Метаданные полей компании
export function getCompanyFields(auth) {
    let addr = "rest/crm.company.fields";
    //  let params = "&select[]=ID&select[]=TITLE&select[]=PHONE`///&select[]=UF_CRM_1579113190&select[]=UF_CRM_5E1D86B235DB7"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}`//${params}`

    return fetch(request, Get)
        .then(response => response.json());
}

//Добавление задания в список (можно (потом) сделать 1 функцию для добавления записи в список))
export function addTaskList(auth, params) {
    let addr = "rest/lists.element.add"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Post)
        .then(response => response.json())
}

//Добавить Б24-задачу
export function addUserTask(auth, resp_id, title, task, gis, company_id) {
    let addr = "rest/tasks.task.add";
    let content = task + "<br>" + "Открыть 2GIS: " + gis;
    let company = 'fields[UF_CRM_TASK][0]=CO_' + company_id;
    let params = `&fields[RESPONSIBLE_ID]=${resp_id}&fields[TITLE]=${title}&fields[DESCRIPTION]=${content}&${company}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Get)
        .then(response => response.json());
}




//Удаление задания из списка
export function deleteTaskList(auth, elementid) {
    let addr = "rest/lists.element.delete";
    let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&ELEMENT_ID=${elementid}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Get)
        .then(response => response.json());
}

//Обновление задания в списке
export function updateTaskList(auth, params) {
    let addr = "rest/lists.element.update"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Post)
        .then(response => response.json())
}


///
export function getLids(auth) {
    let addr = "rest/crm.lead.list"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}`

    //Интересно, что saga получит уже разрешенное значение
    return getBigList()(request, 0)
}

function getBigList() {
    let arr = [];
    return function getByPortion(url, start) {//, a) {
        return fetch(url + `&start=${start}`, Get)
            .then(response => response.json())
            .then(data => {
                arr = [...arr, ...data.result]
                if (data.next) {
                    return getByPortion(url, data.next)//, arr)
                } else { return arr }
            })
    }
}

//////////--------new code-////////////////

//Добавляет новую задачу курьеру со статусом "ждет выполнения"
export function addNewUserTask(auth, params) {
    let addr = "rest/tasks.task.add";
    let content = params.task + "<br>" + "Открыть 2GIS: " + params.gis;
    let company = 'fields[UF_CRM_TASK][0]=CO_' + params.company_id;
    let fldParams = `&fields[RESPONSIBLE_ID]=${params.responsible_id}&fields[TITLE]=${params.address}&fields[DESCRIPTION]=${content}&${company}&fields[STATUS]=2&fields[TAGS]=Маршрутное задание`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${fldParams}`
    return fetch(request, Get)
        .then(response => response.json());
}

//Добавляет запись в список Заданий
export function addTaskInList(auth, params, state) {
    /// debugger
    let metadata = state.taskListFields;
    let addr = "rest/lists.element.add"

    let fldparams = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&ELEMENT_CODE=" + (new Date().getTime()) + "&" +

        "fields[" + BProp("Название", metadata) + "]" + "=" + params.name + "&" +
        "fields[" + BProp("Внешний ключ", metadata) + "]" + "=" + params.fk + "&" +
        "fields[" + BProp("Дата", metadata) + "]" + "=" + params.date + "&" +
        "fields[" + BProp("ID Исполнителя", metadata) + "]" + "=" + params.responsible_id + "&" +
        "fields[" + BProp("Исполнитель", metadata) + "]" + "=" + params.responsible + "&" +
        "fields[" + BProp("ID Компании", metadata) + "]" + "=" + params.company_id + "&" +
        "fields[" + BProp("Компания", metadata) + "]" + "=" + params.company + "&" +
        "fields[" + BProp("Адрес", metadata) + "]" + "=" + params.address + "&" +
        "fields[" + BProp("Гис", metadata) + "]" + "=" + params.gis + "&" +
        "fields[" + BProp("Телефон", metadata) + "]" + "=" + params.phone + "&" +
        "fields[" + BProp("Задание", metadata) + "]" + "=" + params.task + "&" +
        "fields[" + BProp("ID Задачи", metadata) + "]" + "=" + params.task_id + "&" +
        //  "fields[" + BProp("Задача", metadata) + "]" + "=" + params.task_ref + "&" +
        "fields[" + BProp("Статус", metadata) + "]" + "=" + params.task_status

    //debugger
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${fldparams}`
    return fetch(request, Post)
        .then(response => response.json())
}

//Удаляет Б24-задачу
export function deleteUserTask(auth, id) {
    let addr = "rest/tasks.task.delete";
    let param = `&taskId=${id}`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${param}`

    return fetch(request, Get)
        .then(response => response.json());
}


//Обновляет запись в списке заданий. Перед этим была удалена и заново создана Б24-задача
export function updateTaskListRecord(auth, params, newdataTask, metadata) {
    let addr = "rest/lists.element.update"
    let fldParams = "&IBLOCK_TYPE_ID=lists&IBLOCK_CODE=TL1&ELEMENT_ID=" + params.id + "&" +
        "fields[" + BProp("Название", metadata) + "]" + "=" + params.name + "&" +
        "fields[" + BProp("Внешний ключ", metadata) + "]" + "=" + params.fk + "&" +
        "fields[" + BProp("Дата", metadata) + "]" + "=" + params.date + "&" +
        "fields[" + BProp("ID Исполнителя", metadata) + "]" + "=" + params.responsible_id + "&" +
        "fields[" + BProp("Исполнитель", metadata) + "]" + "=" + params.responsible + "&" +
        "fields[" + BProp("ID Компании", metadata) + "]" + "=" + params.company_id + "&" +
        "fields[" + BProp("Компания", metadata) + "]" + "=" + params.company + "&" +
        "fields[" + BProp("Адрес", metadata) + "]" + "=" + params.address + "&" +
        "fields[" + BProp("Гис", metadata) + "]" + "=" + params.gis + "&" +
        "fields[" + BProp("Телефон", metadata) + "]" + "=" + params.phone + "&" +
        "fields[" + BProp("Задание", metadata) + "]" + "=" + params.task + "&" +
        "fields[" + BProp("ID Задачи", metadata) + "]" + "=" + newdataTask.task.id + "&" +
        "fields[" + BProp("Статус", metadata) + "]" + "=" + "-"

    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${fldParams}`
    return fetch(request, Post)
        .then(response => response.json())
}

//Начать выполнение Б24-задачи
export function startUserTask(auth, id) {
    let addr = "rest/tasks.task.update";
    let param = `&taskId=${id}&fields[STATUS]=3`
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${param}`

    return fetch(request, Get)
        .then(response => response.json());
}

//Обновляет запись в Списке задач, Пареметры строятся в sag'e Нужен для обновления статуса
export function updateTaskListRecordFlds(auth, params) {
    let addr = "rest/lists.element.update"
    let request = `https://${auth.domain}/${addr}?auth=${auth.token}${params}`
    return fetch(request, Post)
        .then(response => response.json())
}