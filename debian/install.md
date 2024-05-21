




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
PS1="\[\e[01;33m\]\u@\h \[\e[01;34m\][\w]\[\e[0m\]\n\$ "

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
