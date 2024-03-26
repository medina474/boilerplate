apt install gnupg

Convert if necessary
Verify that the filetype is "PGP public key block Public-Key (old)":
file <keyfile>.<ext>

gpg supports a number of key formats, so if your key is in a different format, convert it by importing it into a temp keyring, then exporting it again:
gpg --no-default-keyring --keyring ./temp-keyring.gpg --import <keyfile>.<ext>
gpg --no-default-keyring --keyring ./temp-keyring.gpg --export --output <your-keyfile-name>.gpg
rm temp-keyring.gpg

Now that you have your converted key, do not add it to apt's trusted keystore by copying it into /etc/apt/trusted.gpg.d/
Instead, put it somewhere like /etc/apt/keyrings/. (You might need to create that keyrings directory first.)

https://askubuntu.com/questions/1286545/what-commands-exactly-should-replace-the-deprecated-apt-key
