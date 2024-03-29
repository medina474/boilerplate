module.exports = (db) => {

  /*
  status
  0 planifié
  1 en production
  2 assemblage
  4 test
  5 terminé
  6 annulé
  */
  const router = require('express').Router();
  const validator = require('validator');

  router.get('/', async (req, res) => {
    const data = await db.any(`select o.id, o.order, o.status, p.reference as product, o.qty, o.time_start from "order" as o inner join product as p on (p.id = o.product) where status < 5`);
    res.status(200).json(data);
  });

  router.post('/', async (req, res) => {
    db.one("insert into 'order' (order, reference, qty) VALUES ($1, $2, $3) RETURNING id",
      [req.body.order, req.body.product, req.body.qte])
      .then(function (data) {
        res.status(201).json({ status: 'success', data: data });
      })
      .catch(function (reason) {
        res.status(500).json(reason);
      });
  });

  router.get('/status', async (req, res) => {
    const data = await db.one('SELECT sum(qty) from "order" WHERE status = 1');

    const data2 = await db.one('SELECT (time_end - time_start) as duree from "order" where status > 4');
    data.duree = data2.duree;

    data2 = await db.one('SELECT (time_end - time_start) as duree from "order" where status > 6');
    data.perte = data2.duree;
    data.ca = 500;

    res.status(200).json(data);
  });

  router.get('/fabriquer', async (req, res) => {
    await db.query(`INSERT INTO public."order" ("order", status, product, qty, time_start)
      VALUES (substr(encode(cast(random() as text)::bytea, 'base64'),4,8), 
      0, 
      floor(random() * 20 + 10)::int, floor(random() * 100 + 2)::int * 50, 
      now());`)

    res.status(200).json("ok");
  });

  router.get('/step', async (req, res) => {

    //await db.query(`UPDATE public."order" SET status = floor(random() * 6)::int WHERE status < 5;`);

    await db.query(`update "order" set status = status + 1 where id in (select id from "order" TABLESAMPLE BERNOULLI (10) WHERE status < 5)`);

    await db.query(`update "order" set time_end = now() WHERE status > 4 AND time_end is null`);

    res.status(200).json("ok");
  });

  router.get('/products', async (req, res) => {
    const data = await db.any('SELECT * from product order by id')
    res.status(200).json(data);
  });

  router.get('/product/:id', async (req, res) => {
    const data = await db.one('SELECT * from product WHERE reference=$1', req.params.id)
    res.status(200).json(data);
  });

  return router;
}