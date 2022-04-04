# Install and build packages dependencies
FROM node:16-buster-slim as packages
WORKDIR /packages
COPY package.json .
COPY packages/types/package.json ./packages/types/package.json 
COPY packages/shared-server/package.json ./packages/shared-server/package.json 

# install package dependencies
RUN yarn

# Copy over packages files
COPY packages/types ./packages/types
COPY packages/shared-server ./packages/shared-server

# Run build
RUN npm run build:types
RUN npm run build:shared-server

FROM node:16-buster-slim as frontend-build
WORKDIR /frontend-build

COPY package.json .
COPY apps/frontend/package.json ./apps/frontend/package.json 
COPY --from=packages /packages .

RUN yarn

COPY apps/frontend ./apps/frontend
COPY .eslintrc .

RUN npm run build:frontend:umbrel

FROM node:16-buster-slim as backend-build
WORKDIR /backend-build

COPY package.json .
COPY apps/express/package.json ./apps/express/package.json 
COPY --from=packages /packages .

RUN yarn

COPY apps/express ./apps/express
# COPY --from=frontend-build /frontend-build/apps/frontend/build ./apps/frontend

RUN npm run build:express

FROM node:16-buster-slim as final
WORKDIR /final

COPY --from=backend-build /backend-build/apps/express/dist ./apps/express/dist
COPY --from=backend-build /backend-build/apps/express/package.json ./apps/express
COPY --from=backend-build /backend-build/node_modules ./node_modules
COPY --from=frontend-build /frontend-build/apps/frontend/build ./apps/frontend
COPY --from=packages /packages .
COPY package.json .

# Copy over HWI binary
COPY packages/HWIs/HWI_PI ./apps/express/build/HWIs/

# Intall HWI dependencies
RUN apt update && apt install libusb-1.0-0 libusb-1.0.0-dev libudev-dev python3-dev -y

EXPOSE 42069

CMD ["npm", "run", "express"]