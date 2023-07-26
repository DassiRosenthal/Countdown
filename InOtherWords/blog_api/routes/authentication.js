const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
  const { validationErr } = userSchema.validate(req.body);
  if (validationErr) {
    const err = new Error(validationErr.details[0].message);
    err.statusCode = 403;
    return next(err);
  }
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return next(err);
    }

    try {
      const result = await global.users.insertOne({ email: req.body.email, password: hash });
      if (!result.insertedId) {
        return next(new Error('Registration failed.'))
      }
      const email = request.body.email;
      req.session.user = {
        email,
        isLoggedIn: true
      }
      await req.session.save();
    }
    catch (err) {
      if (err.code === 11000) {
        return next(new Error('Username is taken. Please try another.'));
      }
      //return next(new Error('Registration Failed'));
      return next(err);
    }
    res.sendStatus(201);
  });
})


router.post('/login', async (req, res, next) => {
  const { validationErr } = userSchema.validate(req.body);
  if (validationErr) {
    const err = new Error(validationErr.details[0].message);
    err.statusCode = 403;
    return next(err);
  }
  try {
    const existingUser = await global.users.findOne({ email: req.body.email });
    if (existingUser) {
      const correctPswrd = await bcrypt.compare(req.body.password, existingUser.password);
      if (correctPswrd) {
        if (req.session) {
          return next(new Error('Login failed- session error'));
        }
        let email = req.session.user.email;
        //existingUser.sessionID = req.sessionID;
        //await global.users.updateOne({ id: existingUser.id }, { $set: { sessionID: req.sessionID } });
        res.statusCode = 200;
        return res.send(email);
      }
      else {
        const invalidErr = new Error('Invalid username or password!');
        invalidErr.statusCode = 401;
        //return next(invalidErr);
        throw (invalidErr);
      }
    }
  }
  catch (err) {
    return next(err);
  }

});

router.post('/logout', (req, res) => {
  try {
    req.session.destroy();
  }
  catch (err) {
    return next(new Error('Error logging out'));
  }
  res.sendStatus(200);
});

module.exports = router;

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(16).required()
});