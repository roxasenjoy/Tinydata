### STAGE 1: Build ###
FROM node:14 as builder
LABEL maintainer "Lucas Gancel' <lucas@tiny-coaching.com>"
WORKDIR /app
COPY package*.json /app/
RUN npm install -g @angular/cli@11.2.4
RUN npm install
COPY . .
ARG ENVIRONMENT
RUN ng build --configuration=$ENVIRONMENT

### STAGE 2: Production Environment ###
FROM nginx
LABEL maintainer "Lucas Gancel' <lucas@tiny-coaching.com>"
ENV TZ=Europe/Paris

## wait script version
COPY --from=builder /app/dist/TinyData /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN chown 33:33 /usr/share/nginx/html -R
EXPOSE 80
