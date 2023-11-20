FROM node:20.9.0

# Create the app directory in the container
WORKDIR /Vuetify

# Copy package.json and package-lock.json to the container
COPY package*.json .

ENV VITE_LEGACY=true

# Install regular dependencies
RUN npm install

# Copy the rest of your app's source code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]