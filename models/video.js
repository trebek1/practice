'use strict';
module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define('Video', {
    title: DataTypes.STRING,
    plays: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User)
        // associations can be defined here
      }
    }
  });
  return Video;
};