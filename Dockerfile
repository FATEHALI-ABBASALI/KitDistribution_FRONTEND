FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy package files
COPY package*.json ./

# Install dependencies + xlsx
RUN npm install && npm install xlsx

# Copy project files
COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["serve", "-s", "build", "-l", "3000"]
