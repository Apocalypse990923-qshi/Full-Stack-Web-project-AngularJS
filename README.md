# CS571 HW8
Building website for Events Searching by AngularJS Framework, supporting searching by Keyword, Genre and Location(or Auto-Detect Location), with additional function of Showing Event, Musical Artists and Venue details(embedded with GoogleMap Geography).\
Establishing Back-end Server using Node.js, Deployed on Google Cloud Platform, Retrieving data with TicketMaster API and Spotify API, Sending JSON response to Front-end Website

Website Link: https://cs571-hw8-379421.wl.r.appspot.com/search

# Quickstart for Node.js in the App Engine standard environment

This is the sample application for the
[Quickstart for Node.js in the App Engine standard environment][tutorial]
tutorial found in the [Google App Engine Node.js standard environment][appengine]
documentation.

* [Setup](#setup)
* [Running locally](#running-locally)
* [Deploying to App Engine](#deploying-to-app-engine)
* [Running the tests](#running-the-tests)

## Setup

Before you can run or deploy the sample, you need to do the following:

1.  Refer to the [appengine/README.md][readme] file for instructions on
    running and deploying.
1.  Install dependencies:

        npm install

## Running locally

    npm start

## Deploying to App Engine

    gcloud app deploy

## Running the tests

See [Contributing][contributing].

[appengine]: https://cloud.google.com/appengine/docs/standard/nodejs
[tutorial]: https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
[readme]: ../../README.md
[contributing]: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/main/CONTRIBUTING.md
