export const DEFAULT_YAML = `version: '3.8'

services:
  frontend:
    image: node:18-alpine
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8080
    depends_on:
      - backend
    networks:
      - app-net

  backend:
    image: golang:1.19
    volumes:
      - ./server:/app
    environment:
      - DB_HOST=postgres
      - DB_USER=admin
    depends_on:
      - postgres
      - redis
    networks:
      - app-net
      - db-net

  postgres:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret
    networks:
      - db-net

  redis:
    image: redis:alpine
    networks:
      - db-net

volumes:
  db-data:

networks:
  app-net:
  db-net:
`;
