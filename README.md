# ApiEndpoint

https://5mtd8ee5li.execute-api.ap-southeast-2.amazonaws.com/prod/nameMatching

## Postman test

Method: POST
body: {person: "华文吴"}

## Name Matching Lambda Function

This project provides an AWS Lambda function written in TypeScript to match a human name from a given list of names using OpenAI's GPT-3.5-turbo model.

## Goals

- Develop an AWS Lambda function that matches a human name in a list of names.
- Ensure the function returns the best-matched name consistently.

## Features

- Name matching using OpenAI's GPT-3.5-turbo.
- Few shot training for naming matching task.
- Post validation of the model response.
- Carefully designed prompt.
- Error handling and retries for OpenAI API calls.
- Validation of OpenAI responses against the provided list of names.
