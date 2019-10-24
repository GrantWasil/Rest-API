const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$",'i'],
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$",'i'],
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                min: 4, 
            }
        }
    }, {
        sequelize
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        })
    }
    module.exports = User; 
    return User;
};