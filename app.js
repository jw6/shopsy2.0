const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const cors       = require('cors');
const passport   = require('passport');
const mongoose   = require('mongoose');
const config     = require('./config/database');

// Connect to database