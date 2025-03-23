<img src="public/favicon.ico" height="100" width="100">

# looper

Have you ever wanted to loop over the most catchy part of your favorite song on Spotify? Well, now you can!

This project is a web application that allows you to loop over a specific part of a song on Spotify. You can select the start and end time of the loop and the application will play that part of the song in a loop.

Note: you have to have a Spotify account, be logged in and be playing a song on Spotify from a device.

## Live Version

Check out the live version [here](https://looper.toluolatubosun.com/)

## Watch on YouTube

Check out the demo on YouTube [here](https://www.youtube.com/watch?v=)

---

## Setup & usage

**1. Install all dependencies**

```bash
yarn install
```

**2. Start the development server**

```bash
yarn dev
```

**3. Open [http://localhost:4000](http://localhost:4000) with your browser to see if the server is up.**

---

## Naming Conventions

### Classes and Types
When naming classes and types, use PascalCase.

```typescript
class MyClass {
  // ...
}

type MyType = {
  // ...
};
```

### Functions and Variables
When naming functions and variables, use camelCase.

```typescript
const myFunction = () => {
  // ...
};

const myVariable = 0;
```

### Database Columns or Data In/Out
for database columns & response payloads, use snake_case.

```json
{ 
    "first_name": "John",
    "last_name": "Doe"
}
```

---

## Setting Up Prisma

Ensure you have the `DATABASE_URL` environment variable set in a `.env` file in the root of the project, which is the connection string to your database.

```.env
# If you are using the database in a docker container, you can use the following connection string

DATABASE_URL="postgresql://postgres:password@localhost:5420/spotify-looper"
```

To run the docker compose file, run the following command:

````bash
docker-compose up -d
````

```bash
# Install Prisma 
# **You don't need to run this command since the prisma folder is already created
npx prisma init

# Generate Prisma Client
npx prisma generate

# Run existing migrations
npx prisma migrate dev

# Create a new migration
# **If you make changes to the schema.prisma file, you need to create a new migration
npx prisma migrate dev --name init
```

## Contribution Guide

### Git Contribution

> Perform all your changes on a fork of the base repository.

> Open a pull request once you have completed your changes.

> Don't forget to sync your fork and pull frequently in case any new changes that have been made to the base repository may conflict with your changes.

---

### File Formatting

The same prettier config will be used for code formatting. It should be automatically applied when you use the VS Code prettier extension. If you are using something other than VS Code, try to see if a prettier extension is available for that.

---

_official policy: it is fOrBiddEn to bring down production with your PRs !!_
