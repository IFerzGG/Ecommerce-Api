**ENTIDADES Y SUS ATRIBUTOS**

## Entidad: Usuario
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| nombre        | Texto          | Obligatorio |
| email         | Texto          | Unico       |
| password      | Texto          | Obligatorio |
| Role          | Texto          | ENUM        |
| creado        | Date           | Default     |


## Entidad: Categorias
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| nombre        | Texto          | Obligatorio |
| descripcion   | Texto          | Opcional    |


## Entidad: Productos
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| nombre        | Texto          | Obligatorio |
| precio_Compra | Decimal        | Obligatorio |
| precio_Venta  | Decimal        | Obligatorio |
| stock         | Numero         | Obligatorio |
| activo        | Booleano       | Default     |
| creado        | Date           | Default     |
| categoria_id  | Numero         | [FK]        |


## Entidad: Direccion
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| ciudad        | Texto          | Obligatorio |
| pais          | Texto          | Obligatorio |
| codigo_postal | Texto          | Obligatorio |
| direccion     | Texto          | Obligatorio |
| referencia    | Texto          | Opcional    |
| usuario_id    | Numero         | Obligatorio |


## Entidad: Venta Mostrador
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| metodo_pago   | Texto          | Obligatorio |
| total         | Numero         | Obligatorio |
| fecha         | Date           | default     |
| usuario_id    | Numero         | [FK]        |
| caja_id       | Numero         | [FK]        |


## Entidad: Detalle Venta
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| cantidad      | Decimal        | Obligatorio |
| precio_unidad | Decimal        | Obligatorio |
| subtotal      | Decimal        | Obligatorio |
| producto_id   | Numero         | [FK]        |
| venta_id      | Numero         | [FK]        |


## Entidad: Pedido Web
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| estado        | Texto          | ENUM        |
| total         | Decimal        | Obligatorio |
| fecha         | Date           | Default     |
| usuario_id    | Numero         | [FK]        |
| direccion_id  | Numero         | [FK]        |


## Entidad: Detalle Pedido
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| cantidad      | Numero         | Obligatorio |
| precio_unidad | Numero         | Obligatorio |
| subtotal      | Numero         | Obligatorio |
| producto_id   | Numero         | [FK]        |
| pedido_id     | Numero         | [FK]        |


## Entidad: Caja
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| fecha_apertura| Date           | Default     |
| monto_inicial | Numero         | Obligatorio |
| fecha_Cierre  | Date           | Opcional    |
| monto_final   | Numero         | Opcional    |
| estado        | Texto          | ENUM        |
| usuario_id    | Numero         | [FK]        |


## Entidad: Movimiento Caja
| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Serial         | [PK]        |
| tipo_mov      | Texto          | Obligatorio |
| monto         | Numero         | Obligatorio |
| fecha         | Date           | Default     |

**RELACIONES ENTRE ENTIDADES**

## Categorías → Productos
Una categoría puede tener muchos productos, pero un producto pertenece a una sola categoría.

## Usuario.Cliente → Direcciones
Un usuarioCliente puede tener muchas direcciones, pero una dirección pertenece a un solo usuarioCliente.

## Usuario.Cliente → Pedidos
Un usuarioCliente puede realizar muchos pedidos, pero un pedido pertenece a un solo usuarioCliente.

## Direcciones → Pedidos
Una dirección puede utilizarse en muchos pedidos, pero un pedido utiliza una sola *dirección.

## Usuarios → Ventas
Un usuario puede registrar muchas ventas, pero una venta es registrada por un solo usuario.

## Cajas → Ventas
Una caja puede contener muchas ventas, pero una venta pertenece a una sola caja.

## Ventas → Detalle de ventas
Una venta puede tener muchos detalles de venta, pero un detalle de venta pertenece a una sola venta.

## Productos → Detalle de ventas
Un producto puede aparecer en muchos detalles de venta, pero un detalle de venta corresponde a un solo producto.

## Pedidos → Detalle de pedidos
Un pedido puede tener muchos detalles de pedido, pero un detalle de pedido pertenece a un solo pedido.

## Productos → Detalle de pedidos
Un producto puede aparecer en muchos detalles de pedido, pero un detalle de pedido corresponde a un solo producto.

## Cajas → Movimientos de caja
Una caja puede tener muchos movimientos de caja, pero un movimiento de caja pertenece a una sola caja.

## Usuarios → Cajas
Un usuario puede realizar muchas aperturas de caja, pero cada caja es abierta por un solo usuario.