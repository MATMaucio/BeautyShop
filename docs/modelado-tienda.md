# Modelo Entidad–Relación de la Tienda Online

## Entidades y Atributos

### 1. **Producto**
- **ID_Producto** (PK): Identificador único del producto.
- **Nombre**: Nombre del producto.
- **Descripción**: Descripción detallada del producto.
- **Categoría**: Categoría a la que pertenece el producto (Cuidado Facial, Maquillaje, etc.).
- **Marca**: Marca del producto.
- **Precio**: Precio del producto.
- **Stock**: Cantidad disponible en inventario.

### 2. **Cliente**
- **ID_Cliente** (PK): Identificador único del cliente.
- **Nombre**: Nombre completo del cliente.
- **Correo**: Correo electrónico del cliente.
- **Teléfono**: Número de contacto.
- **Dirección**: Dirección de envío.

### 3. **Pedido**
- **ID_Pedido** (PK): Identificador único del pedido.
- **Fecha**: Fecha en que se realizó el pedido.
- **Total**: Monto total del pedido.
- **ID_Cliente** (FK): Relación con la entidad Cliente.

### 4. **Detalle_Pedido**
- **ID_Detalle** (PK): Identificador único del detalle del pedido.
- **ID_Pedido** (FK): Relación con la entidad Pedido.
- **ID_Producto** (FK): Relación con la entidad Producto.
- **Cantidad**: Cantidad de productos solicitados.
- **Subtotal**: Subtotal por producto.

### 5. **Método_Pago**
- **ID_Metodo** (PK): Identificador único del método de pago.
- **Tipo**: Tipo de método de pago (Tarjeta de crédito, PayPal, etc.).
- **ID_Pedido** (FK): Relación con la entidad Pedido.

## Relaciones
1. **Cliente** realiza **Pedidos** (1:N).
2. **Pedido** contiene **Detalle_Pedido** (1:N).
3. **Detalle_Pedido** está asociado a **Producto** (N:1).
4. **Pedido** utiliza **Método_Pago** (1:1).

## Diagrama en Texto
- **Cliente** (1) — (N) **Pedido**
- **Pedido** (1) — (N) **Detalle_Pedido**
- **Detalle_Pedido** (N) — (1) **Producto**
- **Pedido** (1) — (1) **Método_Pago**

## Reglas de Negocio

1. **Gestión de Inventario**: 
   - No se permite realizar pedidos de productos cuyo stock sea igual a 0.
   - El stock de un producto se actualiza automáticamente después de confirmar un pedido.

2. **Política de Precios**:
   - Los precios de los productos incluyen impuestos.
   - Los descuentos o promociones deben aplicarse antes de confirmar el pago.

3. **Registro de Clientes**:
   - Un cliente debe estar registrado para realizar un pedido.
   - Los datos del cliente deben ser válidos y completos (nombre, correo, dirección, etc.).

4. **Procesamiento de Pedidos**:
   - Un pedido no puede ser procesado si no tiene al menos un producto en el carrito.
   - Los pedidos deben incluir un método de pago válido.

5. **Métodos de Pago**:
   - Solo se aceptan métodos de pago previamente configurados (Tarjeta de crédito, PayPal, etc.).
   - El pago debe ser confirmado antes de generar la orden de compra.

6. **Envío de Pedidos**:
   - Los pedidos solo se envían a direcciones válidas proporcionadas por el cliente.
   - Se debe generar un número de seguimiento para cada pedido enviado.

7. **Cancelación de Pedidos**:
   - Un pedido puede ser cancelado solo si no ha sido enviado.
   - Al cancelar un pedido, el stock de los productos debe ser restablecido.

8. **Notificaciones**:
   - El cliente debe recibir un correo electrónico con la confirmación del pedido y los detalles del envío.
   - En caso de problemas con el inventario o el pago, el cliente debe ser notificado inmediatamente.

## Imagen de Modelo Entidad Relacion
![Moodboard](/docs/practica-11/IMG/Diagrama%20en%20blanco.png)

## Imagen de Modelo Entidad Relacion
![Supabase](/docs/practica-11/IMG/Supabase.png)