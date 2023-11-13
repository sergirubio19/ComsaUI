FROM node:20.9.0

# Create the app directory in the container
WORKDIR /Vuetify

# Copy package.json and package-lock.json to the container
COPY ./Vuetify/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code to the container
COPY ./Vuetify .

# Build your Vue.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]