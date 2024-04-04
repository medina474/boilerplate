# Protocole TLS

Le protocole TLS n'est pas structurellement différent de la version 3 de SSL, mais des modifications dans l'utilisation des fonctions de hachage font que les deux protocoles ne sont pas directement interopérables. Cependant TLS, comme SSL 3.0, intègre un mécanisme de compatibilité ascendante avec les versions précédentes, c'est-à-dire qu'au début de la phase de négociation, où le client et le serveur négocient la « meilleure » version du protocole disponible par tous deux. Pour des raisons de sécurité la compatibilité de TLS avec SSL 2.0 est abandonnée en 2011.

La génération des clés symétriques est un peu plus sécurisée dans TLS que dans SSLv3 dans la mesure où aucune étape de l'algorithme ne repose pas uniquement sur MD5 pour lequel sont apparues des faiblesses en cryptanalyse.

Janvier 1999 : Publication de la norme TLS 1.0. TLS est le protocole développé par l'IETF pour succéder au SSL. Plusieurs améliorations lui sont apportées par la suite :

Octobre 1999 : Ajout du protocole Kerberos à TLS ;

Mai 2000 : Passage à TLS lors d'une session HTTP 1.1 ;

Juin 2002 : Support du système de chiffrement AES.

Avril 2006 : Publication de la norme TLS 1.1.

Août 2008 : Publication de la norme TLS 1.2.

Mars 2011 : Abandon de la compatibilité avec SSL 2.0 pour toutes les versions de TLS.

Juin 2015 : Abandon de la compatibilité avec SSL 1.0 et SSL 3.0.

Référence : https://fr.wikipedia.org/wiki/Transport_Layer_Security

## Création du certificat de l'autorité racine de confiance

### 1. Créer un fichier de configuration appelé master.cnf

```
[req]
prompt = no
distinguished_name = dn

[dn]
CN = BUT ìnformatique               # Common Name / FQDN
emailAddress = emmanuel.medina@univ-lorraine.fr
O = Université de Lorraine          # Organization Name
OU = IUT de Saint-Dié des Vosges    # Organization Unit Name
L = Saint-Dié des Vosges            # Locality Name
C = FR                              # Country

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
```

Rubrique **[req]** : propriétés de la requête
prompt = no : ne demande pas les informations par le clavier mais utilise les informations du fichier de configuration. Cette méthode est à préférer si on souhaite utiliser des caractères autres qu'ascii.
distinguished_name = dn : rubrique à utiliser pour les informations du propriétaire du certificat.

**[dn]** : Contient les informations du propriétaire du certificat : Le pays, la ville, son nom, le détail de l'organisation.

**[v3_ca]** : Contient les propriétés pour définir un certificat racine et définit la politique d'utilisation du certificat (*keyUsage*)

### 2. Générer le certificat de l'autorité racine ainsi que la clé privée associée

```shell-session
openssl req -x509 -utf8 -newkey rsa:4096 -keyout master.key -config master.cnf
-extensions v3_ca -days 1826 -out master.crt
```

La commande req est utilisée pour traiter les demandes de création de certificats au format PKCS # 10. Nous l’utilisons ici pour créer un certificat auto-signé à utiliser comme autorité de certification racine.

**x509** : Norme spécifiant le format du certificat. Nous l’utilisons ici pour générer un certificat auto-signé au lieu d'une demande de certificat.

**utf8** : Les valeurs seront encodées en UTF8, sinon elles le seront en ascii et aucun accent ne sera affiché correctement.

**newkey rsa:4096** : Génère la clé privée RSA (de longueur 4096 bits) en même temps que le certificat.

**keyout** : Nom du fichier pour écrire la clé privée nouvellement créée (ici master.key).

**config** : fichier de configuration à utiliser (ici master.cnf)

**extensions** : rubrique du fichier de configuration à prendre en compte lors de la création du certificat. (ici les extensions v3_ca)

**days** : Nombre de jours de validité du certificat. Nous définissons ici une validité de 5 ans.

**out** : Nom du fichier pour écrire le certificat.

### 3. Installer le certificat racine dans chaque navigateur

Firefox – Options – Vie privée et sécurité – Afficher les certificats – Importer le fichier master.crt – Choisir le paramètre de confiance : Ce certificat peut identifier des sites web.

Chrome utilise le magasin de Windows qui est utilisé aussi par Edge et toutes les applications Windows.

Chrome – Paramètres – Rechercher : certificats – Gérer les certificats – Choisir l’onglet Autorités de certification racines de confiance – Importer … - Choisir le magasin par défaut.

## Création du certificat pour un domaine particulier

### 1. Générer une demande de certificat et la clé privée associée

```shell-session
openssl req -new -utf8 -newkey rsa:1024 -nodes -keyout boilerplate.key
-config boilerplate.cnf –out boilerplate.csr -days 180
```

-new : générer une demande de certificat
-nodes : ne pas chiffrer la clé (no DES)
-out : Nom du fichier pour écrire la demande de certificat.

Fichier de configuration boilerplate.cnf. (Utilisation de caractère non ascii)

```
[req]
prompt = no
distinguished_name = dn

[dn]
CN = localhost                             # Nom commun (Common Name / FQDN)
emailAddress = emmanuel.medina@univ-lorraine.fr
O = 大阪大学                                # Ōsaka Daigaku (Université d'Osaka)
OU = Факультет радиотехники и кибернетики  # Département d'Ingénierie Radio et Cybernétique
L =  الإسكندرية                             # al-ʾIskandariyya (Alexandrie)
C = IT                                     # Pays (Country)
```

### 2. Accepter et signer la demande de certificat

Fichier de configuration extensions.cnf qui va contenir les directives pour l'extension SAN (Subject Alternative Name)

```
[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
DNS.2 = boilerplate.docker.org
IP.1 = 192.168.1.19
```

```
openssl x509 -req -in boilerplate.csr ^
  -CA master.crt -CAkey master.key
  -CAcreateserial ^
  -extensions v3_req ^
  -extfile extensions.cnf ^
  -out boilerplate.crt
```

La commande x509 est utilisée pour générer un certificat au format PKCS # 10.

**CA** : certificat de l'autorité qui signe ce certificat

**CAkey** : clé privée de certificat d'autorité

*CAcreateserial* : fichier qui va contenir un identifiant de sérialisation, la prochaine fois utiliser l'option CAserial qui va incrémenter ce numéro de série.

**extfile** : fichier qui va contenir la configuration requise pour l'extension
