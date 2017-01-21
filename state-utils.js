const _ = require('./extended-lodash');

module.exports = {
    determineParentComponent(stateName) {
        const normalizedStateName = this.normalizeStateName(stateName);

        if (normalizedStateName.indexOf('.') === -1) {
            return 'application';
        }

        return this.stateToComponentName(
            normalizedStateName.slice(0, normalizedStateName.lastIndexOf('.'))
        );
    },

    normalizeStateName(stateName) {
        let normalizedStateName = stateName;

        if (normalizedStateName.indexOf('app.') === 0) {
            normalizedStateName = normalizedStateName.slice(4);
        }

        return normalizedStateName
            .split('.')
            .map(part => _.slugify(_.humanize(part)))
            .join('.');
    },

    normalizeUrl(stateName, url) {
        const leadingSlashRequired = stateName.indexOf('.') > -1;
        const hasLeadingSlash = url[0] === '/';
        let normalizedUrl = url;

        if (leadingSlashRequired && !hasLeadingSlash) {
            normalizedUrl = `/${normalizedUrl}`;
        } else if (!leadingSlashRequired && hasLeadingSlash) {
            normalizedUrl = normalizedUrl.slice(1);
        }

        if (normalizedUrl.slice(-1) === '/') {
            normalizedUrl = normalizedUrl.slice(0, -1);
        }

        return normalizedUrl;
    },

    stateToComponentName(stateName) {
        return `${stateName.replace(/\./g, '-')}-state`;
    }
};
