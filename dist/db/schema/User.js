"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/db/index");
const sequelize_1 = require("sequelize");
const User = index_1.sequelize.define("users", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
    },
});
exports.default = User;
//# sourceMappingURL=User.js.map