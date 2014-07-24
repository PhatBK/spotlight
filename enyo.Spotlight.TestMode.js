/**
 * Spotlight utilities
 *
 * @typedef {Object} enyo.Spotlight.TestMode definition
 *
 * @ui
 * @class enyo.Spotlight.TestMode
 * @public
 */
enyo.Spotlight.TestMode = new function() {

    /********************* PRIVATE ********************/

    var _aNodes = [],
        _bEnabled = false;

    var

    /**
     * Destroy all highlight elements
     *
     * @type {function}
     * @private
     */
        _destroyExistingHighlightNodes = function() {
            var n;
            for (n = 0; n < _aNodes.length; n++) {
                if (_aNodes[n]) {
                    _aNodes[n].destroy();
                }
            }
            _aNodes = [];
        },

        /**
         * Highlight the current spotlighted control and add it to __aNodes_
         *
         * @type {function}
         * @private
         */
        _highlightCurrentControl = function() {
            _aNodes.push(_addConrolHighlightNode({
                control: enyo.Spotlight.getCurrent(),
                str: 'C'
            }));
        },

        /**
         * Highlight controls adjacent to the current spotlighted controls and add them to __aNodes_
         *
         * @type {function}
         * @private
         */
        _highlightAdjacentControls = function() {
            if (!enyo.Spotlight.getCurrent()) {
                return;
            }
            var controls = _removeDuplicateHighlightNodes([{
                control: enyo.Spotlight.NearestNeighbor.getNearestNeighbor('UP'),
                str: 'U'
            }, {
                control: enyo.Spotlight.NearestNeighbor.getNearestNeighbor('DOWN'),
                str: 'D'
            }, {
                control: enyo.Spotlight.NearestNeighbor.getNearestNeighbor('LEFT'),
                str: 'L'
            }, {
                control: enyo.Spotlight.NearestNeighbor.getNearestNeighbor('RIGHT'),
                str: 'R'
            }]);

            for (var i = 0; i < controls.length; i++) {
                if (!controls[i]) {
                    continue;
                }
                _aNodes.push(_addConrolHighlightNode(controls[i]));
            }
        },

        /**
         * Combine duplicated highlight nodes (created for the same control). This happens when a given
         * control can be reached via more than one five-way direction (e.g. up and left).
         *
         * @type {function}
         * @private
         */
        _removeDuplicateHighlightNodes = function(inControls) {
            var returnControls = [],
                dupeOf = -1;

            for (var i = 0; i < inControls.length; i++) {
                dupeOf = -1;

                for (var j = 0; j < inControls.length; j++) {
                    if (inControls[i].control === inControls[j].control && inControls[i].str !== inControls[j].str) {
                        dupeOf = j;
                        break;
                    }
                }

                if (dupeOf > -1) {
                    inControls[i].str += ',' + inControls[dupeOf].str;
                    inControls.splice(dupeOf, 1);
                }

                returnControls.push(inControls[i]);
            }

            return returnControls;
        },

        /**
         * Create a new control with styling to highlight current or adjacent spotlight nodes.
         *
         * @type {function}
         * @private
         */
        _addConrolHighlightNode = function(inObj) {
            if (!inObj || !inObj.control || !inObj.control.hasNode()) {
                return null;
            }

            var bounds = enyo.Spotlight.Util.getAbsoluteBounds(inObj.control),
                className = (inObj.str === 'C') ? 'spotlight-current-item' : 'spotlight-adjacent-item',
                highlightNode = enyo.roots[0].createComponent({
                    classes: 'spotlight-highlight ' + className,
                    style: 'height:' + bounds.height + 'px;width:' + bounds.width + 'px;top:' + bounds.top + 'px;left:' + bounds.left + 'px;line-height:' + bounds.height + 'px;',
                    content: inObj.str
                });

            highlightNode.render();

            return highlightNode;
        };

    /**
     *  Enable/disable test mode
     *
     * @type {function}
     * @public
     */
    this.enable = function() {
        _bEnabled = true;
        this.highlight();
    };

    /**
     * Disables test mode
     *
     * @type {function}
     * @public
     */
    this.disable = function() {
        _bEnabled = false;
        _destroyExistingHighlightNodes();
    };

    /**
     * Destroy existing highlight nodes, and highlight current and adjacent spotlight controls
     *
     * @type {function}
     * @public
     */
    this.highlight = function() {
        if (!_bEnabled) {
            return;
        }
        _destroyExistingHighlightNodes();
        _highlightCurrentControl();
        _highlightAdjacentControls();
    };

    /**
     * Return true if test mode is enabled
     *
     * @type {function}
     * @returns {boolean}
     * @public
     */
    this.isEnabled = function() {
        return _bEnabled;
    };
};
