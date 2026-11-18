# Modelo relacional de LlaveCRM

La persistencia del MVP se implementa en `js/bd.js` mediante un adaptador relacional en memoria sincronizado con `localStorage`, bajo la clave `LlaveCRM_DB_Relacional`. No es un servidor SQL ni una base de datos compartida entre equipos.

## Entidades y registros iniciales

| Tabla | Registros | PK | FK principales |
|---|---:|---|---|
| proyectos | 4 | idProyecto | — |
| asesores | 3 | idAsesor | — |
| bancos | 5 | idBanco | — |
| inmuebles | 31 | idInmueble | idProyecto |
| clientes | 31 | idCliente | idAsesor |
| compras | 31 | idCompra | idCliente, idInmueble, idBanco |
| planesPago | 31 | idPlanPago | idCompra |
| pagos | 10 | idPago | idPlanPago |
| seguimientos | 15 | idSeguimiento | idCliente, idAsesor |
| sugerenciasIA | 31 | idSugerencia | idCliente |

## Relaciones

- `proyectos 1:N inmuebles`.
- `asesores 1:N clientes`.
- `clientes 1:N compras` (el conjunto inicial tiene una compra por cliente).
- `inmuebles 1:N compras` (cada compra referencia un inmueble).
- `bancos 1:N compras`.
- `compras 1:N planesPago` (el conjunto inicial crea un plan por compra).
- `planesPago 1:N pagos`.
- `clientes 1:N seguimientos` y `asesores 1:N seguimientos`.
- `clientes 1:N sugerenciasIA`.

## Operaciones

`obtenerBD()` lee el esquema completo; `guardarBD(db)` persiste los cambios; `obtenerClientesBD()` realiza cruces entre clientes, compras, inmuebles, bancos, asesores y sugerencias; `registrarClienteBD(datos)` crea cliente, compra, plan de pago y sugerencia. El CRUD del dashboard actualiza estas tablas relacionadas.

## Inicialización y reinicio

La primera carga crea los datos semilla. Para reconstruir los datos de demostración desde la consola del navegador se puede ejecutar `LlaveCRMDB.reiniciarBD()`. Esto elimina los cambios locales actuales.

## Advertencia de despliegue

`localStorage` pertenece al navegador y al origen del sitio. No ofrece concurrencia, control de acceso robusto, cifrado de credenciales ni sincronización entre asesores. Para producción se requiere API/backend y una base de datos servidor (por ejemplo PostgreSQL o MySQL), con contraseñas almacenadas mediante hash seguro.


## Portafolio oficial de proyectos Madcons
La base de datos utiliza únicamente los tres proyectos presentes en los recursos y vistas del proyecto: **Santa Catalina**, **Llanos de Calibío** y **Okavango**. Se eliminaron los nombres ficticios Mirador de la Sierra, Bosques del Norte, Altos de Morinda y Reserva del Cauca. Los valores "desde" se tomaron de las tarjetas del portal original: Santa Catalina $175.000.000 COP, Llanos de Calibío $135.000.000 COP y Okavango $210.000.000 COP. No se asignan áreas ni características de unidades que no estén documentadas.
