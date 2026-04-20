import "./fetch-blob+[...].mjs";
import "./formdata-polyfill.mjs";
import { i as init_src, r as fetch } from "./node-fetch.mjs";
init_src();
export { fetch as default };
