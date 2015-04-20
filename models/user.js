'use strict';
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
     email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        len: [6, 30]
       }
    },
    passwordDigest: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    instanceMethods: {
      checkPassword: function(password) {
        return bcrypt.compareSync(password, this.passwordDigest);
      },
      
    },
    classMethods: {
      encryptPassword: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function(first,last,email,password) {
        if(password.length < 6) {
          throw new Error("Password too short");
        }
        return this.create({
          first_name: first,
          last_name: last,
          email: email,
          passwordDigest: this.encryptPassword(password)
        });

      },
      authenticate: function(first,last,email,password) {
        // find a user in the DB
        return this.find({
          where: {
          first_name: first,
          last_name: last,
          email: email
          }
        }) 
        .then(function(user){
          if (user === null){
            throw new Error("Username does not exist");
          }
          else if (user.checkPassword(password)){
            return user;
          } else {
            return false;
          }
        });
      },
      associate: function(models) {
        this.hasMany(models.Video)
        // associations can be defined here
      }

    } // close classMethods
  }); // close define user
  return User;
}; 






