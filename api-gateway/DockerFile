# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

#Install global dependencies (if any)
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
#----legacy-peer-deps
# Copy source files
COPY . .

# Build the Nest app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]