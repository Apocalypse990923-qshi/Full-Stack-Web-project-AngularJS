const path = require(`path`);
const bodyParser = require('body-parser');
const express  = require("express");
const cors = require('cors');
const axios = require('axios');
const { response } = require("express");
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');
app.use(cors());
app.use(express.static(path.join(__dirname,'/dist/my-app')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/dist/my-app/index.html'));
    //res.send("Hello");
});

app.get('/search', (req, res) => {
	res.sendFile(path.join(__dirname+'/dist/my-app/index.html'));
    //res.send("Hello");
});

app.get('/favorites', (req, res) => {
	res.sendFile(path.join(__dirname+'/dist/my-app/index.html'));
    //res.send("Hello");
});

var spotifyApi = new SpotifyWebApi({
  clientId: '2b15283b278d4fa8876719e37d8fe73f',
  clientSecret: '3a3e7ec822744768a2ba0f8e1a6f72bf',
});

app.get('/backend', (req, res) => {
	var result = "<html><body>"
	result += "<h1>Welcome to Qiushi Xu's Backend Server deployed on GCP of homework8</h1><br>"
	result += "Please visit <a href='https://cs571-hw8-379421.wl.r.appspot.com/search'>frontend page</a> for homework8<br>"
	result += "To test backend Request service, here are examples:<br>"
	result += "An example for <a href='https://cs571-hw8-379421.wl.r.appspot.com/search_events?keyword=Taylor Swift&category=Default&radius=10&latitude=34.03564453125&longitude=-118.27880859375'>searching events</a><br>"
	result += "An example for <a href='https://cs571-hw8-379421.wl.r.appspot.com/autocomplete?text=tay'>auto-complete</a><br>"
	result += "An example for <a href='https://cs571-hw8-379421.wl.r.appspot.com/detail?event_id=vvG1IZ9p2w_7HY'>searching details of specific event</a><br>"
	result += "An example for <a href='https://cs571-hw8-379421.wl.r.appspot.com/venue?venue=Sofi Stadium'>searching details of specific venue</a><br>"
	result += "An example for <a href='https://cs571-hw8-379421.wl.r.appspot.com/artist?artist=taylor swift'>searching artist's info</a> using Spotify API<br>"
	result += "</body></html>"
  res.status(200).send(result).end();
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

app.get('/search_events',(req,res) => {
	console.log("Search Request Got")
    url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=GBngPbqojMzEIxXGL69kv6QWLAAid4mm"
    console.log(req.query)
    const latitude =req.query.latitude
    const longitude = req.query.longitude
    const category = req.query.category
	const keyword = req.query.keyword
	const radius = req.query.radius
	const segmentId_dict = {
  		"Default": "",
		"Music": "KZFzniwnSyZfZ7v7nJ",
		"Sports": "KZFzniwnSyZfZ7v7nE",
		"Arts & Theatre": "KZFzniwnSyZfZ7v7na",
		"Film": "KZFzniwnSyZfZ7v7nn",
		"Miscellaneous": "KZFzniwnSyZfZ7v7n1"
	};
	segmentId = segmentId_dict[category];
	import('latlon-geohash').then((module) => {
		const Geohash = module.default;
  		geopoint = Geohash.encode(latitude, longitude, 7);
		url = url+"&keyword="+keyword+"&segmentId="+segmentId+"&radius="+radius+"&unit=miles"+"&geoPoint="+geopoint;
	    console.log(url)
	    axios.get(url ,{
	        method:'GET',
	    })
	    .then(function (response) {
	            console.log(response.data)
	            res.send(response.data)
	    }).catch(function (error) {
	            console.log(error);
	            res.status(500).send(error);
	    });
	}).catch((err) => {
  		console.error(err);
	});
})

app.get('/detail',(req,res) => {
    console.log("Event detail request got")
    //console.log(req.query)
    const id = req.query.event_id
	url="https://app.ticketmaster.com/discovery/v2/events/"+id+".json?apikey=GBngPbqojMzEIxXGL69kv6QWLAAid4mm"
    console.log(url)
    axios.get(url ,{
            method:'GET',
    })
    .then(function (response) {
            // console.log(response.data)
            res.send(response.data)
    }).catch(function (error) {
            console.log(error);
            res.status(500).send(error);
    });
})

app.get('/venue',(req,res) => {
    console.log("Venue detail request got")
    //console.log(req.query)
    const venue = req.query.venue
	url="https://app.ticketmaster.com/discovery/v2/venues?apikey=GBngPbqojMzEIxXGL69kv6QWLAAid4mm&keyword="+venue
    console.log(url)
    axios.get(url ,{
            method:'GET',
    })
    .then(function (response) {
            // console.log(response.data)
            res.send(response.data._embedded.venues[0])
    }).catch(function (error) {
            console.log(error);
            res.status(500).send(error);
    });
})

app.get('/artist',(req,res) => {
    //console.log(req.query)
    const artist = req.query.artist
	console.log("Spotify artist request got: ",artist);
	var artist_info;
	spotifyApi.clientCredentialsGrant().then(function(result) {
    	console.log('Retrieved access token', result.body.access_token);
    	spotifyApi.setAccessToken(result.body.access_token);
    	return spotifyApi.searchArtists(artist);
  	},function(err) {console.log('Something went wrong when retrieving an access token:', err.message);})
	.then(function(data) {
		//console.log("results of searching for artist: ", data.body);
		artist_info = data.body.artists.items[0];
		return spotifyApi.getArtistAlbums(artist_info.id,{limit: 3});
  	},function(err) {console.log('Something went wrong when searching an artist:', err.message);})
	.then(function(data2) {
		//console.log("results of searching albums of artist: ", data2.body);
		artist_info["albums"]=data2.body.items;
		console.log("Return info of ",artist,": ",artist_info);
		res.send(artist_info);
  	},function(err) {console.log('Something went wrong when searching albums of this artist:', err.message);})
})

app.get('/album',(req,res) => {
    console.log("Spotify album request got")
    //console.log(req.query)
    const artist_id = req.query.artist_id
	spotifyApi.clientCredentialsGrant().then(function(result) {
    	console.log('Retrieved access token', result.body.access_token);
    	spotifyApi.setAccessToken(result.body.access_token);
    	return spotifyApi.getArtistAlbums(artist_id,{limit: 3});
  	},function(err) {console.log('Something went wrong when retrieving an access token:', err.message);})
	.then(function(data) {
		console.log(data.body);
		res.send(data.body);
  	},function(err) {console.log('Something went wrong when searching albums of artist:', err.message);});
})

app.get('/autocomplete',(req,res) => {
    console.log("AutoComplete Request Got")
    url = 'https://app.ticketmaster.com/discovery/v2/suggest?apikey=GBngPbqojMzEIxXGL69kv6QWLAAid4mm&keyword='

    axios.get(url+req.query.text,{
        method:'GET',
    })
    .then(function (response) {
            // console.log(response.data)
            obj = response.data;
			var DataArray = [];
			if(obj["_embedded"] && obj["_embedded"]["attractions"]){
				len = obj._embedded.attractions.length;
				for(i=0;i<len;i++){
	                DataArray.push(obj._embedded.attractions[i].name);
	            }
			}
            console.log(DataArray)
            res.send(DataArray)
    }).catch(function (error) {
            console.log(error);
            res.status(500).send(error);
    });
})

module.exports = app;
