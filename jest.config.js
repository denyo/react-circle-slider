const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";

module.exports = {
    setupFiles: ["<rootDir>/jest.setup.js"],
    snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"],
    preset: "ts-jest",
};
