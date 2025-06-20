# Mapping the Valor

[View live project here on Heroku](https://mapping-the-valor-a17b7cc98edf.herokuapp.com/)

<br>

## CONTENTS

* [Concept](#concept)
* [Project Planning](#project-planning)
  * [Wireframes](#wireframes)
  * [Project Board](#project-board)
  * [Styling Choices](#styling-choices)
* [Features for MVP](#features-for-mvp)
* [User Experience](#user-experience)
* [Technology Used](#technology-used)
  * [Languages, Frameworks, Editors & Version Control](#languages-frameworks-editors--version-control)
  * [Tools Used](#tools-used)
* [Database](#database)
  * [Database Schema](#database-schema)
* [Features](#features)
  * [Future Features](#future-features)
* [Testing](#testing)
  * [Found Bugs & Fixes](#found-bugs--fixes)
* [Deployment](#deployment)
* [Credits](#credits)

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>
<br>

---

## Concept

This project is to fulfil the requirements of the Capstone project with CodeInstitute.
The idea for the project is to provide a space for research and interaction for site users who have an interest in the history of England.
By selecting the monasteries as a defined list of items, and encouraging users to add information to the database, the project aims to achieve the CRUD features of this full stack web application.

### What is the Valor?

The Valor, or to give it its full name, the 'Valor Ecclesiasticus' is a comprehensive record of all the church held lands in England and Wales on the eve of the Reformation. 
It is a document which gives a fascinating insight into land ownership, local and national economy, and the social geography of sixteenth century England and Wales.
It is, in a very real sense, a census document of value alongside that of the Domesday Book of 1086.

Although the texts are accessible to the public through the national libraries, they remain untranslated and thoroughly inaccessible to all but the most dedicated of historians.
Remaining untranslated from its 16th century Latin, and printed in the 19th century as a multi-volume tome of lists, the aim of this project is to generate interest in this work and make it accessible to contemporary viewers.

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>
<br>

---

## Project Planning

### Wireframes

* [Balsamiq wireframes](#) (link or screenshots to be added)

### Project Board

* [GitHub Project Board](#) (link to your project board if available)

### Styling Choices

* Bootstrap for layout and components
* Custom CSS for branding and tweaks
* Google Fonts (planned)
* FontAwesome for icons

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>
<br>

---

## Features for MVP

* Interactive map with markers for each record
* Paginated list view of all records
* Detail view for each record
* Modal CRUD for authenticated users
* Read-only modal for anonymous users
* User authentication (registration, login, logout)
* About page

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>
<br>

---

## User Experience

* Users can browse and search Valor records by map or list
* Authenticated users can add, edit, or delete records
* Anonymous users can view records in read-only mode
* Responsive design for mobile and desktop
* Clear navigation and feedback

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>
<br>

---

## Technology Used

### Languages, Frameworks, Editors & Version Control:

* HTML, CSS, JS & Python
* Django
* Bootstrap
* Leaflet.js
* Github
* Heroku

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

### Tools Used

* PostgreSQL
* WhiteNoise
* Google Chrome Dev Tools
* (Balsamiq)
* FontAwesome
* (Google Fonts)
* Google Sheets

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

---

## Database

### Database Schema

* The main model is `ValorRecord`, which includes fields for name, record type, house type, deanery, valuation, dedication, religious order, status, latitude, longitude, and source references.
* User authentication uses Django's built-in user model.

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

---

## Features

* Interactive map with marker clustering
* Modal-based CRUD for records (edit/add/delete)
* Read-only modal for non-authenticated users
* Paginated list and detail views
* Filtering by record type
* "View on Map" from record detail
* Responsive Bootstrap layout

### Future Features

* Advanced search and filtering
* User profiles and contributions
* Export data as CSV/Excel
* API for external use
* More detailed historical context and links

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

---

## Testing

* Manual testing of all CRUD operations, authentication, and map interactions.
* Django unit tests can be run with:
    ```sh
    python manage.py test
    ```

### Found Bugs & Fixes

* (Document any bugs found and how you fixed them here.)

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

---

## Deployment

* Deployed on Heroku using a `Procfile` and `runtime.txt`.
* Static files served via WhiteNoise.
* See [Heroku deployment documentation](https://devcenter.heroku.com/categories/reference) for more.

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>

---

## Credits

* Valor Ecclesiasticus data: Record Commission of Great Britain, published in five volumes (1810 - 1834)
* Map data: [OpenStreetMap](https://www.openstreetmap.org/)
* Map tiles: [OpenStreetMap](https://www.openstreetmap.org/)
* Icons: [FontAwesome](https://fontawesome.com/)
* Project by Christopher Matthew for Code Institute Capstone

<p align="right"><a href="#mapping-the-valor">Back To Top</a></p>








