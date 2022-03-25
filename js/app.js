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
