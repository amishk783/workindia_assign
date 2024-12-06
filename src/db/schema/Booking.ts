import { sequelize } from "@/db/index";

import { Model, Optional } from "sequelize";
import DataTypes from "sequelize";
import User from "./User";

interface BookingAttributes {
  id: number;
  user_id: string;
  seat_no: number;
  train_id: string;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}

interface BookingInstace
  extends Model<BookingAttributes, BookingCreationAttributes>,
    BookingAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const Booking = sequelize.define<BookingInstace>("Bookings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  user_id: { type: DataTypes.STRING, allowNull: false },
  seat_no: { type: DataTypes.Number, allowNull: false },
  train_id: { type: DataTypes.STRING, allowNull: false },
});

Booking.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
User.hasMany(Booking, {
  foreignKey: "user_id",
  as: "bookings",
});

export default Booking;
