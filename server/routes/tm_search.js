const geohash = require('ngeohash');
const request = require('request');

const searchResults = (req, res) => {
	let {keyword, segmentID, radius, unit, lat, long} = req.params;

	if(!keyword || !segmentID || !radius || !unit || !lat || !long){
		return res.status(400).json("Incorrect form submission");
	}
	let geoh = geohash.encode(lat, long);
	let api_call = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Rsc8KOS2Vttgw9VtGw4uGXEpyuDilVML&sort=date,asc&keyword=" + keyword;
	if(segmentID != "all"){
		api_call+= "&segmentID=" + segmentID
	}
	api_call+="&radius=" + radius + "&unit=" + unit + "&geoPoint=" + geoh;
	// console.log(api_call);
	request({uri: api_call}).pipe(res);

}

module.exports = {
	searchResults
}
