import { sequelize } from "@/db/index";

import { Model, Optional } from "sequelize";
import DataTypes from "sequelize";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserInstace
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt: Date;
  updatedAt: Date;
}
const User = sequelize.define<UserInstace>("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
});

export default User;
