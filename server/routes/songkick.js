const request = require("request-promise")

const api_key = "kPzsmkbsP09Zgyty";

const info = (req, res) => {
	let {venue} = req.params;
	if(!venue){
		return res.status(400).json("Incorrect form submission");
	}
	venue = venue.split(' ').join('+');
	let options ={
		method: "GET",
		uri: "https://api.songkick.com/api/3.0/search/venues.json?query=" + venue + "&apikey=" + api_key,
		json: true		
	}

	request(options)
		.then(function(response){
			let id = '0'
			if(response.resultsPage.results.venue != undefined){
				id = response.resultsPage.results.venue[0].id;
			}
			
			options = {
				method:"GET",
				uri: "https://api.songkick.com/api/3.0/venues/" + id + "/calendar.json?apikey=" + api_key
			}
			request(options).pipe(res)
		})
		.catch(function(err){
			console.log(err);
		})
}

module.exports = {
	info
}
