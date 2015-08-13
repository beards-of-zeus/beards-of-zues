/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'Gat2goCXdKhmGCGXYcPzHQ6FhM0tXJwQ';
	var AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'tagalong.auth0.com';
	//var AUTH0_CALLBACK_URL=location.href;

	var App = __webpack_require__(2);

	React.render(React.createElement(App, { clientId: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN }), document.getElementById('login-page'));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LoggedIn = __webpack_require__(3);
	var Home = __webpack_require__(15);
	module.exports = React.createClass({
	  displayName: 'App',
	  componentWillMount: function componentWillMount() {
	    this.setupAjax();
	    this.createLock();
	    this.setState({ idToken: this.getIdToken() });
	  },
	  createLock: function createLock() {
	    this.lock = new Auth0Lock(this.props.clientId, this.props.domain);
	  },
	  setupAjax: function setupAjax() {
	    $.ajaxSetup({
	      'beforeSend': function beforeSend(xhr) {
	        if (localStorage.getItem('userToken')) {
	          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
	        }
	      }
	    });
	  },
	  getIdToken: function getIdToken() {
	    var idToken = localStorage.getItem('userToken');
	    var authHash = this.lock.parseHash(window.location.hash);
	    if (!idToken && authHash) {
	      if (authHash.id_token) {
	        idToken = authHash.id_token;
	        localStorage.setItem('userToken', authHash.id_token);
	      }
	      if (authHash.error) {
	        console.log("Error signing in", authHash);
	      }
	    }
	    return idToken;
	  },
	  render: function render() {
	    if (this.state.idToken) {
	      return React.createElement(LoggedIn, { lock: this.lock, idToken: this.state.idToken });
	    } else {
	      return React.createElement(Home, { lock: this.lock });
	    }
	  }
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Main = __webpack_require__(4);
	module.exports = React.createClass({
	  displayName: 'LoggedIn',

	  postApi: function postApi() {
	    $.post('/data/user', this.state.profile);
	  },

	  getApi: function getApi() {
	    //This function is useful for the eventual user profile screen.
	    //Consider refactoring out of here when that component becomes a reality.
	    $.getJSON('/data/user').done(function (data) {
	      //Data stuff
	    });
	  },

	  getInitialState: function getInitialState() {
	    return {
	      profile: null
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.props.lock.getProfile(this.props.idToken, (function (err, profile) {
	      if (err) {
	        console.log("Error loading the Profile", err);
	        alert("Error loading the Profile");
	      }
	      //POST profile to API /user
	      this.setState({ profile: profile });
	    }).bind(this));
	  },

	  render: function render() {
	    if (this.state.profile) {
	      this.postApi();
	      return React.createElement(Main, { profile: this.state.profile });
	    } else {
	      return React.createElement(
	        'div',
	        { className: 'logged-in-box auth0-box logged-in' },
	        React.createElement(
	          'h1',
	          { id: 'logo' },
	          React.createElement('img', { src: 'https://cdn.auth0.com/blog/auth0_logo_final_blue_RGB.png' })
	        )
	      );
	    }
	  }
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	//For webpack, require react components here
	'use strict';

	var Nav = __webpack_require__(5);
	var User = __webpack_require__(6);
	var Activities = __webpack_require__(7);
	var AdSpace = __webpack_require__(11);
	var Footer = __webpack_require__(12);
	var ToggleForm = __webpack_require__(13);

	module.exports = React.createClass({
	  displayName: 'Main',
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(Nav, null),
	      React.createElement(
	        'div',
	        { className: 'row' },
	        React.createElement(
	          'div',
	          { className: 'large-3 columns ' },
	          React.createElement(User, { user: this.props.profile })
	        ),
	        React.createElement(
	          'div',
	          { className: 'large-6 columns' },
	          React.createElement(Activities, { user_id: this.props.profile.user_id })
	        ),
	        React.createElement(
	          'aside',
	          { className: 'large-3 columns hide-for-small' },
	          React.createElement(ToggleForm, { user_id: this.props.profile.user_id }),
	          React.createElement(AdSpace, null)
	        )
	      ),
	      React.createElement(Footer, null)
	    );
	  }
	});

	// React.render(<Main />, document.getElementsByTagName('Main')[0]);
	/*load add activity here using toggle; 
	add and remove class hitting a button*/ /*Placeholder button */

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: "Nav",
	  logOut: function logOut() {
	    localStorage.removeItem('userToken');
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "row" },
	      React.createElement(
	        "div",
	        { className: "large-12 columns" },
	        React.createElement(
	          "div",
	          { className: "panel radius" },
	          React.createElement(
	            "h1",
	            null,
	            "TagAlong.Club ",
	            React.createElement(
	              "a",
	              { href: "/", onClick: this.logOut, className: "button radius right" },
	              "Log Out"
	            )
	          )
	        )
	      )
	    );
	  }
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = React.createClass({
	  displayName: 'User',

	  componentDidMount: function componentDidMount() {
	    this.getActivities();
	  },

	  getInitialState: function getInitialState() {
	    return {
	      activityList: []
	    };
	  },

	  getActivities: function getActivities() {
	    $.getJSON('/data/userActivities', { userID: this.props.user.user_id }).done((function (activities) {
	      this.setState({ activityList: activities });
	    }).bind(this));
	  },

	  toggle: function toggle(activityId) {
	    console.log(activityId);
	    $.post('/data/toggle', { activityId: activityId });
	  },

	  render: function render() {
	    var that = this;
	    return React.createElement(
	      'div',
	      { className: 'panel radius' },
	      React.createElement(
	        'a',
	        { href: '#' },
	        React.createElement('img', { className: 'img-round', src: this.props.user.picture })
	      ),
	      React.createElement(
	        'h5',
	        null,
	        React.createElement(
	          'a',
	          { href: '#' },
	          this.props.user.name
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'section-container vertical-nav', 'data-section': true, 'data-options': 'deep_linking: false; one_up: true' },
	        this.state.activityList.map(function (activity) {
	          return React.createElement(
	            'div',
	            { key: activity.id },
	            React.createElement(
	              'section',
	              { className: 'section' },
	              React.createElement(
	                'h5',
	                { className: 'title' },
	                React.createElement(
	                  'a',
	                  { href: '#' },
	                  activity.title
	                ),
	                React.createElement('input', { type: 'checkbox', onChange: that.toggle.bind(null, activity.id) })
	              )
	            )
	          );
	        })
	      )
	    );
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Activity = __webpack_require__(8);

	module.exports = React.createClass({
	  displayName: "Activities",
	  componentDidMount: function componentDidMount() {
	    this.getActivities();
	  },

	  getInitialState: function getInitialState() {
	    return {
	      activityList: []
	    };
	  },

	  getActivities: function getActivities() {
	    $.getJSON('/data/activities', { userID: this.props.user_id }).done((function (activities) {
	      this.setState({ activityList: activities });
	    }).bind(this));
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      this.state.activityList.map(function (activity) {
	        return React.createElement(
	          "div",
	          { key: activity.id },
	          React.createElement(Activity, { avatar: activity.avatar, user: activity.user, description: activity.description, title: activity.title,
	            location: activity.location, keywords: activity.keywords })
	        );
	      })
	    );
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ToggleDescription = __webpack_require__(9);

	module.exports = React.createClass({
	  displayName: "Activity",
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "row" },
	      React.createElement(
	        "div",
	        { className: "large-2 columns small-3" },
	        React.createElement("img", { className: "img-round", src: this.props.avatar })
	      ),
	      React.createElement(
	        "div",
	        { className: "large-10 columns panel radius" },
	        React.createElement(
	          "p",
	          null,
	          React.createElement(
	            "strong",
	            null,
	            this.props.title,
	            ":"
	          ),
	          " ",
	          this.props.description.slice(0, 70)
	        ),
	        React.createElement(
	          "p",
	          null,
	          React.createElement(
	            "em",
	            null,
	            this.props.location
	          )
	        ),
	        " ",
	        React.createElement(
	          "p",
	          { className: "keywords" },
	          this.props.keywords
	        ),
	        React.createElement(
	          "ul",
	          { className: "inline-list" },
	          React.createElement(ToggleDescription, { description: this.props.description }),
	          React.createElement(
	            "li",
	            null,
	            React.createElement(
	              "a",
	              { href: "" },
	              "Share"
	            )
	          )
	        )
	      )
	    );
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Description = __webpack_require__(10);
	module.exports = React.createClass({
	  displayName: 'ToggleDescription',
	  getInitialState: function getInitialState() {
	    return {
	      showForm: false
	    };
	  },
	  onClick: function onClick() {
	    this.setState({
	      showForm: !this.state.showForm
	    });
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'button',
	        { onClick: this.onClick },
	        this.state.showForm ? 'Hide' : 'More Details'
	      ),
	      this.state.showForm ? React.createElement(Description, { description: this.props.description }) : null
	    );
	  }
	});

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = React.createClass({
	  displayName: 'activityDescription',
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'p',
	        null,
	        this.props.description
	      )
	    );
	  }
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: "AdSpace",
	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "p",
	        null,
	        React.createElement("img", { src: "//placehold.it/300x440&text=[ad]" })
	      ),
	      React.createElement(
	        "p",
	        null,
	        React.createElement("img", { src: "//placehold.it/300x440&text=[ad]" })
	      )
	    );
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: "Footer",
	  render: function render() {
	    return React.createElement(
	      "footer",
	      { className: "row" },
	      React.createElement(
	        "div",
	        { className: "large-12 columns" },
	        React.createElement("hr", null),
	        React.createElement(
	          "div",
	          { className: "row" },
	          React.createElement(
	            "div",
	            { className: "large-5 columns" },
	            React.createElement(
	              "p",
	              null,
	              "© Copyright Beards of Zeus."
	            )
	          ),
	          React.createElement("div", { className: "large-6 columns" }),
	          React.createElement(
	            "div",
	            { className: "large-1 columns" },
	            React.createElement(
	              "a",
	              { href: "https://www.positivessl.com" },
	              React.createElement("img", { src: "https://www.positivessl.com/images-new/PositiveSSL_tl_trans.png", alt: "SSL Certificate", title: "SSL Certificate", border: "0" })
	            )
	          )
	        )
	      )
	    );
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Create = __webpack_require__(14);
	module.exports = React.createClass({
	  displayName: 'ToggleForm',
	  getInitialState: function getInitialState() {
	    return {
	      showForm: false
	    };
	  },
	  onClick: function onClick() {
	    this.setState({
	      showForm: !this.state.showForm
	    });
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'button',
	        { onClick: this.onClick },
	        this.state.showForm ? 'Cancel' : 'Add an Activity'
	      ),
	      this.state.showForm ? React.createElement(Create, { user_id: this.props.user_id }) : null
	    );
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: 'CreateActivity',
	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "h3",
	        null,
	        "Create Your Activity"
	      ),
	      React.createElement(
	        "form",
	        { action: "/data/activities", method: "post" },
	        React.createElement("input", { type: "hidden", name: "user_id", value: this.props.user_id }),
	        React.createElement(
	          "label",
	          null,
	          "Title: "
	        ),
	        React.createElement("input", { type: "text", name: "title", ref: "title" }),
	        React.createElement(
	          "label",
	          null,
	          "Description: "
	        ),
	        React.createElement("textarea", { name: "description", ref: "description" }),
	        React.createElement(
	          "label",
	          null,
	          "Location: "
	        ),
	        React.createElement("input", { type: "text", name: "location", ref: "location" }),
	        React.createElement(
	          "label",
	          null,
	          "Keywords: "
	        ),
	        React.createElement("input", { type: "text", name: "keywords", ref: "keywords" }),
	        React.createElement(
	          "button",
	          { type: "submit" },
	          "Add Activity"
	        )
	      )
	    );
	  }
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// var Nav = require('./home/nav.jsx');
	'use strict';

	var Banner = __webpack_require__(16);
	var TestimonialGroup = __webpack_require__(17);
	var Footer = __webpack_require__(12);

	module.exports = React.createClass({
	  displayName: 'Home',
	  showLock: function showLock() {
	    this.props.lock.show();
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'login-box auth0-box before' },
	        React.createElement(
	          'a',
	          { onClick: this.showLock, className: 'btn btn-primary btn-lg btn-login btn-block' },
	          'Sign In'
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'row' },
	        React.createElement(
	          'div',
	          { className: 'large-12 columns' },
	          React.createElement(Banner, null),
	          React.createElement(
	            'div',
	            { className: 'row' },
	            React.createElement(
	              'div',
	              { className: 'large-12 columns' },
	              React.createElement(TestimonialGroup, null)
	            )
	          )
	        )
	      ),
	      React.createElement(Footer, null)
	    );
	  }
	});

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: 'Banner',
	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "div",
	        { className: "row" },
	        React.createElement(
	          "div",
	          { className: "large-12 hide-for-small" },
	          React.createElement(
	            "div",
	            { id: "featured", "data-orbit": true },
	            React.createElement("img", { src: "//placehold.it/1200x500&text=Slide Image 1", alt: "slide image" })
	          )
	        )
	      ),
	      React.createElement(
	        "div",
	        { className: "row" },
	        React.createElement(
	          "div",
	          { className: "large-12 columns show-for-small" },
	          React.createElement("img", { src: "//placehold.it/1200x700&text=Mobile Header" })
	        )
	      ),
	      React.createElement("br", null)
	    );
	  }

	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Testimonial = __webpack_require__(18);
	module.exports = React.createClass({
	  displayName: 'TestimonialGroup',
	  render: function render() {
	    var testArray = [{ avatar: "//placehold.it/50x50&text=[img]", user: 'Macho Man', quote: 'Oh YEEEEEAH' }, { avatar: "//placehold.it/50x50&text=[img]", user: 'Jon Snow', quote: 'Winter is Coming' }, { avatar: "//placehold.it/50x50&text=[img]", user: 'Austin Powers', quote: 'Yeah Babby Yeah' }, { avatar: "//placehold.it/50x50&text=[img]", user: 'Daryl from Walking Dead', quote: 'Sorry Brother' }];
	    return React.createElement(
	      'div',
	      { className: 'row' },
	      testArray.map(function (quote) {
	        return React.createElement(
	          'div',
	          { className: 'large-3 small-12 columns', key: quote.user },
	          React.createElement(Testimonial, { avatar: quote.avatar, name: quote.user, quote: quote.quote })
	        );
	      })
	    );
	  }

	});

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	module.exports = React.createClass({
	  displayName: 'Testimonial',
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'row person' },
	        React.createElement(
	          'div',
	          { className: 'small-4 columns' },
	          React.createElement('img', { className: 'img-round', src: this.props.avatar })
	        ),
	        React.createElement(
	          'div',
	          { className: 'small-8 columns' },
	          React.createElement(
	            'h5',
	            null,
	            this.props.name
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'row' },
	        React.createElement(
	          'blockquote',
	          null,
	          this.props.quote
	        )
	      )
	    );
	  }
	});

/***/ }
/******/ ]);