const request = require('request');

const suggestions = (req, res) => {
	let {keyword} = req.params;

	if(!keyword){
		return res.status(400).json("Incorrect form submission");
	}

	let api_call = "https://app.ticketmaster.com/discovery/v2/suggest?apikey=Rsc8KOS2Vttgw9VtGw4uGXEpyuDilVML&keyword=" + keyword;
	request({uri: api_call}).pipe(res);
}

module.exports = {
	suggestions
}
