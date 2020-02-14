import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import App from './compApp'

import reducerApp from './reducerApp'
import rootSaga from './sagas'
/////////////////////

//ActionCreators
const checkAuth = () => {
    return { type: "CHECK_AUTH" }
}
const checkLists = (authData) => {
    return { type: "CHECK_LISTS", auth: authData }
}

const createLists = (authData) => {
    return { type: "CREATING_LISTS", creatingLists: true, auth: authData }
}

/////////////////
const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducerApp,
    applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

//
// function select(state) {
//     return state.marshList
// }
// let currentValue
// function handleChange() {
//     let previousValue = currentValue
//     currentValue = select(store.getState())

//     if (previousValue !== currentValue) {
//         console.log(
//             'Некоторое глубокое вложенное свойство измененное от ',
//             previousValue,
//             'к',
//             currentValue)
//     }
// }

//store.subscribe(handleChange)

////////////////
store.dispatch(checkAuth())
let st = store.getState()
store.dispatch(checkLists(st.auth))
//

// const refresh = () => {
//     setInterval(() => {
//         console.log('REFRESH')
//         store.dispatch(checkAuth())
//     }, 1000 * 60)
// }
// refresh();

const StoP = (state) => (
    state //пока для контроля св-в возвратим весь стейт
    //{ listsError: state.listsError } //потом только серьезные ошибки
)

const ConnectedApp = connect(StoP, null)(App)

const ConnApp = () => (
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
)

export default ConnApp
