const BaseEntity = require('typeorm').BaseEntity;

class User extends BaseEntity {
    constructor(id, firstName, lastName, emailAddress, password) {
        super();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
}

module.exports = {
    User
};