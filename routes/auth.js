const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
    showDialog: true
  }));

router.get(
    '/spotify/callback',
    passport.authenticate('spotify', {
      failureRedirect: `${process.env.CLIENT_URL}`,
    }),
    (_req, res) => {
      // Successful authentication, redirect to client-side application
      res.redirect(process.env.CLIENT_URL_SIGNIN);
    }
  );

  // User profile endpoint that requires authentication
router.get('/profile', (req, res) => {
    // Passport stores authenticated user information on `req.user` object.
    // Comes from done function of `deserializeUser`
  
    // If `req.user` isn't found send back a 401 Unauthorized response
    if (req.user === undefined)
      return res.status(401).json({ message: 'Unauthorized' });

      delete req.user.id;
      delete req.user.password;
      delete req.user.refresh_token;

    // If user is currently authenticated, send back user info
    res.status(200).json(req.user);
  });

  router.get('/logout', (req, res) => {
    // Passport adds the logout method to request, it will end user session
    req.logout((error) => {
        // This callback function runs after the logout function
        if (error) {
            return res.status(500).json({message: "Server error, please try again later", error: error});
        }
        // Redirect the user back to client-side application
        res.redirect(process.env.CLIENT_URL);
    });
  });

  module.exports = router;