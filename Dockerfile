FROM node:10

WORKDIR "/nsd_wrapper"

COPY package.json package-lock.json ./
RUN npm ci
COPY index.js ./

ENV HOST="localhost"
ENV PORT=3100

ENV PORTAL="https://siasky.net"

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE $PORT

ENTRYPOINT ["node", "index.js"]
