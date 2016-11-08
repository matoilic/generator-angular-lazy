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
        load: () => System.import('../../index-state/index')
    }
];

export default states;
