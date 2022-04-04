FROM node:16-buster-slim as install

WORKDIR /install
# TODO: this should only copy package.jsons in appropriate folders
COPY . .

# Use yarn for correct webpack version hoisting
RUN yarn

FROM node:16-buster-slim as build
WORKDIR /build

COPY --from=install /install .

ENV GENERATE_SOURCEMAP false

# ARG EXPRESS_PORT
# ENV EXPRESS_PORT $EXPRESS_PORT

# ARG REACT_APP_KEYSERVER_SIGNING_ADDRESS
# ENV REACT_APP_KEYSERVER_SIGNING_ADDRESS $REACT_APP_KEYSERVER_SIGNING_ADDRESS

# ARG REACT_APP_LILY_ENDPOINT
# ENV REACT_APP_LILY_ENDPOINT $REACT_APP_LILY_ENDPOINT

# ARG REACT_APP_BACKEND_HOST
# ENV REACT_APP_BACKEND_HOST $REACT_APP_BACKEND_HOST

# ARG REACT_APP_BACKEND_PORT
# ENV REACT_APP_BACKEND_PORT $REACT_APP_BACKEND_PORT


RUN npm run build:types
RUN npm run build:frontend:umbrel

# # production environment
FROM nginx:stable-alpine
WORKDIR /app
COPY --from=build build/apps/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]