import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider, connect} from 'react-redux';
import { createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { put, takeEvery, delay, all } from 'redux-saga/effects'

class Counter extends React.Component {
    render() {
        let { value, onClickAdd, onClickMinus, onClickAddAsync, onClickMinusAsync } = this.props;
        return (
            <div>
                <p>{value}</p>
                <div>
                    <button onClick = {onClickAdd}>Add 1</button>
                    <button onClick = {onClickMinus}>Minus 1</button>
                </div>
                <div>
                    <button onClick = {onClickAddAsync}>Add 1 after 3 seconds</button>
                    <button onClick = {onClickMinusAsync}>Minus 1 after 3 seconds</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {value: state.value}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClickAdd: () => dispatch({type: "CLICK_ADD"}),
        onClickMinus: () => dispatch({type: "CLICK_MINUS"}),
        onClickAddAsync: () => dispatch({type: "CLICK_ADD_ASYNC"}),
        onClickMinusAsync: () => dispatch({type: "CLICK_MINUS_ASYNC"})
    }
}


const Example = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)

const Reducer = ( state = { value: 0 }, action ) => {
    let value = state.value;
    switch (action.type) {
        case "CLICK_ADD":
            return { ...state, value: value + 1}
        case "CLICK_MINUS":
            return { ...state, value: value - 1}
        default:
            return state
    }
}

function* increaseAsync () {
    yield delay(3000)
    yield put({type: 'CLICK_ADD'})
}

function* watchIncreaseAsync() {
    yield takeEvery('CLICK_ADD_ASYNC', increaseAsync)
}

function* decreaseAsync () {
    yield delay(3000)
    yield put({type: 'CLICK_MINUS'})
}

function* watchDecreaseAsync() {
    yield takeEvery('CLICK_MINUS_ASYNC', decreaseAsync)
}

function* rootSaga() {
    yield all([
        watchIncreaseAsync(),
        watchDecreaseAsync(),
    ])
}

//var store = createStore(Reducer, applyMiddleware(rootSaga));

const sagaMiddleware = createSagaMiddleware()
const store = createStore(Reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

ReactDOM.render(
    <Provider store = { store }>
        <Example />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
