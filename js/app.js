let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: "Comidas",
    2: "Bebidas",
    3: "Postres"
}
const btnNuevaOrden = document.querySelector('#nueva-orden');
const btnGuardarCliente = document.querySelector('#guardar-cliente');

btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Validar Form
    const camposVacios = [mesa, hora].some( campo => campo === '');

    if(camposVacios){
        //Verificar si ya existe una alerta
        const existeAlerta = document.querySelector('.alerta');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'p-3', 'text-center', 'text-uppercase', 'border', 'border-danger', 'alerta');
            alerta.textContent = 'Todos los campos son obligatorios.';

            //insertar alerta en el HTML
            document.querySelector('.modal-body').appendChild(alerta);

            //Quitar alerta
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }

        return
    }else{
        btnNuevaOrden.setAttribute('disabled', '')
    }

    //Asignar datos del form al obj Cliente
    cliente = { ...cliente, mesa, hora }

    //Ocultar Modal
    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    mostrarSecciones();

    obtenerPlatillos();
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        //Extraer Variables
        const { id, nombre, precio, categoria } = platillo;

        //Crear el HTML del contenido de platillos
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombrePlatillo = document.createElement('div');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = nombre;

        const precioPlatillo = document.createElement('div');
        precioPlatillo.classList.add('col-md-3', 'fw-bold');
        precioPlatillo.textContent = `$${precio}`;

        const categoriaPlatillo = document.createElement('div');
        categoriaPlatillo.classList.add('col-md-3', 'fw-bold');
        categoriaPlatillo.textContent = categorias[categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${id}`;
        inputCantidad.placeholder = "0";
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        }

        const divCantidad = document.createElement('div');
        divCantidad.classList.add('col-md-2');

        divCantidad.appendChild(inputCantidad);

        row.appendChild(nombrePlatillo);
        row.appendChild(precioPlatillo);
        row.appendChild(categoriaPlatillo);
        row.appendChild(divCantidad);
        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto) {
    const { cantidad } = producto;

    //Extraer pedido actual
    let { pedido } = cliente;

    //Revisar que la cantidad sea mayor a 0
    if(cantidad > 0){
        //Comprobar si el elemento ya existe en el array pedido
        if(pedido.some(articulo => articulo.id === producto.id)){

            //El elemento ya existe, actualizar la cantidad
            const pedidoActulizado = pedido.map( articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }

                return articulo;
            });

            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActulizado];
        }else{
            //El elemento no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else{
        //Eliminar elemento del array de pedido cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    //Limpiar el HTML previo
    limpiarHTML();

    //Verificar si hay pedidos para mostrar el resumen o el mensaje de pedido vacio segun corresponda
    if( cliente.pedido.length ){
        //Mostrar el resumen
        actualizarResumen();
    }else{
        //Mostrar mensaje pedido vacío
        mensajePedidoVacio();
    }
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'mt-4');

    const divResumen = document.createElement('div');
    divResumen.classList.add('card', 'py-2', 'px-3', 'shadow');

    //Crear HTML para mostrar la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);

    //Crear HTML para mostrar la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    hora.appendChild(horaSpan);

    //Titulo heading
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        //HTML para el nombre del articulo
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreArt = document.createElement('h4');
        nombreArt.classList.add('my-4');
        nombreArt.textContent = nombre;

        //HTML para la cantidad
        const cantidadArt = document.createElement('p');
        cantidadArt.textContent = 'Cantidad: ';
        cantidadArt.classList.add('fw-bold');

        const cantidadValor = document.createElement('span');
        cantidadValor.textContent = cantidad;
        cantidadValor.classList.add('fw-normal');

        //HTML para el precio
        const precioArt = document.createElement('p');
        precioArt.textContent = 'Precio: ';
        precioArt.classList.add('fw-bold');

        const precioValor = document.createElement('span');
        precioValor.textContent = `$${precio}`;
        precioValor.classList.add('fw-normal');

        //HTML para el subtotal
        const subtotal = document.createElement('p');
        subtotal.textContent = 'Subtotal: ';
        subtotal.classList.add('fw-bold');

        const subtotalArt = document.createElement('span');
        subtotalArt.textContent = calcularSubtotal(precio, cantidad);
        subtotalArt.classList.add('fw-normal');

        //Boton eliminar articulo del resumen
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'd-flex', 'justify-content-center', 'align-items-center', 'text-right');
        btnEliminar.innerHTML = ` Eliminar
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
        `;

        //Funcion para eliminar el pedido
        btnEliminar.onclick = () =>{
            eliminarArticulo(id);
        }

        //Agregar al contenedor
        cantidadArt.appendChild(cantidadValor);
        precioArt.appendChild(precioValor);
        subtotal.appendChild(subtotalArt);


        //Agregar elementos al li
        lista.appendChild(nombreArt);
        lista.appendChild(cantidadArt);
        lista.appendChild(precioArt);
        lista.appendChild(subtotal);
        lista.appendChild(btnEliminar)
        grupo.appendChild(lista)
    })

    //Agregar los elementos creados al HTML
    divResumen.appendChild(heading);
    divResumen.appendChild(mesa);
    divResumen.appendChild(hora);
    divResumen.appendChild(grupo);

    resumen.appendChild(divResumen);

    contenido.appendChild(resumen);

    //Mostrar formulario de propinas
    formularioPropinas();


}

function calcularSubtotal(precio, cantidad){
    return `$${precio*cantidad}`;
}

function eliminarArticulo(id) {
    const { pedido } = cliente;

    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    //Limpiar el HTML previo
    limpiarHTML();

    //Verificar si hay pedidos para mostrar el resumen o el mensaje de pedido vacio segun corresponda
    if( cliente.pedido.length ){
        //Mostrar el resumen
        actualizarResumen();
    }else{
        //Mostrar mensaje pedido vacío
        mensajePedidoVacio();
    }

    //Se eliminó el articulo, resetear form a 0
    const articuloEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(articuloEliminado);
    inputEliminado.value = '';
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');

    formulario.classList.add('col-md-6', 'mt-4', 'formulario');
    const divForm = document.createElement('div');
    divForm.classList.add( 'card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input', 'btn-outline-info');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = 'Propina del 10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input', 'btn-outline-info');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = 'Propina del 25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //Radio button 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input', 'btn-outline-info');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = 'Propina del 50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    divForm.appendChild(heading);
    divForm.appendChild(radio10Div);
    divForm.appendChild(radio25Div);
    divForm.appendChild(radio50Div);
    formulario.appendChild(divForm);

    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    //Obtener el radio button seleccionado
    const propinaSeleccionada = parseInt(document.querySelector('[name="propina"]:checked').value);

    //Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += (articulo.cantidad * articulo.precio);
    });

    //Calcular propina
    const propina = (subtotal * propinaSeleccionada) / 100;

    //Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, propina, total);
}

function mostrarTotalHTML(subtotal, propina, total) {
    const formulario = document.querySelector('#resumen .formulario > div');

    //Contenedor
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-5', 'mb-0', 'text-center', 'text-info');
    subtotalParrafo.textContent = 'Subtotal consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    //Signo +
    const suma = document.createElement('p');
    suma.classList.add('fs-3', 'fw-bold', 'm-0', 'text-center', 'text-info');
    suma.textContent = '+';

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-0', 'text-center', 'text-secondary', 'text-info');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    //Separacion
    const separacion = document.createElement('hr');

    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2', 'text-center');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    //Agregar elementos al HTML
    subtotalParrafo.appendChild(subtotalSpan);
    propinaParrafo.appendChild(propinaSpan);
    totalParrafo.appendChild(totalSpan);

    //Eliminar HTML previo
    const totalPagarDiv = document.querySelector('.total-pagar');

    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(suma);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(separacion);
    divTotales.appendChild(totalParrafo);

    formulario.appendChild(divTotales)
}