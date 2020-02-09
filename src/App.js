import './App.css'
import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects';

import { watchTestSaga, fetchData } from './sagas'

const funcDom2 = () => {
  return new Promise((resolve) => {
    let conf;
    window.BX24.init((e) => {
      console.log("Prom init", BX24.getAuth())
      let au = BX24.getAuth();

      conf = {
        auth: {
          domain: au.domain,
          token: au.access_token,
          expires_in: au.expires_in,
          refresh_token: au.refresh_token
        }
      }
      resolve(conf);
    })
    resolve(conf);
  }
  )
}


const refresh = () => {
  let conf;
  if (window.BX24) {
    BX24.refreshAuth(function (a) {
      console.log("Refresh", a);
      conf = {
        auth: {
          domain: a.domain,
          token: a.access_token,
          expires_in: a.expires_in,
          refresh_token: a.refresh_token
        }
      }

    })
  }
}


const funcdom = (f) => {
  let conf;
  if (window.BX24) {

    // window.BX24.init(() => {
    //   console.log("f init", BX24.getAuth())
    // })

    let a = BX24.getAuth();
    conf = {
      auth: {
        domain: a.domain,
        token: a.access_token,
        expires_in: a.expires_in,
        refresh_token: a.refresh_token
      }
    }
    console.log("conf 1", conf);
    return conf

  }
  else {
    conf = {
      auth: {
        token: '1a00305e0043ea4c0031392000000001201c0389363b29f541386ba916136a34c31ce2',
        expires_in: new Date().valueOf(),
        refresh_token: "123456",
        domain: "anywhere.bitrix24.ru"
      }
    }
    console.log("conf func dom", conf)
    return conf
  }

}

const iniState = {
  auth: {
    domain: null,
    token: null,
    expires_in: 98,
    refresh_token: null,
  },
  somedata: { a: 1 }
}

const reducer = (state = iniState, action) => {
  switch (action.type) {
    case "CHECK_DOMAIN":
      console.log("reducer CHECK_DOMAIN", action);
      return Object.assign({}, state, funcdom());

    case "REFRESH_TOKEN":
      refresh();
      return state //Object.assign({}, state, refresh());

    case "TEST_SAGA":
      debugger
      return state //Object.assign({}, state, refresh());

    case "SOME_DATA":
      debugger
      return state //Object.assign({}, state, refresh());

    case "SETUP_DOMAIN":
      console.log("red setup_domain", action);
      return Object.assign({}, state, action.authData);

    default:
      return state;
  }
}

//Creators
const checkDomain = () => {
  return { type: "CHECK_DOMAIN" }
}

const refreshToken = () => {
  return { type: "REFRESH_TOKEN" }
}

const testSAGA = (somedata) => {
  return { type: "TEST_SAGA", authdata: somedata }
}


const SetupDomain = (data) => {
  return { type: "SETUP_DOMAIN", res: data }
}



// function* setDomain() {
//   const data = funcdom();
//   yield put(SetupDomain(data))
// }

////
const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer,
  applyMiddleware(sagaMiddleware));

//это запускает сагу и данные по домену извлекаются - поэтому можно не диспатчить своих действий
sagaMiddleware.run(watchTestSaga);


class App extends Component {
  componentDidMount() {
    this.props.dispatchDomain() //.dispatch(checkDomain())
  }

  render() {
    const { auth, dispatchDomain, refresh, testSaga } = this.props;
    console.log("props", this.props)
    return (

      <div className="App">
        <h1>123</h1>

        <h3>token: {auth.token}</h3>
        <h4>exp: {auth.expires_in}</h4>

        <button onClick={() => dispatchDomain()}>Click</button>
        <button onClick={() => refresh()}>Refresh</button>
        <div>
          <button onClick={() => testSaga(auth)}>TestSaga</button>
        </div>

      </div>

    )
  }
}

const map_DispatchToProps = (dispatch, ownProps) => {
  debugger
  return {
    dispatchDomain: () => dispatch(checkDomain()),
    refresh: () => dispatch(refreshToken()),
    testSaga: (k) => dispatch(testSAGA(k))
  }
}

const map_StateToProps = (state) => {
  // ... computed data from state and optionally ownProps
  return state
}

const ConnectedApp = connect(map_StateToProps, map_DispatchToProps)(App)

const Conn = () => {
  return (
    <Provider store={store}>
      <ConnectedApp />
    </Provider>)
}

export default Conn
