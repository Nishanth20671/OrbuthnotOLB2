/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Copyright © Temenos Headquarters SA 2021. All rights reserved.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/
define(function () {
  return {
    getState: function(prevState, action) {
      if(typeof prevState === "undefined") {
        return {
          "Cache" : {},
          "Collection" : {}
        };
      }
      var state = JSON.parse(JSON.stringify(prevState));
      switch(action.type) {
        case "UPDATE_CACHE":
          state.Cache[action.key] = action.data;
          return state;
        case "UPDATE_COLLECTION":
          if(action.key)
            state.Collection[action.key] = action.data;
          else
            state.Collection = action.data;
          return state;
        case "UPDATE_CACHE_COLLECTION":
          state.Cache[action.key] = action.cacheData;
          state.Collection[action.key] = action.collectionData;
          return state;
        default: 
          return state;
      }
    }
  };
});