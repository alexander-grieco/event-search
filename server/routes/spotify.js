const request = require('request');
const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi({
	clientId: "aa1ce76ca50746f7bd19c91d7fdc4e2b",
	clientSecret: "d16848508db34cbd8f71720d060043bd"
})

const getToken = (req, res) =>{
	spotifyApi.clientCredentialsGrant().then(
		function(data) {
			console.log('The access token expires in ' + data.body['expires_in']);
			console.log('The access token is ' + data.body['access_token']);

			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body['access_token']);
		},
		function(err) {
			console.log('Something went wrong when retrieving an access token', err);
		}
	).catch((error)=>{
		console.log("Token access error: ", error);
	}).then(details(req, res));
}


const details = (req, res) => {
	let {keyword} = req.params;

	if(!keyword){
		return res.status(400).json("Incorrect form submission");
	}

	spotifyApi.searchArtists(keyword)
		.then(function(data){
			res.send(data.body);
		}, function(err){
			if(err.statusCode == 401){
				getToken(req, res);
			}
			else{
				res.send("Error calling Spotify API, not token related.")
			}
		}).catch((error)=>{
			console.log("Details error: ",error);
		});


}

module.exports = {
	details
}
