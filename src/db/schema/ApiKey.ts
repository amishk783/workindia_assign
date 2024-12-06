import { sequelize } from "@/db/index";

import { Model, Optional } from "sequelize";
import DataTypes from "sequelize";
import User from "./User";

interface ApiKeyAttributes {
  id: number;
  user_id: number;
  key: string;
}

interface ApiKeyCreationAttributes extends Optional<ApiKeyAttributes, "id"> {}

interface ApiKeyInstace
  extends Model<ApiKeyAttributes, ApiKeyCreationAttributes>,
    ApiKeyAttributes {
  createdAt: Date;
  updatedAt: Date;
}
const ApiKey = sequelize.define<ApiKeyInstace>("api_keys", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  key: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
});
ApiKey.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
User.hasMany(ApiKey, {
  foreignKey: "user_id",
  as: "api_keys",
});
export default ApiKey;
