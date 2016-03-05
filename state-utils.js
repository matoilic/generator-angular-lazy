/*eslint-disable */
'use strict';
/*eslint-enable */

const _ = require('./extended-lodash');

module.exports = {
    determineParentComponent: function (stateName) {
        const normalizedStateName = this.normalizeStateName(stateName);

        if (normalizedStateName.indexOf('.') === -1) {
            return 'application';
        }

        return this.stateToComponentName(
            normalizedStateName.slice(0, normalizedStateName.lastIndexOf('.'))
        );
    },

    normalizeStateName: function (stateName) {
        let normalizedStateName = stateName;

        if (normalizedStateName.indexOf('app.') === 0) {
            normalizedStateName = normalizedStateName.slice(4);
        }

        return normalizedStateName
            .split('.')
            .map((part) => _.slugify(_.humanize(part)))
            .join('.');
    },

    normalizeUrl: function (stateName, url) {
        const leadingSlashRequired = stateName.indexOf('.') > -1;
        const hasLeadingSlash = url[0] === '/';
        let normalizedUrl = url;

        if (leadingSlashRequired && !hasLeadingSlash) {
            normalizedUrl = '/' + normalizedUrl;
        } else if (!leadingSlashRequired && hasLeadingSlash) {
            normalizedUrl = normalizedUrl.slice(1);
        }

        if (normalizedUrl.slice(-1) === '/') {
            normalizedUrl = normalizedUrl.slice(0, -1);
        }

        return normalizedUrl;
    },

    stateToComponentName: function (stateName) {
        return stateName.replace(/\./g, '-') + '-state';
    }
};
