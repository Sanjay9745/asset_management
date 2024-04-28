const router = require("express").Router();
const auth = require("../middlewares/auth");
const { insertAdmin } = require("../helpers/insertAdmin");
const controller = require("../controllers/controller");
router.get("/",auth, controller.getHome);
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/home",auth,controller.getHome);
router.get('/add-asset',auth,controller.getAddAsset);
router.get('/all-assets',auth,controller.getAllAssets);
router.get('/add-employee',auth,(req,res)=>{
    res.render('add-employee')
});
router.get('/all-employees',auth,controller.getAllEmployees);
router.get('/add-asset-category',auth,(req,res)=>{
    res.render('add-asset-category')
});
router.get('/add-asset-to-employee',auth,controller.getAddAssetToEmployee);

router.get("/protected", auth, (req, res) => {
    res.status(200).json({ message: "Protected route" });
});
//router.get("/create-admin", (req, res) => {
  //  insertAdmin();
   // res.status(200).json({ message: "Admin created" });
//});
router.get('/edit-asset',auth,controller.getEditAsset);
router.get('/asset-info',auth,controller.getAssetInfo);
router.get('/return-asset',auth,controller.getReturnAsset);



router.post("/login", controller.login);
// router.post("/add-employee", controller.addEmployee);
// router.post("/add-asset", controller.addAsset);
router.post("/add-asset-category",auth, controller.addAssetCategory);
router.post("/add-employee",auth, controller.addEmployee);
router.post("/add-asset",auth, controller.addAsset);
router.post("/add-asset-to-employee",auth, controller.addAssetToEmployee);
router.post("/edit-asset",auth,controller.editAsset);
router.post("/return-asset",auth,controller.returnAsset);


//

//delete
router.get('/delete-employee',auth,controller.deleteEmployee);
router.get('/delete-asset',auth,controller.deleteAsset);


module.exports = router;
