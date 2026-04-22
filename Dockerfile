FROM node:18-alpine

WORKDIR /app

# Install serve globally (lightweight static server)
RUN npm install -g serve

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

# Serve build (production)
CMD ["serve", "-s", "build", "-l", "3000"]
