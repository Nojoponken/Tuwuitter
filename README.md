# Tuwuitter

Create an account, add friends and post on peoples boards!

![Screenshot of the website showing a profile belonging to Noah. The profile has two posts: The first reads "Good programmers program because it is fun to program." and is authored by JohnDoe; The second reads "Hello world!" and is authored by Noah. The profile has a "Friends" list containing Giedre and JohnDoe.](tUwUitter.webp)

# Running the project

In order to run the project you need to have a MongoDB database for the backend
to use. Either you can provide your own or use the ~docker-compose.yaml~ to
spin up a docker container locally.

Both the backend and frontend need to be configured with ~.env~ files. If you
are running locally and with the docker container you can use the provided
example files.

```bash
cp .env-example-frontend ./frontend/.env
cp .env-example-backend ./backend/.env
```

## Running MongoDB with Docker

Prerequisites:
 - docker
 - docker-compose

Stand in the root of the project and run:

```bash
sudo docker compose up -d
```

The flag ~-d~ runs the container in the background (detached) and is not
required, but there for convenience. You can stop the container with:

```bash
sudo docker container stop mongo
```

## Running the backend and frontend

Prerequisites:
 - npm

### Backend

Navigate into the ~backend~ directory. Make sure the ~.env~ is correctly
configured (see ~.end-example-backend~). Install package dependencies with:

```bash
npm install
```

When developing, it is nice for the server to restart automatically. For this
run:

```bash
npm run dev
```

To run normally use:

```bash
npm run start
```

### Frontend

Navigate into the ~frontend~ directory. Make sure the ~.env~ is correctly
configured (see ~.end-example-frontend~). Install package dependencies with:

```bash
npm install
```

Run the frontend with:

```bash
npm run dev
```
