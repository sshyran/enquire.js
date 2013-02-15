
    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.initialised = false;
        this.options = options;

        !options.deferSetup && this.setup();
    }
    QueryHandler.prototype = {

        /**
         * loads assets on setup
         *
         * @function
         * @param {object || string || array} what an object that Modernizr.load can accept
         */
        load : function(what) {
            if(Modernizr && Modernizr.load) {
                Modernizr.load(what);
            }
        },

        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup : function() {
            var setup = this.options.setup;
            this.initialised = true;
            if(!setup) {
                return;
            }

            isFunction(setup) ? setup() : this.load(setup);
        },

        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         */
        on : function() {
            !this.initialised && this.setup();
            this.options.match();
        },

        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         */
        off : function() {
            this.options.unmatch && this.options.unmatch();
        },

        /**
         * called when a handler is to be destroyed.
         * delegates to the destroy or unmatch callbacks, depending on availability.
         *
         * @function
         */
        destroy : function() {
            this.options.destroy ? this.options.destroy() : this.off();
        },

        /**
         * determines equality by reference.
         * if object is supplied compare options, if function, compare match callback
         *
         * @function
         * @param {object || function} [target] the target for comparison
         */
        equals : function(target) {
            return this.options === target || this.options.match === target;
        }

    };