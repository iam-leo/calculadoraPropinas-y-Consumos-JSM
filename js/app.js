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
    }

    //Asignar datos del form al obj Cliente
    cliente = { ...cliente, mesa, hora }
    console.log(cliente);

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
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

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
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo)

    contenido.appendChild(resumen);


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
    const inputEliminado = document.querySelector(articuloEliminado).value = '';
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}