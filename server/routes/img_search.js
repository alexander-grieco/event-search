const request = require('request');

const api_key = "AIzaSyDoP8QMc28Pe4XGxhfdKF0ERLs9HMdEtUY";
const search_engine_id = "000748941404988740991:dc4ps_spmy8";


const images = (req, res) => {
	let {keyword} = req.params;

	if(!keyword){
		return res.status(400).json("Incorrect form submission");
	}

	keyword = keyword.split(' ').join('+');

	let api_call = "https://www.googleapis.com/customsearch/v1?q=" + keyword + "&cx=" + search_engine_id + "&imgSize=huge&imgType=news&num=8&searchType=image&key=" + api_key;
	request({uri: api_call}).pipe(res);
}

module.exports = {
	images
}

