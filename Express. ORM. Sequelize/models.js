const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './INS.db',
    define: {
        timestamps: false
    }
});


class Turtle extends Model {}
class Weapon extends Model {}
class Pizza extends Model {}

async function createModels() {

    await Weapon.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dps: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Weapon',
        }
    );

    await Pizza.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Pizza',
        }
    );

    await Turtle.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'Turtle',
        }
    );

    await Weapon.hasMany(Turtle, {
        foreignKey: "weapon_id",
    })
    await Pizza.hasMany(Turtle, {
        foreignKey: "favorite_pizza_id",
    });
    await Pizza.hasMany(Turtle, {
        foreignKey: "second_favorite_pizza_id",
    });

    await Weapon.sync({ force: true });
    await Pizza.sync({ force: true });
    await Turtle.sync({ force: true });


    await Weapon.create({ name: 'katana', dps: 5 });
    await Weapon.create({ name: 'sai', dps: 4 });
    await Weapon.create({ name: 'nunchaku', dps: 3 });
    await Weapon.create({ name: 'staff', dps: 2 });

    await Pizza.create({ name: 'pepperoni', calories: 1550 })
    await Pizza.create({ name: 'margarita', calories: 1430 })
    await Pizza.create({ name: 'capriciosa', calories: 1600 })
    await Pizza.create({ name: 'hawaiian', calories: 1390 })

    await Turtle.create({ 
        name: 'Leonardo', 
        color: 'blue', 
        image: 'file:///C:/Учёба БГТУ/3 курс/6 семестр/Лабораторные/Программирование в интернет/Lab_09/images/leonardo.png', 
        weapon_id: 1,
        favorite_pizza_id: 1,
        second_favorite_pizza_id: 2
    });
    await Turtle.create({ 
        name: 'Raphael', 
        color: 'red', 
        image: 'file:///C:/Учёба БГТУ/3 курс/6 семестр/Лабораторные/Программирование в интернет/Lab_09/images/raphael.png', 
        weapon_id: 2,
        favorite_pizza_id: 1,
        second_favorite_pizza_id: 3
    });
    await Turtle.create({ 
        name: 'Donatello', 
        color: 'purple', 
        image: 'file:///C:/Учёба БГТУ/3 курс/6 семестр/Лабораторные/Программирование в интернет/Lab_09/images/donatello.png', 
        weapon_id: 4,
        favorite_pizza_id: 3,
        second_favorite_pizza_id: 2
    });
    await Turtle.create({ 
        name: 'Michelangelo', 
        color: 'orange', 
        image: 'file:///C:/Учёба БГТУ/3 курс/6 семестр/Лабораторные/Программирование в интернет/Lab_09/images/michelangelo.png', 
        weapon_id: 3,
        favorite_pizza_id: 4,
        second_favorite_pizza_id: 1
    });
}

createModels();