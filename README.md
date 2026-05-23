# Still Fresh

Description: Still Fresh is a platform for grocery stores across Vancouver, where they can offer their fresh produce that will soon expire at a discount.

## About Us

Team Name: DTC-04
Team Members:

- Austin Doquiatan
- Edward Kim
- Chris Banno
- Jake Surry
- Darien Lowe

## Technologies Used

### Frontend

- Build tool: Vite
- Styling: Tailwind
- State management: Zustand
- Map rendering: MapLibre
- HTTP Client: Axios

### Backend

- Web framework: Express
- Cross-origin middleware: cors
- Session management: express-session
- env Variable Loading: dotenv

### Deployment

- Frontend Hosting: Netlify
- Backend Hosting: Render

### APIs & Services

- Database: MongoDB
- Geocoding/Location data: Geoapify
- AI feature: Groq
- Map tiles: MapTiler

### File contents

C:.
│ .gitignore
│ netlify.toml
│ README.md
│  
├───client
│ │ .env
│ │ .gitignore
│ │ index.html
│ │ ingredients.html
│ │ instructions.html
│ │ item-confirm-page.html
│ │ item-page.html
│ │ item-qr-page.html
│ │ login-page.html
│ │ map.html
│ │ mydeals.html
│ │ profile.html
│ │ README.md
│ │ recipe.html
│ │ recipes.html
│ │ searchbar.html
│ │ signup-page.html
│ │ vite.config.js
│ │  
│ ├───dist
│ │ │ about.html
│ │ │ index.html
│ │ │ ingredients.html
│ │ │ instructions.html
│ │ │ item-confirm-page.html
│ │ │ item-page.html
│ │ │ item-qr-page.html
│ │ │ login-page.html
│ │ │ map.html
│ │ │ mydeals.html
│ │ │ profile.html
│ │ │ recipe.html
│ │ │ recipes.html
│ │ │ searchbar.html
│ │ │ signup-page.html
│ │ │  
│ │ └───assets
│ │ authStore-c2xsosHL.js
│ │ axios-CN9p6eId.js
│ │ confirm_checkmark-HswaqqBi.png
│ │ dealStore-CvFVsVj5.js
│ │ index-DKkTNaj8.js
│ │ ingredients-Rh38RsAv.js
│ │ instructions-BjI1CE1Z.js
│ │ item-card-CkssPnnj.js
│ │ item-page-BCb0T91M.js
│ │ login-DYwUBOAA.js
│ │ main-B-9SBhwT.js
│ │ map-B2k4QVOw.css
│ │ map-HkwJGnkZ.js
│ │ mydeals-DeQY9VE1.js
│ │ profile-CUoaAdNi.js
│ │ qr-code-DhQ9saoT.png
│ │ recipe-api-Dmb0tXQO.js
│ │ recipe-hwjvCjbO.js
│ │ recipes-CtYyXbM-.js
│ │ signup-DnxBb2cp.js
│ │ site-top-navbar-B4SN4GbI.js
│ │ style-cgUOWCAP.css
│ │ style-DnL2KB-W.js
│ │ tutorialStore-BQQs_sBK.js
│ │  
│ ├───public
│ │ └───images
│ │ confirm_checkmark-old.png
│ │ confirm_checkmark.png
│ │ home-sprite-old-green.png
│ │ home-sprite-old.png
│ │ home-sprite.png
│ │ map-sprite-old.png
│ │ map-sprite.png
│ │ my-deals-sprite-old.png
│ │ my-deals-sprite.png
│ │ profile-sprite.png
│ │ qr-code.png
│ │ recipes-sprite-old.png
│ │ recipes-sprite.png
│ │  
│ └───src
│ │ home.js
│ │ ingredients-page.js
│ │ instructions-page.js
│ │ item-page.js
│ │ login-page.js
│ │ main.js
│ │ map.js
│ │ mock-data.js
│ │ profile.js
│ │ recipe-api.js
│ │ recipe-detail-page.js
│ │ recipes-page.js
│ │ signup-page.js
│ │ style.css
│ │ utils.js
│ │  
│ ├───assets
│ │ skeleton.html
│ │  
│ ├───components
│ │ discount-card.js
│ │ info-popup.js
│ │ item-card.js
│ │ recipe-card.js
│ │ searchbar.js
│ │ site-navbar.js
│ │ site-top-navbar.js
│ │  
│ └───store
│ authStore.js
│ dealStore.js
│ itemStore.js
│ tutorialStore.js
│  
└───server
│ .env
│ server.js
│  
 ├───config
│ db.js
│ session.js
│  
 ├───controllers
│ auth.controller.js
│ business.controller.js
│ customer.controller.js
│ deal.controller.js
│ geocode.controller.js
│ item.controller.js
│ recipe.controller.js
│  
 ├───middleware
│ auth.js
│  
 ├───models
│ business.js
│ item.js
│ stock.js
│ user.js
│  
 ├───routes
│ auth.routes.js
│ business.routes.js
│ deal.routes.js
│ item.routes.js
│ recipe.routes.js
│  
 └───seed
seed.js

# Installation and running the app

## Prerequisites

Install the following before cloning:

- [Node.js](https://nodejs.org) (v18+)
- [MongoDB](https://www.mongodb.com) (local) or a MongoDB Atlas account
- A code editor like [VS Code](https://code.visualstudio.com)

## API Keys Required

Sign up and obtain keys from:

- [Geoapify](https://www.geoapify.com) — free tier available
- [Groq](https://console.groq.com) — free tier available
- [MapTiler](https://www.maptiler.com) — free tier available
- MongoDB connection string (Atlas or local)

## Installation Steps

1. **Clone the repo**

```bash
   git clone https://github.com/Dairy03/2800-202610-DTC04.git
   cd 2800-202610-DTC04
```

2. **Install backend dependencies**

```bash
   cd server
   npm install
```

3. **Configure backend environment**
   Create a `.env` file in the `/server` folder with these keys:

```bash
    SESSION_SECRET="catatonic"
    MONGO_URL=your_mongodb_connection_string
    GEOAPIFY_API_KEY=your_geoapify_key
    GROQ_API_KEY=your_groq_key
```

4. **Install frontend dependencies**

```bash
   cd ../client
   npm install
```

5. **Configure frontend environment**
   Create a `.env` file in the `/client` folder:

```bash
    VITE_MAPTILER_KEY=your_maptiler_key
    VITE_API_URL="http://localhost:3000"
```

6. **Run the app**

```bash
   # In /server
   npm start

   # In /client (separate terminal)
   npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3000`.

## How to Use (Features)

- Feature 1 — Create account / Log into account
- Feature 2 — Browse deals on home page
- Feature 3 — Click on an item to view it's details
- Feature 4 — Claim the deal with the 'Claim Deal' button
- Feature 5 — Cancel a deal with the 'Cancel Deal' button
- Feature 6 — View the profile stats on the profile page
- Feature 7 — View the map on the map page
- Feature 8 — Browse recipes on the recipes page

---

## How We Used AI and APIs

| Service                    | How it was used                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------- |
| **Groq**                   | Used to generate recipe suggestions based on the user's cart via the Groq API         |
| **Geoapify**               | Used to geocode business addresses and convert them to map coordinates                |
| **MapTiler + MapLibre GL** | MapTiler provides the tile layer; MapLibre renders the interactive map in the browser |
| **MongoDB**                | Stores user accounts, business listings, deals, and items                             |

---

## Credits, References, and Licenses

- [MapLibre GL JS](https://maplibre.org) — BSD license
- [Tailwind CSS](https://tailwindcss.com) — MIT license
- [Express](https://expressjs.com) — MIT license

---

## Contact

- Austin Doquiatan - email
- GitHub: [@austindoq](https://github.com/austindoq)

- Edward Kim - email
- GitHub: [@nobodyknows-byte](https://github.com/nobodyknows-byte)

- Chris Banno - email
- GitHub: [@cbanno](https://github.com/cbanno)

- Jake Surry - email
- GitHub: [@JakeSurry](https://github.com/JakeSurry)

- Darien Lowe - email
- GitHub: [@Dairy03](https://github.com/Dairy03)
