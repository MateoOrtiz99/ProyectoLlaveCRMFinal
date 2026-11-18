/**

 * LlaveCRM - Motor de Persistencia Relacional (js/bd.js)

 * Mapeo directo del Diagrama de Clases UML a modelo relacional en memoria + localStorage

 */



const DB_KEY = 'LlaveCRM_DB_Relacional_v2';



// 1. CONSTRUCCIÓN DE LA BASE DE DATOS RELACIONAL (31 REGISTROS REGIONALES)

function construirBDRelacional() {

    // Entidad: Asesor

    const asesores = [

        { idAsesor: 1, nombre: "Carlos Gómez", correo: "cgomez@madcons.co", passwordHash: "hash_123", rol: "Asesor Senior" },

        { idAsesor: 2, nombre: "Laura Méndez", correo: "lmendez@madcons.co", passwordHash: "hash_456", rol: "Asesor Comercial" },

        { idAsesor: 3, nombre: "Andrés Felipe Rojas", correo: "arojas@madcons.co", passwordHash: "hash_789", rol: "Director Comercial" }

    ];



    // Entidad: Banco

    const bancos = [

        { idBanco: 1, nombreBanco: "Bancolombia" },

        { idBanco: 2, nombreBanco: "Davivienda" },

        { idBanco: 3, nombreBanco: "Banco de Bogotá" },

        { idBanco: 4, nombreBanco: "BBVA Colombia" },

        { idBanco: 5, nombreBanco: "Fondo Nacional del Ahorro (FNA)" }

    ];



    // Entidad: Inmueble (Proyectos Madcons en Popayán / Cauca)

    const proyectosMadcons = [
        { idProyecto: 101, nombreProyecto: "Santa Catalina", unidadBase: "Apartamento", precioDesde: 175000000, imagen: "imagenes/santaCatalina.jpg" },
        { idProyecto: 102, nombreProyecto: "Llanos de Calibío", unidadBase: "Unidad residencial", precioDesde: 135000000, imagen: "imagenes/llanosdeCalibio.jpeg" },
        { idProyecto: 103, nombreProyecto: "Okavango", unidadBase: "Unidad residencial", precioDesde: 210000000, imagen: "imagenes/okavango.jpeg" }
    ];



    const inmuebles = [];

    for (let i = 1; i <= 31; i++) {

        const proy = proyectosMadcons[(i - 1) % proyectosMadcons.length];

        inmuebles.push({

            idInmueble: 1000 + i,

            numeroUnidad: `${proy.unidadBase} ${100 + i}`,

            areaM2: null,

            precioLista: proy.precioDesde,

            estadoDisponibilidad: i <= 25 ? "Separado" : "Disponible",

            idProyecto: proy.idProyecto,

            nombreProyecto: proy.nombreProyecto // Desnormalización controlada para consulta rápida

        });

    }



    // Listado base de 31 clientes regionales

    const nombresClientes = [

        "Julián Andrés Caicedo", "María Fernanda Muñoz", "Diego Fernando Hurtado", "Paola Andrea Gómez",

        "Camilo Ernesto Velasco", "Luisa Fernanda Solarte", "Jorge Eliecer Dorado", "Sandra Milena Hoyos",

        "Héctor Fabio Mosquera", "Diana Carolina Paz", "Sebastián Castro Ruiz", "Natalia Andrea Cerón",

        "Óscar Eduardo Samboní", "Valentina Torres López", "Juan Carlos Orozco", "Ángela María Bolaños",

        "Mauricio Alejandro Pino", "Tatiana Isabel Valencia", "Ricardo Andrés Burbano", "Claudia Patricia Realpe",

        "Felipe Santiago Chicangana", "Yuliana Andrea Navia", "Cristian Camiloera Erazo", "Mónica Liliana Quintero",

        "Gustavo Adolfo Ledezma", "Daniela Sofía Guevara", "Álvaro José Imbachí", "Karen Lorena Sánchez",

        "Hernán Darío Zúñiga", "Adriana Lucía Ordóñez", "Edwin Alexander Mera"

    ];



    const estadosComerciales = ["Caliente", "En Seguimiento", "Cierre"];



    // Entidad: Cliente

    const clientes = nombresClientes.map((nombre, idx) => {

        const idCliente = idx + 1;

        const correoSlug = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');

        return {

            idCliente: idCliente,

            nombre: nombre,

            telefono: `31${idx % 9}${1000000 + idx * 34567}`,

            correo: `${correoSlug}@gmail.com`,

            presupuestoEstimado: inmuebles[idx].precioLista,

            estadoComercial: estadosComerciales[idx % estadosComerciales.length],

            idAsesor: (idx % asesores.length) + 1

        };

    });



    // Entidad: Compra (Tabla pivote Cliente - Inmueble - Banco)

    const compras = clientes.map((cliente, idx) => {

        const inmueble = inmuebles[idx];

        const valorTotal = inmueble.precioLista;

        const valorCuotaInicial = Math.round(valorTotal * 0.30);

        const montoCredito = valorTotal - valorCuotaInicial;



        return {

            idCompra: 5000 + cliente.idCliente,

            fechaNegocio: `2026-10-${String((idx % 28) + 1).padStart(2, '0')}`,

            valorTotal: valorTotal,

            valorCuotaInicial: valorCuotaInicial,

            plazoCuotasMeses: 180, // 15 años

            manejaCredito: true,

            montoCredito: montoCredito,

            estadoCompra: cliente.estadoComercial === "Cierre" ? "Aprobada" : "En Proceso",

            idCliente: cliente.idCliente,

            idInmueble: inmueble.idInmueble,

            idBanco: (idx % bancos.length) + 1

        };

    });



    // Entidad: PlanPago (Composición de Compra)

    const planesPago = compras.map((compra) => ({

        idPlanPago: 8000 + compra.idCliente,

        numeroCuota: 1,

        fechaProgramada: "2026-12-05",

        montoProgramado: Math.round(compra.valorCuotaInicial / 12),

        estadoPago: compra.estadoCompra === "Aprobada" ? "Al Día" : "Pendiente",

        idCompra: compra.idCompra

    }));



    // Entidad: Pago

    const pagos = planesPago

        .filter(p => p.estadoPago === "Al Día")

        .map((plan, idx) => ({

            idPago: 9000 + idx + 1,

            fechaPago: "2026-11-10",

            montoPagado: plan.montoProgramado,

            numeroComprobante: `REC-MAD-${10450 + idx}`,

            idPlanPago: plan.idPlanPago

        }));



    // Entidad: Seguimiento

    const seguimientos = clientes.slice(0, 15).map((c, idx) => ({

        idSeguimiento: 300 + idx + 1,

        fechaContacto: "2026-11-15 10:30",

        tipoContacto: idx % 2 === 0 ? "Llamada Telefónica" : "Visita Sala de Ventas",

        observaciones: `Cliente interesado en ${inmuebles[idx].nombreProyecto}. Se envió proyección financiera.`,

        idCliente: c.idCliente,

        idAsesor: c.idAsesor

    }));



    // Entidad: SugerenciaIA (Agregación sobre Cliente)

    const sugerenciasIA = clientes.map((c, idx) => ({

        idSugerencia: 700 + c.idCliente,

        fechaGeneracion: "2026-11-18 08:00",

        tipoRecomendacion: c.estadoComercial === "Caliente" ? "Cierre Prioritario" : "Simulación Bancaria",

        contenidoSugerencia: c.estadoComercial === "Caliente"

            ? "Ofrecer bono de descuento del 2% en cuota inicial para cierre esta semana."

            : "Compartir comparativa de tasas con Bancolombia y FNA.",

        estado: "Activa",

        idCliente: c.idCliente

    }));



    return {

        proyectos: proyectosMadcons,

        asesores,

        bancos,

        inmuebles,

        clientes,

        compras,

        planesPago,

        pagos,

        seguimientos,

        sugerenciasIA

    };

}



// 2. ADAPTADOR DE CONEXIÓN Y SINCRONIZACIÓN LOCALSTORAGE

function inicializarBD() {

    const bdGuardada = localStorage.getItem(DB_KEY);

    if (!bdGuardada) {

        const bdInicial = construirBDRelacional();

        localStorage.setItem(DB_KEY, JSON.stringify(bdInicial));

    }

}



function obtenerBD() {

    inicializarBD();

    return JSON.parse(localStorage.getItem(DB_KEY));

}



function guardarBD(db) {

    localStorage.setItem(DB_KEY, JSON.stringify(db));

}



// Función para reiniciar la BD si modificas los datos base arriba

function reiniciarBD() {

    localStorage.removeItem(DB_KEY);

    inicializarBD();

    return obtenerBD();

}



// 3. CONSULTAS RELACIONALES (JOIN EN MEMORIA PARA EL DASHBOARD)

function obtenerClientesBD() {

    const db = obtenerBD();

    return db.clientes.map(cliente => {

        const compra = db.compras.find(c => c.idCliente === cliente.idCliente) || {};

        const inmueble = db.inmuebles.find(i => i.idInmueble === compra.idInmueble) || {};

        const banco = db.bancos.find(b => b.idBanco === compra.idBanco) || {};

        const asesor = db.asesores.find(a => a.idAsesor === cliente.idAsesor) || {};

        const sugerencia = db.sugerenciasIA.find(s => s.idCliente === cliente.idCliente) || {};



        return {

            idCliente: cliente.idCliente,

            nombre: cliente.nombre,

            telefono: cliente.telefono,

            correo: cliente.correo,

            presupuesto: cliente.presupuestoEstimado,

            estado: cliente.estadoComercial,

            proyecto: inmueble.nombreProyecto || "Por definir",

            unidad: inmueble.numeroUnidad || "N/A",

            valorInmueble: compra.valorTotal || cliente.presupuestoEstimado,

            cuotaInicial: compra.valorCuotaInicial || 0,

            montoCredito: compra.montoCredito || 0,

            banco: banco.nombreBanco || "Recursos Propios",

            asesor: asesor.nombre || "Sin asignar",

            sugerenciaIA: sugerencia.contenidoSugerencia || ""

        };

    });

}



// 4. OPERACIONES CRUD (REGISTRO DE NUEVO CLIENTE + COMPRA ASOCIADA)

function registrarClienteBD(datosNuevoCliente) {

    const db = obtenerBD();

    const nuevoIdCliente = db.clientes.length > 0 

        ? Math.max(...db.clientes.map(c => c.idCliente)) + 1 

        : 1;



    const nuevoCliente = {

        idCliente: nuevoIdCliente,

        nombre: datosNuevoCliente.nombre,

        telefono: datosNuevoCliente.telefono,

        correo: datosNuevoCliente.correo,

        presupuestoEstimado: Number(datosNuevoCliente.presupuesto),

        estadoComercial: datosNuevoCliente.estado || "Caliente",

        idAsesor: Number(datosNuevoCliente.idAsesor) || 1

    };



    db.clientes.unshift(nuevoCliente);



    // Vincular inmueble y compra automáticamente

    const inmuebleDisponible = db.inmuebles.find(i => i.nombreProyecto === datosNuevoCliente.proyecto) || db.inmuebles[0];

    const valorTotal = Number(datosNuevoCliente.presupuesto) || inmuebleDisponible.precioLista;



    const nuevoIdCompra = 5000 + nuevoIdCliente;
    db.compras.push({
        idCompra: nuevoIdCompra,
        fechaNegocio: new Date().toISOString().split('T')[0],
        valorTotal: valorTotal,
        valorCuotaInicial: Math.round(valorTotal * 0.30),
        plazoCuotasMeses: 180,
        manejaCredito: true,
        montoCredito: Math.round(valorTotal * 0.70),
        estadoCompra: "En Proceso",
        idCliente: nuevoIdCliente,
        idInmueble: inmuebleDisponible.idInmueble,
        idBanco: Number(datosNuevoCliente.idBanco) || 1
    });

    const nuevoIdPlan = 8000 + nuevoIdCliente;
    db.planesPago.push({
        idPlanPago: nuevoIdPlan,
        numeroCuota: 1,
        fechaProgramada: "2026-12-05",
        montoProgramado: Math.round((valorTotal * 0.30) / 12),
        estadoPago: "Pendiente",
        idCompra: nuevoIdCompra
    });
    db.sugerenciasIA.push({
        idSugerencia: 700 + nuevoIdCliente,
        fechaGeneracion: new Date().toISOString(),
        tipoRecomendacion: "Seguimiento comercial",
        contenidoSugerencia: "Contactar al prospecto para confirmar su interés y capacidad de compra.",
        estado: "Activa",
        idCliente: nuevoIdCliente
    });

    guardarBD(db);

    return nuevoCliente;

}



// Inicialización automática al cargar el script

inicializarBD();  
// API publica para la aplicacion web.
window.LlaveCRMDB = { DB_KEY, construirBDRelacional, inicializarBD, obtenerBD, guardarBD, reiniciarBD, obtenerClientesBD, registrarClienteBD };
