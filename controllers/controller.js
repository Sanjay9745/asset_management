const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;
const uuid = require("uuid");
const { Op } = require("sequelize");
const { get } = require("../routes/router");
const e = require("express");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.admins.findOne({ where: { email } });
    if (!user) {
      return res.redirect("/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/login");
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/home");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAssetCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const assetCategory = await db.assetCategories.create({ name });
    if (!assetCategory) {
      return res.render("add-asset-category", {
        message: "Error adding asset category",
      });
    }
    res.render("add-asset-category", {
      message: "Asset category added successfully",
    });
  } catch (error) {
    res.render("add-asset-category", {
      message: "Error adding asset category",
    });
  }
};
const getAddAsset = async (req, res) => {
  const assetCategories = await db.assetCategories.findAll();

  res.render("add-asset", { assetCategories });
};
const addEmployee = async (req, res) => {
  const { name, status } = req.body;
  try {
    if (!name || !status) {
      return res.render("add-employee", {
        message: { type: "danger", text: "Please fill the fields" },
      });
    }
    const employee = await db.employees.create({
      name,
      status,
    });
    if (!employee) {
      return res.render("add-employee", {
        message: { type: "danger", text: "Error adding employee" },
      });
    }
    res.render("add-employee", {
      message: { type: "success", text: "Employee Added Sucessfully" },
    });
  } catch (error) {
    res.render("add-employee", {
      message: { type: "danger", text: "Error adding employee" },
    });
  }
};
const addAsset = async (req, res) => {
  const assetCategories = await db.assetCategories.findAll();
  try {
    const {
      serialNumber,
      name,
      location,
      description,
      purchaseDate,
      warrantyEndDate,
      status,
      assetCategoryId,
    } = req.body;
    console.log(req.body);
    if (
      !serialNumber ||
      !name ||
      !location ||
      !purchaseDate ||
      !warrantyEndDate ||
      !status ||
      !assetCategoryId
    ) {
      return res.render("add-asset", {
        message: { type: "danger", text: "Please fill the fields" },
        assetCategories,
      });
    }
    const asset = await db.assets.create({
      serialNumber,
      name,
      location,
      description,
      purchaseDate,
      warrantyEndDate,
      status,
      assetCategoryId,
    });
    if (!asset) {
      return res.render("add-asset", {
        message: { type: "danger", text: "Error adding assets" },
        assetCategories,
      });
    }
    res.render("add-asset", {
      message: { type: "success", text: "Asset Added Sucessfully" },
      assetCategories,
    });
  } catch (error) {
    res.render("add-asset", {
      message: { type: "danger", text: "Error adding assets" },
      assetCategories,
    });
  }
};
const deleteAsset = (req, res) => {
  const { id } = req.query;
  try {
    db.assets.destroy({ where: { _id: id } });
    db.employeeWithAssets.destroy({ where: { asset_id: id } });
    res.redirect("/all-assets");
  } catch (error) {
    res.redirect("/all-assets");
  }
};
const getEditAsset = async (req, res) => {
  const assetCategories = await db.assetCategories.findAll();
  try {
    const { id } = req.query;
    const asset = await db.assets.findOne({ where: { _id: id } }); // Adjusted _id to id
    if (!asset) {
      return res.status(404).send("Asset not found");
    }
    if (!assetCategories || !asset) {
      res.redirect("/all-assets");
    }
    res.render("edit-asset", { asset, assetCategories, id });
  } catch (error) {
    console.log(error);
    res.redirect("/all-assets");
  }
};

const editAsset = async (req, res) => {
  //if values exist then update

  const assetCategories = await db.assetCategories.findAll();
  try {
    const { id } = req.query;

    const {
      serialNumber,
      name,
      location,
      description,
      purchaseDate,
      warrantyEndDate,
      status,
      assetCategoryId,
    } = req.body;
    console.log(req.body);
    const asset = await db.assets.findOne({ where: { _id: id } });
    if (!asset) {
      return res.render("edit-asset", {
        message: { type: "danger", text: "Asset not found" },
        assetCategories,
        asset,
        id,
      });
    }

    //if exist then update

    if (serialNumber) {
      asset.serialNumber = serialNumber;
    }
    if (name) {
      asset.name = name;
    }
    if (location) {
      asset.location = location;
    }
    if (description) {
      asset.description = description;
    }
    if (purchaseDate) {
      asset.purchaseDate = purchaseDate;
    }
    if (warrantyEndDate) {
      asset.warrantyEndDate = warrantyEndDate;
    }
    if (status) {
      asset.status = status;
    }
    if (assetCategoryId) {
      asset.assetCategoryId = assetCategoryId;
    }
    await asset.save();

    res.render("edit-asset", {
      message: { type: "success", text: "Asset updated successfully" },
      assetCategories,
      asset,
      id,
    });
  } catch (error) {
    res.render("edit-asset", {
      message: { type: "danger", text: "Error updating asset" },
      assetCategories,
      asset,
      id,
    });
  }
};

const getAllAssets = async (req, res) => {
  const { status, search } = req.query;
  let query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query = {
      [Op.or]: [
        //search by serial number or name . case insensitive
        { serialNumber: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ],
    };
  }
  const assets = await db.assets.findAll({ where: query });
  res.render("all-assets", { assets, getBadgeClass });
};
const getAllEmployees = async (req, res) => {
  const employees = await db.employees.findAll();
  res.render("all-employees", { employees });
};
const getAddAssetToEmployee = async (req, res) => {
  const { id } = req.query;
  const employees = await db.employees.findAll();
  const assets = await db.assets.findAll();
  res.render("add-asset-to-employee", { employees, assets, id });
};
const addAssetToEmployee = async (req, res) => {
  let { id } = req.query;
  const employees = await db.employees.findAll();
  const assets = await db.assets.findAll();
  try {
    const { asset_id, from_date, to_date, employee_id } = req.body;
    if (!id) {
      id = employee_id;
    }
    console.log(id, employee_id);
    if (id == undefined && employee_id == undefined) {
      return res.redirect("/all-employees");
    }
    //check is asset status is available
    const isAssetAvailable = await db.assets.findOne({
      where: { _id: asset_id, status: "available" },
    });
    if (!isAssetAvailable) {
      return res.render("add-asset-to-employee", {
        message: { type: "danger", text: "Asset is not available" },
        employees,
        assets,
        id,
      });
    }

    if (!asset_id || !from_date || !to_date) {
      return res.render("add-asset-to-employee", {
        message: { type: "danger", text: "Please fill the fields" },
        employees,
        assets,
        id,
      });
    }
    //if employee already has the asset
    const checkAsset = await db.employeeWithAssets.findOne({
      where: { employee_id: id, asset_id },
    });
    if (checkAsset) {
      return res.render("add-asset-to-employee", {
        message: { type: "danger", text: "Employee already has the asset" },
        employees,
        assets,
        id,
      });
    }
    const asset = await db.employeeWithAssets.create({
      employee_id: id,
      asset_id,
      from_date,
      to_date,
    });
    //upate asset status
    await db.assets.update({ status: "in-use" }, { where: { _id: asset_id } });
    if (!asset) {
      return res.render("add-asset-to-employee", {
        message: { type: "danger", text: "Error adding assets" },
        employees,
        assets,
        id,
      });
    }
    res.render("add-asset-to-employee", {
      message: { type: "success", text: "Asset Added Sucessfully" },
      employees,
      assets,
      id,
    });
  } catch (error) {
    console.log(error);
    res.render("add-asset-to-employee", {
      message: { type: "danger", text: "Error adding assets" },
      employees,
      assets,
      id,
    });
  }
};
const getReturnAsset = async (req, res) => {
  const { id } = req.query;
  try {
    const employeeWithAsset = await db.employeeWithAssets.findAll({
      where: { employee_id: id },
    });
    if (!employeeWithAsset) {
      return res.redirect("/all-employees");
    }
    const employees = [];
    for (let i = 0; i < employeeWithAsset.length; i++) {
      const employee = await db.employees.findOne({
        where: { _id: employeeWithAsset[i].employee_id },
      });
      const asset = await db.assets.findOne({
        where: { _id: employeeWithAsset[i].asset_id },
      });
      //add employee name to employeeWithAsset
      employeeWithAsset[i].employee = employee;
      employeeWithAsset[i].asset = asset;

      employees.push(employeeWithAsset[i]);
    }
    if(employees.length==0){
        return res.redirect("/all-employees");
    }
    res.render("return-asset", { employees, id});
  } catch (error) {
    res.redirect("/all-employees");
  }
};
const returnAsset = async (req, res) => {
  try {
    const { id } = req.query;
      const { return_date, reason, asset_id ,employee_id} = req.body;
      console.log(id)
      if (!return_date || !reason) {
          return res.redirect("/all-employees");
      }
      //update employeeWithAsset
      const isEmployeeAsset =  await db.employeeWithAssets.update(
          { return_date, reason },
          { where: { employee_id: id, asset_id:asset_id } }
      );
      if (!isEmployeeAsset) {
          return res.redirect("/all-employees");
      }

      //update asset status
      await db.assets.update({ status: "available" }, { where: { _id: asset_id } });
      console.log("asset updated")
      res.redirect("/all-employees");
  } catch (error) {
      console.log(error);
      res.redirect("/all-employees");
  }
}

const deleteEmployee = (req, res) => {
  const { id } = req.query;
  try {
    db.employees.destroy({ where: { _id: id } });
    //delete assets of employee
    db.employeeWithAssets.destroy({ where: { employee_id: id } });
    res.redirect("/all-employees");
  } catch (error) {
    res.redirect("/all-employees");
  }
};

const getAssetInfo = async (req, res) => {
  const { id } = req.query;
  const asset = await db.assets.findOne({ where: { _id: id } });
  //get employee with asset
  const employeeWithAsset = await db.employeeWithAssets.findAll({
    where: { asset_id: id },
  });
  if (!asset) {
    return res.status(404).send("Asset not found");
  }
  const category = await db.assetCategories.findOne({
    where: { _id: asset.assetCategoryId },
  });
  asset.category = category.name;
  if (!employeeWithAsset) {
    return res.render("asset-info", { asset });
  }

  const employees = [];
  for (let i = 0; i < employeeWithAsset.length; i++) {
    const employee = await db.employees.findOne({
      where: { _id: employeeWithAsset[i].employee_id },
    });
    //add employee name to employeeWithAsset
    employeeWithAsset[i].employeeName = employee.name;
    employeeWithAsset[i].employeeStatus = employee.status;
    employees.push(employeeWithAsset[i]);
  }
  asset.employees = employees;

  res.render("asset-info", { asset });
};

const getHome = async (req, res) => {
  try {
    //find first 5 assets and employees in descending order
    const assets = await db.assets.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    const employees = await db.employees.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    const totalAssets = await db.assets.count();
    const totalEmployees = await db.employees.count();
    const lastWeekAssets = await db.assets.count({
      where: {
        createdAt: {
          [Op.gt]: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
        },
      },
    });
    const lastWeekEmployees = await db.employees.count({
      where: {
        createdAt: {
          [Op.gt]: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
        },
      },
    });
    res.render("index", {
      assets,
      employees,
      totalAssets,
      totalEmployees,
      lastWeekAssets,
      lastWeekEmployees,
      getBadgeClass,
    });
  } catch (error) {
    console.log(error);
    res.redirect("index");
  }
};
function getBadgeClass(status) {
  switch (status) {
    case "available":
      return "bg-success";
    case "in-use":
      return "bg-warning";
    case "maintenance":
      return "bg-primary";
    case "disposed":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

module.exports = {
  login,
  addAssetCategory,
  getAddAsset,
  addEmployee,
  addAsset,
  getEditAsset,
  deleteAsset,
  getAllAssets,
  getAllEmployees,
  getAddAssetToEmployee,
  addAssetToEmployee,
  deleteEmployee,
  editAsset,
  getAssetInfo,
  getHome,
    getReturnAsset,
    returnAsset
};
