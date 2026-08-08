FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Start the application on the port expected by Hugging Face
ENV PORT=7860
EXPOSE 7860

# Run the backend server
CMD ["npm", "start"]
