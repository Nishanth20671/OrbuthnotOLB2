define(['redux','./ExportLCReducer'],function (redux, ExportLCReducer) {  
  return redux.createStore(ExportLCReducer.getState);
});