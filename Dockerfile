FROM node:10

WORKDIR "/nsd_wrapper"

COPY index.js package.json package-lock.json ./

RUN npm ci

ENV HOSTNAME="localhost"
ENV PORT=3100
ENV HSD_NETWORK="mainnet"
ENV HSD_HOST="127.0.0.1"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE $PORT

ENTRYPOINT ["node", "index.js"]
