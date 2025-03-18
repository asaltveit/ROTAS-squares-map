# ROTAS-squares-map
An interactive map and timeline of the locations where ROTAS Squares were created. The user can add, update, and delete data points. 

Per the request of someone doing historical research.

## Current Version

<img width="1373" alt="Screenshot 2025-03-17 at 5 06 14 PM" src="https://github.com/user-attachments/assets/7fb72b07-13c8-4ddc-b915-201db71e240d" />

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
[Frontend](frontend/README.md)  
[Backend](backend/README.md)
