import { call, put, takeEvery } from 'redux-saga/effects';

function ttt(par) {
    console.log(par)
}

export function* watchTestSaga(action) {
    debugger;
    yield takeEvery("TEST_SAGA", fetchData)
}

export function* fetchData(action) {
    //теперрь в action я получаю auth data и их можно передать в функцию вместе с предметными
    // данными (id текущего itema)
    try {
        debugger;
        const data = yield call(ttt, action)
        console.log("data", data)

        yield put({ type: "SOME_DATA", someData: data })
    } catch (error) {
        yield put({ type: "FETCH_FAILED", error })
    }
}