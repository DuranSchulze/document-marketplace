import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { t as require_src$2 } from "./gaxios.mjs";
import { t as require_bignumber } from "./bignumber.js.mjs";
//#region node_modules/json-bigint/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = require_bignumber();
	var JSON = module.exports;
	(function() {
		"use strict";
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
			"\b": "\\b",
			"	": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			"\"": "\\\"",
			"\\": "\\\\"
		}, rep;
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? "\"" + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + "\"" : "\"" + string + "\"";
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
			if (value && typeof value === "object" && typeof value.toJSON === "function") value = value.toJSON(key);
			if (typeof rep === "function") value = rep.call(holder, key, value);
			switch (typeof value) {
				case "string": if (isBigNumber) return value;
				else return quote(value);
				case "number": return isFinite(value) ? String(value) : "null";
				case "boolean":
				case "null":
				case "bigint": return String(value);
				case "object":
					if (!value) return "null";
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === "[object Array]") {
						length = value.length;
						for (i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v;
					}
					if (rep && typeof rep === "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
							k = rep[i];
							v = str(k, value);
							if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
						}
					} else Object.keys(value).forEach(function(k) {
						var v = str(k, value);
						if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
					});
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v;
			}
		}
		if (typeof JSON.stringify !== "function") JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") for (i = 0; i < space; i += 1) indent += " ";
			else if (typeof space === "string") indent = space;
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) throw new Error("JSON.stringify");
			return str("", { "": value });
		};
	})();
}));
//#endregion
//#region node_modules/json-bigint/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = null;
	var suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
	var suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
	var json_parse = function(options) {
		"use strict";
		var _options = {
			strict: false,
			storeAsString: false,
			alwaysParseAsBig: false,
			useNativeBigInt: false,
			protoAction: "error",
			constructorAction: "error"
		};
		if (options !== void 0 && options !== null) {
			if (options.strict === true) _options.strict = true;
			if (options.storeAsString === true) _options.storeAsString = true;
			_options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
			_options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
			if (typeof options.constructorAction !== "undefined") if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") _options.constructorAction = options.constructorAction;
			else throw new Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`);
			if (typeof options.protoAction !== "undefined") if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") _options.protoAction = options.protoAction;
			else throw new Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`);
		}
		var at, ch, escapee = {
			"\"": "\"",
			"\\": "\\",
			"/": "/",
			b: "\b",
			f: "\f",
			n: "\n",
			r: "\r",
			t: "	"
		}, text, error = function(m) {
			throw {
				name: "SyntaxError",
				message: m,
				at,
				text
			};
		}, next = function(c) {
			if (c && c !== ch) error("Expected '" + c + "' instead of '" + ch + "'");
			ch = text.charAt(at);
			at += 1;
			return ch;
		}, number = function() {
			var number, string = "";
			if (ch === "-") {
				string = "-";
				next("-");
			}
			while (ch >= "0" && ch <= "9") {
				string += ch;
				next();
			}
			if (ch === ".") {
				string += ".";
				while (next() && ch >= "0" && ch <= "9") string += ch;
			}
			if (ch === "e" || ch === "E") {
				string += ch;
				next();
				if (ch === "-" || ch === "+") {
					string += ch;
					next();
				}
				while (ch >= "0" && ch <= "9") {
					string += ch;
					next();
				}
			}
			number = +string;
			if (!isFinite(number)) error("Bad number");
			else {
				if (BigNumber == null) BigNumber = require_bignumber();
				if (string.length > 15) return _options.storeAsString ? string : _options.useNativeBigInt ? BigInt(string) : new BigNumber(string);
				else return !_options.alwaysParseAsBig ? number : _options.useNativeBigInt ? BigInt(number) : new BigNumber(number);
			}
		}, string = function() {
			var hex, i, string = "", uffff;
			if (ch === "\"") {
				var startAt = at;
				while (next()) {
					if (ch === "\"") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						return string;
					}
					if (ch === "\\") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						if (ch === "u") {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) break;
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (typeof escapee[ch] === "string") string += escapee[ch];
						else break;
						startAt = at;
					}
				}
			}
			error("Bad string");
		}, white = function() {
			while (ch && ch <= " ") next();
		}, word = function() {
			switch (ch) {
				case "t":
					next("t");
					next("r");
					next("u");
					next("e");
					return true;
				case "f":
					next("f");
					next("a");
					next("l");
					next("s");
					next("e");
					return false;
				case "n":
					next("n");
					next("u");
					next("l");
					next("l");
					return null;
			}
			error("Unexpected '" + ch + "'");
		}, value, array = function() {
			var array = [];
			if (ch === "[") {
				next("[");
				white();
				if (ch === "]") {
					next("]");
					return array;
				}
				while (ch) {
					array.push(value());
					white();
					if (ch === "]") {
						next("]");
						return array;
					}
					next(",");
					white();
				}
			}
			error("Bad array");
		}, object = function() {
			var key, object = Object.create(null);
			if (ch === "{") {
				next("{");
				white();
				if (ch === "}") {
					next("}");
					return object;
				}
				while (ch) {
					key = string();
					white();
					next(":");
					if (_options.strict === true && Object.hasOwnProperty.call(object, key)) error("Duplicate key \"" + key + "\"");
					if (suspectProtoRx.test(key) === true) if (_options.protoAction === "error") error("Object contains forbidden prototype property");
					else if (_options.protoAction === "ignore") value();
					else object[key] = value();
					else if (suspectConstructorRx.test(key) === true) if (_options.constructorAction === "error") error("Object contains forbidden constructor property");
					else if (_options.constructorAction === "ignore") value();
					else object[key] = value();
					else object[key] = value();
					white();
					if (ch === "}") {
						next("}");
						return object;
					}
					next(",");
					white();
				}
			}
			error("Bad object");
		};
		value = function() {
			white();
			switch (ch) {
				case "{": return object();
				case "[": return array();
				case "\"": return string();
				case "-": return number();
				default: return ch >= "0" && ch <= "9" ? number() : word();
			}
		};
		return function(source, reviver) {
			var result;
			text = source + "";
			at = 0;
			ch = " ";
			result = value();
			white();
			if (ch) error("Syntax error");
			return typeof reviver === "function" ? (function walk(holder, key) {
				var v, value = holder[key];
				if (value && typeof value === "object") Object.keys(value).forEach(function(k) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				});
				return reviver.call(holder, key, value);
			})({ "": result }, "") : result;
		};
	};
	module.exports = json_parse;
}));
//#endregion
//#region node_modules/json-bigint/index.js
var require_json_bigint = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var json_stringify = require_stringify().stringify;
	var json_parse = require_parse();
	module.exports = function(options) {
		return {
			parse: json_parse(options),
			stringify: json_stringify
		};
	};
	module.exports.parse = json_parse();
	module.exports.stringify = json_stringify;
}));
//#endregion
//#region node_modules/gcp-metadata/build/src/gcp-residency.js
var require_gcp_residency = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2022 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GCE_LINUX_BIOS_PATHS = void 0;
	exports.isGoogleCloudServerless = isGoogleCloudServerless;
	exports.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
	exports.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
	exports.isGoogleComputeEngine = isGoogleComputeEngine;
	exports.detectGCPResidency = detectGCPResidency;
	var fs_1 = __require("fs");
	var os_1 = __require("os");
	/**
	* Known paths unique to Google Compute Engine Linux instances
	*/
	exports.GCE_LINUX_BIOS_PATHS = {
		BIOS_DATE: "/sys/class/dmi/id/bios_date",
		BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
	};
	var GCE_MAC_ADDRESS_REGEX = /^42:01/;
	/**
	* Determines if the process is running on a Google Cloud Serverless environment (Cloud Run or Cloud Functions instance).
	*
	* Uses the:
	* - {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables}.
	* - {@link https://cloud.google.com/functions/docs/env-var Cloud Functions environment variables}.
	*
	* @returns {boolean} `true` if the process is running on GCP serverless, `false` otherwise.
	*/
	function isGoogleCloudServerless() {
		return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE);
	}
	/**
	* Determines if the process is running on a Linux Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on Linux GCE, `false` otherwise.
	*/
	function isGoogleComputeEngineLinux() {
		if ((0, os_1.platform)() !== "linux") return false;
		try {
			(0, fs_1.statSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
			const biosVendor = (0, fs_1.readFileSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
			return /Google/.test(biosVendor);
		} catch {
			return false;
		}
	}
	/**
	* Determines if the process is running on a Google Compute Engine instance with a known
	* MAC address.
	*
	* @returns {boolean} `true` if the process is running on GCE (as determined by MAC address), `false` otherwise.
	*/
	function isGoogleComputeEngineMACAddress() {
		const interfaces = (0, os_1.networkInterfaces)();
		for (const item of Object.values(interfaces)) {
			if (!item) continue;
			for (const { mac } of item) if (GCE_MAC_ADDRESS_REGEX.test(mac)) return true;
		}
		return false;
	}
	/**
	* Determines if the process is running on a Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on GCE, `false` otherwise.
	*/
	function isGoogleComputeEngine() {
		return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
	}
	/**
	* Determines if the process is running on Google Cloud Platform.
	*
	* @returns {boolean} `true` if the process is running on GCP, `false` otherwise.
	*/
	function detectGCPResidency() {
		return isGoogleCloudServerless() || isGoogleComputeEngine();
	}
}));
//#endregion
//#region node_modules/google-logging-utils/build/src/colours.js
var require_colours = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Colours = void 0;
	/**
	* Handles figuring out if we can use ANSI colours and handing out the escape codes.
	*
	* This is for package-internal use only, and may change at any time.
	*
	* @private
	* @internal
	*/
	var Colours = class Colours {
		/**
		* @param stream The stream (e.g. process.stderr)
		* @returns true if the stream should have colourization enabled
		*/
		static isEnabled(stream) {
			return stream && stream.isTTY && (typeof stream.getColorDepth === "function" ? stream.getColorDepth() > 2 : true);
		}
		static refresh() {
			Colours.enabled = Colours.isEnabled(process === null || process === void 0 ? void 0 : process.stderr);
			if (!this.enabled) {
				Colours.reset = "";
				Colours.bright = "";
				Colours.dim = "";
				Colours.red = "";
				Colours.green = "";
				Colours.yellow = "";
				Colours.blue = "";
				Colours.magenta = "";
				Colours.cyan = "";
				Colours.white = "";
				Colours.grey = "";
			} else {
				Colours.reset = "\x1B[0m";
				Colours.bright = "\x1B[1m";
				Colours.dim = "\x1B[2m";
				Colours.red = "\x1B[31m";
				Colours.green = "\x1B[32m";
				Colours.yellow = "\x1B[33m";
				Colours.blue = "\x1B[34m";
				Colours.magenta = "\x1B[35m";
				Colours.cyan = "\x1B[36m";
				Colours.white = "\x1B[37m";
				Colours.grey = "\x1B[90m";
			}
		}
	};
	exports.Colours = Colours;
	Colours.enabled = false;
	Colours.reset = "";
	Colours.bright = "";
	Colours.dim = "";
	Colours.red = "";
	Colours.green = "";
	Colours.yellow = "";
	Colours.blue = "";
	Colours.magenta = "";
	Colours.cyan = "";
	Colours.white = "";
	Colours.grey = "";
	Colours.refresh();
}));
//#endregion
//#region node_modules/google-logging-utils/build/src/logging-utils.js
var require_logging_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.env = exports.DebugLogBackendBase = exports.placeholder = exports.AdhocDebugLogger = exports.LogSeverity = void 0;
	exports.getNodeBackend = getNodeBackend;
	exports.getDebugBackend = getDebugBackend;
	exports.getStructuredBackend = getStructuredBackend;
	exports.setBackend = setBackend;
	exports.log = log;
	var events_1 = __require("events");
	var process$1 = __importStar(__require("process"));
	var util = __importStar(__require("util"));
	var colours_1 = require_colours();
	/**
	* This module defines an ad-hoc debug logger for Google Cloud Platform
	* client libraries in Node. An ad-hoc debug logger is a tool which lets
	* users use an external, unified interface (in this case, environment
	* variables) to determine what logging they want to see at runtime. This
	* isn't necessarily fed into the console, but is meant to be under the
	* control of the user. The kind of logging that will be produced by this
	* is more like "call retry happened", not "events you'd want to record
	* in Cloud Logger".
	*
	* More for Googlers implementing libraries with it:
	* go/cloud-client-logging-design
	*/
	/**
	* Possible log levels. These are a subset of Cloud Observability levels.
	* https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
	*/
	var LogSeverity;
	(function(LogSeverity) {
		LogSeverity["DEFAULT"] = "DEFAULT";
		LogSeverity["DEBUG"] = "DEBUG";
		LogSeverity["INFO"] = "INFO";
		LogSeverity["WARNING"] = "WARNING";
		LogSeverity["ERROR"] = "ERROR";
	})(LogSeverity || (exports.LogSeverity = LogSeverity = {}));
	/**
	* Our logger instance. This actually contains the meat of dealing
	* with log lines, including EventEmitter. This contains the function
	* that will be passed back to users of the package.
	*/
	var AdhocDebugLogger = class extends events_1.EventEmitter {
		/**
		* @param upstream The backend will pass a function that will be
		*   called whenever our logger function is invoked.
		*/
		constructor(namespace, upstream) {
			super();
			this.namespace = namespace;
			this.upstream = upstream;
			this.func = Object.assign(this.invoke.bind(this), {
				instance: this,
				on: (event, listener) => this.on(event, listener)
			});
			this.func.debug = (...args) => this.invokeSeverity(LogSeverity.DEBUG, ...args);
			this.func.info = (...args) => this.invokeSeverity(LogSeverity.INFO, ...args);
			this.func.warn = (...args) => this.invokeSeverity(LogSeverity.WARNING, ...args);
			this.func.error = (...args) => this.invokeSeverity(LogSeverity.ERROR, ...args);
			this.func.sublog = (namespace) => log(namespace, this.func);
		}
		invoke(fields, ...args) {
			if (this.upstream) try {
				this.upstream(fields, ...args);
			} catch (e) {}
			try {
				this.emit("log", fields, args);
			} catch (e) {}
		}
		invokeSeverity(severity, ...args) {
			this.invoke({ severity }, ...args);
		}
	};
	exports.AdhocDebugLogger = AdhocDebugLogger;
	/**
	* This can be used in place of a real logger while waiting for Promises or disabling logging.
	*/
	exports.placeholder = new AdhocDebugLogger("", () => {}).func;
	/**
	* The base class for debug logging backends. It's possible to use this, but the
	* same non-guarantees above still apply (unstable interface, etc).
	*
	* @private
	* @internal
	*/
	var DebugLogBackendBase = class {
		constructor() {
			var _a;
			this.cached = /* @__PURE__ */ new Map();
			this.filters = [];
			this.filtersSet = false;
			let nodeFlag = (_a = process$1.env[exports.env.nodeEnables]) !== null && _a !== void 0 ? _a : "*";
			if (nodeFlag === "all") nodeFlag = "*";
			this.filters = nodeFlag.split(",");
		}
		log(namespace, fields, ...args) {
			try {
				if (!this.filtersSet) {
					this.setFilters();
					this.filtersSet = true;
				}
				let logger = this.cached.get(namespace);
				if (!logger) {
					logger = this.makeLogger(namespace);
					this.cached.set(namespace, logger);
				}
				logger(fields, ...args);
			} catch (e) {
				console.error(e);
			}
		}
	};
	exports.DebugLogBackendBase = DebugLogBackendBase;
	var NodeBackend = class extends DebugLogBackendBase {
		constructor() {
			super(...arguments);
			this.enabledRegexp = /.*/g;
		}
		isEnabled(namespace) {
			return this.enabledRegexp.test(namespace);
		}
		makeLogger(namespace) {
			if (!this.enabledRegexp.test(namespace)) return () => {};
			return (fields, ...args) => {
				var _a;
				const nscolour = `${colours_1.Colours.green}${namespace}${colours_1.Colours.reset}`;
				const pid = `${colours_1.Colours.yellow}${process$1.pid}${colours_1.Colours.reset}`;
				let level;
				switch (fields.severity) {
					case LogSeverity.ERROR:
						level = `${colours_1.Colours.red}${fields.severity}${colours_1.Colours.reset}`;
						break;
					case LogSeverity.INFO:
						level = `${colours_1.Colours.magenta}${fields.severity}${colours_1.Colours.reset}`;
						break;
					case LogSeverity.WARNING:
						level = `${colours_1.Colours.yellow}${fields.severity}${colours_1.Colours.reset}`;
						break;
					default:
						level = (_a = fields.severity) !== null && _a !== void 0 ? _a : LogSeverity.DEFAULT;
						break;
				}
				const msg = util.formatWithOptions({ colors: colours_1.Colours.enabled }, ...args);
				const filteredFields = Object.assign({}, fields);
				delete filteredFields.severity;
				const fieldsJson = Object.getOwnPropertyNames(filteredFields).length ? JSON.stringify(filteredFields) : "";
				const fieldsColour = fieldsJson ? `${colours_1.Colours.grey}${fieldsJson}${colours_1.Colours.reset}` : "";
				console.error("%s [%s|%s] %s%s", pid, nscolour, level, msg, fieldsJson ? ` ${fieldsColour}` : "");
			};
		}
		setFilters() {
			const regexp = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
			this.enabledRegexp = new RegExp(`^${regexp}$`, "i");
		}
	};
	/**
	* @returns A backend based on Node util.debuglog; this is the default.
	*/
	function getNodeBackend() {
		return new NodeBackend();
	}
	var DebugBackend = class extends DebugLogBackendBase {
		constructor(pkg) {
			super();
			this.debugPkg = pkg;
		}
		makeLogger(namespace) {
			const debugLogger = this.debugPkg(namespace);
			return (fields, ...args) => {
				debugLogger(args[0], ...args.slice(1));
			};
		}
		setFilters() {
			var _a;
			const existingFilters = (_a = process$1.env["NODE_DEBUG"]) !== null && _a !== void 0 ? _a : "";
			process$1.env["NODE_DEBUG"] = `${existingFilters}${existingFilters ? "," : ""}${this.filters.join(",")}`;
		}
	};
	/**
	* Creates a "debug" package backend. The user must call require('debug') and pass
	* the resulting object to this function.
	*
	* ```
	*  setBackend(getDebugBackend(require('debug')))
	* ```
	*
	* https://www.npmjs.com/package/debug
	*
	* Note: Google does not explicitly endorse or recommend this package; it's just
	* being provided as an option.
	*
	* @returns A backend based on the npm "debug" package.
	*/
	function getDebugBackend(debugPkg) {
		return new DebugBackend(debugPkg);
	}
	/**
	* This pretty much works like the Node logger, but it outputs structured
	* logging JSON matching Google Cloud's ingestion specs. Rather than handling
	* its own output, it wraps another backend. The passed backend must be a subclass
	* of `DebugLogBackendBase` (any of the backends exposed by this package will work).
	*/
	var StructuredBackend = class extends DebugLogBackendBase {
		constructor(upstream) {
			var _a;
			super();
			this.upstream = (_a = upstream) !== null && _a !== void 0 ? _a : void 0;
		}
		makeLogger(namespace) {
			var _a;
			const debugLogger = (_a = this.upstream) === null || _a === void 0 ? void 0 : _a.makeLogger(namespace);
			return (fields, ...args) => {
				var _a;
				const severity = (_a = fields.severity) !== null && _a !== void 0 ? _a : LogSeverity.INFO;
				const json = Object.assign({
					severity,
					message: util.format(...args)
				}, fields);
				const jsonString = JSON.stringify(json);
				if (debugLogger) debugLogger(fields, jsonString);
				else console.log("%s", jsonString);
			};
		}
		setFilters() {
			var _a;
			(_a = this.upstream) === null || _a === void 0 || _a.setFilters();
		}
	};
	/**
	* Creates a "structured logging" backend. This pretty much works like the
	* Node logger, but it outputs structured logging JSON matching Google
	* Cloud's ingestion specs instead of plain text.
	*
	* ```
	*  setBackend(getStructuredBackend())
	* ```
	*
	* @param upstream If you want to use something besides the Node backend to
	*   write the actual log lines into, pass that here.
	* @returns A backend based on Google Cloud structured logging.
	*/
	function getStructuredBackend(upstream) {
		return new StructuredBackend(upstream);
	}
	/**
	* The environment variables that we standardized on, for all ad-hoc logging.
	*/
	exports.env = { nodeEnables: "GOOGLE_SDK_NODE_LOGGING" };
	var loggerCache = /* @__PURE__ */ new Map();
	var cachedBackend = void 0;
	/**
	* Set the backend to use for our log output.
	* - A backend object
	* - null to disable logging
	* - undefined for "nothing yet", defaults to the Node backend
	*
	* @param backend Results from one of the get*Backend() functions.
	*/
	function setBackend(backend) {
		cachedBackend = backend;
		loggerCache.clear();
	}
	/**
	* Creates a logging function. Multiple calls to this with the same namespace
	* will produce the same logger, with the same event emitter hooks.
	*
	* Namespaces can be a simple string ("system" name), or a qualified string
	* (system:subsystem), which can be used for filtering, or for "system:*".
	*
	* @param namespace The namespace, a descriptive text string.
	* @returns A function you can call that works similar to console.log().
	*/
	function log(namespace, parent) {
		if (!cachedBackend) {
			if (!process$1.env[exports.env.nodeEnables]) return exports.placeholder;
		}
		if (!namespace) return exports.placeholder;
		if (parent) namespace = `${parent.instance.namespace}:${namespace}`;
		const existing = loggerCache.get(namespace);
		if (existing) return existing.func;
		if (cachedBackend === null) return exports.placeholder;
		else if (cachedBackend === void 0) cachedBackend = getNodeBackend();
		const logger = (() => {
			let previousBackend = void 0;
			return new AdhocDebugLogger(namespace, (fields, ...args) => {
				if (previousBackend !== cachedBackend) {
					if (cachedBackend === null) return;
					else if (cachedBackend === void 0) cachedBackend = getNodeBackend();
					previousBackend = cachedBackend;
				}
				cachedBackend === null || cachedBackend === void 0 || cachedBackend.log(namespace, fields, ...args);
			});
		})();
		loggerCache.set(namespace, logger);
		return logger.func;
	}
}));
//#endregion
//#region node_modules/google-logging-utils/build/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_logging_utils(), exports);
}));
//#endregion
//#region node_modules/gcp-metadata/build/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.gcpResidencyCache = exports.METADATA_SERVER_DETECTION = exports.HEADERS = exports.HEADER_VALUE = exports.HEADER_NAME = exports.SECONDARY_HOST_ADDRESS = exports.HOST_ADDRESS = exports.BASE_PATH = void 0;
	exports.instance = instance;
	exports.project = project;
	exports.universe = universe;
	exports.bulk = bulk;
	exports.isAvailable = isAvailable;
	exports.resetIsAvailableCache = resetIsAvailableCache;
	exports.getGCPResidency = getGCPResidency;
	exports.setGCPResidency = setGCPResidency;
	exports.requestTimeout = requestTimeout;
	/**
	* Copyright 2018 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var gaxios_1 = require_src$2();
	var jsonBigint = require_json_bigint();
	var gcp_residency_1 = require_gcp_residency();
	var logger = __importStar(require_src$1());
	exports.BASE_PATH = "/computeMetadata/v1";
	exports.HOST_ADDRESS = "http://169.254.169.254";
	exports.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
	exports.HEADER_NAME = "Metadata-Flavor";
	exports.HEADER_VALUE = "Google";
	exports.HEADERS = Object.freeze({ [exports.HEADER_NAME]: exports.HEADER_VALUE });
	var log = logger.log("gcp-metadata");
	/**
	* Metadata server detection override options.
	*
	* Available via `process.env.METADATA_SERVER_DETECTION`.
	*/
	exports.METADATA_SERVER_DETECTION = Object.freeze({
		"assume-present": "don't try to ping the metadata server, but assume it's present",
		none: "don't try to ping the metadata server, but don't try to use it either",
		"bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
		"ping-only": "skip the BIOS probe, and go straight to pinging"
	});
	/**
	* Returns the base URL while taking into account the GCE_METADATA_HOST
	* environment variable if it exists.
	*
	* @returns The base URL, e.g., http://169.254.169.254/computeMetadata/v1.
	*/
	function getBaseUrl(baseUrl) {
		if (!baseUrl) baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports.HOST_ADDRESS;
		if (!/^https?:\/\//.test(baseUrl)) baseUrl = `http://${baseUrl}`;
		return new URL(exports.BASE_PATH, baseUrl).href;
	}
	function validate(options) {
		Object.keys(options).forEach((key) => {
			switch (key) {
				case "params":
				case "property":
				case "headers": break;
				case "qs": throw new Error("'qs' is not a valid configuration option. Please use 'params' instead.");
				default: throw new Error(`'${key}' is not a valid configuration option.`);
			}
		});
	}
	async function metadataAccessor(type, options = {}, noResponseRetries = 3, fastFail = false) {
		const headers = new Headers(exports.HEADERS);
		let metadataKey = "";
		let params = {};
		if (typeof type === "object") {
			const metadataAccessor = type;
			new Headers(metadataAccessor.headers).forEach((value, key) => headers.set(key, value));
			metadataKey = metadataAccessor.metadataKey;
			params = metadataAccessor.params || params;
			noResponseRetries = metadataAccessor.noResponseRetries || noResponseRetries;
			fastFail = metadataAccessor.fastFail || fastFail;
		} else metadataKey = type;
		if (typeof options === "string") metadataKey += `/${options}`;
		else {
			validate(options);
			if (options.property) metadataKey += `/${options.property}`;
			new Headers(options.headers).forEach((value, key) => headers.set(key, value));
			params = options.params || params;
		}
		const requestMethod = fastFail ? fastFailMetadataRequest : gaxios_1.request;
		const req = {
			url: `${getBaseUrl()}/${metadataKey}`,
			headers,
			retryConfig: { noResponseRetries },
			params,
			responseType: "text",
			timeout: requestTimeout()
		};
		log.info("instance request %j", req);
		const res = await requestMethod(req);
		log.info("instance metadata is %s", res.data);
		const metadataFlavor = res.headers.get(exports.HEADER_NAME);
		if (metadataFlavor !== exports.HEADER_VALUE) throw new RangeError(`Invalid response from metadata service: incorrect ${exports.HEADER_NAME} header. Expected '${exports.HEADER_VALUE}', got ${metadataFlavor ? `'${metadataFlavor}'` : "no header"}`);
		if (typeof res.data === "string") try {
			return jsonBigint.parse(res.data);
		} catch {}
		return res.data;
	}
	async function fastFailMetadataRequest(options) {
		const secondaryOptions = {
			...options,
			url: options.url?.toString().replace(getBaseUrl(), getBaseUrl(exports.SECONDARY_HOST_ADDRESS))
		};
		const r1 = (0, gaxios_1.request)(options);
		const r2 = (0, gaxios_1.request)(secondaryOptions);
		return Promise.any([r1, r2]);
	}
	/**
	* Obtain metadata for the current GCE instance.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const serviceAccount: {} = await instance('service-accounts/');
	* const serviceAccountEmail: string = await instance('service-accounts/default/email');
	* ```
	*/
	function instance(options) {
		return metadataAccessor("instance", options);
	}
	/**
	* Obtain metadata for the current GCP project.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const projectId: string = await project('project-id');
	* const numericProjectId: number = await project('numeric-project-id');
	* ```
	*/
	function project(options) {
		return metadataAccessor("project", options);
	}
	/**
	* Obtain metadata for the current universe.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const universeDomain: string = await universe('universe-domain');
	* ```
	*/
	function universe(options) {
		return metadataAccessor("universe", options);
	}
	/**
	* Retrieve metadata items in parallel.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const data = await bulk([
	*   {
	*     metadataKey: 'instance',
	*   },
	*   {
	*     metadataKey: 'project/project-id',
	*   },
	* ] as const);
	*
	* // data.instance;
	* // data['project/project-id'];
	* ```
	*
	* @param properties The metadata properties to retrieve
	* @returns The metadata in `metadatakey:value` format
	*/
	async function bulk(properties) {
		const r = {};
		await Promise.all(properties.map((item) => {
			return (async () => {
				const res = await metadataAccessor(item);
				const key = item.metadataKey;
				r[key] = res;
			})();
		}));
		return r;
	}
	function detectGCPAvailableRetries() {
		return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
	}
	var cachedIsAvailableResponse;
	/**
	* Determine if the metadata server is currently available.
	*/
	async function isAvailable() {
		if (process.env.METADATA_SERVER_DETECTION) {
			const value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
			if (!(value in exports.METADATA_SERVER_DETECTION)) throw new RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
			switch (value) {
				case "assume-present": return true;
				case "none": return false;
				case "bios-only": return getGCPResidency();
				case "ping-only":
			}
		}
		try {
			if (cachedIsAvailableResponse === void 0) cachedIsAvailableResponse = metadataAccessor("instance", void 0, detectGCPAvailableRetries(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
			await cachedIsAvailableResponse;
			return true;
		} catch (e) {
			const err = e;
			if (process.env.DEBUG_AUTH) console.info(err);
			if (err.type === "request-timeout") return false;
			if (err.response && err.response.status === 404) return false;
			else {
				if (!(err.response && err.response.status === 404) && (!err.code || ![
					"EHOSTDOWN",
					"EHOSTUNREACH",
					"ENETUNREACH",
					"ENOENT",
					"ENOTFOUND",
					"ECONNREFUSED"
				].includes(err.code.toString()))) {
					let code = "UNKNOWN";
					if (err.code) code = err.code.toString();
					process.emitWarning(`received unexpected error = ${err.message} code = ${code}`, "MetadataLookupWarning");
				}
				return false;
			}
		}
	}
	/**
	* reset the memoized isAvailable() lookup.
	*/
	function resetIsAvailableCache() {
		cachedIsAvailableResponse = void 0;
	}
	/**
	* A cache for the detected GCP Residency.
	*/
	exports.gcpResidencyCache = null;
	/**
	* Detects GCP Residency.
	* Caches results to reduce costs for subsequent calls.
	*
	* @see setGCPResidency for setting
	*/
	function getGCPResidency() {
		if (exports.gcpResidencyCache === null) setGCPResidency();
		return exports.gcpResidencyCache;
	}
	/**
	* Sets the detected GCP Residency.
	* Useful for forcing metadata server detection behavior.
	*
	* Set `null` to autodetect the environment (default behavior).
	* @see getGCPResidency for getting
	*/
	function setGCPResidency(value = null) {
		exports.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
	}
	/**
	* Obtain the timeout for requests to the metadata server.
	*
	* In certain environments and conditions requests can take longer than
	* the default timeout to complete. This function will determine the
	* appropriate timeout based on the environment.
	*
	* @returns {number} a request timeout duration in milliseconds.
	*/
	function requestTimeout() {
		return getGCPResidency() ? 0 : 3e3;
	}
	__exportStar(require_gcp_residency(), exports);
}));
//#endregion
export { require_src$1 as n, require_src as t };
