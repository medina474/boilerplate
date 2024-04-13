Base de données comme source unique de vérité

L'utilisation de PostgREST est une alternative à la programmation CRUD manuelle. Les serveurs API personnalisés souffrent de problèmes. L’écriture d’une logique métier duplique, ignore ou entrave souvent la structure de la base de données. Le mappage objet-relationnel est une abstraction qui fuit conduisant à un code impératif lent. La philosophie PostgREST établit une seule source déclarative de vérité : les données elles-mêmes.

Programmation déclarative

Il est plus facile de demander à PostgreSQL de joindre les données pour vous et de laisser son planificateur de requêtes comprendre les détails plutôt que de parcourir les lignes vous-même. Il est plus facile d'attribuer des autorisations aux objets de base de données que d'ajouter des gardes dans les contrôleurs. (Cela est particulièrement vrai pour les autorisations en cascade dans les dépendances de données.) Il est plus facile de définir des contraintes que d'encombrer le code de contrôles d'intégrité.

Abstraction étanche

Aucun ORM n’est impliqué. La création de nouvelles vues se produit dans SQL avec des implications connues sur les performances. Un administrateur de base de données peut désormais créer une API à partir de zéro, sans programmation personnalisée.

Une chose bien

PostgREST a une portée ciblée. Cela fonctionne bien avec d'autres outils comme Nginx. Cela vous oblige à séparer clairement les opérations CRUD centrées sur les données des autres préoccupations. Utilisez une collection d’outils tranchants plutôt que de construire une grosse boule de boue.


Copier dans le dossier postgresql/initdb les fichiers sql

Copier dans le dossier postgresql/tmp les fichiers csv


docker build ./ -t boilerplate/postgresql:2024.04
