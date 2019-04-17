const passport = require('passport');
const path = require('path');
const fs = require('fs');
const imgdownload = require('image-downloader');
const excelToJson = require('../helpers/exceltojson');
const Category = require('../models/Category');
const Item = require('../models/Item');

// Display Landing Page
module.exports.adminlogin_get = (req, res, next) => {
  res.render('admin/login');
};

// Autenticate Admin
module.exports.adminlogin_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })(req, res, next);
};

// Show Admin Dashboard
module.exports.dashboard_get = (req, res, next) => {
  res.render('admin/dashboard');
};

// Show Add Category Form
module.exports.addcategory_get = (req, res, next) => {
  res.render('admin/addcategory');
};

// Add Category
module.exports.addcategory_post = async (req, res, next) => {
  const name = req.body.name.trim();
  const emoji = req.body.emoji.trim();
  const messages = [];

  if (name == '') {
    messages.push('Please fill in all fields');
  } else {
    const foundCategory = await Category.findOne({
      name
    });
    console.log(foundCategory);
    if (foundCategory) {
      messages.push('Category already exists')
    }
  }

  if (messages.length > 0) {
    res.render('admin/addcategory', {
      messages,
    });
  } else {
    const newCategory = new Category({
      name,
      emoji,
    });
    newCategory.save().then((savedCategory) => {
      res.render('admin/addcategory', {
        success_msg: 'Category saved successfully...',
      });
    });
  }
};

// Delete a category
module.exports.deletecategory_post = async (req, res, next) => {
  const foundCategory = await Item.find({
    category: req.params.categoryid,
  });
  if (foundCategory.length != 0) {
    const categories = await Category.find();
    res.render('admin/categories', {
      categories,
      error_msg: 'Cannot delete category with items inside it...',
    });
  } else {
    await Category.findByIdAndDelete(req.params.categoryid);
    const categories = await Category.find();
    res.render('admin/categories', {
      categories,
      success_msg: 'Category Deleted...',
    });
  }
};

// Show Add Item Form
module.exports.additem_get = async (req, res, next) => {
  const categories = await Category.find();
  res.render('admin/additem', {
    categories
  });
};

// Add Item
module.exports.additem_post = async (req, res, next) => {
  const categories = await Category.find();
  const newItem = {
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    origins: req.body.origins ? JSON.parse(req.body.origins) : [],
    description: req.body.description.trim(),
    // image: req.files ? req.files.image.name.toLowerCase() : '',
    searchtags: req.body.searchtags.substring(1, req.body.searchtags.length - 1).replace(/"/g, '').split(','),
  };

  const category = await Category.findById(newItem.category);
  
  if (req.files) {
    const extentionArray = req.files.image.name.split('.');
    const extension = extentionArray[extentionArray.length - 1];
    newItem.image = `${newItem.name.replace(' ', '').toLowerCase()}${category.name.replace(' ', '').toLowerCase()}.${extension}`;
  } else if (req.body.imageurl != '') {
    const extentionArray = req.body.imageurl.split('.');
    const extension = extentionArray[extentionArray.length - 1];
    newItem.image = `${newItem.name.replace(' ', '').toLowerCase()}${category.name.replace(' ', '').toLowerCase()}.${extension}`;
  } else {
    newItem.image = '';
  }

  const messages = [];
  if (newItem.name == '') {
    messages.push('Please Fill in all required fields');
  } else {
    const foundItem = await Item.findOne({
      name: newItem.name
    });
    if (foundItem) {
      messages.push('Food Item already exists');
    }
  }

  if (messages.length > 0) {
    res.render('admin/additem', {
      messages,
      categories,
    });
  } else {
    const createItem = new Item(newItem);
    await createItem.save();
    
    // Save Image File
    if (req.files) {
      const imgPath = path.resolve(__dirname, `../public/images/dishes/${newItem.image}`);
      const file_img = req.files.image;
      file_img.mv(imgPath, (err => console.log(err)));
    } else if (req.body.imageurl != '') {
      const imgPath = path.resolve(__dirname, `../public/images/dishes/${newItem.image}`);
      await imgdownload({url: req.body.imageurl, dest: imgPath})  
    }

    res.render('admin/additem', {
      categories,
      success_msg: 'Food item added successfully',
    });
  }
};

// Show Categories Page
module.exports.categories_get = async (req, res, next) => {
  const categories = await Category.find();
  res.render('admin/categories', {
    categories,
  });
};

// Show Items Page
module.exports.items_get = async (req, res, next) => {
  const category = await Category.findById(req.params.categoryid);
  const items = await Item.find({
    category: req.params.categoryid,
  }).populate('category').exec();
  res.render('admin/items', {
    items,
    category,
  });
};

// Delete Item
module.exports.deleteitem_post = async (req, res, next) => {
  const foundItem = await Item.findById(req.params.itemid);
  if (foundItem.image != '') {
    const imagePath = path.resolve(__dirname, `../public/images/dishes/${foundItem.image}`);
    const fileExists = fs.existsSync(imagePath);
    if (fileExists) {
      fs.unlinkSync(imagePath);
    }
  }
  await Item.findByIdAndDelete(req.params.itemid);
  const category = await Category.findById(foundItem.category);
  const items = await Item.find({
    category: foundItem.category,
  }).populate('category').exec();
  res.render('admin/items', {
    items,
    category,
    success_msg: 'Item Deleted...',
  });
};

// Show Add Categories Bulk Form
module.exports.addcategorybulk_get = (req, res, next) => {
  res.render('admin/addcategorybulk');
};

// Add Categories Bulk
module.exports.addcategorybulk_post = async (req, res, next) => {
  try {
    const filePath = path.resolve(__dirname, `../temp/${req.files.excelfile.name}`);
    const outputPath = path.resolve(__dirname, '../temp/categories.json');
    const file_img = req.files.excelfile;
    file_img.mv(filePath, async () => {
      const catJSON = await excelToJson(filePath, outputPath);
      console.log(catJSON);
      await Category.insertMany(catJSON)
    });
    req.flash('success_msg', 'Categories Added to Database');
    res.redirect('/admin/categories');
  } catch (error) {
    res.render('admin/addcategorybulk', {
      error_msg: error,
    });
  }
};

// Show Add Items Bulk Form
module.exports.additembulk_get = (req, res, next) => {
  res.render('admin/additembulk');
};

// Add Items Bulk
module.exports.additembulk_post = (req, res, next) => {
  try {
    const filePath = path.resolve(__dirname, `../temp/${req.files.excelfile.name}`);
    const outputPath = path.resolve(__dirname, '../temp/items.json');
    const file_img = req.files.excelfile;
    file_img.mv(filePath, async () => {
      const itemsJSON = await excelToJson(filePath, outputPath);
      for (let i = 0; i < itemsJSON.length; i++) {
        const downloadURI = itemsJSON[i].image;
        const convertedItem = await convertItem(itemsJSON[i]);
        if (downloadURI != '') {
          console.log(downloadURI)
          const imgPath = path.resolve(__dirname, `../public/images/dishes/${convertedItem.image}`);
          await imgdownload({url: downloadURI, dest: imgPath});
        }
        const newItem = new Item(convertedItem);
        await newItem.save();
      }
    });
    res.render('admin/additembulk', {
      success_msg: 'Items Added to Database',
    });
  } catch (error) {
    res.render('admin/additembulk', {
      error_msg: error,
    });
  }
};

// Show Edit category Page
module.exports.editcategory_get = async (req, res, next) => {
  const category = await Category.findById(req.params.categoryid);
  res.render('admin/editcategory', {
    category
  });
}

// Save Modifications in category
module.exports.editcategory_post = async (req, res, next) => {
  const name = req.body.name.trim();
  const category = await Category.findById(req.body.category);
  const messages = [];

  if (name == '') messages.push('Food category must have a name')

  if (messages.length > 0) {
    res.render('admin/editcategory', {
      messages,
      category
    });
  } else {
    await Category.findByIdAndUpdate(req.body.category, {
      name: req.body.name,
      emoji: req.body.emoji,
    });
    req.flash('success_msg', 'Category updated');
    res.redirect('/admin/categories');
  }
}

// Show Edit Item Page
module.exports.edititem_get = async (req, res, next) => {
  const categories = await Category.find();
  const foundItem = await Item.findById(req.params.itemid).populate('category').exec();
  
  foundItem.image = `/images/dishes/${foundItem.image}`
  res.render('admin/edititem', {
    item: foundItem,
    categories,
  });
}

// Edit Food item
module.exports.edititem_post = async (req, res, next) => {
  const foundItem = await Item.findById(req.body.itemid);
  console.log(req.body);
  const newItem = {
    name: req.body.name.trim(),
    category: req.body.category,
    origins: req.body.origins ? JSON.parse(req.body.origins) : [],
    description: req.body.description.trim(),
    // image: req.files ? req.files.image.name.toLowerCase() : foundItem.image,
    searchtags: req.body.searchtags.substring(1, req.body.searchtags.length - 1).replace(/"/g, '').split(','),
  };
  const category = await Category.findById(newItem.category);

  if (req.files) {
    const extentionArray = req.files.image.name.split('.');
    const extension = extentionArray[extentionArray.length - 1];
    newItem.image = `${newItem.name.replace(' ', '').toLowerCase()}${category.name.replace(' ', '').toLowerCase()}.${extension}`;
  } else if (req.body.imageurl != '') {
    const extentionArray = req.body.imageurl.split('.');
    const extension = extentionArray[extentionArray.length - 1];
    newItem.image = `${newItem.name.replace(' ', '').toLowerCase()}${category.name.replace(' ', '').toLowerCase()}.${extension}`;
  } else {
    newItem.image = foundItem.image;
  }

  const messages = [];
  if (newItem.name == '') {
    messages.push('Please Fill in all required fields');
  }

  if (messages.length > 0) {
    const categories = await Category.find();
    foundItem.image = `/images/dishes/${foundItem.image}`
    res.render('admin/edititem', {
      messages,
      categories,
      item: foundItem,
    });
  } else {
    await Item.findByIdAndUpdate(req.body.itemid, newItem);

    // Save Image File
    if (req.files) {
      const imgPath = path.resolve(__dirname, `../public/images/dishes/${newItem.image}`);
      const file_img = req.files.image;
      file_img.mv(imgPath, (err => console.log(err)));
    } else if (req.body.imageurl != '') {
      const imgPath = path.resolve(__dirname, `../public/images/dishes/${newItem.image}`);
      await imgdownload({url: req.body.imageurl, dest: imgPath})  
    }
    
    req.flash('success_msg', 'Item modified');
    res.redirect(`/admin/items/list/${category._id}`);
  }
}


function convertItem(item) {
  return new Promise(async (resolve, reject) => {
    try {
      const returnItem = item;

      if (returnItem.searchtags != '') {
        returnItem.searchtags = returnItem.searchtags.split(',');
        for (let i = 0; i < returnItem.searchtags.length; i++) {
          returnItem.searchtags[i] = returnItem.searchtags[i].trim();
        }
      } else {
        returnItem.searchtags = [];
      }

      if (returnItem.origins != '') {
        returnItem.origins = item.origins.split(',');
        for (let i = 0; i < returnItem.origins.length; i++) {
          returnItem.origins[i] = returnItem.origins[i].trim();
        }
      } else {
        returnItem.origins = [];
      }

      const foundCategory = await Category.findOne({
        name: {
          $regex: item.category,
          $options: 'i'
        },
      });
      returnItem.category = foundCategory._id;

      if (returnItem.image != '') {
        const extentionArray = returnItem.image.split('.');
        const extension = extentionArray[extentionArray.length - 1];
        returnItem.image = `${returnItem.name.replace(' ', '').toLowerCase()}${foundCategory.name.replace(' ', '').toLowerCase()}.${extension}`;
        returnItem.image = returnItem.image.toLowerCase();
      }

      resolve(returnItem);
    } catch (error) {
      reject(error);
    }
  });
}