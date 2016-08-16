FROM node:5.10
MAINTAINER jeffrey@learnersguild.org

# INSTALL any further tools you need here so they are cached in the docker build

# Set the WORKDIR to /app so all following commands run in /app
WORKDIR /app

# COPY the package.json and if you use npm shrinkwrap the npm-shrinkwrap.json
# and install npm dependencies before copying the whole code into the container
# (which avoids prematurely invalidating the docker cache)
COPY package.json ./

# Since we only did a COPY of package.json above rather than the whole codebase,
# we cannot run postinstall yet, so we pass the --ignore-scripts flag
RUN npm install --ignore-scripts

# After installing dependencies, copy the whole codebase into the container
COPY . ./

# Because we did --ignore-scripts above during `npm install`, run postinstall
# here. We need the --usafe-perm flag so that we have appropriate permissions
# to modify the filesystem in the container.
RUN npm run postinstall --unsafe-perm
