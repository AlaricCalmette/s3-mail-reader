# This stage installs our modules
FROM node:alpine
WORKDIR /app
COPY package.json yarn.lock ./

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN yarn

# Then we copy over the modules from above onto a `slim` image
FROM node:alpine

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini
# ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app
COPY --from=0 /app .
COPY . .
EXPOSE 1234
RUN yarn build
CMD ["yarn", "run", "appStart"]
