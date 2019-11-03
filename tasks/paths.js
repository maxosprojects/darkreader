module.exports = {
    getDestDir: function ({production, firefox, edge}) {
        if (firefox) {
            return production ? 'build-firefox' : 'debug-firefox';
        }
        if (edge) {
            return production ? 'build-edge' : 'debug-edge';
        }
        return production ? 'build' : 'debug';
    }
};
