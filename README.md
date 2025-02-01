The Bag Spot 👜
An Online Bag Store with Exclusive Collections
📌 Project Description
The Bag Spot is an online store where customers can browse and purchase bags directly from the shop owner. The platform provides a seamless shopping experience with secure authentication, product management, and order processing.

🚀 Features
🛍️ Product Listings – View available bags with details.
🛡️ Authentication – Secure login/logout with JWT.
🏬 Admin Panel – Manage inventory (Add, Update, Delete products).
📦 Order Management – Customers can place orders, and the admin can track them.
📸 Image Uploads – Upload product images with multer.
🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (via Mongoose)
Authentication: JSON Web Token (JWT), bcrypt.js
Templating Engine: EJS
File Uploads: Multer
Session Management: express-session, connect-flash
Environment Variables: dotenv
📂 Project Setup
Follow these steps to set up the project on your local machine:

1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Rishabh-Dev-Mishra/The-Bag-Spot.git
cd The-Bag-Spot
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
Edit
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
4️⃣ Run the Application
bash
Copy
Edit
npm start
The server will start at http://localhost:5000.

🔥 API Endpoints
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	User login
GET	/products	Get all products
POST	/products	Add a new product
PUT	/products/:id	Update a product
DELETE	/products/:id	Remove a product
👤 Owner
Rishabh Dev Mishra
