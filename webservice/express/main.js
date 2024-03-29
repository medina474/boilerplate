module.exports = () => {

  const router = require('express').Router();

  router.get('/', (req, res) => {
    res.status(200).json("Application Express");
  });

  router.get('/version', async (req, res) => {
    res.status(200).send("2023.01.20");
  });

  return router;
}
