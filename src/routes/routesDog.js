const express = require("express");
const dogs = express.Router();
const { Temperament, Dog } = require("../db");

const { getAllDogs } = require("../controllers/dogControllers");
const { default: axios } = require("axios");

dogs.use(express.json());

dogs.get("/dogs", async (req, res) => {
  const name = req.query.name;
  try {
    let dogsTotal = await getAllDogs();
    if (name) {
      let dogName = await dogsTotal.filter((dog) =>
        dog.name.toLowerCase().includes(name.toLowerCase())
      );
      dogName.length
        ? res.status(200).send(dogName)
        : res
            .status(404)
            .send("No encuentro el perro con el nombre que buscas");
    } else {
      res.status(200).json(dogsTotal);
    }
  } catch (error) {
    res.status(404).json("No hay ningún perro con este nombre");
  }
});

dogs.post("/dogs", async (req, res) => {
  var {
    name,
    height_min,
    height_max,
    weight_min,
    weight_max,
    life_span,
    temperament,
    image,
  } = req.body;

  if (!image) {
    try {
      image = await (
        await axios.get("https://dog.ceo/api/breeds/image/random")
      ).data.message;
    } catch (error) {
      console.log(error);
    }
  }

  if (
    name &&
    height_min &&
    height_max &&
    weight_min &&
    weight_max &&
    temperament &&
    image
  ) {
    const createDog = await Dog.create({
      name: name,
      height_min: parseInt(height_min),
      height_max: parseInt(height_max),
      weight_min: parseInt(weight_min),
      weight_max: parseInt(weight_max),
      life_span: life_span,
      image: image || "https://dog.ceo/api/breeds/image/random",
    });
    temperament.map(async (el) => {
      const findTemp = await Temperament.findAll({
        where: { name: el },
      });
      createDog.addTemperament(findTemp);
    });
    res.status(200).send(createDog);
  } else {
    res.status(404).send("Faltan los datos necesarios para continuar");
  }
});

dogs.get("/dogs/:idRaza", async (req, res) => {
  try {
    const { idRaza } = req.params;
    const allDogs = await getAllDogs();
    if (!idRaza) {
      res.status(404).json("No se pudo encontrar el nombre en Base de Datos");
    } else {
      const dog = allDogs.find((dogui) => dogui.id.toString() === idRaza);
      res.status(200).json(dog);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = dogs;
