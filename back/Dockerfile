FROM node

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Specify the command to run the application
CMD ["node", "app.js"]