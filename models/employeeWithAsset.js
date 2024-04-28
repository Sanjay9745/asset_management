module.exports = (sequelize, DataTypes) => {
  return sequelize.define("employeeWithAsset", {
    // Adding a UUID as the primary key
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs (version 4)
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    asset_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    from_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
    return_date: {
      type: DataTypes.STRING,
    
    },
  });
};
