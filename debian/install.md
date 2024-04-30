## Installation de Debian

Démarrer sur l'iso

### Debian GNU/Linux UEFI Installer menu

Advanced options ...

... Expert install

### Debian installer main menu

#### Choose language

- Select a language : French - Français
- Pays (territoire ou région) : France
- Pays qui servira de base aux paramètres régionaux par défaut : France fr_FR.UTF-8
- Paramètres régionaux supplémentaires : (aucun)

### Acces software for a blind person using a braille display

- Ne pas faire, sauter l'étape

#### Configurer le clavier

Disposition du clavier à utiliser : Français

### Détection et montage du support d'installation

Continuer

#### Charger des composants depuis le support d'installation

- Ne rien sélectionner

### Détecter le matériel réseau

### Configurer le réseau

- Faut-il configurer le réseau automatiquement ? : Non
- Adresse IP : 192.168.137.84
- Valeur du masque-réseau : 255.255.255.0
- Passerelle : 192.168.137.254
- Adresses des serveurs de noms : 192.168.137.4
- Délai d'attente (en secondes) pour la détection du réseau : 3
- Nom de la machine : fx84
- Domaine : neotech.local

### Créer les utilisateurs et choisir les mots de passe

Faut-il activer les mots de passe cachés (< shadow passwords>) (11 Bullseye)
Oui

Faut-il autoriser les connexions du superutilisateur ?
Oui

Faut-il créer un compte d'utilisateur ordinaire maintenant ?
Non

### Configurer l'horloge

Faut-il utiliser NTP pour régler l'horloge ?
Non

Fuseau horaire :
Europe/Paris

### Détecter les disques

### Partionnner les disques
Assité - utiliser un disque entier

Schéma de partitionnement
Tout dans une seule partition (recommandé pour les débutants)

Terminer le partitionnement et appliquer les changements

Faut-il appliquer les changements sur les disques ?
Oui

### Installer le système de base

Noyau à installer
linux-image-amd64

Pilotes à inclure sur l'image disque en mémoire ( initrd )
image ciblée : seulement les pilotes nécessaires pour ce système

### Configurer l'outil de gestion des paquets

Faut-il analyser d'autres supports d'installation ?
Non

Faut-il utiliser un miroir sur le réseau
Oui

Protocole de téléchargement des fichiers
http

Souhaitez-vous utiliser des microprogrammes non libres ? (12 bookworm)
Non

Souhaitez-vous utiliser des logiciels non libres ?
Non

Souhaitez-vous utiliser des logiciels de la section contrib ?
Non

Activer les dépôts source dans APT
Non

Services à utiliser
- mises à jour de sécurité
- mises à jour de la publication

### Choisir et installer des logiciels

Gestion des mises à jour sur ce système :
Installation automatique des mises à jour de sécurité

Sélection des logiciels
Tout décocher

### Installer le programme de démarrage GRUB

Faut-il forcer l'installation sur le chemin des supports amovibles EFI
Non

Faut-il mettre à jour les variables dans la mémoire non volatile pour démarrer Debian automatiquement ? (12 bookworm)
Oui

Faut-il exécuter os-prober automatiquement pour détecter et amorcer d'autres systèmes ? (12 bookworm)
Non

### Terminer l'installation

L'horloge système est-elle à l'heure universelle (UTC) ?
Non




### Configurations supplémentaires

Configurer les tabulations dans l'éditeur Nano.
Créer le fichier ~/.nanorc

```
set tabsize 4
set tabstospaces
```

Mettre de la couleur dans le terminal.
Editer .bashrc

```
alias ls='ls --color=auto -la'
PS1="\[\e[01;33m\]\u@\h \[\e[01;32m\][\w]\[\e[0m\]\n\$ "

TMOUT=3000
```

## Envoi de syslog vers le NAS

systemctl status rsyslog

nano /etc/rsyslog.conf

*.* @192.168.137.52:514

un seul @ pour udp

systemctl restart rsyslog

## Sendmail

apt install --no-install-recommends msmtp-mta

## Mariadb

apt update
apt install --no-install-recommends mariadb-server
mysql_secure_installation

- Switch to unix_socket authentication [Y/n] y
- Change the root password? [Y/n] n
- Remove anonymous users? [Y/n] y
- Disallow root login remotely? [Y/n] y
- Remove test database and access to it? [Y/n] y
- Reload privilege tables now? [Y/n] y

Créer un utilisateur avec privilèges. le compte root à accès que depuis le terminal.

```shell-session
mariadb
```

```sql
GRANT ALL ON *.* TO 'medina5'@'localhost' IDENTIFIED BY 'KeePass' WITH GRANT OPTION;
FLUSH PRIVILEGES;
\q
```






CREATE TABLE 'prestashop';
CREATE USER 'prestashop'@'localhost' IDENTIFIED BY 'my-strong-password-here';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON prestashop.* TO 'prestashop'@'localhost';


apt list --installed
apt list --manual-installed
apt list --upgradable

apt php
apt depends php7.4


PHP CHROOT

Trop de fichiers de configuration à copier

mkdir /etc/skel/etc
mkdir -p /etc/skel/usr/share/zoneinfo/Europe

cp /etc/localtime /home/eureka/etc/localtime

chown root:root /home/eureka/etc
chown root:root -R /home/eureka/usr

### chroot
etc/php/ php.ini
cgi.fix_pathinfo=0


### Résumé
