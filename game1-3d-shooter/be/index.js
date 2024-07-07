const express = require('express');
const router = express.Router();

router.get('/exp', async (req, res) => {
  res.json([{exp: 1}, {exp: 2}, {exp: 3}]);
});
