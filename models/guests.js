'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class guests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  guests.init({
    nickname: DataTypes.STRING,
    room_name: DataTypes.STRING,
    room_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'guests',
  });
  return guests;
};