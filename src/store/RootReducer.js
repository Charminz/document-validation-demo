import { combineReducers } from 'redux';
import documentsReducer from '../documents/DocumentReducer';

export default combineReducers({
	documents: documentsReducer
});