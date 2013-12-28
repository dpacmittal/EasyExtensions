//chrome.runtime.onInstalled.addListener(function(details){

	chrome.management.getAll(function(exts){
		chrome.storage.sync.set({"default_extensions": exts});
	});
//});