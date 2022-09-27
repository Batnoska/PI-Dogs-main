import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers/reducer";


const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk))); // applyMiddleware(thunk) para que se puedan usar los thunks

export default store;