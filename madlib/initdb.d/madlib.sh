#!/bin/bash
set -e

PATH=$PATH:/usr/local/madlib/Versions/2.1.0/bin

/usr/local/madlib/Versions/2.1.0/bin/madpack -s madlib -p postgres -c postgres/supermotdepasse@localhost/postgres install-check
