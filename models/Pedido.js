class Pedido {
    constructor(id, cliente, productos, total) {
        this.id = id;
        this.cliente = cliente;
        this.productos = productos;
        this.total = total;
    }
}

module.exports = Pedido;