# Use an official lightweight Node.js image.
FROM node:slim

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

COPY ./certs/ap-south-1-bundle.pem ./certs/ap-south-1-bundle.pem

# Install dependencies.
RUN npm install

# Copy the rest of the source code.
COPY . .

# Build the project (assuming tsc is configured to output to the 'dist' folder)
RUN npm run build

# Expose the port (make sure this matches your config; here we assume 3000)
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]