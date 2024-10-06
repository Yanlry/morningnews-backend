var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');  

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(newDoc => {
        res.status(201).json({ result: true, token: newDoc.token });
      }).catch(err => {
        res.status(500).json({ result: false, error: 'Failed to save user' });
      });
    } else {
      res.status(409).json({ result: false, error: 'User already exists' });
    }
  }).catch(err => {
    res.status(500).json({ result: false, error: 'Internal server error' });
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).json({ result: true, token: user.token });
    } else {
      res.status(401).json({ result: false, error: 'Invalid username or password' });
    }
  }).catch(err => {
    res.status(500).json({ result: false, error: 'Internal server error' });
  });
});

router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canBookmark: data.canBookmark });
    } else {
      res.status(404).json({ result: false, error: 'User not found' });
    }
  }).catch(err => {
    res.status(500).json({ result: false, error: 'Internal server error' });
  });
});

module.exports = router;
