docker run --rm httpd:2.4-alpine htpasswd -nbB admin 'superpassword' | cut -d ":" -f 2
You need to escape each $ character inside the hashed password with another $
https://hostingcanada.org/htpasswd-generator/ choisir BCrypt.
Le login est obligatoirement admin
