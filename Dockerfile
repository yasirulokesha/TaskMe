FROM node:20 AS base   
WORKDIR /backend                  
COPY package*.json ./        
RUN npm ci                   # Install dependencies
COPY . .                     
EXPOSE 3000                  
CMD ["node", "server.js"]    # Start command