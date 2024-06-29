require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');

const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/company',require('./companyDetails/company.controller'));
app.use('/job',require('./jobDesc/job.controller'));
app.use('/project',require('./project/project.controller'));
app.use('/bids',require('./bids/bid.controller'));
app.use('/vendorBidInvites',require('./vendorBidInvite/vendorBidInvite.controller'));

// global error handler
app.use(errorHandler);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4100;
app.listen(port, () => console.log('Server listening on port ' + port));