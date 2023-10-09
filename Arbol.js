const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
}

class ArbolBinario {
    constructor() {
        this.raiz = null;
    }

    agregarNodo(usuario) {
        if (this.raiz === null) {
            this.raiz = new Nodo(usuario);
        } else {
            this.agregarNodoRecursivo(this.raiz, usuario);
        }
    }

    agregarNodoRecursivo(nodo, usuario) {
        if (usuario.id < nodo.valor.id) {
            if (nodo.izquierdo === null) {
                nodo.izquierdo = new Nodo(usuario);
            } else {
                this.agregarNodoRecursivo(nodo.izquierdo, usuario);
            }
        } else if (usuario.id > nodo.valor.id) {
            if (nodo.derecho === null) {
                nodo.derecho = new Nodo(usuario);
            } else {
                this.agregarNodoRecursivo(nodo.derecho, usuario);
            }
        }
    }

    buscarNodo(id) {
        return this.buscarNodoRecursivo(this.raiz, id);
    }

    buscarNodoRecursivo(nodo, id) {
        if (nodo === null) {
            return null;
        }

        if (id === nodo.valor.id) {
            return nodo.valor;
        } else if (id < nodo.valor.id) {
            return this.buscarNodoRecursivo(nodo.izquierdo, id);
        } else {
            return this.buscarNodoRecursivo(nodo.derecho, id);
        }
    }

    eliminarNodo(id) {
        this.raiz = this.eliminarNodoRecursivo(this.raiz, id);
    }

    eliminarNodoRecursivo(nodo, id) {
        if (nodo === null) {
            return null;
        }

        if (id < nodo.valor.id) {
            nodo.izquierdo = this.eliminarNodoRecursivo(nodo.izquierdo, id);
        } else if (id > nodo.valor.id) {
            nodo.derecho = this.eliminarNodoRecursivo(nodo.derecho, id);
        } else {
            if (nodo.izquierdo === null) {
                return nodo.derecho;
            } else if (nodo.derecho === null) {
                return nodo.izquierdo;
            }

            nodo.valor = this.encontrarMinimoNodo(nodo.derecho).valor;
            nodo.derecho = this.eliminarNodoRecursivo(nodo.derecho, nodo.valor.id);
        }
        return nodo;
    }

    encontrarMinimoNodo(nodo) {
        while (nodo.izquierdo !== null) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    actualizarNodo(id, nuevoUsuario) {
        this.eliminarNodo(id);
        this.agregarNodo(nuevoUsuario);
    }

    obtenerNodos() {
        const nodos = [];
        this.obtenerNodosRecursivo(this.raiz, nodos);
        return nodos;
    }

    obtenerNodosRecursivo(nodo, nodos) {
        if (nodo !== null) {
            this.obtenerNodosRecursivo(nodo.izquierdo, nodos);
            nodos.push(nodo.valor);
            this.obtenerNodosRecursivo(nodo.derecho, nodos);
        }
    }
}

function main() {
    const arbolito = new ArbolBinario();
    const idsRegistrados = new Set();

    function menu() {
        console.log(
            "1. Agregar un Usuario\n" +
            "2. Buscar un Usuario por ID\n" +
            "3. Eliminar un Usuario por ID\n" +
            "4. Actualizar un Usuario por ID\n" +
            "5. Mostrar Nodos Registrados\n" +
            "6. Salir\n"
        );
    }

    function agregarUsuario() {
        rl.question("Ingresa el ID del Usuario:", (id) => {
            id = parseInt(id);
            if (!isNaN(id)) {
                if (idsRegistrados.has(id)) {
                    console.log("Error, el ID ya está registrado.");
                    menu();
                    seleccionarOpcion();
                } else {
                    rl.question("Ingresa el Nombre de Usuario (máximo 10 caracteres): ", (usuario) => {
                        if (usuario.length <= 10) {
                            rl.question("Ingresa la Contraseña (máximo 8 caracteres): ", (password) => {
                                if (password.length <= 8) {
                                    rl.question("Ingresa el Nombre (Sin Apellidos): ", (nombre) => {
                                        rl.question("Ingresa los Apellidos (juntos): ", (apellidos) => {
                                            const nuevoUsuario = {
                                                id: id,
                                                usuario: usuario,
                                                password: password,
                                                nombre: nombre,
                                                apellidos: apellidos
                                            };
                                            arbolito.agregarNodo(nuevoUsuario);
                                            idsRegistrados.add(id);
                                            console.log("Usuario registrado correctamente.");
                                            menu();
                                            seleccionarOpcion();
                                        });
                                    });
                                } else {
                                    console.log("Error, la contraseña debe tener máximo 8 caracteres");
                                    agregarUsuario();
                                }
                            });
                        } else {
                            console.log("Error, el nombre de usuario debe tener máximo 10 caracteres");
                            agregarUsuario();
                        }
                    });
                }
            } else {
                console.log("Error, ingresa un ID válido (número)");
                agregarUsuario();
            }
        });
    }

    function mostrarNodosRegistrados() {
        const nodos = arbolito.obtenerNodos();
        if (nodos.length === 0) {
            console.log("No hay nodos registrados.");
        } else {
            console.log("Nodos registrados:");
            nodos.forEach((nodo) => {
                console.log(nodo);
            });
        }
        menu();
        seleccionarOpcion();
    }

    function seleccionarOpcion() {
        rl.question("Elije Una Opcion...", (opcionSeleccionada) => {
            opcionSeleccionada = parseInt(opcionSeleccionada);
            if (!isNaN(opcionSeleccionada)) {
                switch (opcionSeleccionada) {
                    case 1:
                        agregarUsuario();
                        break;
                    case 2:
                        rl.question("Ingresa el ID del Usuario a buscar:", (id) => {
                            id = parseInt(id);
                            if (!isNaN(id)) {
                                const usuarioEncontrado = arbolito.buscarNodo(id);
                                if (usuarioEncontrado === null) {
                                    console.log("Usuario no encontrado");
                                } else {
                                    console.log("Usuario encontrado:", usuarioEncontrado);
                                }
                                menu();
                                seleccionarOpcion();
                            } else {
                                console.log("Error, ingresa un ID válido (número)");
                                seleccionarOpcion();
                            }
                        });
                        break;
                    case 3:
                        rl.question("Ingresa el ID del Usuario a eliminar:", (id) => {
                            id = parseInt(id);
                            if (!isNaN(id)) {
                                arbolito.eliminarNodo(id);
                                idsRegistrados.delete(id);
                                console.log("Usuario eliminado");
                                menu();
                                seleccionarOpcion();
                            } else {
                                console.log("Error, ingresa un ID válido (número)");
                                seleccionarOpcion();
                            }
                        });
                        break;
                    case 4:
                        rl.question("Ingresa el ID del Usuario a actualizar:", (id) => {
                            id = parseInt(id);
                            if (!isNaN(id)) {
                                rl.question("Ingresa el Nombre de Usuario (máximo 10 caracteres): ", (usuario) => {
                                    if (usuario.length <= 10) {
                                        rl.question("Ingresa la Contraseña (máximo 8 caracteres): ", (password) => {
                                            if (password.length <= 8) {
                                                rl.question("Ingresa el Nombre (Sin Apellidos): ", (nombre) => {
                                                    rl.question("Ingresa los Apellidos (juntos): ", (apellidos) => {
                                                        const nuevoUsuario = {
                                                            id: id,
                                                            usuario: usuario,
                                                            password: password,
                                                            nombre: nombre,
                                                            apellidos: apellidos
                                                        };
                                                        arbolito.actualizarNodo(id, nuevoUsuario);
                                                        console.log("Usuario actualizado");
                                                        menu();
                                                        seleccionarOpcion();
                                                    });
                                                });
                                            } else {
                                                console.log("Error, la contraseña debe tener máximo 8 caracteres");
                                                seleccionarOpcion();
                                            }
                                        });
                                    } else {
                                        console.log("Error, el nombre de usuario debe tener máximo 10 caracteres");
                                        seleccionarOpcion();
                                    }
                                });
                            } else {
                                console.log("Error, ingresa un ID válido (número)");
                                seleccionarOpcion();
                            }
                        });
                        break;
                    case 5:
                        mostrarNodosRegistrados();
                        break;
                    case 6:
                        console.log("Aplicación Finalizada");
                        rl.close();
                        break;
                    default:
                        console.log("Opción Incorrecta");
                        menu();
                        seleccionarOpcion();
                }
            } else {
                console.log("Error, ingresa solo números enteros");
                menu();
                seleccionarOpcion();
            }
        });
    }

    menu();
    seleccionarOpcion();
}

main();
