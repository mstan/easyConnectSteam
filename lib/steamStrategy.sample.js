var SteamStrategy = require('../node_modules/passport-steam/lib/passport-steam').Strategy

module.exports = new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '<TOKEN>'
  },
  function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {


      profile.id = profile._json.steamid;
      return done(null, profile);
    });
  }
)