"use strict";

var NodeFetch = require("node-fetch");
var NodeFormData = require("form-data");
var buffer = require("buffer");
var NodeAbortController = require("abort-controller");

const Blob = globalThis.Blob ?? buffer.Blob;
const FormData = globalThis.FormData ?? NodeFormData;
const Headers = globalThis.Headers ?? NodeFetch.Headers;
const Request = globalThis.Request ?? NodeFetch.Request;
const Response = globalThis.Response ?? NodeFetch.Response;
const fetch = globalThis.fetch ?? NodeFetch.default;
const AbortController =
  globalThis.AbortController ?? NodeAbortController.AbortController;
const AbortSignal = globalThis.AbortSignal ?? NodeAbortController.AbortSignal;

exports.Blob = Blob;
exports.FormData = FormData;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.fetch = fetch;
exports.AbortController = AbortController;
exports.AbortSignal = AbortSignal;
