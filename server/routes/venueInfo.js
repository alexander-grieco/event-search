const geohash = require('ngeohash');
const request = require('request');

const results = (req, res) => {
	let {venue} = req.params;

	if(!venue){
		return res.status(400).json("Incorrect form submission");
	}
	venue = venue.split(' ').join('%20');
	let api_call = "https://app.ticketmaster.com/discovery/v2/venues/?apikey=Rsc8KOS2Vttgw9VtGw4uGXEpyuDilVML&keyword=" + venue;
	request({uri: api_call}).pipe(res);

}

module.exports = {
	results
}