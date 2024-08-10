# Use the official Node.js image as the build image
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use the official Node.js image as the base image for the final stage
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm","run", "start"]

