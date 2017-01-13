//定义外层整体API
var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.11',
        // 匹配注释的语句,这里是三个:  /*任意字符*/  任意非:字符，没有都行//    ^//
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        // 匹配require的语句:  任意非.字符require("name")
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //对PS3做特殊处理
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //检测是否是opera
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},  
        globalDefQueue = [],     //储存使用defined方法定义的模块[name,deps,callback,name,deps,callback]每三个一模块
        useInteractive = false;  //ie的情况下是true，为了做加载兼容
    //判断是否是函数,为什么不直接调用，就是为了防止自身的toString方法被重写，所以这里用了call 
    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }
    // 判断是否是一个数组
    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }
    // 循环数组，如果后面的函数有返回值的情况下直接跳出循环,没有返回值的话就是返回undefined
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    // 倒序循环数组，如果后面函数有正确返回值则跳出循环
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    // 检测某个对象是否有指定自身属性，不包括继承属性和原型链上属性
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }
    // 检测某个对象是否有指定自身属性,如果有则返回该属性的值
    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }
    // 循环对象的自身属性，如果后面的函数返回正确值就跳出循环
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }
    // 将source对象里面的值赋给target，如果target有相同属性则不赋值，deepStringMixin来控制是否深拷贝
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }
    //类似的Function.prototype.bind, 但是这样this对象是独立的
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    // 得到scripts标签节点的方法
    function scripts() {
        return document.getElementsByTagName('script');
    }
    // 默认错误方法
    function defaultOnError(err) {
        throw err;
    }
    //对于像'a.b.c'这样的点分割的来返回一个当前对象的值global[c]可能为undefined
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }    
    //通过url来构造错误信息
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }
    //如果define已经存在其他AMD loader则直接返回
    if (typeof define !== 'undefined') {
        return;
    }
    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //不要重写已经存在的requirejs实例
            return;
        }
        cfg = requirejs;       //页面加载进来的时候可能已经有了requirejs变量，保存该变量
        requirejs = undefined; // 使requirejs为undefined来供下面使用
    }
    //允许将配置作为全局变量"require"在require.js加载之前进行定义，它会被自动应用赋值给配置变量cfg
    if (typeof require !== 'undefined' && !isFunction(require)) {
        cfg = require;
        require = undefined;
    }



    // 根据上下文名字，来得到一个格式化之后的上下文对象
    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},          //已注册模块的存放位置,键为id值为相应new出来的module
            enabledRegistry = {},   //保存相应已经被激活定义过的模块,键为模块id值为对应的new出来的模块
            /* 存储对应模块的自定义事件的对应回调函数数组
               undefEvents={
                    moduleId: {
                        "myeventname":[callback1,callbak2]
                    }
               } 
            */
            undefEvents = {},
            defQueue = [],       //储存使用defined定义的模块[name,deps,callback,name,deps,callback]每三个一模块
            defined = {},        //保存已经被注册进registry中的并且被定义之后的模块
            urlFetched = {},     //储存已经加载过的url为键并且对应值为true
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        // 对路径数组进行过滤,所有的当前路径也就是.会被过滤掉，多个上层目录..报错
        // ['.','..','a','b']       ['..','a','b']
        // ['..','.','a','b']       ['..','a','b']
        // ['..','..','a','b']      error
        function trimDots(ary) {
            var i, part, length = ary.length;
            for (i = 0; i < length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }
        /*
        requirejs.config({
            map: {
                'some/newmodule': {
                    'foo': 'foo1.2'
                },
                'some/oldmodule': {
                    'foo': 'foo1.0'
                },
                '*': {
                    'foo': 'foo1.3'
                },
            }
        });
        当“some/newmodule”调用了“require('foo')”，它将获取到foo1.2.js文件
        而当“some/oldmodule”调用“`require('foo')”时它将获取到foo1.0.js
        除了上面外的所有模块，当要用“foo”时，使用“foo1.3”来替代
        */
        // @param {String} name 模块的相对路径名
        // @param {String} baseName 基础路径，给name用
        // @param {Boolean} applyMap 将map的配置参数导入
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),   //存在的情况下返回路径数组
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];
            // 对路径进行过滤处理就是将name和baseName进行合并处理成字符串
            if (name && name.charAt(0) === '.') {
                if (baseName) {
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = name.split('/');
                    lastIndex = name.length - 1;
                    // 如果想让节点id保证一定的通用性，就将name的.js后缀去掉
                    // nodeIdCompat参数在放弃加载一个脚本之前等待的秒数。设为0禁用等待超时。默认为7秒
                    if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                        name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                    }

                    name = normalizedBaseParts.concat(name);
                    trimDots(name);
                    name = name.join('/');
                } else if (name.indexOf('./') === 0) {
                    // 过滤当前路径
                    name = name.substring(2);
                }
            }
            // 导入map配置的参数
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');
                // outerloop:命名外圈语句，innerloop:命名内圈语句，其实这也是break的一个用法
                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        // 用基础路径循环匹配map里面的路径
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));
                            // 如果已经配置了该参数，那么就用配置的值
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //保存匹配到的map值和匹配到时候的位置
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }
                    // 匹配*号的配置
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }
                // 通过配置文件，改变name的引用地址
                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }
            // If the name points to a package's name, use the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }
        // 根据模块路径名删除对应script标签
        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //只要失败删除第一个值然后重试
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }
        //将plugin!resource变成[plugin, resource]
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }
        //构造包含插件前缀,模块名等值的模块地图对象,如果父模块地图存在就通过上面的normalize来格式化一下路径名
        // @param {String} name 模块名同时也是路径名
        // @param {String} [parentModuleMap] 父模块来决定相对路径
        // @param {Boolean} isNormalized:  ID 是否已经被格式化了
        // @param {Boolean} applyMap: 导入地图配置文件进入ID.
        // @returns {Object}
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //如果没有名字说明他是一个require命令，则给其拼装一个内部的名字
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            // 调用normalize方法格式化name,得到的值赋给normalizedName
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //插件被下载调用它的normalize方法
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //一个常规模块没有前缀
                    normalizedName = normalize(name, parentName, applyMap);
                    // 再次分割前缀
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;
                    // 下载相应模块
                    url = context.nameToUrl(normalizedName);
                }
            }
            // 后缀
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }
        // 通过new对象得到依赖模块并存入registry
        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }
        //根据依赖地图和事件名称name来触发相应函数fn,module模块原型上的callPlugin方法用到了
        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }
        // 循环err中的所有错误模块，触发对应错误回调，如果都没有定义错误回调则运行默认错误事件
        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });
                // 如果所有的模块错误都没有捕获到的情况下就触发默认的error错误方法
                if (!notified) {
                    req.onError(err);
                }
            }
        }
        // 一个内部方法，将全局队列globalQueue翻译成上下文的定义队列defQueue
        function takeGlobalQueue() {
            if (globalDefQueue.length) {
                apsp.apply(defQueue,
                           [defQueue.length, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return  getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };
        //清除已经活跃的该模块和相应的已经注册的该模块
        function cleanRegistry(id) {
            delete registry[id];
            delete enabledRegistry[id];
        }
        // 中断循环mod为new出来的模块对象
        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);
                    // 定义没有完成但是已经被注册的模块做些强制处理
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }
        // 检测所有模块的加载状况
        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //设置过期时间，可以通过waitSeconds参数设置
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            if (inCheckLoaded) {
                return;
            }
            //控制是否处于正在检测的状态
            inCheckLoaded = true;
            // 计算所有模块的状态mod为完整的new出来的module模块
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //跳过没有被激活的模块或者错误状态中的模块
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //如果模块没有被初始化而且已经过期了
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished loading. If the only stillLoading is a
                            //plugin resource though, keep going,because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });
            //如果等待时间过期了，则抛出错误下载失败
            if (expired && noLoads.length) {
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }
            // 没有过期的情况下再次检测一下循环
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }
            // 如果仍然等待加载并且等待加载的不是插件资源，仍可解释为scripts所以之后继续加载
            if ((!expired || usingPathFallback) && stillLoading) {
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }
        // 定义模块所应该有的属性
        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];    //导出的模块对应的标示数组
            this.depMaps = [];
            this.depMatched = [];    //已经匹配到的依赖的数组，存入true or false
            this.pluginMaps = {};
            this.depCount = 0;
        };
        // 重写模块的原型对象
        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};
                // 如果已经init过了，不要多次调用init方法
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //注册错误回到函数
                    this.on('error', errback);
                } else if (this.events.error) {
                    //如果没有errback但是有error事件的监听，则通过复制让errback可以触发error事件
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                this.depMaps = depMaps && depMaps.slice(0);
                this.errback = errback;
                //标示模块已经initialized
                this.inited = true;
                this.ignore = options.ignore;
                //在激活模式下，如果有参数来初始化这个模块
                if (options.enabled || this.enabled) {
                    //激活这个模块的依赖
                    this.enable();
                } else {
                    this.check();
                }
            },
            // 定义相应导出的依赖，写入相应标示进数组记录
            defineDep: function (i, depExports) {
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },
            // 判定用callPlugin方法还是load方法来加载相应模块
            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //是否有配置项shim
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //正常依赖
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },
            // 加载模块的方法
            load: function () {
                var url = this.map.url;
                //对应url如果加载过了则不处理
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },
            // 检测模块是否准备定义自身，如果是，那就定义它
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    // 正在定义中
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            // 如果他有一个错误监听者优先使用它而不是抛出错误
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }
                            // module.exports 命令优先于exports对象
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //导出已经设置的定义值
                                    exports = this.exports;
                                }
                            }
                            // 定义错误的参数
                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //仅仅是一个普通的值
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    // 完成了定义 
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },
            // 激活定义相依插件地图
            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //构造插件地图
                    pluginMap = makeModuleMap(map.prefix);
                // 标记这是插件的依赖，能够被循环追踪
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });
                    // 如果当前模块没有被格式化，就格式化他的name
                    if (this.map.unnormalized) {
                        //如果插件允许则格式化ID 
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }
                        //前缀和名称应该已经标准化,不需要再次应用地图配置
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //标记这是插件的依赖，能够被循环追踪
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }
                    // 如果有路径配置参数，就加载该文件而不是处理插件，因为他在路径时候已经建立好了
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];
                        // 为这个模块移除临时的没有格式化的模块
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });
                    //允许插件加载其他代码不需要知道上下文或如何他完成加载的
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;
                        // 支持通过文本来保证来自文本的每个资源只被加载一次也支持通过旧的模块名来抛弃内部参考模块名
                        if (textAlt) {
                            text = textAlt;
                        }
                        //对于ie的script的定义在结束的时候直接返回
                        if (hasInteractive) {
                            useInteractive = false;
                        }
                        //创建模块实例来填装系统
                        getModule(moduleMap);
                        //将配置文件转换为其他模块
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }
                        //标记为插件资源的依赖
                        this.depMaps.push(moduleMap);
                        // 支持匿名模块
                        context.completeLoad(moduleName);
                        // 通过资源ID来绑定模块的值
                        localRequire([moduleName], load);
                    });
                    // 这里使用父模块名因为插件名不可靠，还有一些字符串没有路径,所以参考parentName的路径
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },
            // 激活对应模块使其从注册模块变成已定义模块
            enable: function () {
                enabledRegistry[this.map.id] = this;
                // 给模块都加上一个键来标示已经被激活过了
                this.enabled = true;
                // 正在激活中
                this.enabling = true;
                //循环激活每个依赖
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //将依赖路径转变为相应的依赖地图
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //跳过'require', 'exports', 'module'这样的模块，也不要激活那些已经激活的模块了
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //激活插件依赖
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },
            // 根据模块id，来给模块绑定自定义事件，数组类型也是引用类型
            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },
            // 触发on定义的自定义事件
            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    // 到这里error的回调函数已经触发了，所以清除掉对应回调函数的数组
                    delete this.events[name];
                }
            }
        };
        //args包括id, deps, factory应该被define()函数格式化，new Module对象并初始化该对象
        function callGetModule(args) {
            //跳过已经被定义的模块
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }
        // 移除节点事件
        function removeListener(node, func, name, ieName) {
            //IE9支持detachEvent
            if (node.detachEvent && !isOpera) {
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }
        // @param {Event} evt 来自script节点的event事件对象
        function getScriptData(evt) {
            //firefox和其他浏览器下的 event.target = IE 下的 event.srcElement，意义一样，只是方法不同
            var node = evt.currentTarget || evt.srcElement;

            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }
        // 放入所有正确的模块定义
        function intakeDefines() {
            var args;
            //将全局队列中的所有定义模块全都吸入
            takeGlobalQueue();
            // 保证所有剩下的defQueue值都经过正确的处理
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args包括id, deps, factory应该被define()函数格式化
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            // 合并配置对象的方法
            configure: function (cfg) {
                //确保基础路径以'/'结尾
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };
                //循环遍历上面objs对象的键在cfg中是否有，如果有就将其混合到config配置文件中
                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });
                // 在require.js被加载定义之前加载的依赖deps以及deps加载完成之后执行callback回调
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },
            // 得带shim配置参数中的导出模块的对应变量
            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },
            // 创建require方法,relMap是父模块地图
            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //处理依赖是require|exports|module 
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }
                        // 同步获取一个模块，如果require.get存在更是该如此
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }
                        // 构造模块地图
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }
                    //最终结果就是将从全局队列中取出定义的模块new出相应module并存放入registry对象中
                    intakeDefines();
                    //通过settimeOut不停的调用确保所有依赖被加载完成
                    context.nextTick(function () {
                        //Some defines could have been added since the require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,
                    // 处理模块名后缀
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },
                    // 模块是否被定义
                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },
                    // 模块是否被指定
                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //只有顶层的require才可以调用
                if (!relMap) {
                    localRequire.undef = function (id) {
 
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];
                        // 删除相应定义队列的记录
                        eachReverse(defQueue, function(args, i) {
                            if(args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            // 建立一个监听防止模块被重复加载
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }
                            // 清除相应的注册记录
                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },
            //唤醒已经注册的模块中等待启动的模块
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },
            // 这是一个内部方法，通过对环境的适配来完成事件的加载
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        // 如果发现一个匿名模块，就绑定这个名字，其他模块等它加载完成才加载
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //匹配到定义的模块
                        found = true;
                    }
                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //如果模块没有调用defined方法，则模拟一个调用它
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },
            // 使模块名变成文件路径，也支持模块名本身就是url的情况，这里假定模块名已经进行过标准化normalized
            // 这是一个内部api，对外部api使用的是toUrl
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }
                // 判断它是否只是一个模块ID
                if (req.jsExtRegExp.test(moduleName)) {
                    // 这里的标准化或许不那么健壮，将来也许会重写
                    url = moduleName + (ext || '');
                } else {

                    paths = config.paths;
                    syms = moduleName.split('/');
                    // 对于每个模块名片段，看它在配置文件path中是否已经被配置
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }
                    //判断是否要加入baseUrl
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }
                // 这里的config.urlArgs是人为配置的参数，如果我们没配置就肯定是undefined
                // urlArgs: RequireJS获取资源时附加在URL后面的额外的query参数。作为浏览器或服务器未正确配置
                // 时的“cache bust”手段很有用如：urlArgs: "bust=" +  (new Date()).getTime()
                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },
            //利用req.load载入加载模块
            load: function (id, url) {
                req.load(context, id, url);
            },
            // 已正确的参数顺序来执行模块的回调函数
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },
            //script加载中的回调函数 
            onScriptLoad: function (evt) {
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for to long.
                    interactiveScript = null;

                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },
            // 模块加载失败报错方法
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }



    /*
    上面代码只是加载一些方法，这里是主要入口,对req和requirejs函数对象的构造,主要是利用上面的newContext方法生成上下文
    require中要注意的地方，如果模块还没有被加载，那么它的这三种状态出现的时机是：
        loading     文件还没有加载完毕
        enabling    对该模块的依赖进行加载和模块化
        defining    对正在处理的模块进行加载，并运行模块中的callback
    */
    req = requirejs = function (deps, callback, errback, optional) {

        var context, config,
            contextName = defContextName;   //默认模块名

        // 第一个参数不是数组也不是字符串的话那就是配置参数了
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps是一个配置对象
            config = deps;
            if (isArray(callback)) {
                // 那么相应的第二个参数如果是数组就变为依赖模块了，依次类推赋值
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            // 这里下面有映射，就是调用上面的newContext方法
            context = contexts[contextName] = req.s.newContext(contextName);
        }
        // 载入配置文件
        if (config) {
            context.configure(config);
        }
        // 实际上就是调用上面的localRequire方法
        return context.require(deps, callback, errback);
    };
    //支持require.config()来与其他AMD loaders合作使用
    req.config = function (config) {
        return req(config);
    };
    // 当前事件循环钩子执行之后，来运行该函数
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };
    // 导出require接口
    if (!require) {
        require = req;
    }
    // 版本控制
    req.version = version;
    //匹配以斜杠/开头，或者字符中有:或者有?或者以.js结尾的字符串
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };
    //整体运行创建默认上下文
    req({});



    //导出一些有意义的方法到全局require对象
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //从上下文引用而不是早期绑定默认上下文,所以在构建期间，默认的最新默认上下文实例是通过配置得到的
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });
    // base标签的载入
    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        // 注意base标签是为为页面上的所有链接规定默认地址或默认目标
        // 在ie6下面如果base标签在运行中的话，使用appendChild有问题，当浏览器死了之后该节点会被移除
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    req.onError = defaultOnError;
    // 为加载创建节点，如果是xml文档则使用createElementNS来创建节点
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    }; 
    // 主要加载模块 @param {Object} 需要加载模块的上下文
    // @param {String} 模块名字 @param {Object} 模块对应地址
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            node = req.createNode(config, moduleName, url);
            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //首先检测attachEvent因为IE9对addEventListener和script加载事件与其他浏览器不同
            //而且Opera并不支持script形式的脚本加载模式
            if (node.attachEvent &&
                    //检测node.attachEvent是人为添加的还是浏览器原生的
                    // 如果没有发现[native code]说明是了浏览器原生的
                    //在IE8里面node.attachEvent没有toString()方法
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //对于IE (至少6-8)我们不能在脚本加载之后指定一个匿名回调 
                // 但是我们可以监听onreadystatechange事件,通过判断node.readystate=='interactive'表示还未执行完毕
                useInteractive = true;
                node.attachEvent('onreadystatechange', context.onScriptLoad);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;
            // 插入节点并且返回节点
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //HTML5引入了一个工作线程（webWorker）的概念。它允许开发人员编写能够长时间运行而不被用户所中断的
                //后台程序，去执行事务或者逻辑，并同时保证页面对用户的响应。就是允许JavaScript创建多个线程，但是
                //子线程完全受主线程控制，且不得操作DOM。从而，可以用webWorker来处理一些比较耗时的计算。
                importScripts(url);
                //计算匿名模块
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };
    // 获得正在加载的脚本的状态对象
    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //查找data-main属性
    if (isBrowser && !cfg.skipDataMain) {
        //从require.js所引入的script标签中计算出baseUrl
        eachReverse(scripts(), function (script) {
            //保证head肯定能增加子节点
            if (!head) {
                head = script.parentNode;
            }
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
              
                mainScript = dataMain;
                //如果没有设置 baseUrl则以data-main作为baseUrl
                if (!cfg.baseUrl) {
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }
                //去掉.js结尾的文件，使其更像模块名字
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //如果mainScript仍然是一个路径的话，再次重赋值
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //准备加载主文件
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    // 定义define方法，将其写入全局队列中globalDefQueue或者context.defQueue中
    define = function (name, deps, callback) {
        var node, context;
        //处理匿名模块
        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
            name = null;
        }
        //处理没有依赖的模块
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //处理没有名字并且callback是一个函数，判断是否是CommonJS规范
        if (!deps && isFunction(callback)) {
            deps = [];
            // callback.length可以读到该callback函数有几个参数
            // toString方法将callback变成字符串，之后去掉注释并把里面的require全部push到deps
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });
                // 有时候需要包装CommonJS来定义模块
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }
        //如果IE 6-8有匿名define，修正name和context的值 
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }
        // 如果当前context存在，把本次defined加入到defQueue中否则加入到globalDefQueue
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };
    // jslint
    req.exec = function (text) {
        return eval(text);
    };
    //根据配置信息建立req
    req(cfg);
}(this));
