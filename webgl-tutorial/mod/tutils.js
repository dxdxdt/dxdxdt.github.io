/* global vec2, vec3, vec4, mat2, mat2d, mat3, mat4 */
var Tut = (() => {
  "use strict";
  // Scope local decl ...
  var __ret__; // Scope object.
  const __RAD2DEG__ = Math.PI / 180;
  var __fabAcc__, __fabRacc__;
  var __checkType__, __checkFunc__, __checkClass__;

  __checkType__ = function (x, t) {
    var typeName = typeof x;

    if (typeName !== t) {
      let sb = [
        t,
        " type required. Passed: ",
        typeName
      ];
      Tut.throwFreezed(new TypeError(sb.join("")));
    }
  };
  __checkClass__ = function (x, c) {
    if (Array.isArray(c)) {
      let e, names, str;

      for (e of c) {
        if (x instanceof e) {
          return;
        }
      }

      names = [];
      for (e of c) {
        names.push(e.name || e);
      }
      if (names.length <= 1) {
        str = names.join("");
      }
      else {
        str = names.slice(0, names.length - 1).join(", ") + names[names.length - 1];
      }

      Tut.throwFreezed(new TypeError("instance of [" + str + "] required."));
    }
    else {
      if (!(x instanceof c)) {
        Tut.throwFreezed(new TypeError("instance of " + (c.name || c) + " required."));
      }
    }
  };
  __checkFunc__ = function (x) {
    if (!(x instanceof Function)) {
      Tut.throwFreezed(new TypeError("function/callable required."));
    }
  };

  __ret__ = {
    GLError: class extends Error {
      constructor (ctx, msg, fn, ln) {
        var glCode = new Set();
        super(msg, fn, ln);

        (function (){
          var c;
          while ((c = ctx.getError())) {
            glCode.add(c);
          }
        })();

        Object.defineProperty(this, 'glCode', {
          get : function () {
            return glCode;
          },
          configurable: true
        });
        Object.defineProperty(this, 'ctx', {
          get : function () {
            return ctx;
          },
          configurable: true
        });
      }
    },

    PerfStopwatch: class {
      constructor () {
        var tsArr = [];
        var prec = 4;

        Object.defineProperty(this, 'ts', {
          get : function () {
            return tsArr.slice();
          },
          configurable: true
        });
        Object.defineProperty(this, 'push', {
          value : function (report) {
            var ts = performance.now();

            if (report) {
              if (tsArr.length) {
                console.log(tsArr.length + ": " + (ts - tsArr[0]).toFixed(prec) + "ms (diff: " + (ts - tsArr[tsArr.length - 1]).toFixed(prec) + "ms)");
              }
              else {
                console.log("0: " + (0).toFixed(prec) + "ms");
              }
            }
            tsArr.push(ts);

            return this;
          },
          configurable: true
        });
        Object.defineProperty(this, 'reset', {
          value : function () {
            tsArr = [];
            return this;
          },
          configurable: true
        });
      }
    },

    FrameCounter: class {
      constructor () {
        var __arr = [];
        var __sum, __min, __max, __stdev, __mean, __cnt = 0;

        this.calc = function () {
          if (__arr.length) {
            __min = __max = __arr[0];
            __stdev = __sum = 0;

            for (let v of __arr) {
              __max = Math.max(v, __max);
              __min = Math.min(v, __min);
              __sum += v;
            }
            __mean = __sum / __arr.length;

            for (let v of __arr) {
              __stdev += Math.abs(v - __mean);
            }
            __stdev = __stdev / __arr.length;
          }
          __cnt = __arr.length;
          __arr = [];

          return this;
        };
        this.push = function (x) {
          __arr.push(x);
          return this;
        };

        Object.defineProperty(this, 'sum', {
          get : function () {
            return __sum;
          },
          configurable: true
        });
        Object.defineProperty(this, 'min', {
          get : function () {
            return __min;
          },
          configurable: true
        });
        Object.defineProperty(this, 'max', {
          get : function () {
            return __max;
          },
          configurable: true
        });
        Object.defineProperty(this, 'stdev', {
          get : function () {
            return __stdev;
          },
          configurable: true
        });
        Object.defineProperty(this, 'mean', {
          get : function () {
            return __mean;
          },
          configurable: true
        });
        Object.defineProperty(this, 'cnt', {
          get : function () {
            return __cnt;
          },
          configurable: true
        });
      }
    },

    Camera: class {
      constructor () {
        var __vecAdd__ = vec3.create();
        var __vecDir__ = vec3.create();
        var __vecRight__ = vec3.create();

        this.position = vec3.fromValues(0, 0, 5);
        this.angle = {
          h: Math.deg2rad(180), // toward -Z
          v: Math.deg2rad(0) // look at the horizon
        };
        this.fov = 45.0;
        this.direction = vec3.create();
        this.right = vec3.create();
        this.up = vec3.create();

        this.correctAngles = function () {
          var wrapAngle = (x) => {
            var ret = x % (Math.PI * 2);
            if (ret < -Math.PI) {
              ret += (Math.PI * 2);
            }
            else if (ret > Math.PI) {
              ret -= (Math.PI * 2);
            }
            return ret;
          };

          // Wrap angles in [-180, 180] range.
          this.angle.h = wrapAngle(this.angle.h);
          this.angle.v = wrapAngle(this.angle.v);

          // Limit verticle angle so that the camera won't go upside down.
          {
            if (this.angle.v > Math.PI / 2) {
              this.angle.v = Math.PI / 2;
            }
            else if (this.angle.v < -Math.PI / 2) {
              this.angle.v = -Math.PI / 2;
            }
          }

          return this;
        };
        this.setAngles = function (v, h) {
          this.angle.h = v;
          this.angle.v = h;

          this
            .correctAngles()
            .calcVectors();

          return this;
        };
        this.addAngles = function (v, h) {
          this.angle.h += v;
          this.angle.v += h;

          this
            .correctAngles()
            .calcVectors();

          return this;
        };
        this.move = function (direction, right) {
          var i;

          for (i = 0; i < 3; i += 1) {
            __vecDir__[i] = this.direction[i] * direction;
            __vecRight__[i] = this.right[i] * right;
          }
          vec3.add(__vecAdd__, this.position, __vecDir__);
          vec3.copy(this.position, __vecAdd__);
          vec3.add(__vecAdd__, this.position, __vecRight__);
          vec3.copy(this.position, __vecAdd__);

          this.onupdate();

          return this;
        };
        this.calcVectors = function () {
          this.direction[0] = Math.cos(this.angle.v) * Math.sin(this.angle.h);
          this.direction[1] = Math.sin(this.angle.v);
          this.direction[2] = Math.cos(this.angle.v) * Math.cos(this.angle.h);
          this.right[0] = Math.sin(this.angle.h - Math.deg2rad(90));
          this.right[1] = 0;
          this.right[2] = Math.cos(this.angle.h - Math.deg2rad(90));
          vec3.cross(this.up, this.right, this.direction);

          this.onupdate();

          return this;
        };
        this.onupdate = function () {};

        this.calcVectors();
      }
    },

    R: (function () {
        var __TYPES__ = Object.freeze({
          TEXT: 0,
          ARRAYBUFFER: 1,
          DOCUMENT: 2,
          JSON: 3,
          IMAGE: 4
        });
        var __ERROR_CODES__ = Object.freeze({
          INTERNAL: 0,
          DUP: 1,
          NO_RSRC: 2,
          IN_ACTION: 3
        });
        var __DEF_WORKERS__ = 4;
        var __ERR_WAIT_TIME__ = 200;
        var __GIVE_UP_AFTER__ = 5;
        // Therefore, max stall time: '__ERR_WAIT_TIME__' * '__GIVE_UP_AFTER__'
        var __ns__;
        var __typeSet__ = new Set();
        var __errorCodeSet__ = new Set();
        var __type2responseType__;
        var __checkTypeRange__;
        var __throwMyError__;

        let k;

        for (k in __TYPES__) {
          __typeSet__.add(__TYPES__[k]);
        }
        for (k in __ERROR_CODES__) {
          __errorCodeSet__.add(__ERROR_CODES__[k]);
        }
        Object.freeze(__typeSet__);

        __type2responseType__ = function (x) {
          switch (x) {
          case __TYPES__.TEXT: return 'text';
          case __TYPES__.ARRAYBUFFER: return 'arraybuffer';
          case __TYPES__.DOCUMENT: return 'document';
          case __TYPES__.JSON: return 'json';
          default: Tut.throwFreezed(new RangeError("type not in range."));
          }
        };
        __checkTypeRange__ = function (x) {
          if (!__typeSet__.has(x)) {
            let sb = [
              "type not in range(",
              0,
              ", ",
              __typeSet__.size - 1,
              "). Passed: ",
              x
            ];
            Tut.throwFreezed(new RangeError(sb.join("")));
          }
        };
        __throwMyError__ = function (msg, code) {
          let e = new Tut.R.Error(msg);
          e.code = code;
          Tut.throwFreezed(e);
        };

        __ns__ = {
          TYPE: __TYPES__,
          Source: class {
            constructor (__id, __uri, __type) {
              var __path;

              Object.defineProperties(this, {
                id: {
                  get: function () {
                    return __id;
                  },
                  set: function (x) {
                    let path, tidyPath, e;

                    __checkType__(x, 'string');
                    if (x === '') {
                      Tut.throwFreezed(new TypeError("Empty id not allowed."));
                    }

                    path = x.split('.');
                    tidyPath = [];
                    for (e of path) {
                      if (e) {
                        tidyPath.push(e);
                      }
                    }

                    __id = x;
                    __path = Object.freeze(tidyPath);

                    return x;
                  },
                  configurable: true
                },
                uri: {
                  get: function () {
                    return __uri;
                  },
                  set: function (x) {
                    __checkType__(x, 'string');
                    __uri = x;
                    return x;
                  },
                  configurable: true
                },
                type: {
                  get: function () {
                    return __type;
                  },
                  set: function (x) {
                    __checkType__(x, 'number');
                    __checkTypeRange__(x);
                    __type = x;
                    return x;
                  },
                  configurable: true
                },
                path: {
                  get: function () {
                    return __path;
                  },
                  configurable: true
                }
              });

              this.id = __id;
              this.uri = __uri;
              this.type = __type;
            }
          },

          Pack: class {
            constructor (iterable) {
              var __rsrcMap = new Map(); // ID string => Source
              var __pending = [];
              // Source => fetched resource
              // (Tut.R.Error / String / ArrayBuffer / Document / JSON / Image)
              var __fetchedMap = new Map();
              var __resultMap = new Map(); // Source => boolean
              var __workerMap = new Map(); // Request instance => Source
              // Number of requests to process simultaneously
              var __workers = __DEF_WORKERS__;
              var __lookupTree = {};
              // Protected methods
              var __deploy, __utilise, __giveup, __throwIfInAction,
                __treatError, __treatOK, __assignPath, __stepPath, __delPath;
              var __handleError, __handleLoad; // Event handlers
              var __onResult = null, __onDone = null;
              var __cntError = 0, __cntOK = 0;
              var __reqErrCnt = 0;

              // Make an XMLHttpRequest instance to fetch the resource.
              __deploy = function (src) {
                let req;

                if (__workerMap.size >= __workers) {
                  // XXX: cargocult. Caller must check before calling
                  // the function.
                  __throwMyError__("no worker available.",
                    __ERROR_CODES__.INTERNAL);
                }

                switch (src.type) {
                case __TYPES__.TEXT:
                case __TYPES__.ARRAYBUFFER:
                case __TYPES__.DOCUMENT:
                case __TYPES__.JSON:
                  req = new XMLHttpRequest();
                  req.addEventListener('abort', __handleError);
                  req.addEventListener('error', __handleError);
                  req.addEventListener('load', __handleLoad);
                  req.open("GET", src.uri);
                  req.responseType = __type2responseType__(src.type);
                  req.send(null);
                  break;
                case __TYPES__.IMAGE:
                  req = new Image();
                  req.addEventListener('error', __handleError);
                  req.addEventListener('load', __handleLoad);
                  req.src = src.uri;
                  // TODO: crossorigin support?
                  break;
                }
                __workerMap.set(req, src);
              };
              // Call '__deploy' until it's full.
              __utilise = function () {
                try {
                  while (__workerMap.size < __workers && __pending.length > 0) {
                    __deploy(__pending[__pending.length - 1]);
                    __pending.pop();
                    __reqErrCnt = 0;
                  }
                }
                catch (e) {
                  if (e instanceof Tut.R.Error) {
                    // XXX: cargocult
                    // Something horrible happened inside. Panic.
                    __giveup();
                  }
                  else {
                    // Probably system resource shortage.
                    if (__workerMap.size <= 0 && __pending.length > 0) {
                      // Got resource to fetch, but no worker to wait around.
                      if (__reqErrCnt >= __GIVE_UP_AFTER__) {
                        // Tried enough. The system's in a bad shape.
                        __giveup();
                      }
                      else {
                        __reqErrCnt += 1;
                        // Give it a shot after a while.
                        setTimeout(function () {
                          __utilise();
                        }, __ERR_WAIT_TIME__);
                      }
                    }
                  }
                }
              };
              // Give up on pending resources.
              __giveup = function () {
                while (__pending.length > 0) {
                  __treatError(null, __pending.pop(), null);
                }
              };
              // Treat the response as error.
              // As XMLHttpRequest considers 404 response sane.
              __treatError = function (req, src, v) {
                v = v || null;
                __resultMap.set(src, false);
                __fetchedMap.set(src, v);
                __workerMap.delete(req);
                __cntError += 1;

                if (__onResult) {
                  Promise.resolve({
                    src: src,
                    result: false,
                    detail: v
                  }).then(__onResult);
                }
                if ((__cntError + __cntOK) === __rsrcMap.size) {
                  if (__onDone) {
                    Promise.resolve().then(__onDone);
                  }
                }
                else {
                  __utilise();
                }
              };
              // Treat the response as success.
              __treatOK = function (req, src, v) {
                __resultMap.set(src, true);
                __fetchedMap.set(src, v);
                __workerMap.delete(req);
                __cntOK += 1;

                if (__onResult) {
                  Promise.resolve({
                    src: src,
                    result: true,
                    detail: v
                  }).then(__onResult);
                }
                if ((__cntError + __cntOK) === __rsrcMap.size) {
                  if (__onDone) {
                    Promise.resolve().then(__onDone);
                  }
                }
                else {
                  __utilise();
                }
              };
              // Assign deep in a object.
              __assignPath = function (to, path, v) {
                let i, lim, e;

                lim = path.length - 1;
                for (i = 0; i < lim; i += 1) {
                  e = path[i];

                  if (to[e]) {
                    to = to[e];
                  }
                  else {
                    to[e] = {};
                    to = to[e];
                  }
                }
                to[path[lim]] = v;
              };
              // Step into the tree, check if the path is already there.
              __stepPath = function (tree, path) {
                let i, lim, e, tn;

                lim = path.length - 1;
                for (i = 0; i < lim; i += 1) {
                  e = path[i];
                  tn = typeof tree[e];

                  if (tn === 'undefined') {
                    return false;
                  }
                  else if (tn !== 'object') {
                    return true;
                  }
                  else {
                    tree = tree[e];
                  }
                }

                return typeof tree[path[lim]] !== 'undefined';
              };
              __delPath = function (tree, path) {
                let i, lim, e;

                lim = path.length - 1;
                for (i = 0; i < lim; i += 1) {
                  e = path[i];

                  if (typeof tree[e] !== 'object') {
                    return false;
                  }
                  else {
                    tree = tree[e];
                  }
                }

                if (typeof tree[path[lim]] !== 'undefined') {
                  delete tree[path[lim]];
                  return true;
                }
                return false;
              };

              __handleError = function (evt) {
                let src = __workerMap.get(evt.target);

                if (!src) {
                  return;
                }
                __treatError(evt.target, src, evt.detail || undefined);
              };
              __handleLoad = function (evt) {
                let src = __workerMap.get(evt.target);

                if (!src) {
                  return;
                }

                if (evt.target instanceof XMLHttpRequest) {
                  // 'load' event will be fired even if the status is not OK or
                  // the response cannot be evaluated to the specified
                  // type('responseType' attribute) as long as the data is
                  // sent by the server.
                  if (evt.target.status !== 200 ||
                    evt.target.response === null) {
                    __treatError(evt.target, src, evt.detail);
                  }
                  else {
                    __treatOK(evt.target, src, evt.target.response);
                  }
                }
                else if (evt.target instanceof Image) {
                  // Remove the attached handlers.
                  evt.target.removeEventListener('error', __handleError);
                  evt.target.removeEventListener('load', __handleLoad);
                  __treatOK(evt.target, src, evt.target);
                }
              };

              Object.defineProperties(this, {
                // Add the resource to fetch.
                add: {
                  value: function (src) {
                    __throwIfInAction(); // TODO: test
                    __checkClass__(src, Tut.R.Source);
                    if (__rsrcMap.has(src.id) ||
                      __stepPath(__lookupTree, src.path)) {
                      __throwMyError__("duplicate id", __ERROR_CODES__.DUP);
                    }

                    __rsrcMap.set(src.id, src);
                    __assignPath(__lookupTree, src.path, true);
                    return this;
                  },
                  configurable: true
                },
                // Remove the resource from the pack.
                // Takes either a string or an instance of Tut.R.Source.
                // Note that the method will remove the instance with the id of
                // passed Tut.R.Source instance, not the instance itself.
                // TODO: test
                remove: {
                  value: function (src) {
                    let rsrc;

                    __throwIfInAction(); // TODO: test

                    if (src instanceof Tut.R.Source) {
                      rsrc = __rsrcMap.get(src.id);
                      __rsrcMap.delete(src.id);
                    }
                    else if (typeof src === 'string') {
                      rsrc = __rsrcMap.get(src);
                      __rsrcMap.delete(src);
                    }
                    else {
                      Tut.throwFreezed(new TypeError("string or Tut.R.Source type required."));
                    }
                    __delPath(__lookupTree, rsrc.path);

                    return this;
                  },
                  configurable: true
                },
                // Returns an object describing the fetch process.
                // retval.ok: number of resources fetched successfully
                // retval.error: number of resources unable to fetch
                // retval.total: total number of resources
                // retval.map: a Map instance, resource id => value where
                // value is either true, false or null when the corresponding
                // resource is successfully fetched, unable to fetch or pending
                // respectively.
                progress: {
                  value: function () {
                    return {
                      ok: __cntOK,
                      error: __cntError,
                      total: __rsrcMap.size,
                      map: new Map(__resultMap)
                    };
                  },
                  configurable: true
                },
                // Start the fetch process.
                fetch: {
                  value: function () {
                    let p;

                    __throwIfInAction(); // TODO: test
                    if (__rsrcMap.size <= 0) {
                      __throwMyError__("no resource added.", __ERROR_CODES__.NO_RSRC);
                    }

                    __reqErrCnt = __cntOK = __cntError = 0;
                    __resultMap.clear();
                    __fetchedMap.clear();
                    // Fill '__pending' queue and init '__resultMap' with null.
                    for (p of __rsrcMap) {
                      __pending.push(p[1]);
                      __resultMap.set(p[1], null);
                    }
                    __utilise();

                    return this;
                  },
                  configurable: true
                },
                // Return an object containing the fetched result
                // (attribute: id => value: resource)
                // Unresolved resources will be set as null. If there's one or
                // more commas in the resource id, the resolved resource will
                // be assigned in the sub object. For example, if the id is
                // 'img.a', the resource will be retval.img.a. Deeper paths like
                // 'img.a.b.c' are allowed.
                bundle: {
                  value: function () {
                    let p;
                    let ret = {};

                    for (p of __rsrcMap) {
                      __assignPath(ret, p[1].path,
                        (__resultMap.get(p[1]) && __fetchedMap.get(p[1])) || null);
                    }

                    return ret;
                  },
                  configurable: true
                },

                // Test if fetching is in process.
                inAction: {
                  get: function () {
                    return __workerMap.size > 0 || __pending.length > 0;
                  },
                  configurable: true
                },

                getResources: {
                  value: function () {
                    return new Map(__rsrcMap);
                  },
                  configurable: true
                },
                // Set the number of requests to run simultaneously.
                // The default value is 4. Passing 0 or a negative value will
                // set it to the default value. This limit is essential
                // because the browsers do not "queue" the requests when
                // there's not enough system resource.
                setWorkers: {
                  value: function (x) {
                    __checkType__(x, 'number');

                    if (x <= 0) {
                      __workers = __DEF_WORKERS__;
                    }
                    else {
                      __workers = x;
                    }

                    if (this.inAction) {
                      __utilise();
                    }

                    return __workers;
                  },
                  configurable: true
                },
                getWorkers: {
                  value: function () {
                    return __workers;
                  },
                  configurable: true
                },
                // Set the callback function that's called
                // when the process is done.
                onDone: {
                  get: function () {
                    return __onDone;
                  },
                  set: function (x) {
                    if (x) {
                      __checkFunc__(x);
                      __onDone = x.bind(this);
                    }
                    else {
                      __onDone = null;
                    }

                    return __onDone;
                  },
                  configurable: true
                },
                // Set the callback function that's called
                // when one resource is processed. The first argument of
                // the callback function will be an object with following
                // attributes:
                // 'src': Tut.R.Source instance
                // 'result': a boolean value. True if successful.
                // 'detail': The fetched resource if 'result' is true. An object
                // returned by the browser describing the error. Eg: Event.detail
                onResult: {
                  get: function () {
                    return __onResult;
                  },
                  set: function (x) {
                    if (x) {
                      __checkFunc__(x);
                      __onResult = x.bind(this);
                    }
                    else {
                      __onResult = null;
                    }

                    return __onResult;
                  },
                  configurable: true
                }
              });

              __throwIfInAction = (function () {
                if (this.inAction) {
                  __throwMyError__("fetching in progress.", __ERROR_CODES__.IN_ACTION);
                }
              }).bind(this);
              // Initialise with the passed iterable.
              if (iterable && iterable[Symbol.iterator]) {
                let e;
                for (e of iterable) {
                  this.add(e);
                }
              }
            }
          },

          Error: class extends Error {
            constructor (msg, fn, l) {
              var __code = __ERROR_CODES__.INTERNAL;

              super(msg, fn, l);

              Object.defineProperties(this, {
                code: {
                  get: function () {
                    return __code;
                  },
                  set: function (x) {
                    __checkType__(x, 'number');
                    if (!__errorCodeSet__.has(x)) {
                      Tut.throwFreezed(new RangeError("code not in range."));
                    }

                    __code = x;
                    return x;
                  }
                }
              });
            }

            static get CODE () {
              return __ERROR_CODES__;
            }
          }
        };

        return __ns__;
    })(),

    ElementBuilder: class {
      constructor (name) {
        var __attr = new Map();
        var __text = null;

        __checkType__(name, 'string');
        if (name === '') {
          Tut.throwFreezed(new TypeError("Empty string passed."));
        }

        Object.defineProperty(this, 'build', {
          value: function () {
            var e = document.createElement(name);

            for (let p of __attr) {
              e.setAttribute(p[0], p[1]);
            }
            if (__text !== null) {
                Tut.setTextNode(e, __text);
            }
            return e;
          },
          configurable: true
        });
        Object.defineProperty(this, 'attr', {
          value: function(a, v) {
            __attr.set(a, v);
            return this;
          },
          configurable: true
        });
        Object.defineProperty(this, 'text', {
          value: function (x) {
            __text = x;
            return this;
          },
          configurable: true
        });
      }
    },

    AssertionError: class extends Error {},

    assert: function (cond, msg) {
      if (!cond) {
        Tut.throwFreezed(new Tut.AssertionError(msg));
      }
    },

    // Freeze the passed object and throw it.
    throwFreezed: (x) => {
      throw Object.freeze(x);
    },
    // Convenience function for instantiating 'ElementBuilder'.
    mkElement: (name) => {
      return new Tut.ElementBuilder(name);
    },
    // Pad the string with a character.
    // 'str': the string to pad
    // 'n': number of characters used to pad the string
    // 'c': the character to pad with. Default is a space(' ')
    padString: (str, n, c) => {
      if (str.length >= n) {
        return str;
      }
      c = c || ' ';
      return str + c.repeat(n - str.length);
    },
    // Print to the console only if the argument is non-empty string.
    printLegit: (str) => {
      if (typeof str == 'string' && str) {
        console.log(str);
        return true;
      }
      return false;
    },
    // Set a text node of an HTML element. Clears existing child nodes.
    // (since a text node is usually the only child node of an HTML element
    // created programmatically.)
    // This is to avoid using the innerHTML attribute as it can be exploited
    // to inject malicious code.
    // 'e': the element to append a text node
    // 'str': the string to create a text node with
    setTextNode: (e, str) => {
      while (e.firstChild) {
        e.removeChild(e.firstChild);
      }
      if (str && typeof str === 'string') {
        e.appendChild(document.createTextNode(str));
      }
      return e;
    },
    // Append a string to an HTML element attribute.
    // Used to do something like this: element.class += ' another_class';
    // 'e': the element to manipulate
    // 'attr': the attribute to append a value
    // 'val': a value to append
    appendAttr: (e, attr, val) => {
      e.setAttribute(attr, (e.getAttribute(attr) || "") + val);
      return e;
    },
    // Prep a shader. This function does everything to get a shader linkable.
    // Throws Tut.GLError if anything goes wrong. Will print the string returned
    // from the shader compiler. Returns a shader GL object.
    // 'gl': a WebGL context
    // 'src': the string of the shader program to compile
    // 'type': the type of the shader program. Must be one of gl.VERTEX_SHADER
    // or gl.FRAGMENT_SHADER.
    loadShader: (gl, src, type) => {
      let shader, shaderInfo;

      shader = gl.createShader(type);
      if (!shader) {
        let e = new Tut.GLError(gl, "Could not create shader.");
        Tut.throwFreezed(e);
      }

      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      shaderInfo = gl.getShaderInfoLog(shader);

      Tut.printLegit(shaderInfo);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const msg = [
          "Failed to compile ",
          (function () {
            switch (type) {
            case gl.FRAGMENT_SHADER: return 'fragment';
            case gl.VERTEX_SHADER: return 'vertex';
            }
            return '?';
          })(),
          " shader."
        ];
        let e = new Tut.GLError(gl, msg.join(''));
        e.infoLog = shaderInfo;

        gl.deleteShader(shader);

        Tut.throwFreezed(e);
      }

      return shader;
    },
    setupShader: function (gl, b) {
      let ret = {
        prog: gl.createProgram(),
        vert: Tut.loadShader(gl, b.vert, gl.VERTEX_SHADER),
        frag: Tut.loadShader(gl, b.frag, gl.FRAGMENT_SHADER),
        attrMap: b.attrMap,
        unif: {}
      };
      let i;
      let progInfoLog;

      gl.attachShader(ret.prog, ret.vert);
      gl.attachShader(ret.prog, ret.frag);

      for (i in b.attrMap) {
        gl.bindAttribLocation(ret.prog, b.attrMap[i], i);
      }

      gl.linkProgram(ret.prog);
      progInfoLog = gl.getProgramInfoLog(ret.prog);
      Tut.printLegit(progInfoLog);
      if (!gl.getProgramParameter(ret.prog, gl.LINK_STATUS)) {
        let e = new Tut.GLError(gl, "Failed to link program");
        e.infoLog = progInfoLog;
        Tut.throwFreezed(e);
      }

      for (i of b.unif) {
        ret.unif[i] = gl.getUniformLocation(ret.prog, i);
      }

      return ret;
    },
    // Prints the capability of the WebGL rendering context to the console.
    // For debugging purpose.
    // 'gl': a WebGL rendering context
    printGLCap: (gl) => {
      var shaderPrecision = (s, t) => {
        var x = gl.getShaderPrecisionFormat(gl[s], gl[t]);

        if (x) {
          return s + "/" + t + ": " + x.precision + "(" + x.rangeMin + "~" + x.rangeMax + ")";
        }
        throw new Tut.GLError(gl, "gl.getShaderPrecisionFormat() returned error.");
      };
      var glParam = (name) => {
        var prop;
        var ret;

        if (name.substr(0, 3) !== 'GL_') {
          return;
        }
        prop = gl[name.substr(3)];
        ret = prop && gl.getParameter(prop);

        if (ret) {
          return name + ": " + ret;
        }
        throw new Tut.GLError(gl, "gl.getParameter() returned error.");
      };
      var arr;

      arr = [];
      arr.push(glParam("GL_MAX_TEXTURE_IMAGE_UNITS"));
      arr.push(glParam("GL_MAX_VERTEX_UNIFORM_VECTORS"));
      arr.push(glParam("GL_MAX_FRAGMENT_UNIFORM_VECTORS"));
      arr.push(glParam("GL_MAX_VERTEX_ATTRIBS"));
      arr.push(glParam("GL_MAX_VARYING_VECTORS"));
      arr.push(glParam("GL_ALIASED_POINT_SIZE_RANGE"));
      arr.push(glParam("GL_SAMPLES"));
      console.info(arr.join("\n"));

      arr = [];
      arr.push(shaderPrecision("VERTEX_SHADER", "LOW_FLOAT"));
      arr.push(shaderPrecision("VERTEX_SHADER", "MEDIUM_FLOAT"));
      arr.push(shaderPrecision("VERTEX_SHADER", "HIGH_FLOAT"));
      arr.push(shaderPrecision("VERTEX_SHADER", "LOW_INT"));
      arr.push(shaderPrecision("VERTEX_SHADER", "MEDIUM_INT"));
      arr.push(shaderPrecision("VERTEX_SHADER", "HIGH_INT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "LOW_FLOAT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "MEDIUM_FLOAT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "HIGH_FLOAT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "LOW_INT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "MEDIUM_INT"));
      arr.push(shaderPrecision("FRAGMENT_SHADER", "HIGH_INT"));
      console.info(arr.join("\n"));

      console.info(gl.getSupportedExtensions().join("\n"));
    },

    checkClass: function () {
      return __checkClass__.apply(this, arguments);
    },

    checkType: function () {
      return __checkType__.apply(this, arguments);
    },

    checkFunc: function () {
      return __checkFunc__.apply(this, arguments);
    },

    // Simple Wavefront OBJ file parser
    OBJ: (() => {
        let lineTypes = ['v', 'vt', 'vn', 'vp', 'f', 'mtllib', 'usemtl'];
        var __LINE_TYPES__ = Object.freeze(new Set(lineTypes));
        var __LINE_TYPES_STR__ = Object.freeze(lineTypes.join(", "));
        var __ns__;

        __ns__ = {
          ParseError: class extends Error {
            constructor (msg, file, line) {
              var __lineType = null;
              var __at = -1;

              super(msg, file, line);

              Object.defineProperty(this, 'lineType', {
                get: function () {
                  return __lineType;
                },
                set: function (x) { // TODO: test
                  __checkType__(x, 'string');
                  if (x !== null && (!__LINE_TYPES__.has(x))) {
                    throw new TypeError("Invalid line type. Expected: " + __LINE_TYPES_STR__);
                  }
                  __lineType = x;
                  return x;
                },
                configurable: true
              });
              Object.defineProperty(this, 'at', {
                get: function () {
                  return __at;
                },
                set: function (x) {
                  __checkType__(x, 'number');
                  __at = x;
                  return x;
                },
                configurable: true
              });
            }
          },

          // Parses an OBJ file format string and returns an object containing
          // parsed data like vertices and normals.
          // 'src': a string of OBJ file content
          // 'supplement': reserved parameter to pass supplementary data such as
          // mtllib file. This parameter will not be referenced at all.
          // 'opt': parsing options object. The caller can pass this to get
          // a different parsing result. Below is an example option:
          // {
          //   loadList: {
          //     // Whether to parse and return UV coordinates.
          //     'uvs': true,
          //     // Whether to parse and return normal vectors.
          //     'normals': true,
          //     // Whether to calculate and return tangents and bitangents from uvs and normals.
          //     'tangents': true
          //   }
          // }
          // Return value:
          // {
          //   array: { // Vertex attributes
          //     vertices: Float32Array,
          //     uvs: Float32Array or null,
          //     normals: Float32Array or null
          //     tangents: Float32Array or null
          //     bitangents: Float32Array or null
          //   },
          //   indices: Uint16Array // glDrawElement() parameter.
          // }
          parse: (() => {
            // Parse a string expected to be a float.
            var __throwIfNANf__ = (x, l) => {
              var ret = parseFloat(x);

              if (isNaN(ret)) {
                let e = new Tut.OBJ.ParseError("Invalid value at line " + l);
                e.at = l;
                Tut.throwFreezed(e);
              }
              return ret;
            };
            // Parse a string expected to be an index.
            var __throwIfNANidx__ = (x, l) => {
              var ret = parseInt(x);

              if (isNaN(ret) || ret <= 0) {
                let e = new Tut.OBJ.ParseError("Invalid value at line " + l);
                e.at = l;
                Tut.throwFreezed(e);
              }
              return ret;
            };
            // Convenience function that throws an exception for invalid line.
            var __throwInvLine__ = (type, l) => {
              let e = new Tut.OBJ.ParseError("Invalid " + type + " line format at " + l);
              e.lineType = type;
              e.at = l;
              Tut.throwFreezed(e);
            };

            return (src, supplement, opt) => {
              let i, j;
              let arrLines, arrWords, arrIndices, mapIndices, mapMaxIndex;
              let vertices, uvs, normals;
              let w, index, to, from;
              let ret;

              opt = opt || {
                loadList: {
                  uvs: true,
                  normals: true,
                  tangents: true
                }
              };
              vertices = [];
              uvs = opt.loadList.uvs ? [] : null;
              normals = opt.loadList.normals ? [] : null;
              mapIndices = [[], [], []];
              mapMaxIndex = [-1, -1, -1];

              arrLines = src.split(/(?:\r|\n|\r\n)+/gm);

              for (i = 0; i < arrLines.length; i += 1) {
                arrWords = arrLines[i].trim().toLowerCase().split(/\s+/);
                switch (arrWords[0]) {
                case 'v':
                  if (arrWords.length === 4) { // Regular vertex
                    vertices.push(__throwIfNANf__(arrWords[1], i));
                    vertices.push(__throwIfNANf__(arrWords[2], i));
                    vertices.push(__throwIfNANf__(arrWords[3], i));
                  }
                  else if (arrWords.length >= 5) { // Vertex w/ 'w'
                    w = __throwIfNANf__(arrWords[4], i);
                    vertices.push(__throwIfNANf__(arrWords[1], i) / w);
                    vertices.push(__throwIfNANf__(arrWords[2], i) / w);
                    vertices.push(__throwIfNANf__(arrWords[3], i) / w);
                  }
                  else {
                    __throwInvLine__("v", i);
                  }
                  break;
                case 'vt':
                  if (arrWords.length < 3) {
                    __throwInvLine__("vt", i);
                  }
                  if (uvs) {
                    uvs.push(__throwIfNANf__(arrWords[1], i));
                    uvs.push(__throwIfNANf__(arrWords[2], i));
                  }
                  else {
                    // Validity check only.
                    __throwIfNANf__(arrWords[1], i);
                    __throwIfNANf__(arrWords[2], i);
                  }
                  break;
                case 'vn':
                  if (arrWords.length < 4) {
                    __throwInvLine__('vn', i);
                  }
                  if (normals) {
                    normals.push(__throwIfNANf__(arrWords[1], i));
                    normals.push(__throwIfNANf__(arrWords[2], i));
                    normals.push(__throwIfNANf__(arrWords[3], i));
                  }
                  else {
                    // Validity check only.
                    __throwIfNANf__(arrWords[1], i);
                    __throwIfNANf__(arrWords[2], i);
                    __throwIfNANf__(arrWords[3], i);
                  }
                  break;
                case 'f':
                  if (arrWords.length !== 4) {
                    var nb_elements = arrWords.length - 1;
                    var e = new Tut.OBJ.ParseError("Unsupported face of " +
                      nb_elements + (nb_elements == 1 ? " element" : " elements") +
                      " at " + i + ". Only triangle supported.");
                    e.at = i;
                    Tut.throwFreezed(e);
                  }
                  for (j = 1; j < 4; j += 1) {
                    arrIndices = arrWords[j].match(/^(\d+)(?:\/((?:\d+)?)(?:\/((?:\d+)?))?)?$/);
                    if (arrIndices === null) {
                      __throwInvLine__('f', i);
                    }

                    index = __throwIfNANidx__(arrIndices[1], i) - 1;
                    mapIndices[0].push(index);
                    mapMaxIndex[0] = Math.max(mapMaxIndex[0], index);
                    if (arrIndices[2]) {
                      index = __throwIfNANidx__(arrIndices[2], i) - 1;
                      mapIndices[1].push(index);
                      mapMaxIndex[1] = Math.max(mapMaxIndex[1], index);
                    }
                    if (arrIndices[3]) {
                      index = __throwIfNANidx__(arrIndices[3], i) - 1;
                      mapIndices[2].push(index);
                      mapMaxIndex[2] = Math.max(mapMaxIndex[2], index);
                    }
                  }
                  break;
                // default:
                // Ignore unrecognised lines.
                }
              }
              // Sanity check of parsed data.
              if (mapIndices[0].length <= 0) {
                Tut.throwFreezed(new Tut.OBJ.ParseError("No polygonal face listed."));
              }
              if ((mapIndices[1].length && mapIndices[0].length !== mapIndices[1].length) ||
                (mapIndices[2].length && mapIndices[0].length !== mapIndices[2].length)) {
                let sb = [
                  "Inconsistent polygonal face data(",
                  mapIndices[0].length,
                  ", ",
                  mapIndices[1].length,
                  ", ",
                  mapIndices[2].length,
                  ")"];
                Tut.throwFreezed(new Tut.OBJ.ParseError(sb.join("")));
              }
              {
                // Out of bounds check.
                let checkBounds = function (name, cnt, max) {
                  if (cnt <= max) {
                    let sb = [name, " index out of bound(", cnt, " <= ", max, ")"];
                    Tut.throwFreezed(new Tut.OBJ.ParseError(sb.join("")));
                  }
                };

                checkBounds('Vertex', vertices.length / 3, mapMaxIndex[0]);
                if (uvs) {
                  checkBounds('Vertex', uvs.length / 2, mapMaxIndex[1]);
                }
                if (normals) {
                  checkBounds('Vertex', normals.length / 3, mapMaxIndex[2]);
                }
              }
              {
                // Construct return object.
                // Rebuild UV and Normal vectors for use in OpenGL.
                let has = {};

                has.uvs = mapIndices[1].length > 0;
                has.normals = mapIndices[2].length > 0;
                has.tangents = has.uvs && has.normals;

                ret = {
                  array: {
                    vertices: new Float32Array(vertices),
                    uvs: opt.loadList.uvs ? new Float32Array(has.uvs ? vertices.length / 3 * 2 : 0) : null,
                    normals: opt.loadList.normals ? new Float32Array(has.normals ? vertices.length : 0) : null,
                    tangents: opt.loadList.tangents ? new Float32Array(has.tangents ? vertices.length : 0) : null,
                    bitangents: opt.loadList.tangents ? new Float32Array(has.tangents ? vertices.length : 0) : null
                  },
                  indices: new Uint16Array(mapIndices[0])
                };
              }
              if (ret.array.uvs) {
                // Copy UV.
                for (i = 0; i < mapIndices[0].length; i += 1) {
                  to = mapIndices[0][i] * 2;
                  from = mapIndices[1][i] * 2;
                  ret.array.uvs[to] = uvs[from];
                  ret.array.uvs[to + 1] = uvs[from + 1];
                }
              }
              if (ret.array.normals) {
                // Copy Normal.
                for (i = 0; i < mapIndices[0].length; i += 1) {
                  to = mapIndices[0][i] * 3;
                  from = mapIndices[2][i] * 3;
                  ret.array.normals[to] = normals[from];
                  ret.array.normals[to + 1] = normals[from + 1];
                  ret.array.normals[to + 2] = normals[from + 2];
                }
              }
              if (ret.array.tangents) {
                let d = {
                  vert: {
                    a: vec3.create(),
                    b: vec3.create()
                  },
                  uv: {
                    a: vec2.create(),
                    b: vec2.create()
                  },
                  a: null,
                  b: null,
                  c: null
                };
                let n = {
                  a: vec3.create(),
                  b: vec3.create(),
                  c: vec3.create()
                };
                let idx = {
                  a: null,
                  b: null,
                  c: null
                };
                let op = {
                  a: vec3.create(),
                  b: vec3.create(),
                  c: vec3.create()
                };
                let t = {
                  o: vec3.create(),
                  a: vec3.create(),
                  b: vec3.create(),
                  c: vec3.create()
                };
                let bt = vec3.create();
                let r;

                for (i = 0; i < mapIndices[0].length; i += 3) {
                  // Fetch UV and calc the delta.
                  idx.a = mapIndices[1][i + 1] * 2;
                  idx.b = mapIndices[1][i] * 2;
                  idx.c = mapIndices[1][i + 2] * 2;
                  [d.uv.a[0], d.uv.a[1]] = [uvs[idx.a] - uvs[idx.b], uvs[idx.a + 1] - uvs[idx.b + 1]];
                  [d.uv.b[0], d.uv.b[1]] = [uvs[idx.c] - uvs[idx.b], uvs[idx.c + 1] - uvs[idx.b + 1]];
                  // Fetch normals.
                  idx.a = mapIndices[2][i + 1] * 3;
                  idx.b = mapIndices[2][i] * 3;
                  idx.c = mapIndices[2][i + 2] * 3;
                  [n.a[0], n.a[1], n.a[2]] = [normals[idx.a], normals[idx.a + 1], normals[idx.a + 2]];
                  [n.b[0], n.b[1], n.b[2]] = [normals[idx.b], normals[idx.b + 1], normals[idx.b + 2]];
                  [n.c[0], n.c[1], n.c[2]] = [normals[idx.c], normals[idx.c + 1], normals[idx.c + 2]];
                  // Calc this for the last to reuse 'idx'.
                  idx.a = mapIndices[0][i + 1] * 3;
                  idx.b = mapIndices[0][i] * 3;
                  idx.c = mapIndices[0][i + 2] * 3;
                  [d.vert.a[0], d.vert.a[1], d.vert.a[2]] = [vertices[idx.a] - vertices[idx.b], vertices[idx.a + 1] - vertices[idx.b + 1], vertices[idx.a + 2] - vertices[idx.b + 2]];
                  [d.vert.b[0], d.vert.b[1], d.vert.b[2]] = [vertices[idx.c] - vertices[idx.b], vertices[idx.c + 1] - vertices[idx.b + 1], vertices[idx.c + 2] - vertices[idx.b + 2]];

                  r = 1 / (d.uv.a[0] * d.uv.b[1] - d.uv.a[1] * d.uv.b[0]);

                  vec3.scale(op.a, d.vert.a, d.uv.b[1]);
                  vec3.scale(op.b, d.vert.b, d.uv.a[1]);
                  vec3.sub(op.c, op.a, op.b);
                  vec3.scale(t.o, op.c, r);

                  vec3.scale(op.a, d.vert.b, d.uv.a[0]);
                  vec3.scale(op.b, d.vert.a, d.uv.b[0]);
                  vec3.sub(op.c, op.a, op.b);
                  vec3.scale(bt, op.c, r);

                  // Adjust the tangents according to the normals.
                  vec3.scale(op.a, n.a, vec3.dot(n.a, t.o));
                  vec3.sub(op.a, t.o, op.a);
                  vec3.normalize(t.a, op.a);
                  vec3.cross(op.a, n.a, t.a);
                  if (vec3.dot(op.a, bt) < 0.0) {
                    vec3.scale(t.a, t.a, -1);
                  }

                  vec3.scale(op.a, n.b, vec3.dot(n.b, t.o));
                  vec3.sub(op.a, t.o, op.a);
                  vec3.normalize(t.b, op.a);
                  vec3.cross(op.a, n.b, t.b);
                  if (vec3.dot(op.a, bt) < 0.0) {
                    vec3.scale(t.b, t.b, -1);
                  }

                  vec3.scale(op.a, n.c, vec3.dot(n.c, t.o));
                  vec3.sub(op.a, t.o, op.a);
                  vec3.normalize(t.c, op.a);
                  vec3.cross(op.a, n.c, t.c);
                  if (vec3.dot(op.a, bt) < 0.0) {
                    vec3.scale(t.c, t.c, -1);
                  }

                  [ret.array.tangents[idx.a], ret.array.tangents[idx.a + 1], ret.array.tangents[idx.a + 2]] = [t.a[0], t.a[1], t.a[2]];
                  [ret.array.tangents[idx.b], ret.array.tangents[idx.b + 1], ret.array.tangents[idx.b + 2]] = [t.b[0], t.b[1], t.b[2]];
                  [ret.array.tangents[idx.c], ret.array.tangents[idx.c + 1], ret.array.tangents[idx.c + 2]] = [t.c[0], t.c[1], t.c[2]];
                  [ret.array.bitangents[idx.a], ret.array.bitangents[idx.a + 1], ret.array.bitangents[idx.a + 2]] = [bt[0], bt[1], bt[2]];
                  [ret.array.bitangents[idx.b], ret.array.bitangents[idx.b + 1], ret.array.bitangents[idx.b + 2]] = [bt[0], bt[1], bt[2]];
                  [ret.array.bitangents[idx.c], ret.array.bitangents[idx.c + 1], ret.array.bitangents[idx.c + 2]] = [bt[0], bt[1], bt[2]];
                }
              }

              return ret;
            };
          })(),
        };

        return __ns__;
    })()
  };

  // External library augmentation.
  Math.deg2rad = (x) => {
    return x * __RAD2DEG__;
  };
  Math.rad2deg = (x) => {
    return x / __RAD2DEG__;
  };

  __fabAcc__ = (t, op) => {
    var tmp;

    tmp = t.create();

    return function () {
      var i;
      var ret;

      if (arguments.length < 3) {
        throw new TypeError("at least 3 arguments required, but only " + arguments.length + " passed.");
      }
      ret = arguments[0];

      t.copy(ret, arguments[1]);
      for (i = 2; i < arguments.length; i += 1) {
        op(tmp, ret, arguments[i]);
        t.copy(ret, tmp);
      }

      return ret;
    };
  };
  __fabRacc__ = (t, op) => {
    var regular = __fabAcc__(t, op);

    return function () {
      var nyArgs = [arguments[0]];

      nyArgs.concat(Array.from(arguments).slice(1).reverse());
      regular.apply(undefined, nyArgs);
    };
  };

  // (reversed)Accumulative matrix/vertex operations. Requires at least
  // 3 arguments
  // First argument: an output matrix
  // The arguments after that: operands
  mat4.aadd = __fabAcc__(mat4, mat4.add);
  mat4.asub = __fabAcc__(mat4, mat4.sub);
  mat4.amul = __fabAcc__(mat4, mat4.mul);
  mat3.aadd = __fabAcc__(mat3, mat3.add);
  mat3.asub = __fabAcc__(mat3, mat3.sub);
  mat3.amul = __fabAcc__(mat3, mat3.mul);
  mat2.aadd = __fabAcc__(mat2, mat2.add);
  mat2.asub = __fabAcc__(mat2, mat2.sub);
  mat2.amul = __fabAcc__(mat2, mat2.mul);
  mat2d.aadd = __fabAcc__(mat2d, mat2d.add);
  mat2d.asub = __fabAcc__(mat2d, mat2d.sub);
  mat2d.amul = __fabAcc__(mat2d, mat2d.mul);

  mat4.raadd = __fabRacc__(mat4, mat4.add);
  mat4.rasub = __fabRacc__(mat4, mat4.sub);
  mat4.ramul = __fabRacc__(mat4, mat4.mul);
  mat3.raadd = __fabRacc__(mat3, mat3.add);
  mat3.rasub = __fabRacc__(mat3, mat3.sub);
  mat3.ramul = __fabRacc__(mat3, mat3.mul);
  mat2.raadd = __fabRacc__(mat2, mat2.add);
  mat2.rasub = __fabRacc__(mat2, mat2.sub);
  mat2.ramul = __fabRacc__(mat2, mat2.mul);
  mat2d.raadd = __fabRacc__(mat2d, mat2d.add);
  mat2d.rasub = __fabRacc__(mat2d, mat2d.sub);
  mat2d.ramul = __fabRacc__(mat2d, mat2d.mul);

  vec4.aadd = __fabAcc__(vec4, vec4.add);
  vec4.asub = __fabAcc__(vec4, vec4.sub);
  vec4.amul = __fabAcc__(vec4, vec4.mul);
  vec4.adiv = __fabAcc__(vec4, vec4.div);
  vec3.aadd = __fabAcc__(vec3, vec3.add);
  vec3.asub = __fabAcc__(vec3, vec3.sub);
  vec3.amul = __fabAcc__(vec3, vec3.mul);
  vec3.adiv = __fabAcc__(vec3, vec3.div);
  vec2.aadd = __fabAcc__(vec2, vec2.add);
  vec2.asub = __fabAcc__(vec2, vec2.sub);
  vec2.amul = __fabAcc__(vec2, vec2.mul);
  vec2.adiv = __fabAcc__(vec2, vec2.div);

  vec4.raadd = __fabRacc__(vec4, vec4.add);
  vec4.rasub = __fabRacc__(vec4, vec4.sub);
  vec4.ramul = __fabRacc__(vec4, vec4.mul);
  vec4.radiv = __fabRacc__(vec4, vec4.div);
  vec3.raadd = __fabRacc__(vec3, vec3.add);
  vec3.rasub = __fabRacc__(vec3, vec3.sub);
  vec3.ramul = __fabRacc__(vec3, vec3.mul);
  vec3.radiv = __fabRacc__(vec3, vec3.div);
  vec2.raadd = __fabRacc__(vec2, vec2.add);
  vec2.rasub = __fabRacc__(vec2, vec2.sub);
  vec2.ramul = __fabRacc__(vec2, vec2.mul);
  vec2.radiv = __fabRacc__(vec2, vec2.div);

  return __ret__;
})();
