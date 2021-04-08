module.exports = {
    silent: false,
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    testMatch: [
        "**/*.spec.(ts|js)"
    ],
    testEnvironment: "node"
};