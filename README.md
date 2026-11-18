# LlaveCRM - MVP de demostracion

## Requisitos
- Navegador moderno (Chrome, Edge o Firefox).
- Python 3 para iniciar un servidor local sencillo (o Live Server en VS Code).

## Ejecucion
1. Descomprima el proyecto.
2. Abra una terminal dentro de la carpeta `ProyectoLlaveCRM`.
3. Ejecute `python -m http.server 8000`.
4. Abra `http://localhost:8000` en el navegador.

No se recomienda abrir las paginas mediante `file://`; utilice un servidor local para que las rutas y el almacenamiento funcionen de forma consistente.

## Acceso de demostracion
- Correo: `julian@casa.com`
- Contrasena: `12345`
- Tambien puede registrar cuentas nuevas desde la pantalla de ingreso.

## Funcionalidades verificables
- Portal publico y catalogo de proyectos.
- Registro e inicio de sesion de asesores en el navegador.
- Proteccion de acceso al dashboard y cierre de sesion.
- Listado inicial de cinco prospectos.
- Creacion, edicion y eliminacion de clientes.
- Busqueda por texto y filtro por proyecto.
- Exportacion de clientes a CSV compatible con Excel.
- Simulacion de cuota fija, validacion de monto y precarga desde el dashboard.
- Persistencia local de cuentas, sesion y clientes usando `localStorage`.

## Importante: alcance y seguridad
Esta version es un MVP de demostracion frontend. Los datos permanecen en el almacenamiento local del navegador donde se ejecuta el sistema; no se sincronizan entre equipos ni usuarios. La autenticacion guarda credenciales en `localStorage`, por lo que **no es adecuada para produccion**. Para despliegue empresarial se requiere backend, HTTPS, contrasenas con hash seguro, autorizacion en servidor y base de datos central.

El simulador usa una tasa referencial fija del 1.1% mensual y genera una estimacion informativa; no representa una oferta bancaria ni incluye seguros, subsidios, gastos u otras condiciones crediticias.
