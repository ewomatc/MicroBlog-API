const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('connected to database'))
.catch((err) => console.log(err))