import { sequelize } from "@/db/index";

import { Model, Optional } from "sequelize";
import DataTypes from "sequelize";

interface TrainAttributes {
  id: number;
  trainName: string;
  total_seats: number;
  available_seats: number;
  source_station: string;
  destination_station: string;
}

interface TrainCreationAttributes extends Optional<TrainAttributes, "id"> {}

interface TrainInstace
  extends Model<TrainAttributes, TrainCreationAttributes>,
    TrainAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const Train = sequelize.define<TrainInstace>("Trains", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  trainName: { type: DataTypes.STRING, allowNull: false },
  total_seats: { type: DataTypes.NUMBER, allowNull: false },
  available_seats: { type: DataTypes.NUMBER, allowNull: false },
  source_station: { type: DataTypes.STRING, allowNull: false },
  destination_station: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Train;
