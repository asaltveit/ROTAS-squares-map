# ROTAS-squares-map
An interactive map and timeline of the locations where ROTAS Squares were created. The user can add, update, and delete data points. 

Per the request of someone doing historical research.

## Current Version

<img width="1463" alt="Screenshot 2025-04-16 at 4 58 01 PM" src="https://github.com/user-attachments/assets/f95eb911-5bcc-46c1-915f-c68447a90fdf" />

## Why I built it this way
- I wanted to work with d3, and found that Observable Plot (which is built off of d3) had the functionality I needed to create the map.
- I started with creating just the map in an Observable Notebook - [link](https://observablehq.com/d/7f4625aa405d37c1). But connecting that to a database and restricting access to users was expensive, so the project was moved to a fullstack standalone website.
- I used Zustand for state management because I wanted to avoid some of the boiler plate from Redux.
- I used Material UI because styling was not a focus for this project and it had the accordion component that I wanted.

## Future Work
- Functionality to add a file of data points
- Screen recording / image functionality
- Additional timeline filters - speed/step of slider
- Better styling

## Set Up

# React+Vite Frontend

1. Presents a map of ROTAS square locations.
2. Provides an interactive timeline slider with animation.
3. Provides a section of filters for the map and timeline.
4. Provides a section to add, update, and delete locations. (In progress)

- In a terminal, run ``` npm run dev ``` to start.

