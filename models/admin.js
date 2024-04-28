// models/admin.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('admin', {
          // Adding a UUID as the primary key
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Automatically generate UUIDs (version 4)
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  };
  