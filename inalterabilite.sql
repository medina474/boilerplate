CREATE TABLE operation (
  id SERIAL,
  value INTEGER NOT NULL,
  datetime TIMESTAMP NOT NULL UNIQUE DEFAULT NOW(),
  ope_hash CHARACTER VARYING(256) NOT NULL,
  PRIMARY KEY(id)
);

-- Initialisation
INSERT INTO operation(value, ope_hash)
SELECT 0, MD5( 0::character || EXTRACT(EPOCH FROM NOW()) );


INSERT INTO operation (value, ope_hash)
-- on calcul le hash en concatément la valeur et la date de l'opération avec le hash précédent
SELECT 50, MD5(50::character || EXTRACT(EPOCH FROM NOW()) || ope_hash )
FROM
  operation as o
    INNER JOIN (
      -- on récupère le moment de la dernière opération
      SELECT MAX(datetime) as datetime
      FROM operation
    ) as temp
      ON temp.datetime = o.datetime;
