const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/Account');

router.post('/register', async (req, res) => {
    try {
      const { email, name, password, accountType} = req.body;

      const existingAccount1 = await Account.findOne({ name });
      const existingAccount2 = await Account.findOne({ email });

      if (existingAccount1 || existingAccount2) {
        return res.status(400).send('Account already exists. Please choose a different one.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const account = new Account({ email, name, password: hashedPassword, accountType});
      await account.save();
      res.status(201).redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering account');
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const account = await Account.findOne({ email });
      if (!account) {
        return res.render('index.hbs', { error: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.render('index.hbs', { error: 'Invalid email or password' });
      }
      console.log('logged in');
      req.session.account = account;
      console.log(account.name);
      res.redirect(`/home`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  });

  
  module.exports = router;
  
