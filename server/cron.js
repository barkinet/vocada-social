/*
 * Cron-based Analytics Processing
 */
var Auth = require('./auth').getInstance(),
		Helper = require('./helpers'),
		Cron = require('cron').CronJob,
		Model = Model || Object,
		Harvester = {
			facebook: require('./harvesters/facebook'),
			twitter: require('./harvesters/twitter'),
			foursquare: require('./harvesters/foursquare'),
			google: require('./harvesters/google'),
			yelp: require('./harvesters/yelp'),
		};

var CronJobs = {
	facebook: {
		feed: new Cron({
			cronTime: '0 */30 * * * *',
			onTick: function() {
				Model.User.find(function(err, users) {
					users.forEach(function(user) {
						user.Business.forEach(function(business, indx) {

						var f = business.Social.facebook;
						if (
								typeof f.auth.oauthAccessToken !== 'undefined'
								&& typeof f.auth.expires !== 'undefined'
								&& typeof f.auth.created !== 'undefined'
								&& typeof f.account.id !== 'undefined'
								&& typeof f.account.oauthAccessToken !== 'undefined'
								&& f.auth.oauthAccessToken != ''
								&& f.auth.expires != 0
								&& f.auth.created != 0
								&& f.account.id != ''
								&& f.account.oauthAccessToken != ''
								&& f.auth.oauthAccessToken
								&& f.auth.expires
								&& f.auth.created
								&& f.account.id
								&& f.account.oauthAccessToken
								&& ((f.auth.created + f.auth.expires) * 1000 > Date.now())
							) {

								Harvester.facebook.getData({
									network: 'facebook',
									methods: ['page', 'posts'],
									user: user._id,
									analytics_id: business.Analytics.id,
									index: indx,
									network_id: f.account.id,
									auth_token: f.account.oauthAccessToken
								}, function(err) {
									console.log('callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});

							}
						}); // End of business forEach
					}); // End of users forEach
				}); // End of Model users array
			}, // End of onTick Cron function

			start: false
		}),

		insights: new Cron({
			cronTime: '0 30 3 * * *',
			onTick: function() {
				Model.User.find(function(err, users) {
					users.forEach(function(user) {
						user.Business.forEach(function(business, index) {

						var f = business.Social.facebook;
						if (
								f.auth.oauthAccessToken
								&& f.auth.expires
								&& f.auth.created
								&& f.account.id
								&& f.account.oauthAccessToken
								&& f.auth.oauthAccessToken != ''
								&& f.auth.expires != 0
								&& f.auth.created != 0
								&& f.account.id != ''
								&& f.account.oauthAccessToken != ''
								&& ((f.auth.created + f.auth.expires) * 1000 > Date.now())
							) {

								Harvester.facebook.getData({
									network: 'facebook',
									methods: ['page_insights', 'posts_insights'],
									user: user._id,
									analytics_id: business.Analytics.id,
									index: index,
									network_id: f.account.id,
									auth_token: f.account.oauthAccessToken
								}, function(err) {
									console.log('callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});

							}
						}); // End of business forEach
					}); // End of users forEach
				}); // End of Model users array
			}, // End of onTick Cron function

			start: false
		}),
	},


	twitter: {
		timeline: new Cron({
			cronTime: '45 * * * * *',
			onTick: function() {
				Model.User.find(function(err, users) {
					users.forEach(function(user) {
						user.Business.forEach(function(business, index) {

						var t = business.Social.twitter;
						if (
								t.auth.oauthAccessToken
								&& t.auth.oauthAccessTokenSecret
								&& t.id
								&& t.auth.oauthAccessToken != ''
								&& t.auth.oauthAccessTokenSecret != ''
								&& t.id != ''
							) {

								Harvester.twitter.getData({
									methods: ['credentials', 'timeline', 'mentions', 'retweets', 'dm', 'favorited'],
									user: user._id,
									analytics_id: business.Analytics.id,
									index: index,
									network_id: t.id,
									auth_token: t.auth.oauthAccessToken,
									token_secret: t.auth.oauthAccessTokenSecret
								}, function(err) {
									console.log('Twitter callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});
		
							} else {
								console.log('no credenttials or credentials problem');
							} // End of twitter credentials if statement

						}); // End of business forEach
					}); // End of users forEach
				}); // End of Model users array
			}, // End of onTick Cron function

			start: false
		}),

		retweeters: new Cron({
			cronTime: '0 */15 * * * *',
			onTick: function() {
				Model.User.find(function(err, users) {
					users.forEach(function(user) {
						user.Business.forEach(function(business, index) {

						var t = business.Social.twitter;
						if (
								t.auth.oauthAccessToken
								&& t.auth.oauthAccessTokenSecret
								&& t.id
								&& t.auth.oauthAccessToken != ''
								&& t.auth.oauthAccessTokenSecret != ''
								&& t.id != ''
							) {

								Harvester.twitter.getData({
									methods: ['retweeters'],
									user: user._id,
									analytics_id: business.Analytics.id,
									index: index,
									network_id: t.id,
									auth_token: t.auth.oauthAccessToken,
									token_secret: t.auth.oauthAccessTokenSecret
								}, function(err) {
									console.log('Twitter retweeters updates');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});
		
							} else {
								console.log('no credenttials or credentials problem');
							} // End of twitter credentials if statement

						}); // End of business forEach
					}); // End of users forEach
				}); // End of Model users array
			}, // End of onTick Cron function

			start: false
		}),

		users: new Cron({
			cronTime: '45 * * * * *',
			onTick: function() {
				Model.Connections.find({"Twitter.id" : {$gt: 0}}, {Twitter: {$elemMatch: {id: {$gt: 0}, handle: {$exists: false} }}}, function(err, connection) {
	console.log(connection); //connection.Klout[0]
})

						var t = business.Social.twitter;
						if (
								t.auth.oauthAccessToken
								&& t.auth.oauthAccessTokenSecret
								&& t.id
								&& t.auth.oauthAccessToken != ''
								&& t.auth.oauthAccessTokenSecret != ''
								&& t.id != ''
							) {

								Harvester.twitter.getData({
									methods: ['user_data'],
									user: user._id,
									analytics_id: business.Analytics.id,
									index: index,
									network_id: t.id,
									auth_token: t.auth.oauthAccessToken,
									token_secret: t.auth.oauthAccessTokenSecret
								}, function(err) {
									console.log('Twitter callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});
		
							} else {
								console.log('no credenttials or credentials problem');
							} // End of twitter credentials if statement

			}, // End of onTick Cron function

			start: false
		}) 
	},



	foursquare: new Cron({
		cronTime: '0 */15 * * * *',
		onTick: function() {

			Model.User.find(function(err, users) {
				users.forEach(function(user) {
					user.Business.forEach(function(business, index) {
						var f = business.Social.foursquare;
						if (
								f.auth.oauthAccessToken
								&& f.venue.id
								&& f.auth.oauthAccessToken != ''
								&& f.venue.id != ''
							) {

								Harvester.foursquare.getData({
									methods: ['venue', 'stats'],
									user: user._id,
									analytics_id: user.Business[index].Analytics.id,
									index: index,
									network_id: f.venue.id,
									auth_token: f.auth.oauthAccessToken
								}, function(err) {
									console.log('Foursquare callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});
						} // End of foursquare credentials if statement

					});
				});
			});
		},

		start: false
	}),

	google: new Cron({
		cronTime: '0 * * * * *',
		onTick: function() {

			Model.User.find(function(err, users) {

				for(var i=0,l=users.length;i<l;i++) {
					if(!users[i].Business.length || users[i].Business[0].Social.yelp.update.scraped === true)
						continue;

					users[i].Business.forEach(function(business, index) {

						var g = business.Social.google.business;
						if (g.id && g.id != '' && g.data.reference && g.data.reference != '') {

							Harvester.google.getData({
								methods: ['reviews'],
								user: users[i]._id,
								analytics_id: business.Analytics.id,
								index: index,
								network_id: g.id,
								network_ref: g.data.reference
							}, function(err) {
								console.log('Google callbacks complete');							
								//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
							});
						} // End of Google credentials if statement

					})
					break;
				}
			})
		},

		start: false
	}),


	yelp: new Cron({
		cronTime: '35 * * * * *',
		onTick: function() {

			Model.User.find(function(err, users) {
				//users.forEach(function(user) {

				for(var i=0,l=users.length;i<l;i++) {
					if(!users[i].Business.length || users[i].Business[0].Social.yelp.update.scraped === true)
						continue;

					users[i].Business.forEach(function(business, index) {

						var y = business.Social.yelp;
						if (y.id && y.id != '') {

								Harvester.yelp.getData({
									methods: ['reviews'],
									user: users[i]._id,
									analytics_id: business.Analytics.id,
									index: index,
									network_id: y.id
								}, function(err) {
									console.log('Yelp callbacks complete');							
									//res.json({success: true,connected: true,account: true,data: {businesses: null},url: null});
								});
						} // End of Yelp credentials if statement

					})
					break;
				}
			})
		},

		start: false
	})
} // end cronjobs namespace

module.exports = CronJobs;