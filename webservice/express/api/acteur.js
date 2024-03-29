module.exports = (db) => {

  const router = require('express').Router();
  const validator = require('validator');

  /**
   * @swagger
   * components:
   *   schemas:
   *     Acteur:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           format: uuid
   *           description: ID de l'acteur
   *           example: 9ba16814-0229-4025-927c-795cd4d6dd07
   *         nom:
   *           type: string
   *           description: Le prénom et le nom de l'acteur.
   *           example: Sylvester Stallone
   *         naissance:
   *           type: string
   *           description: La date de naissance.
   *           example: 1946-07-06T00:00:00.000Z
   *         age:
   *           type: int
   *           description: L'age du capitaine, si l'acteur est toujours en vie.
   *           example: 76
   *         nb_film:
   *           type: int
   *           description: Nombre de films avec cet acteur.
   *           example: 11
   */

  /**
   *  @swagger
   *
   *  /acteur:
   *   get:
   *     tags:
   *       - Acteur
   *     summary: Liste des acteurs
   *     responses:
   *       200:
   *         description: successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Acteur'
   */
  router.get('/', async (req, res) => {
    const data = await db.any("SELECT * from cinema.acteur ORDER BY nb_film desc")
    res.status(200).json(data);
  });

  /**
   * @swagger
   *
   * /acteur/{id}:
   *   get:
   *     tags:
   *     - Acteur
   *     description: Détail de l'acteur
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: identifiant uuid de l'acteur.
   *         in: path
   *         required: true
   *         type: string
   *         format: uuid
   *         example: 9ba16814-0229-4025-927c-795cd4d6dd07
   *     responses:
   *       200:
   *         description: acteur
   *       400:
   *         description: "ID invalide"
   *       404:
   *         description: "Acteur non trouvé"
   */
  router.get('/:id', async (req, res) => {
    if (!validator.isUUID(req.params.id, "4")) {
      res.status(404).json({ status: 'error', message: 'bad format uuid', data: { id: req.params.id } });
    }

    try {
      const acteur = await db.oneOrNone("SELECT * from cinema.acteur where id = $1", req.params.id);

      if (acteur == null) {
        res.status(404).json({ status: 'error', message: 'not found', data: { id: req.params.id } });
      }

      acteur.roles = await db.manyOrNone(`SELECT m.*, c.role, c.alias from cinema.film as m
        INNER JOIN cinema.equipe as c on (c.film = m.id)
        WHERE c.personne = $1`, req.params.id)
      res.status(200).json({ status: 'success', data: acteur });
    }
    catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/:id/film', async (req, res) => {
    try {
      const data = await db.manyOrNone(`SELECT distinct m.id, m.titre, m.annee, m.sortie, m.duree,
      (SELECT personne.prenom || ' ' || personne.nom  FROM cinema.equipe
        inner join cinema.personne on (cinema.equipe.personne = cinema.personne.id)
        WHERE role = 'director' AND cinema.equipe.film = m.id LIMIT 1) as director
      from cinema.film as m
      inner join cinema.equipe as c on (c.film = m.id)
      WHERE c.personne = $1 and role = 'actor' ORDER by m.annee`, req.params.id)
      res.status(200).json(data);
    }
    catch (error) {
      res.status(200).send(error);
    }
  });

  router.put('/', (req, res) => {

    db.one("INSERT into cinema.personne (prenom, nom, naissance) VALUES ($1, $2, $3) RETURNING id",
      [req.body.prenom, req.body.nom, req.body.naissance])
      .then(function (data) {
        res.status(201).json({ status: 'success', data: data });
      })
      .catch(function (reason) {
        res.status(500).json(reason);
      });
  });

  router.put('/:id', (req, res) => {

    db.one("update cinema.personne set prenom = $2, nom = $3, naissance = $4 WHERE id = $1 RETURNING *",
      [req.params.id, req.body.prenom, req.body.nom, req.body.naissance])
      .then(function (data) {
        res.status(201).json({ status: 'success', data: data });
      })
      .catch(function (reason) {
        res.status(500).json(reason);
      });
  });

  router.delete('/:id', (req, res) => {
    db.one("delete from personne where id = $1", req.params.id)
      .then(function (data) {
        res.status(200).json({ status: 'success', data: data });
      })
      .catch(function (reason) {
        res.status(500).json(reason);
      })
  });
  return router;
}
