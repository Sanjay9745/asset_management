const db = require('../models');
const bcrypt = require('bcrypt');
function insertAdmin() {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

  db.admins.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword
  })
  .then(() => {
    console.log('Admin inserted successfully.');
  })
  .catch(error => {
    console.error('Error inserting admin:', error);
  });
}

exports.insertAdmin = insertAdmin;
