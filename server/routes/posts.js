const express = require('express');
const router = express.Router();

//controllers
const tm_search = require('./tm_search');
const otherloc = require('./otherloc');
const tm_autocomplete = require('./tm_autocomplete');
const spotify = require('./spotify');
const img_search = require('./img_search');
const songkick = require('./songkick');
const eventInfo = require('./eventInfo');
const venueInfo = require('./venueInfo');


router.get('/ticketmaster/:keyword/:segmentID/:radius/:unit/:lat/:long/', (req, res) => {tm_search.searchResults(req, res)});
router.get('/otherloc/:keyword/:segmentID/:radius/:unit/:location/', (req, res) => {otherloc.searchResultsLoc(req, res)});
router.get('/eventInfo/:id', (req, res) => {eventInfo.results(req, res)});
router.get('/venueInfo/:venue', (req, res) => {venueInfo.results(req, res)});
router.get('/autocomplete/:keyword', (req, res) => {tm_autocomplete.suggestions(req, res)});
router.get('/spotify/:keyword', (req, res) => {spotify.details(req, res)});
router.get('/images/:keyword', (req, res) => {img_search.images(req, res)});
router.get('/songkick/:venue', (req, res) => {songkick.info(req, res)});

module.exports = router;