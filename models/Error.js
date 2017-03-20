class Error {
    constructor(data) {
        this.code = data.code || 0;
        this.message = data.message || "";
    }
}

module.exports = Error;