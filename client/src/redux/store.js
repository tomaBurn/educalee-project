import { compose, applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers/rootReducer';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    let store = createStore(
        persistedReducer,
        {},
        compose(applyMiddleware(thunk))
    );
    let persistor = persistStore(store);
    return { store, persistor };
}