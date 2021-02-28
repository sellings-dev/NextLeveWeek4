# NextLevelWeek4
A repository for the NPS system developed during the Node.js path of RocketSeat's event Next Level Week #4

## The project

#### This is a program made with Node.js to manage and send NPS surveys.

#### You are able to register users to whom different surveys may be sent through email and you can get info about the results of that specific survey.

## Dependencies

#### The main dependencies of this project are:

- Express: used for running the server and routing the api
- Typeorm: used for building database migrations and repositories
- Jest: used for automated testing of system features
- Yup: for validation of input data
- Nodemailer: used for sending emails
- Handlebars: used for templating the emails

## `.env` Structure

#### There's a `.env-example` to help you, but we have only two environment variables to set:

- `URL_MAIL`, which is used by the `SendMailController` to pass the route that will receive the answers to the email
- `GOAL_NPS`, which is used to indicate to the NPS calculator what your goal is (1 - 100)

## Routes

#### We have 6 routes in this API:

- POST `/users` : Creates a user
  - Request:
    - `name`
    - `email`
  - Response:
    - `201` -> user json

- POST `/surveys` : Creates a survey
  - Request:
    - `title`
    - `description`
  - Response:
    - `201` -> survey json

- GET `/surveys` : Shows all surveys
  - Response:
    - `201` -> surveys json

- POST `/sendMail` : Creates a record in the surveysUsers table and sends the survey to the user's email
  - Request:
    - `email`
    - `surveyId`
  - Response:
    - `201` -> surveyUser json, user json and survey json

- GET `/answers/:value` : Registers the value of a survey answer
  - Request:
    - `value`
    - `userId`
  - Response:
    - `201` -> surveyUser json

- GET `/nps` : Creates a survey
  - Request:
    - `surveyId`
  - Response:
    - `201` -> nps results json
