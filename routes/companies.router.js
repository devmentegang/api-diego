var express = require('express');
var router = express.Router();
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');

const Company = require('../model/companies.model')