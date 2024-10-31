# Overview

This README summarizes various container related instructions

# Building The Container

```
docker build -t cybersmithio/oidctestapp ./ -f Dockerfile
```

# Run The Container

```
docker run --rm -it --name oidctestapp -p 443:3000 --mount type=bind,source=/c/Users/jsmith/VSC/oidc-demo-app/.env,target=/usr/src/app/.env cybersmithio/oidctestapp
```

# Publish To Docker Hub

```
docker push cybersmithio/oidctestapp
```