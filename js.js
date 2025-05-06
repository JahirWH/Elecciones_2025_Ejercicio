document.addEventListener('DOMContentLoaded', function() {
    // carga el cvs
    fetch('./Datos.csv')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('No se pudo cargar el archivo CSV');
            }
            return respuesta.text();
        })
        .then(datos => {
            const candidatos = analizarCSV(datos);
            const listaMujeres = document.getElementById('listaMujeres');
            const listaHombres = document.getElementById('listaHombres');
            const mujeres = candidatos.filter(c => c.Sexo === 'Femenino');
            const hombres = candidatos.filter(c => c.Sexo === 'Masculino');

            function mostrarCandidatos(lista, datos) {
                lista.innerHTML = '';
                datos.forEach((candidato, indice) => {
                    const div = document.createElement('div');
                    div.className = 'elemento-candidato';
                    div.innerHTML = `
                        <div class="numero-candidato">${indice + 1}</div>
                        <div>${candidato['Nombre completo']}</div>
                    `;
                    div.addEventListener('click', () => mostrarInfoCandidato(candidato));
                    lista.appendChild(div);
                });
            }

            mostrarCandidatos(listaMujeres, mujeres);
            mostrarCandidatos(listaHombres, hombres);




           // Buscar 
            const campoBusqueda = document.getElementById('campoBusqueda');
            const botonBusqueda = document.getElementById('botonBusqueda');

            function realizarBusqueda() {
                const termino = campoBusqueda.value.toLowerCase();
                const mujeresFiltradas = mujeres.filter(c => c['Nombre completo'].toLowerCase().includes(termino));
                const hombresFiltrados = hombres.filter(c => c['Nombre completo'].toLowerCase().includes(termino));
                mostrarCandidatos(listaMujeres, mujeresFiltradas);
                mostrarCandidatos(listaHombres, hombresFiltrados);
                
                const totalResultados = mujeresFiltradas.length + hombresFiltrados.length;
                const infoResultados = document.getElementById('infoResultados');
                
                if (termino.length > 0) {
                    if (totalResultados === 0) {
                        infoResultados.textContent = 'No se encontraron candidatos';
                    } else {
                        infoResultados.textContent = `Se encontraron ${totalResultados} candidato(s)`;
                    }
                } else {
                    infoResultados.textContent = '';
                }
            }

            campoBusqueda.addEventListener('input', realizarBusqueda);
            
            botonBusqueda.addEventListener('click', realizarBusqueda);
        })
        .catch(error => {
            console.error('Error al cargar el archivo CSV:', error);
            document.getElementById('listaMujeres').innerHTML = '<div class="alert alert-danger">Error al cargar los datos. Revisa que exista el archivo Datos.csv</div>';
            document.getElementById('listaHombres').innerHTML = '<div class="alert alert-danger">Error al cargar los datos. Revisa que exista el archivo Datos.csv</div>';
        });
});

//  analizar CSV
function analizarCSV(texto) {
    const lineas = texto.trim().split('\n');
    const encabezados = lineas[0].split(',');
    return lineas.slice(1).map(linea => {
        const valores = linea.split(',');
        const entrada = {};
        encabezados.forEach((encabezado, i) => {
            entrada[encabezado.trim()] = valores[i] ? valores[i].trim() : '';
        });
        return entrada;
    });
}

//  el modal
function mostrarInfoCandidato(candidato) {
    document.getElementById('modalNombre').textContent = candidato['Nombre completo'];
    document.getElementById('modalEdad').textContent = candidato['Edad'];
    document.getElementById('modalSexo').textContent = candidato['Sexo'];
    document.getElementById('modalOcupacion').textContent = candidato['Ocupación'];
    document.getElementById('modalEstudios').textContent = candidato['Nivel de estudios'];
    const modal = new bootstrap.Modal(document.getElementById('modalCandidato'));
    modal.show();
}