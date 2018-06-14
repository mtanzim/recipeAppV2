
//instead of using associate models, the foreign keys were defined manually
module.exports = (sequelize, DataTypes) => {

  // const bcrypt = require('bcrypt');
  // const SALT_ROUNDS = 10;

  const User = require('./users')(sequelize, DataTypes);

  // Implement schema here
  const Friend = sequelize.define('Friend', {
    // _id: DataTypes.UUIDV1,
    friendId: { 
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, 
    },
    UserA_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: '_id',
      }
    },
    UserB_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: '_id',
      }
    }  
  });

  // relationship
  // Friend.associate = models => Friend.hasMany(models.User);
  return Friend;

};