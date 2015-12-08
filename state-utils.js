const _ = require('./extended-lodash');

module.exports = {
    determineParentComponent: function(stateName) {
        stateName = this.normalizeStateName(stateName);

        if(stateName.indexOf('.') === -1) {
            return 'application';
        }

        return this.conststateToComponentName(
            stateName.slice(0, stateName.lastIndexOf('.'))
        );
    },

    normalizeStateName: function(stateName) {
        if(stateName.indexOf('app.') === 0) {
            stateName = stateName.slice(4);
        }

        return stateName
            .split('.')
            .map((part) => _.slugify(_.humanize(part)))
            .join('.');
    },

    normalizeUrl: function(stateName, url) {
        const leadingSlashRequired = stateName.indexOf('.') > -1;
        const hasLeadingSlash = url[0] === '/';

        if(leadingSlashRequired && !hasLeadingSlash) {
            url = '/' + url;
        } else if(!leadingSlashRequired && hasLeadingSlash) {
            url = url.slice(1);
        }

        if(url.slice(-1) === '/') {
            url = url.slice(0, -1);
        }

        return url;
    },

    stateToComponentName: function(stateName) {
        return stateName.replace(/\./g, '-') + '-state';
    }
};
