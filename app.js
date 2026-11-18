/* LlaveCRM - autenticacion de demostracion y fachada de datos relacionales.
   Persistencia local en navegador; no sustituye un backend seguro de produccion. */
(function () {
  'use strict';
  const KEYS = { users: 'llavecrm_users_v1', session: 'llavecrm_session_v1' };
  const demoUsers = [
    { name: 'Carlos Gómez', email: 'cgomez@madcons.co', password: '12345', role: 'Asesor Senior' },
    { name: 'Laura Méndez', email: 'lmendez@madcons.co', password: '12345', role: 'Asesor Comercial' },
    { name: 'Andrés Felipe Rojas', email: 'arojas@madcons.co', password: '12345', role: 'Director Comercial' }
  ];
  const read = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v===null?fallback:v; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  function init(){ if(!localStorage.getItem(KEYS.users)) write(KEYS.users,demoUsers); if(window.LlaveCRMDB) LlaveCRMDB.inicializarBD(); }
  function currentUser(){ return read(KEYS.session,null); }
  function requireAuth(){ if(!currentUser()){window.location.replace('login.html?next=dashboard.html');return false;} return true; }
  function logout(){localStorage.removeItem(KEYS.session);window.location.href='login.html';}
  function register(name,email,password){init();const users=read(KEYS.users,[]);email=email.trim().toLowerCase();if(!name.trim()||!email||password.length<5)throw new Error('Complete los datos. La contraseña debe tener al menos 5 caracteres.');if(users.some(u=>u.email.toLowerCase()===email))throw new Error('Ya existe una cuenta con ese correo.');users.push({name:name.trim(),email,password,role:'Asesor Comercial'});write(KEYS.users,users);}
  function login(email,password){init();const user=read(KEYS.users,[]).find(u=>u.email.toLowerCase()===email.trim().toLowerCase()&&u.password===password);if(!user)throw new Error('Correo o contraseña incorrectos.');write(KEYS.session,{name:user.name,email:user.email,role:user.role,loggedAt:new Date().toISOString()});}
  function statusToUI(s){return s==='Caliente'?'Alta prioridad':s==='Cierre'?'Cierre próximo':'En seguimiento';}
  function statusToDB(s){return s==='Alta prioridad'?'Caliente':s==='Cierre próximo'?'Cierre':'En Seguimiento';}
  function getClients(){init();return LlaveCRMDB.obtenerClientesBD().map(c=>({id:c.idCliente,name:c.nombre,phone:c.telefono,project:c.proyecto,budget:c.presupuesto,status:statusToUI(c.estado),email:c.correo,advisor:c.asesor,bank:c.banco,unit:c.unidad,credit:c.montoCredito}));}
  function addClient(c){const db=LlaveCRMDB.obtenerBD();const asesor=db.asesores.find(a=>a.correo===currentUser()?.email)||db.asesores[0];const correo=c.email||('cliente.'+Date.now()+'@llavecrm.local');return LlaveCRMDB.registrarClienteBD({nombre:c.name,telefono:c.phone,correo,presupuesto:c.budget,estado:statusToDB(c.status),proyecto:c.project,idAsesor:asesor.idAsesor,idBanco:1});}
  function updateClient(id,c){const db=LlaveCRMDB.obtenerBD();const cl=db.clientes.find(x=>x.idCliente===Number(id));if(!cl)throw new Error('No se encontro el cliente.');Object.assign(cl,{nombre:c.name,telefono:c.phone,presupuestoEstimado:Number(c.budget),estadoComercial:statusToDB(c.status)});const compra=db.compras.find(x=>x.idCliente===Number(id));if(compra){compra.valorTotal=Number(c.budget);compra.valorCuotaInicial=Math.round(compra.valorTotal*.30);compra.montoCredito=compra.valorTotal-compra.valorCuotaInicial;}LlaveCRMDB.guardarBD(db);return cl;}
  function deleteClient(id){const db=LlaveCRMDB.obtenerBD();db.clientes=db.clientes.filter(x=>x.idCliente!==Number(id));const compras=db.compras.filter(x=>x.idCliente===Number(id));const ids=compras.map(x=>x.idCompra);const planes=db.planesPago.filter(x=>ids.includes(x.idCompra));const pids=planes.map(x=>x.idPlanPago);db.compras=db.compras.filter(x=>x.idCliente!==Number(id));db.planesPago=db.planesPago.filter(x=>!ids.includes(x.idCompra));db.pagos=db.pagos.filter(x=>!pids.includes(x.idPlanPago));db.seguimientos=db.seguimientos.filter(x=>x.idCliente!==Number(id));db.sugerenciasIA=db.sugerenciasIA.filter(x=>x.idCliente!==Number(id));LlaveCRMDB.guardarBD(db);}
  function money(v){return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(v)||0);}
  init();window.LlaveCRM={init,currentUser,requireAuth,logout,register,login,getClients,addClient,updateClient,deleteClient,money};
})();
