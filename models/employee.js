module.exports = (sequelize, DataTypes) => {
  return sequelize.define("employee", {
    // Adding a UUID as the primary key
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs (version 4)
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    status: DataTypes.STRING,
  });
};
