document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formSimulador');
  if (!form) return;
  const montoInput = document.getElementById('monto');
  const resultadoBox = document.getElementById('resultado');
  const montoResultado = document.getElementById('montoResultado');
  const params = new URLSearchParams(window.location.search);
  const montoInicial = Number(params.get('monto'));
  if (Number.isFinite(montoInicial) && montoInicial > 0) montoInput.value = montoInicial;
  montoInput.min = '1'; montoInput.step = '1000';
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const monto = Number(montoInput.value);
    const plazoAnios = Number(document.getElementById('plazo').value);
    if (!Number.isFinite(monto) || monto <= 0 || !Number.isInteger(plazoAnios) || plazoAnios <= 0) {
      alert('Ingrese un valor de inmueble mayor que cero y seleccione un plazo valido.');
      resultadoBox.style.display = 'none';
      montoInput.focus();
      return;
    }
    const meses = plazoAnios * 12;
    // Tasa de referencia mensual fija del 1.1%; simulacion informativa, no oferta bancaria.
    const tasaMensual = 0.011;
    const cuota = monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -meses));
    if (!Number.isFinite(cuota)) { alert('No fue posible calcular la cuota. Revise los datos.'); return; }
    montoResultado.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(cuota));
    resultadoBox.style.display = 'block';
  });
});
