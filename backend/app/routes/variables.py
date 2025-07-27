from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.models.schemas import VariableIn
from app.utils.db import get_db
from app.routes.auth import get_current_user

router = APIRouter()

# 📌 Crear una variable
@router.post("/variables")
async def agregar_variable(
    variable: VariableIn,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    nueva_variable = {
        "device_id": variable.device_id,
        "variable_name": variable.variable_name,
        "unit": variable.unit,
        "description": variable.description,
        "sampling_ms": variable.sampling_ms,
        "username": current_user["username"]
    }

    # Validación opcional: evitar duplicados
    existe = await db["variables"].find_one({
        "device_id": variable.device_id,
        "variable_name": variable.variable_name,
        "username": current_user["username"]
    })
    if existe:
        raise HTTPException(status_code=400, detail="Ya existe una variable con ese nombre para ese dispositivo")

    resultado = await db["variables"].insert_one(nueva_variable)
    nueva_variable["_id"] = str(resultado.inserted_id)
    return nueva_variable

# 📌 Listar variables por usuario
@router.get("/variables")
async def listar_variables(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    cursor = db["variables"].find({"username": current_user["username"]})
    variables = []
    async for variable in cursor:
        variable["_id"] = str(variable["_id"])
        variables.append(variable)
    return variables

# 📌 Eliminar variable por ID
@router.delete("/variables/{id}")
async def eliminar_variable(
    id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    resultado = await db["variables"].delete_one({
        "_id": ObjectId(id),
        "username": current_user["username"]
    })
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Variable no encontrada o no autorizada")
    return {"message": "Variable eliminada correctamente"}
