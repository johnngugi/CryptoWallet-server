module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:import/errors", "plugin:import/warnings"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-trailing-spaces": ["warn"],
        "no-unexpected-multiline": ["warn"],
        "quotes": ["warn", "single", { "avoidEscape": false, "allowTemplateLiterals": true }],
    }
};