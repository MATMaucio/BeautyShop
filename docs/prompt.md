## 🛍️ Aplicación Web: Tienda en Línea de Productos de Belleza

### 🎯 Objetivo

Desarrollar una tienda online funcional, estética y modular utilizando **HTML, CSS y JavaScript Vanilla**, sin frameworks ni librerías, ni dependencias npm. El backend será **Supabase**, manejando autenticación y base de datos.

---

### 🔑 Funcionalidades clave

- Registro e inicio de sesión con **correo y contraseña** y **Google OAuth** (usando Supabase Auth).
- Catálogo de productos (belleza, maquillaje, cuidado facial, etc.).
- Carrito de compras funcional.
- Gestión de pedidos.
- CRUD de productos (modo administrador).
- Página de detalle del pedido y confirmación de compra.
- Historial de pedidos para cada cliente.
- Diseño minimalista y responsivo.

---

### 🧩 Modelo Relacional (simplificado)

#### Entidades y relaciones:

1. **Producto**
   - `id`, `nombre`, `descripción`, `categoría`, `marca`, `precio`, `stock`

2. **Cliente (vinculado a Supabase Auth)**
   - `id`, `nombre`, `correo`, `teléfono`, `dirección`

3. **Pedido**
   - `id`, `fecha`, `total`, `id_cliente` (FK)

4. **Detalle_Pedido**
   - `id`, `id_pedido` (FK), `id_producto` (FK), `cantidad`, `subtotal`

5. **Método_Pago**
   - `id`, `tipo`, `id_pedido` (FK)

---

### 🗃️ SQL para crear la base en Supabase

```sql
-- CLIENTE (vinculado a auth.users)
create table cliente (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  correo text unique not null,
  telefono text,
  direccion text
);

create table producto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria text,
  marca text,
  precio numeric(10, 2),
  stock int
);

create table pedido (
  id uuid primary key default gen_random_uuid(),
  fecha timestamp with time zone default timezone('utc', now()),
  total numeric(10, 2),
  id_cliente uuid references cliente(id) on delete cascade
);

create table detalle_pedido (
  id uuid primary key default gen_random_uuid(),
  id_pedido uuid references pedido(id) on delete cascade,
  id_producto uuid references producto(id) on delete restrict,
  cantidad int,
  subtotal numeric(10, 2)
);

create table metodo_pago (
  id uuid primary key default gen_random_uuid(),
  tipo text,
  id_pedido uuid references pedido(id) on delete cascade
);

### 🔐 Políticas de Seguridad (RLS)

```sql
-- Solo ver tus propios datos
create policy "Clientes solo pueden ver sus datos"
on cliente
for select using (auth.uid() = id);

create policy "Clientes gestionan sus pedidos"
on pedido
for all using (auth.uid() = id_cliente);

create policy "Productos visibles a todos (solo lectura)"
on producto
for select using (true);

### 🗂️ Estructura de Archivos (multipágina y modular)

/index.html → Página de inicio
/producto.html → Detalle de producto
/carrito.html → Carrito de compras
/checkout.html → Confirmación y método de pago
/historial.html → Historial de pedidos
/login.html → Iniciar sesión
/register.html → Crear cuenta

/css/
└─ style.css

/js/
├─ auth.js
├─ productos.js
├─ carrito.js
├─ pedidos.js
└─ ui.js