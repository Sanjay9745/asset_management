module.exports = (sequelize, DataTypes) => {
  return sequelize.define("asset", {
    // Adding a UUID as the primary key
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs (version 4)
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    warrantyEndDate: DataTypes.STRING,
    status: DataTypes.STRING,
    assetCategoryId: DataTypes.UUID,
  });
};
