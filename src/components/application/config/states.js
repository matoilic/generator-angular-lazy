const states = [
    {
        name: 'app',
        url: '/',
        type: 'given'
    },
    {
        name: 'app.index',
        url: 'index',
        type: 'load',
        src: () => new Promise((resolve) => {
            require.ensure(['../../index-state/index'], (require) => resolve(require('../../index-state/index')));
        })
    }
];

export default states;
