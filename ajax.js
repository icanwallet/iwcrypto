//https://github.com/fluffff/axios-miniprogram
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf || {
		__proto__: []
	}
	instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b)
			if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	};
	return extendStatics(d, b);
};

function __extends(d, b) {
	if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) +
		" is not a constructor or null");
	extendStatics(d, b);

	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s)
				if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};

function __rest(s, e) {
	var t = {};
	for (var p in s)
		if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function")
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
			if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
		}
	return t;
}

function __spreadArray(to, from) {
	for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];
	return to;
}

var _toString = Object.prototype.toString;

function isArray(value) {
	return Array.isArray(value);
}

function isDate(date) {
	return _toString.call(date) === '[object Date]';
}

function isEmptyArray(value) {
	return isArray(value) && value.length === 0;
}

function isFunction(value) {
	return typeof value === 'function';
}

function isNull(value) {
	return value === null;
}

function isPlainObject(value) {
	return _toString.call(value) === '[object Object]';
}

function isString(value) {
	return typeof value === 'string';
}

function isUndefined(value) {
	return typeof value === 'undefined';
}

function deepMerge() {
	var objs = [];
	for (var _i = 0; _i < arguments.length; _i++) {
		objs[_i] = arguments[_i];
	}
	var result = {};
	objs.forEach(function(obj) {
		return Object.keys(obj).forEach(function(key) {
			var val = obj[key];
			var resultVal = result[key];
			if (isPlainObject(resultVal) && isPlainObject(val)) {
				result[key] = deepMerge(resultVal, val);
			} else if (isPlainObject(val)) {
				result[key] = deepMerge(val);
			} else {
				result[key] = val;
			}
		});
	});
	return result;
}

function omit(obj) {
	var keys = [];
	for (var _i = 1; _i < arguments.length; _i++) {
		keys[_i - 1] = arguments[_i];
	}
	var _omit = Object.assign({}, obj);
	keys.forEach(function(key) {
		return delete _omit[key];
	});
	return _omit;
}

function assert(condition, msg) {
	if (!condition) {
		throwError(msg);
	}
}

function throwError(msg) {
	throw new Error("[axios-miniprogram]: " + msg);
}

function toLowerCase(value, defaultValue) {
	if (!isString(value)) {
		value = defaultValue;
	}
	return value.toLowerCase();
}

function toUpperCase(value, defaultValue) {
	if (!isString(value)) {
		value = defaultValue;
	}
	return value.toUpperCase();
}

function isPlatform(value) {
	return isPlainObject(value) && isFunction(value.request) && isFunction(value.upload) && isFunction(value.download);
}

function revisePlatformApiNames(platform) {
	var _a, _b, _c;
	return {
		request: (_a = platform.request) !== null && _a !== void 0 ? _a : platform.httpRequest,
		upload: (_b = platform.upload) !== null && _b !== void 0 ? _b : platform.uploadFile,
		download: (_c = platform.download) !== null && _c !== void 0 ? _c : platform.downloadFile
	};
}

function createAdapter(platform) {
	assert(isPlainObject(platform), 'platform 需要是一个 object');
	assert(isFunction(platform.request), 'platform.request 需要是一个 function');
	assert(isFunction(platform.upload), 'platform.upload 需要是一个 function');
	assert(isFunction(platform.download), 'platform.download 需要是一个 function');

	function transformResult(result) {
		if (!isUndefined(result.statusCode)) {
			result.status = result.statusCode;
			delete result.statusCode;
		}
		if (isUndefined(result.status)) {
			result.status = isUndefined(result.data) ? 400 : 200;
		}
		if (!isUndefined(result.header)) {
			result.headers = result.header;
			delete result.header;
		}
		if (isUndefined(result.headers)) {
			result.headers = {};
		}
		if (!isUndefined(result.errMsg)) {
			result.statusText = result.errMsg;
			delete result.errMsg;
		}
		if (isUndefined(result.statusText)) {
			result.statusText = result.status === 200 ? 'OK' : result.status === 400 ? 'Bad Adapter' : '';
		}
	}

	function transformOptions(config) {
		return __assign(__assign({}, config), {
			header: config.headers,
			success: function success(response) {
				transformResult(response);
				config.success(response);
			},
			fail: function fail(error) {
				transformResult(error);
				config.fail(error);
			}
		});
	}

	function injectDownloadData(response) {
		if (!isPlainObject(response.data)) {
			response.data = {};
		}
		if (!isUndefined(response.tempFilePath)) {
			response.data.tempFilePath = response.tempFilePath;
			delete response.tempFilePath;
		}
		if (!isUndefined(response.apFilePath)) {
			response.data.tempFilePath = response.apFilePath;
			delete response.apFilePath;
		}
		if (!isUndefined(response.filePath)) {
			response.data.filePath = response.filePath;
			delete response.filePath;
		}
	}

	function callRequest(request, baseOptions) {
		return request(baseOptions);
	}

	function callUpload(upload, baseOptions) {
		assert(isPlainObject(baseOptions.data), '上传文件时 data 需要是一个 object');
		assert(isString(baseOptions.data.fileName), '上传文件时 data.fileName 需要是一个 string');
		assert(isString(baseOptions.data.filePath), '上传文件时 data.filePath 需要是一个 string');
		var _a = baseOptions.data,
			fileName = _a.fileName,
			filePath = _a.filePath,
			fileType = _a.fileType,
			hideLoading = _a.hideLoading,
			formData = __rest(_a, ["fileName", "filePath", "fileType", "hideLoading"]);
		var options = __assign(__assign({}, baseOptions), {
			name: fileName,
			fileName: fileName,
			filePath: filePath,
			fileType: fileType !== null && fileType !== void 0 ? fileType : 'image',
			hideLoading: hideLoading,
			formData: formData
		});
		return upload(options);
	}

	function callDownload(download, baseOptions) {
		var _a, _b;
		var options = __assign(__assign({}, baseOptions), {
			filePath: (_a = baseOptions.params) === null || _a === void 0 ? void 0 : _a.filePath,
			fileName: (_b = baseOptions.params) === null || _b === void 0 ? void 0 : _b.fileName,
			success: function success(response) {
				injectDownloadData(response);
				baseOptions.success(response);
			}
		});
		return download(options);
	}
	return function adapterDefault(config) {
		var baseOptions = transformOptions(config);
		switch (config.type) {
			case 'request':
				return callRequest(platform.request, baseOptions);
			case 'upload':
				return callUpload(platform.upload, baseOptions);
			case 'download':
				return callDownload(platform.download, baseOptions);
			default:
				throwError("\u65E0\u6CD5\u8BC6\u522B\u7684\u8BF7\u6C42\u7C7B\u578B " + config.type);
		}
	};
}

function getAdapterDefault() {
	var tryGetPlatforms = [function() {
		return uni;
	}, function() {
		return wx;
	}, function() {
		return my;
	}, function() {
		return swan;
	}, function() {
		return tt;
	}, function() {
		return qq;
	}, function() {
		return qh;
	}, function() {
		return ks;
	}, function() {
		return dd;
	}];
	var platform;
	while (!isEmptyArray(tryGetPlatforms) && !isPlatform(platform)) {
		try {
			var tryGetPlatform = tryGetPlatforms.shift();
			if (isPlainObject(platform = tryGetPlatform())) {
				platform = revisePlatformApiNames(platform);
			}
		} catch (err) {}
	}
	if (!isPlatform(platform)) {
		return;
	}
	//console.log(platform)
	return createAdapter(platform);
}

function encode(str) {
	return encodeURIComponent(str).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi,
		',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function buildURL(url, params, paramsSerializer) {
	if (url === void 0) {
		url = '';
	}
	if (paramsSerializer === void 0) {
		paramsSerializer = paramsSerialization;
	}
	if (!isPlainObject(params)) {
		return url;
	}
	return generateURL(url, paramsSerializer(params));
}
var combineREG = /(?<!:)\/{2,}/g;

function combineURL(baseURL, url) {
	if (baseURL === void 0) {
		baseURL = '';
	}
	var separator = '/';
	return ("" + baseURL + separator + url).replace(combineREG, separator);
}
var dynamicREG = /\/?(:([a-zA-Z_$][\w-$]*))\/??/g;

function dynamicInterpolation(url, sourceData) {
	if (!isPlainObject(sourceData)) {
		return url;
	}
	return url.replace(dynamicREG, function(key1, key2, key3) {
		return key1.replace(key2, sourceData[key3]);
	});
}
var absoluteREG = /^([a-z][a-z\d+\-.]*:)?\/\//i;

function isAbsoluteURL(url) {
	return absoluteREG.test(url);
}

function isDynamicURL(url) {
	dynamicREG.lastIndex = 0;
	return dynamicREG.test(url);
}

function generateURL(url, serializedParams) {
	var hashIndex = url.indexOf('#');
	if (hashIndex !== -1) {
		url = url.slice(0, hashIndex);
	}
	if (serializedParams === '') {
		return url;
	}
	var prefix = url.indexOf('?') === -1 ? '?' : '&';
	serializedParams = "" + prefix + serializedParams;
	return "" + url + serializedParams;
}

function paramsSerialization(params) {
	if (!isPlainObject(params)) {
		return '';
	}
	var parts = [];
	Object.keys(params).forEach(function(key) {
		var value = params[key];
		if (isNull(value) || isUndefined(value) || value !== value) {
			return;
		}
		if (Array.isArray(value)) {
			key += '[]';
		}
		var values = [].concat(value);
		values.forEach(function(val) {
			if (isPlainObject(val)) {
				val = JSON.stringify(val);
			} else if (isDate(val)) {
				val = val.toISOString();
			}
			parts.push(encode(key) + "=" + encode(val));
		});
	});
	return parts.join('&');
}

function onlyFromConfig2(keys, target, config2) {
	keys.forEach(function(key) {
		var value = config2[key];
		if (!isUndefined(value)) {
			target[key] = value;
		}
	});
}

function priorityFromConfig2(keys, target, config1, config2) {
	keys.forEach(function(key) {
		var value1 = config1[key];
		var value2 = config2[key];
		if (!isUndefined(value2)) {
			target[key] = value2;
		} else if (!isUndefined(value1)) {
			target[key] = value1;
		}
	});
}

function deepMergeConfig(keys, target, config1, config2) {
	keys.forEach(function(key) {
		var value1 = config1[key];
		var value2 = config2[key];
		if (isPlainObject(value2)) {
			target[key] = deepMerge(value1 !== null && value1 !== void 0 ? value1 : {}, value2);
		} else if (isPlainObject(value1)) {
			target[key] = deepMerge(value1);
		}
	});
}
var onlyFromConfig2Keys = ['url', 'method', 'data', 'upload', 'download'];
var priorityFromConfig2Keys = ['adapter', 'baseURL', 'paramsSerializer', 'transformRequest', 'transformResponse',
	'errorHandler', 'cancelToken', 'dataType', 'responseType', 'timeout', 'enableHttp2', 'enableQuic',
	'enableCache', 'sslVerify', 'validateStatus', 'onUploadProgress', 'onDownloadProgress'
];
var deepMergeConfigKeys = ['headers', 'params'];

function mergeConfig(config1, config2) {
	if (config1 === void 0) {
		config1 = {};
	}
	if (config2 === void 0) {
		config2 = {};
	}
	var config = {};
	onlyFromConfig2(onlyFromConfig2Keys, config, config2);
	priorityFromConfig2(priorityFromConfig2Keys, config, config1, config2);
	deepMergeConfig(deepMergeConfigKeys, config, config1, config2);
	return config;
}

var Cancel = function() {
	function Cancel(message) {
		this.message = message;
	}
	Cancel.prototype.toString = function() {
		var message = this.message ? ": " + this.message : '';
		return "Cancel" + message;
	};
	return Cancel;
}();

function isCancel(value) {
	return value instanceof Cancel;
}
var CancelToken = function() {
	function CancelToken(executor) {
		var _this = this;
		var action;
		this.listener = new Promise(function(resolve) {
			action = function action(message) {
				if (_this.reason) {
					return;
				}
				_this.reason = new Cancel(message);
				resolve(_this.reason);
			};
		});
		executor(action);
	}
	CancelToken.source = function() {
		var cancel;
		var token = new CancelToken(function(action) {
			cancel = action;
		});
		return {
			token: token,
			cancel: cancel
		};
	};
	CancelToken.prototype.throwIfRequested = function() {
		if (this.reason) {
			throw this.reason;
		}
	};
	return CancelToken;
}();

function isCancelToken(value) {
	return value instanceof CancelToken;
}

function flattenHeaders(config) {
	if (!isPlainObject(config.headers)) {
		return config.headers;
	}
	var common = 'common';
	var method = toLowerCase(config.method, 'get');
	var alias = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'];
	return Object.assign({}, config.headers[common], config.headers[method], omit.apply(void 0, __spreadArray([config
		.headers, common
	], alias)));
}

function transformData(data, headers, transforms) {
	if (isUndefined(transforms)) {
		return data;
	}
	if (!isArray(transforms)) {
		transforms = [transforms];
	}
	transforms.forEach(function(transform) {
		data = transform(data, headers);
	});
	return data;
}

var AxiosError = function(_super) {
	__extends(AxiosError, _super);

	function AxiosError(message, config, request, response) {
		var _this = _super.call(this, message) || this;
		_this.isAxiosError = true;
		_this.config = config;
		_this.request = request;
		_this.response = response;
		Object.setPrototypeOf(_this, AxiosError.prototype);
		return _this;
	}
	return AxiosError;
}(Error);

function createError(message, config, request, response) {
	return new AxiosError(message, config, request, response);
}

function generateType(config) {
	var requestType = 'request';
	var method = toLowerCase(config.method, 'get');
	if (config.upload && method === 'post') {
		requestType = 'upload';
	}
	if (config.download && method === 'get') {
		requestType = 'download';
	}
	return requestType;
}

function tryToggleProgressUpdate(adapterConfig, progressUpdate) {
	if (isFunction(progressUpdate)) {
		switch (adapterConfig.type) {
			case 'upload':
				if (isFunction(adapterConfig.onUploadProgress)) {
					progressUpdate(adapterConfig.onUploadProgress);
				}
				break;
			case 'download':
				if (isFunction(adapterConfig.onDownloadProgress)) {
					progressUpdate(adapterConfig.onDownloadProgress);
				}
				break;
		}
	}
}

function request(config) {
	return new Promise(function(resolve, reject) {
		var _a;
		assert(isFunction(config.adapter), 'adapter 需要是一个 function');
		var adapterConfig = __assign(__assign({}, config), {
			url: (_a = config.url) !== null && _a !== void 0 ? _a : '',
			type: generateType(config),
			method: toUpperCase(config.method, 'GET'),
			success: success,
			fail: fail
		});
		var adapterTask = config.adapter(adapterConfig);

		function success(response) {
			response.config = config;
			response.request = adapterTask;
			if (!isFunction(config.validateStatus) || config.validateStatus(response.status)) {
				resolve(response);
			} else {
				catchError('请求失败', response);
			}
		}

		function fail(error) {
			error.config = config;
			error.request = adapterTask;
			catchError('网络错误', error);
		}

		function catchError(message, response) {
			reject(createError(message, config, adapterTask, response));
		}
		if (isPlainObject(adapterTask)) {
			tryToggleProgressUpdate(adapterConfig, adapterTask.onProgressUpdate);
		}
		if (isCancelToken(config.cancelToken)) {
			config.cancelToken.listener.then(function(reason) {
				if (isPlainObject(adapterTask)) {
					tryToggleProgressUpdate(adapterConfig, adapterTask.offProgressUpdate);
					if (isFunction(adapterTask.abort)) {
						adapterTask.abort();
					}
				}
				reject(reason);
			});
		}
	});
}

function transformURL(config) {
	var _a;
	var url = (_a = config.url) !== null && _a !== void 0 ? _a : '';
	if (!isAbsoluteURL(url)) {
		url = combineURL(config.baseURL, url);
	}
	if (isDynamicURL(url)) {
		var sourceData = Object.assign({}, config.params, config.data);
		url = dynamicInterpolation(url, sourceData);
	}
	url = buildURL(url, config.params, config.paramsSerializer);
	return url;
}

function throwIfCancellationRequested(config) {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested();
	}
}

function dispatchRequest(config) {
	throwIfCancellationRequested(config);
	config.url = transformURL(config);
	config.headers = flattenHeaders(config);
	config.data = transformData(config.data, config.headers, config.transformRequest);
	return request(config).then(function(response) {
		throwIfCancellationRequested(config);
		response.data = transformData(response.data, response.headers, config.transformResponse);
		return response;
	}, function(reason) {
		var _a, _b;
		if (!isCancel(reason)) {
			throwIfCancellationRequested(config);
			if (isPlainObject(reason.response)) {
				reason.response.data = transformData(reason.response.data, reason.response.headers, config
					.transformResponse);
			}
		}
		return Promise.reject((_b = (_a = config.errorHandler) === null || _a === void 0 ? void 0 : _a.call(
			config, reason)) !== null && _b !== void 0 ? _b : reason);
	});
}

var InterceptorManager = function() {
	function InterceptorManager() {
		this.id = 0;
		this.interceptors = {};
	}
	InterceptorManager.prototype.use = function(resolved, rejected) {
		this.interceptors[++this.id] = {
			resolved: resolved,
			rejected: rejected
		};
		return this.id;
	};
	InterceptorManager.prototype.eject = function(id) {
		delete this.interceptors[id];
	};
	InterceptorManager.prototype.forEach = function(executor, reverse) {
		var _this = this;
		var interceptors = Object.keys(this.interceptors).map(function(id) {
			return _this.interceptors[id];
		});
		if (reverse === 'reverse') {
			interceptors = interceptors.reverse();
		}
		interceptors.forEach(executor);
	};
	return InterceptorManager;
}();

var Axios = function() {
	function Axios(defaults) {
		if (defaults === void 0) {
			defaults = {};
		}
		this.interceptors = {
			request: new InterceptorManager(),
			response: new InterceptorManager()
		};
		this.defaults = defaults;
	}
	Axios.prototype.getUri = function(config) {
		var _a = mergeConfig(this.defaults, config),
			url = _a.url,
			params = _a.params,
			paramsSerializer = _a.paramsSerializer;
		return buildURL(url, params, paramsSerializer).replace(/^\?/, '');
	};
	Axios.prototype.request = function(config) {
		var requestConfig = mergeConfig(this.defaults, config);
		var promiseRequest = Promise.resolve(requestConfig);
		this.interceptors.request.forEach(function(_a) {
			var resolved = _a.resolved,
				rejected = _a.rejected;
			promiseRequest = promiseRequest.then(resolved, rejected);
		}, 'reverse');
		var promiseResponse = promiseRequest.then(dispatchRequest);
		this.interceptors.response.forEach(function(_a) {
			var resolved = _a.resolved,
				rejected = _a.rejected;
			promiseResponse = promiseResponse.then(resolved, rejected);
		});
		return promiseResponse;
	};
	Axios.prototype.options = function(url, config) {
		return this._requestMethodWithoutParams('options', url, undefined, config);
	};
	Axios.prototype.get = function(url, params, config) {
		return this._requestMethodWithoutParams('get', url, params, config);
	};
	Axios.prototype.head = function(url, params, config) {
		return this._requestMethodWithoutParams('head', url, params, config);
	};
	Axios.prototype.post = function(url, data, config) {
		return this._requestMethodWithoutData('post', url, data, config);
	};
	Axios.prototype.put = function(url, data, config) {
		return this._requestMethodWithoutData('put', url, data, config);
	};
	Axios.prototype["delete"] = function(url, params, config) {
		return this._requestMethodWithoutParams('delete', url, params, config);
	};
	Axios.prototype.trace = function(url, config) {
		return this._requestMethodWithoutParams('trace', url, undefined, config);
	};
	Axios.prototype.connect = function(url, config) {
		return this._requestMethodWithoutParams('connect', url, undefined, config);
	};
	Axios.prototype._requestMethodWithoutParams = function(method, url, params, config) {
		return this.request(__assign(__assign({}, config !== null && config !== void 0 ? config : {}), {
			method: method,
			url: url,
			params: params
		}));
	};
	Axios.prototype._requestMethodWithoutData = function(method, url, data, config) {
		return this.request(__assign(__assign({}, config !== null && config !== void 0 ? config : {}), {
			method: method,
			url: url,
			data: data
		}));
	};
	return Axios;
}();

var defaults = {
	adapter: getAdapterDefault(),
	headers: {
		common: {
			Accept: 'application/json, test/plain, */*'
		},
		options: {},
		get: {},
		head: {},
		post: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		},
		put: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		},
		"delete": {},
		trace: {},
		connect: {}
	},
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300;
	},
	timeout: 10000,
	dataType: 'json',
	responseType: 'text',
	enableHttp2: false,
	enableQuic: false,
	enableCache: false,
	sslVerify: true
};

function createInstance(defaults) {
	var instance = new Axios(defaults);

	function axios(url, config) {
		if (isString(url)) {
			config = Object.assign({}, config, {
				url: url
			});
		} else {
			config = url;
		}
		return instance.request(config);
	}
	Object.assign(axios, instance);
	Object.setPrototypeOf(axios, Object.getPrototypeOf(instance));
	return axios;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.CancelToken = CancelToken;
axios.create = function create(defaults) {
	return createInstance(mergeConfig(axios.defaults, defaults));
};
axios.createAdapter = createAdapter;
axios.isCancel = isCancel;

module.exports = uni ? uni.request : axios;
