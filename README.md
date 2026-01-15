# ROTAS-squares-map
An interactive map and timeline of where ROTAS Squares were created. Developed in three iterations: as an Observable Notebook, then with a local backend in Node, Express, and PostgreSQL, and finally hosted with Vercel and Supabase. 

Per the request of someone doing historical research.

## Current Version

<img width="1446" height="725" alt="Screenshot 2026-01-07 at 2 58 24 PM" src="https://github.com/user-attachments/assets/7a31d1d7-7137-4c8a-9b45-9a891da330f8" />

## Why I built it this way
- I started with creating just the map in an Observable Notebook - [link](https://observablehq.com/d/7f4625aa405d37c1). But connecting that to a database and restricting access to users was expensive, so the project was moved to a fullstack standalone website.
- Then I created a local PostgreSQL database with a Node.js, Express.js, Sequelize.js backend. But I didn't want to create and protect my own server, so I moved it to hosted services.
- I decided on Supabase and Vercel, because their free tiers were least likely to disable the project.
- I wanted to work with d3, and found that Observable Plot (which is built off of d3) had the functionality I needed to create the map.
- I used Zustand for state management because I wanted to avoid some of the boiler plate from Redux.
- I originally used Material UI because styling was not a focus for this project and it had an accordion component that I wanted. But I later removed Material UI in favor of TailwindCSS so that I could have easier control of styling.


## Future Work
- Better screen recording / image functionality

## Local Development:
- This project requires Node.js v24.13.0 or higher. If you're using nvm, run `nvm use` to switch to the correct version (specified in `.nvmrc`).
- In a terminal, run ``` npm install ``` to install dependencies.
- In a terminal, run ``` npm run dev ``` to start.

