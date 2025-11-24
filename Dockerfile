# Use an official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install pnpm (the package manager your project uses)
RUN npm install -g pnpm

# Copy package.json AND the pnpm lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of your frontend code
COPY . .

# Build your Next.js app for production
RUN pnpm run build

# Expose the port Next.js runs on
EXPOSE 3000

# The command to start the production server
CMD ["pnpm", "start"]