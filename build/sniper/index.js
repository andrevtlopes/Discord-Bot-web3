"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _add_js_1 = __importDefault(require(".add.js"));
const remove_js_1 = __importDefault(require("./remove.js"));
const check_js_1 = __importDefault(require("./check.js"));
const query_js_1 = __importDefault(require("./query.js"));
exports.default = { add: _add_js_1.default, remove: remove_js_1.default, check: check_js_1.default, query: query_js_1.default };
