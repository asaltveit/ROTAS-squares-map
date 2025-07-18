# ROTAS-squares-map
An interactive map and timeline of where ROTAS Squares were created. Developed in three iterations: as an Observable Notebook, then with a local backend in Node, Express, and PostgreSQL, and finally hosted with Vercel and Supabase. 

Per the request of someone doing historical research.

## Current Version

<img width="1463" alt="Screenshot 2025-04-16 at 4 58 01 PM" src="https://github.com/user-attachments/assets/f95eb911-5bcc-46c1-915f-c68447a90fdf" />

## Why I built it this way
- I started with creating just the map in an Observable Notebook - [link](https://observablehq.com/d/7f4625aa405d37c1). But connecting that to a database and restricting access to users was expensive, so the project was moved to a fullstack standalone website.
- Then I created a local PostgreSQL database with a Node.js, Express.js, Sequelize.js backend. But I didn't want to create and protect my own server, so I moved it to hosted services.
- I decided on Supabase and Vercel, because their free tiers were least likely to disable the project.
- I wanted to work with d3, and found that Observable Plot (which is built off of d3) had the functionality I needed to create the map.
- I used Zustand for state management because I wanted to avoid some of the boiler plate from Redux.
- I used Material UI because styling was not a focus for this project and it had an accordion component that I wanted.

## Current Work
- Update locations

## Future Work
- Better screen recording / image functionality
- Additional timeline filters - speed/step of slider
- Better styling

## Local Development:
- In a terminal, run ``` npm run dev ``` to start.

