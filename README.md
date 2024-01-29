# Epigenetic clock - Phenotype relations Interactive Table

## Access to the tool

This tool is available [here](!!!ADDLINK!!!).

### Local running

You can have it all on your computer and use this tool without access to the internet. 

You need to have [docker](https://www.docker.com/) running on your computer. 

Then you need to clone this repository (require Internet access):
```bash
git clone !!!repo address!!!
cd !!!REPO NAME!!!
```

Then in Linux you just need to run 
```bash
./run.sh
``` 

It will launch `nginx:latest` docker container with passing the repo directory to the root directory of nginx server and opening port 8005.

After that you can go to `http://localhost:8005` in your browser and will get the interactive table locally.

Make sure you run `.\run.sh` for the first time **with** internet access as Docker need to download `nginx` docker image.

In other OS, you need to understand how to launch docker container with `nginx:latest` image, binding the repo directory to `/usr/share/nginx/html` inside the container and forwarding port 80 from inside the container to port 8005 (or any other) on your machine.

## Reference

This interactive table is part of the review paper:
!!!ENTER REFERENCE!!!

It includes data gathered in this paper and in previous review paper:
!!!ENTER OBLAK REFERENCE!!!

## Data

The raw data is available in the [csv]

## Licences

The code for interactive table implementation is licenced under BSD 3-clause licence

The data itself is share under [CC-BY-4.0 <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png" alt="CC-BY-4.0" width="88" height="31">](https://creativecommons.org/licenses/by/4.0/)
