const production = {
    DOMAIN: 'm.test.com'
};

const development = Object.assign({}, production, {
    DOMAIN: '127.0.0.1:8080'
});

const hgh = Object.assign({}, development, {

});

module.exports = {
    production,
    development,
    hgh,
}
