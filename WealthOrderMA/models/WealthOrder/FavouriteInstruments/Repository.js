define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function FavouriteInstrumentsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	FavouriteInstrumentsRepository.prototype = Object.create(BaseRepository.prototype);
	FavouriteInstrumentsRepository.prototype.constructor = FavouriteInstrumentsRepository;

	//For Operation 'getUserFavouriteInstruments' with service id 'getUserFavouriteInstruments6244'
	FavouriteInstrumentsRepository.prototype.getUserFavouriteInstruments = function(params, onCompletion){
		return FavouriteInstrumentsRepository.prototype.customVerb('getUserFavouriteInstruments', params, onCompletion);
	};

	//For Operation 'getFavoriteInstruments' with service id 'getFavoriteInstruments4297'
	FavouriteInstrumentsRepository.prototype.getFavoriteInstruments = function(params, onCompletion){
		return FavouriteInstrumentsRepository.prototype.customVerb('getFavoriteInstruments', params, onCompletion);
	};

	//For Operation 'updateUserFavouriteInstruments' with service id 'updateUserFavouriteInstruments9015'
	FavouriteInstrumentsRepository.prototype.updateUserFavouriteInstruments = function(params, onCompletion){
		return FavouriteInstrumentsRepository.prototype.customVerb('updateUserFavouriteInstruments', params, onCompletion);
	};

	return FavouriteInstrumentsRepository;
})