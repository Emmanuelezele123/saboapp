const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const authRouter = require("./routes/authRouter")
const swaggerUi = require("swagger-ui-express")
const swaggerDocs = require("swagger-jsdoc")

const User = require('./models/user')
const app = express()
require('dotenv').config()
const { use } = require("express/lib/application")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDoc = YAML.load('./api.yaml')
app.use(cors())
app.use(express.json())
app.use("/auth",authRouter)


app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDoc))
// Root route of express app
app.get("/", (req, res) => {
  res.send("<h1>Sabo App Documentation <br/> </h1><a href='/api-docs'>View Documentation</a>");
});
app.get("*", (req, res) => {

 res.send("PAGE NOT FOUND");
 
});
connectDB(app)
