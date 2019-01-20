const geohash = require('ngeohash');
const request = require('request-promise');

const searchResultsLoc = (req, res) => {
	let {keyword, segmentID, radius, unit, location} = req.params;

	if(!keyword || !segmentID || !radius || !unit || !location){
		return res.status(400).json("Incorrect form submission");
	}

	if(location != undefined){
		location = location.split(' ').join('+');
		let options ={
			method: "GET",
			uri: "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyDIOR0fehr15u0Q9nBa6rCh-16pu1mg7s4",
			json: true		
		}

		request(options)
			.then(function(response){
				let lat = response.results[0].geometry.location.lat;
				let long = response.results[0].geometry.location.lng;

				let geoh = geohash.encode(lat, long);
				let api_call = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Rsc8KOS2Vttgw9VtGw4uGXEpyuDilVML&sort=date,asc&keyword=" + keyword;
				if(segmentID != "all"){
					api_call+= "&segmentID=" + segmentID
				}
				api_call+="&radius=" + radius + "&unit=" + unit + "&geoPoint=" + geoh;
				request({uri: api_call}).pipe(res);


			})
			.catch(function(err){
				console.log(err);
				res.send({"response":false});
			})
	}

}

module.exports = {
	searchResultsLoc
}
