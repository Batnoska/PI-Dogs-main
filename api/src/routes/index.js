const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios")
const { API_KEY } = process.env
const { Temperament, Dog } = require("../db");
  
const router = Router();

const api = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const getApiInfo = async () => {  //funciones controladoras luego se llaman en las rutas
    const apiUrl=  await axios.get(api); //trae la info de la api
    //console.log(apiUrl) 
    const apiInfo = await apiUrl.data.map(p => { 
        let weightMin = parseInt(p.weight.metric.slice(0, 2).trim()); 
        let weightMax = parseInt(p.weight.metric.slice(4).trim());
        const heightMin = parseInt(p.height.metric.slice(0, 2).trim()); 
        const heightMax = parseInt(p.height.metric.slice(4).trim());
        const life_spanMin = parseInt(p.life_span.slice(0, 2).trim());
        const life_spanMax = parseInt(p.life_span.slice(4).trim()); 
        
        
    if (weightMin && weightMax) {
        weightMin = weightMin;
        weightMax = weightMax;
    } else if (weightMin && !weightMax) {
        weightMin = weightMin;
        weightMax = `${weightMin+2}`;
    } else if (!weightMin && weightMax) {
        weightMin = `${weightMax-2}`;
        weightMax = weightMax;
    } else {
        if (p.name === "Smooth Fox Terrier") {
            weightMin = 6;
            weightMax = 9;
        } else {
            weightMin = 20;
            weightMax = 30;
        }
    }  
        return {
            id: p.id,
            name: p.name,
            heightMin:heightMin,
            heightMax:heightMax,
            weightMin: weightMin,
            weightMax: weightMax,
            life_spanMin:life_spanMin,
            life_spanMax:life_spanMax,
            temperament:p.temperament,
            createdInBd: false,
            image:p.image.url,
        }   
    })
    return apiInfo
}

const getDbInfo = async () => {
    try {
        const dogs = await Dog.findAll({
            include: Temperament,
        });
        const info = dogs.map(dog => {
            let temp = dog.temperaments.map(te => te.name);
            let aux = temp.join(", ");

            return {
                id: dog.id,
                name: dog.name,
                heightMin: parseInt(dog.heightMin),
                heightMax: parseInt(dog.heightMax),
                weightMin: parseInt(dog.weightMin),
                weightMax: parseInt(dog.weightMax),
                life_spanMin: parseInt(dog.life_spanMin),
                life_spanMax: parseInt(dog.life_spanMax),
                temperament: aux,
                createdInDb: true,
                image: dog.image
            };
        })

        return info
    } catch (error) {
        console.log(error);
    }
}

const getAllDogs = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const totalInfo = apiInfo.concat(dbInfo)
    return totalInfo
}

router.get("/dogs", async (req, res) => {
    const name = req.query.name
    let dogsTotales = await getAllDogs()
    if (name) {
        let dogsName = await dogsTotales.filter(ele => ele.name.toLowerCase().includes(name.toLowerCase()))
        dogsName.length ?
        res.status(200).send(dogsName):
        res.status(404).send("Nombre solicitado no disponible");
    } else {
        res.status(200).send(dogsTotales)
    }
})

router.get("/temperaments", async(req, res) => {
    const tempApi = await axios(api);
    const tempDB = tempApi.data
        .map((t) => t.temperament) //creo muchos arreglos con las palabras
        .toString() // las convierto a string
        .split(",") // las separo por comas
        .map((t) => t.trim()) // las quito los espacios
        .filter((t) => t.length > 1) // las quito las palabras que tienen una longitud de 1
    const filtro = tempDB.filter((t) => t) // por cada temperamento lo guardo separado
    let tempFilt = [...new Set(filtro)]; // hago un nuevo array con los temperamentos que tenia guardados y los nuevos, si se repiten se quitan

    tempFilt.forEach((t) => {
        // se fija si el temperamento esta, si esta no hace nada, si no lo crea
        Temperament.findOrCreate({
            // se fija si el temperamento esta, si esta no hace nada, si no lo crea
            where: { name: t },
        });
    });

    const totalTemp = await Temperament.findAll();
    res.json(totalTemp);
})

router.post("/dogs", async(req, res) => {
    const { name, heightMax, heightMin, weightMax, weightMin, life_spanMax, life_spanMin, image, temperament } = req.body;
    const temperamentId = await Temperament.findOne({
        where: { name: temperament }
    });
    let dogName = await getApiInfo().then((d) => d.find((d) => d.name === name));

    if (!name || !heightMax || !weightMax || !weightMin || !temperament) {
        res.status(400).send("Faltan datos obligatorios")
    } else if (dogName) {
        res.status(404).send("El nombre del perro ya existe")
    } else if (heightMax < heightMin || weightMax < weightMin || life_spanMax < life_spanMin) {
        res.status(400).send("Los datos minimos no pueden ser mayores a los datos maximos");
    } else if (heightMax > 200 || heightMin < 0 || weightMax > 100 || weightMin < 0 || life_spanMax > 30 || life_spanMin < 0) {
        res.status(400).send("Datos invalidos");
    } else if (temperamentId === null) {
        res.status(400).send("Temperamento invalido")
    } else {
        Dog.create({
            name: name,
            heightMin: parseInt(heightMin),
            heightMax: parseInt(heightMax),
            weightMin: parseInt(weightMin),
            weightMax: parseInt(weightMax),
            life_spanMin: parseInt(life_spanMin),
            life_spanMax: parseInt(life_spanMax),
            createdInBd: true,
            image: image || "https://cdn.wallpapersafari.com/0/88/ujTDLZ.jpg"
        })
        .then(async (dog) => {
            const temp = await Temperament.findAll({
                where: { name: temperament },
            });
            await dog.addTemperament(temp);
            res.status(201).send(dog);
        }).catch(err => err)
        
        res.send("Perro creado");
    }
})

router.get("/dogs/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        const dogsTotales = await getAllDogs()

        const dog = dogsTotales.find(ele => ele.id == id);

        if (!dog) {
            res.status(404).send("El id pasado por parametro no coincide con ningun perro de nuestra base de datos")
        } else {
            res.status(200).send(dog)
        }
    } catch (error) {
        next(error)
    }
})

router.delete("/deleted/:id", async (req, res, next) => {
    const {id} = req.params;
    try {
        const dog = await Dog.findByPk(id);
        if (!dog) {
            res.status(404).send("No se encontro el perro especificado")
        } else {
            await dog.destroy();
            res.status(200).send("Perro eliminado");
        }
    } catch (error) {
        next(error);
    }
})

module.exports = router;
