import { createStore,applyMiddleware,compose } from "redux";
import RootReducer from "../reducers";
import thunk from 'redux-thunk';


// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


// const persistConfig = {
//   key: 'root',
//   storage,
// }

// const persistedReducer = persistReducer(persistConfig, RootReducer)

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
    // localStorage.removeItem('state');
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem('state');
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
const persistedStore = loadFromLocalStorage();


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  RootReducer,
  persistedStore,
  composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

// export const persistor = persistStore(store);


// export default ()=>{
//   let store = createStore(
//       RootReducer,
//     composeEnhancers(applyMiddleware(thunk))
//     );
//     let persistor = persistStore(store)
//   return { store, persistor }
//   }