import {
    GET_ALL_DOGS,
    GET_ALL_TEMPERAMENT,
    GET_DESCRIPTION,
    GET_CLEAN,
    GET_DOGS_FOR_NAME,
    DELETE_DOG,
    ADD_FAV,
    DELETE_FAV,
    FILTER_TEMPERAMENT,
    ORDER_BY_NAME,
    ORDER_BY_WEIGHT,
    FILTER_CREATED,
    SET_LOADING,
    ERROR
} from "../action-types/index";
import axios from "axios";

//Obtener

//Action para obtener datos desde el back el cual esta corriendo en el puerto 3001
export const getAllDogs = () => {
    //obtener todos los perros en /dogs por medio de un get
    return (dispatch) => {
        axios.get("/dogs") //trae todos los perros
        .then(response => {
            dispatch({
                type: GET_ALL_DOGS,
                payload: response.data
            });
        })
        .catch(
            error => {
                dispatch({
                    type: ERROR,
                });
            }
        );
    }
}

// con async await
// export function getDogs() {
//     return async function(dispatch) {
//         var json = await axios.get("/dogs");
//         return dispatch({
//             type: GET_ALL_DOGS,
//             payload: json.data
//         });
//     }
// }

export const getAllTemperament = () => {
    //Obtengo todos los temepramentos de mi back
    return (dispatch) => {
        axios.get("/temperaments") //trae todos los temperamentos
        .then(response => { //mapeo todos los datos de la api
            dispatch({
                type: GET_ALL_TEMPERAMENT,
                payload: response.data
            }) //dispatcheo el array de temperamentos
        })
    }
}

export const getDescription = (id) => {
    //Enviar el id al reducer para crear la seccion de Description
    return async function (dispatch) {
        try {
            const json = await axios.get(`/dogs/${id}`);
            return dispatch ({
                type: GET_DESCRIPTION,
                payload: json.data
            })
        } catch (error) {
            return dispatch ({
                type: ERROR,
            })
        }
    }
}

export const getDogsForName = (name) => {
    //Obtener todos los perros que coincidan con el nombre que pasamos por parametro
    try {
        return {
            type: GET_DOGS_FOR_NAME,
            payload: name
        }
    } catch (error) {
        alert("Error al obtener la descripcion")
    }
}

export const postDog = (data) => {
    return async function (dispatch) {
        try {
            const res = await axios.post("/dogs", data);
            return res;
        } catch (error) {
            return dispatch ({
                type: ERROR,
            })
        }
    }
};

export const deleteDog = (id) => {
    return async function (dispatch) {
        try {
            await axios.delete(`/deleted/${id}`);
            return dispatch({
                type: DELETE_DOG,
            });
        } catch (error) {
            return dispatch ({
                type: ERROR,
            });
        }
    };
};

export const addFav = (payload) => {
    return {
        type: ADD_FAV,
        payload
    };
}

export const deleteFav = (id) => {
    return {
        type: DELETE_FAV,
        payload: id
    }
};

// Utils

export function setLoading () {
    return {
        type: SET_LOADING,
    };
};
export function setError () {
    return {
        type: ERROR,
    };
};
export function getClean () {
    return {
        type: GET_CLEAN,
        payload: []
    }
}

//Filters

export const filterTemperament = (temperament) => {
    return {
        type: FILTER_TEMPERAMENT,
        payload: temperament,
    }
}

export function orderByName(payload) {
    return {
        type: ORDER_BY_NAME,
        payload: payload,
    }
}

export function orderByWeight(payload){
    return {
        type: ORDER_BY_WEIGHT,
        payload
    }
}

export function filterCreated(payload){
    return {
        type: FILTER_CREATED,
        payload
    }
}