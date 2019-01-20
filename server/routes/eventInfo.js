const geohash = require('ngeohash');
const request = require('request');

const results = (req, res) => {
	let {id} = req.params;

	if(!id){
		return res.status(400).json("Incorrect form submission");
	}
	
	let api_call = "https://app.ticketmaster.com/discovery/v2/events/" + id + "?apikey=Rsc8KOS2Vttgw9VtGw4uGXEpyuDilVML";
	request({uri: api_call}).pipe(res);

}

module.exports = {
	results
}