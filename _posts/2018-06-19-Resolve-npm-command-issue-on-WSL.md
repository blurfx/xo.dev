---
layout: post
title: "Resolve npm command issue on Windows Subsystem Linux"
date: 2018-06-19
categories: Tech
comments: true
share: true
---

I was getting the following error when running `npm` from WSL shell.
```sh
$ npm -v
: not foundram Files/nodejs/npm: 3: /mnt/c/Program Files/nodejs/npm:
: not foundram Files/nodejs/npm: 5: /mnt/c/Program Files/nodejs/npm:
/mnt/c/Program Files/nodejs/npm: 6: /mnt/c/Program Files/nodejs/npm: Syntax error: word unexpected (expecting "in")
```

So I checked the location of npm binary with `which` command and I can see it npm is Windows binary.
```sh
$ which npm
/mnt/c/Program Files/nodejs/npm
```

Now I know npm for Linux is not installed so, I need to install it. [check this page](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).
```sh
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

Finally, I can see that npm is working well. Done!
```sh
$ which npm
/usr/bin/npm

$ npm -v
5.6.0
```
