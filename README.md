# HSD Wrapper

> :warning: This repo has been archived and moved under the new [SkynetHQ](https://github.com/SkynetHQ) repo [here](https://github.com/SkynetHQ/hsd_wrapper)

This is a thin wrapper for the HSD server. It exposes the `/hsd/:name` endpoint 
and maps it to the server's `getnameresource` RPC call.

The goal of this wrapper is to facilitate the resolution of Handshake domains to
Skynet links. Once we've resolved a valid skylink, we redirect the client to it.

## Docker image

The wrapper comes with a Docker image for easy execution. The image exposes a 
number of environment variables:  
* `HOST` and `PORT`: the host and port on which the wrapper should listen once
running. Defaults to `localhost:3100`.
* `PORTAL`: the Skynet portal to be used for skylink resolution. Default to 
`https://siasky.net`.
* `HSD_NETWORK`: The Handshake network to be used. Defaults to `main`.
* `HSD_HOST` and `HSD_PORT`: Defines where the wrapper can reach a trusted HSD 
node. If the HSD node is running on the host machine on which the Docker image
is being run, use `host.docker.internal` in order to make it possible for the 
wrapper to reach the server from within the container. Defaults to 
`0.0.0.0:12037`.
* `HSD_API_KEY`: The API key to use for authentication with the HSD node. 
Defaults to `foo`.

### Example command

On a Mac you can run it like this:
```
docker run --rm -d \
    -p 3100:3100 \
    -e HSD_HOST="host.docker.internal" \
    --name hsd_wrapper \
    nebulouslabs/hsd_wrapper
```

On Linux you might need to run with Docker Compose in order for the two 
containers to be able to share a network and talk to each other. An alternative
is to manually get the docker IP by running 
`ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+'` and then set the `HSD_HOST`
to that value.
