require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const memeRoute = require("./routes/meme");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require('./swagger.json');
const https = require("https")
const path = require("path")
const fs = require("fs")
const swaggerApp = express()
const swaggerPort = process.env.PORT



//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
}).catch(err => {
    console.log(err);
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
swaggerApp.use(cors());


//Routes
swaggerApp.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
swaggerApp.listen(swaggerPort, () => {
  console.log('Swagger up and running on '+swaggerPort)
})
app.use("", memeRoute);


//Https set up
// const sslServer = https.createServer( {
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'), 'utf8'),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), 'utf8')
// },
// app
// )


//ports
const port = process.env.PORT || 8000;

//For https
// sslServer.listen(3443, () => console.log('Secure server running on 3443'));

//For http
app.listen(port, () => {
    console.log(`Backend is running at ${port}`);
});