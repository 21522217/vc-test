### RUN DATABASE ###

NOTE: Download postgres to run this database.

1. Read all the steps inside queries.sql.
2. Run the scripts inside through vary steps from 1 to 14 (Some are not needed but just for making sure all validates are added).
3. Once you run all the code your database is ready to go.

### RUN BACKEND ###

1. I'm using npm version 20.9.0 for this project.
2. Run `npm install` to install all the dependencies.
3. Run `npm run dev` to start project (port localhost:10000).
4. ".env" is public for clarification (I would have include it in ".gitignore" but this is for test so it's okay).

### RUN FRONTEND ###

1. I'm using npm version 20.9.0 for this project.
2. Run `npm install` to install all the dependencies.
3. Run `npm start` to start project (port localhost:3000).

### FLOW OF THE WORK ###

1. Login as a user (using password and username in ".env").
2. There's a list of cars displayed at "localhost:3000/cars" once you logged in.
3. Every car has it own criterias list for inspection (The criterias are added manually inside database already).
4. Inspection on every car will have the list of criterias.