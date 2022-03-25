let cliente = {
    mesa: '',
    hora: '',
    pedido: []
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
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}