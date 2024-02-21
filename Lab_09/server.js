const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require('express-fileupload');
const { Sequelize, DataTypes, Model, Op } = require("sequelize");
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

async function initModels() {
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

    await Weapon.sync();
    await Pizza.sync();
    await Turtle.sync();
}

initModels();


const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(express.static("images"));
app.use(function(_, response, next) { 
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/api/turtles", getTurtles);
app.get("/api/turtles/:id", getTurtleById);
app.post("/api/turtles", postTurtle);
app.put("/api/turtles", putTurtle);
app.put("/api/turtles/favoritePizzaBind", bindFirstFavoritePizza);
app.put("/api/turtles/secondFavoritePizzaBind", bindSecondFavoritePizza);
app.put("/api/turtles/weaponBind", turtleBindWeapon);
app.delete("/api/turtles/:id/favoritePizzaUnbind", turtleUnbindFavoritePizza);
app.delete("/api/turtles/:id/secondFavoritePizzaUnbind", turtleUnbindSecondFavoritePizza);
app.delete("/api/turtles/:id/weaponUnbind", turtleUnbindWeapon);
app.delete("/api/turtles/:id", deleteTurtle);

app.get("/api/weapons", getWeapons);
app.get("/api/weapons/:id", getWeaponById);
app.post("/api/weapons", postWeapon);
app.put("/api/weapons", putWeapon);
app.delete("/api/weapons/:id", deleteWeapon);

app.get("/api/pizzas", getPizzas);
app.get("/api/pizzas/:id", getPizzaById);
app.post("/api/pizzas", postPizza);
app.put("/api/pizzas", putPizza);
app.delete("/api/pizzas/:id", deletePizza);

const urlencodedParser = express.urlencoded({extended: false});
app.get("/upload", getUpload);
app.post("/upload", postUpload);

app.put("/api/superfat", putSuperfat);

app.listen(3000);




async function getTurtles(request, response) {
    let turtles;
    if (request.query["favoritePizza"] !== undefined) {
        const favoritePizzaName = request.query["favoritePizza"];
        const pizza = await Pizza.findOne({
            where: {
                name: favoritePizzaName
            }
        });
        turtles = await Turtle.findAll({
            where: {
                favorite_pizza_id: pizza.id
            }
        });
    }
    else {
        turtles = await Turtle.findAll();
    }
    response.json(turtles);
}

async function getTurtleById(request, response) {
    const id = parseInt(request.params["id"]);

    if (isNaN(id)) {
        return response.status(400).json({ error: "Некорректный идентификатор. Требуется число." });
    }

    const turtle = await Turtle.findOne({
        where: {
            id: id
        }
    });

    if (!turtle) {
        return response.status(404).json({ error: "Черепаха с указанным идентификатором не найдена." });
    }

    response.json(turtle);
}


async function postTurtle(request, response) {
    const newTurtle = request.body;
    if (!newTurtle.name || !newTurtle.color) {
        return response.status(400).json({ error: 'Missing required fields: name and color must be provided.' });
    }
    Turtle.create(newTurtle);
    response.json(request.body);
}

async function putTurtle(request, response) {
    const { id, name, color, weaponId, favoritePizzaId, secondFavoritePizzaId, image } = request.body;

    if (!id || !name || !color) {
        return response.status(400).json({ error: 'Missing required fields: id, name, and color must be provided.' });
    }
    const turtle = await Turtle.findByPk(id);
    if (!turtle) {
        return response.status(404).json({ error: 'Turtle not found.' });
    }
    const updateData = { name, color };
    if (weaponId !== undefined) updateData.weapon_id = weaponId;
    if (favoritePizzaId !== undefined) updateData.favorite_pizza_id = favoritePizzaId;
    if (secondFavoritePizzaId !== undefined) updateData.second_favorite_pizza_id = secondFavoritePizzaId;
    if (image !== undefined) updateData.image = image;
    
    await Turtle.update(updateData, { where: { id } });
    
    const updatedTurtle = await Turtle.findByPk(id);
    response.json(updatedTurtle);
}

async function deleteTurtle(request, response) {
    const turtle_id = parseInt(request.params["id"]);
    const turtle = await Turtle.findOne({
        where: {
            id: turtle_id
        }
    });
    if (turtle) {
        Turtle.destroy({
            where: {
                id: turtle_id
            }
        });
        response.json(turtle);
    }
    else return response.json({ error: 'Turtle not found.' });
}

async function bindFirstFavoritePizza(request, response) {
    let turtleId = parseInt(request.body.id);
    let pizzaId = parseInt(request.body.favorite_pizza_id);
    const turtle = await Turtle.findByPk(turtleId);
    if (!turtle) {
        return response.status(404).json({ error: 'Turtle not found.' });
    }
    await Turtle.update(
        { favorite_pizza_id: pizzaId },
        { where: { id: turtleId } }
    );
    console.log('Первая любимая пицца успешно обновлена');
    const updatedObject = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });
    response.json(updatedObject);
}

async function bindSecondFavoritePizza(request, response) {
    let turtleId = parseInt(request.body.id);
    let pizzaId = parseInt(request.body.second_favorite_pizza_id);
    const turtle = await Turtle.findByPk(turtleId);
    if (!turtle) {
        return response.status(404).json({ error: 'Turtle not found.' });
    }
    await Turtle.update(
        { second_favorite_pizza_id: pizzaId },
        { where: { id: turtleId } }
    );
    console.log('Вторая любимая пицца успешно обновлена');
    const updatedObject = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });
    response.json(updatedObject);
}

async function turtleUnbindFavoritePizza(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ favorite_pizza_id: null });
    response.json(turtle);
}

async function turtleUnbindSecondFavoritePizza(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ second_favorite_pizza_id: null });
    response.json(turtle);
}

async function turtleBindWeapon(request, response) {
    let turtleId = parseInt(request.body.id);
    let weaponId = parseInt(request.body.weapon_id);
    const turtle = await Turtle.findByPk(turtleId);
    if (!turtle) {
        return response.status(404).json({ error: 'Turtle not found.' });
    }
    await Turtle.update(
        { weapon_id: weaponId },
        { where: { id: turtleId } }
    );
    console.log('Оружие установлено.');
    const updatedObject = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });
    response.json(updatedObject);
}

async function turtleUnbindWeapon(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ weapon_id: null });
    response.json(turtle);
}




async function getWeapons(request, response) {
    const { dps, n } = request.query;

    let whereCondition = {};

    if (dps !== undefined && n !== undefined) {
        const nValue = parseFloat(n);
        if (isNaN(nValue)) {
            return response.status(400).json({ error: 'Parameter n must be a number.' });
        }

        switch (dps) {
            case 'gt':
                whereCondition.dps = { [Sequelize.Op.gt]: nValue };
                break;
            case 'lt':
                whereCondition.dps = { [Sequelize.Op.lt]: nValue };
                break;
            default:
                return response.json({ error: 'Parameter dps must be "gt" or "lt".' });
        }
    }

    const weapons = await Weapon.findAll({
        where: whereCondition
    });

    if (weapons) response.json(weapons);
    else response.json({ error: 'An error occurred while fetching weapons.' });
}


async function getWeaponById(request, response) {

    const id = parseInt(request.params["id"]);

    if (isNaN(id)) {
        return response.status(400).json({ error: "Некорректный идентификатор. Требуется число." });
    }

    const weapon = await Weapon.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });

    if (weapon) response.json(weapon);
    else return response.json({ error: "Оружие с указанным идентификатором не найдено." });
}

async function postWeapon(request, response) {
    const newWeapon = request.body;
    if (!newWeapon.name || !newWeapon.dps) {
        return response.json({ error: 'Missing required fields: name and dps must be provided.' });
    }
    if (newWeapon.dps > 500) {
        return response.json({ error: "dps is too high" });
    }
    else {
        Weapon.create(newWeapon);
        return response.json(request.body);
    }
}

async function putWeapon(request, response) {
    const putData = request.body;
    if (isNaN(putData.id)) return response.json({ error: 'Parameter id must be a number.' });
    if (!putData.id || !putData.name || !putData.dps) {
        return response.json({ error: 'Missing required fields: id, name, and dps must be provided.' });
    }

    if (putData.dps < 0) {
        return response.json({ error: "dps is too small" });
    }
    if (putData.dps > 500)
    {
        return response.json({ error: "dps should not be greater than 500" });
    }
    const putId = parseInt(putData.id);
    const weapon = await Weapon.findByPk(putId);
    
    if (!weapon) {
        return response.json({ error: 'Weapon not found.' });
    }

    await Weapon.update(putData, { where: { id: putId } });
    const updatedWeapon = await Weapon.findOne({ where: { id: putId } });
    return response.json(updatedWeapon);
}

async function deleteWeapon(request, response) {
    const weapon_id = parseInt(request.params["id"]);
    const weapon = await Weapon.findOne({
        where: {
            id: weapon_id
        }
    });
    if (weapon) {
        Weapon.destroy({
            where: {
                id: weapon_id
            }
        });
        return response.json(weapon);
    }
    else return response.json({ error: 'Weapon not found.' });
}




async function getPizzas(request, response) {
    const { calories, n } = request.query;

    let whereCondition = {};

    if (calories !== undefined && n !== undefined) {
        const nValue = parseFloat(n);
        if (isNaN(nValue)) {
            return response.json({ error: 'Parameter n must be a number.' });
        }

        switch (calories) {
            case 'gt':
                whereCondition.calories = { [Sequelize.Op.gt]: nValue };
                break;
            case 'lt':
                whereCondition.calories = { [Sequelize.Op.lt]: nValue };
                break;
            default:
                return response.json({ error: 'Parameter calories must be "gt" or "lt".' });
        }
    }

    const pizzas = await Pizza.findAll({
        where: whereCondition
    });

    if (pizzas) response.json(pizzas);
    else return response.json({ error: 'An error occurred while fetching pizzas.' });
}

async function getPizzaById(request, response) {
    const id = parseInt(request.params["id"]);

    if (isNaN(id)) {
        return response.json({ error: "Некорректный идентификатор. Требуется число." });
    }

    const pizza = await Pizza.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });

    if (pizza) response.json(pizza);
    else return response.json({ error: "Пицца с указанным идентификатором не найдено." });

}

async function postPizza(request, response) {
    const newPizza = request.body;
    if (!newPizza.name || !newPizza.calories) {
        return response.json({ error: 'Missing required fields: name and calories must be provided.' });
    }
    if (newPizza.calories > 2000) {
        return response.json({ error: "Calories are too high" });
    }
    else {
        Pizza.create(newPizza);
        return response.json(request.body);
    }
}

async function putPizza(request, response) {
    const putData = request.body;
    if (isNaN(putData.id)) return response.json({ error: 'Parameter id must be a number.' });
    if (!putData.id || !putData.name || !putData.calories) {
        return response.json({ error: 'Missing required fields: id, name, and calories must be provided.' });
    }

    if (putData.calories < 0) {
        return response.json({ error: "Calories are too small" });
    }
    if (putData.calories > 2000)
    {
        return response.json({ error: "Calories should not be greater than 2000" });
    }
    const putId = parseInt(putData.id);
    const pizza = await Pizza.findByPk(putId);
    
    if (!pizza) {
        return response.json({ error: 'Weapon not found.' });
    }

    await Pizza.update(putData, { where: { id: putId } });
    const updatedPizza = await Pizza.findOne({ where: { id: putId } });
    return response.json(updatedPizza);
}

async function deletePizza(request, response) {
    const pizza_id = parseInt(request.params["id"]);
    const pizza = await Pizza.findOne({
        where: {
            id: pizza_id
        }
    });
    if (pizza) {
        Pizza.destroy({
            where: {
                id: pizza_id
            }
        });
        return response.json(pizza);
    }
    else return response.json({ error: 'Pizza not found.' });
}


async function getUpload(request, response) {
    response.sendFile(__dirname + "/html/upload.html");
}

async function postUpload(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: request.body.id
        }
    });
    if (turtle === null) {
        return response.sendStatus(400);
    }

    const image = request.files.image;
    if (!image) {
        return response.sendStatus(404);
    }
    const imagePath = __dirname + `\\images\\turtle_${request.body.id}.png`;
    image.mv(imagePath);
    await Turtle.update({ image: "file:///" + imagePath }, { 
        where: { 
            id: request.body.id
        } 
    });
    response.sendStatus(200);
}


async function putSuperfat(request, response) {
    const fatPizzas = await Pizza.findAll({
        where: {
            calories: {
                [Op.gt]: 1500
            }
        }
    });
    fatPizzas.forEach((pizza) => {
        const pizzaName = pizza.name;
        pizza.update({ name: pizzaName + " SUPER FAT!"});
    });
    response.json(fatPizzas);
}
