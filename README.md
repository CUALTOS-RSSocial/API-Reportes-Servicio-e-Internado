# API Reportes Área de la Salud.

Autores: 
- Ramón Paredes Sánchez.
- Kevin Josué Olmeda de Rueda.
- Erik Raul Aguirre Lara.

## Acerca de este proyecto.
Esta parte del proyecto constituye al *back-end* de la aplicación para generar reportes de Servicio Social para las carreras del área de la salud. Esta API está escrita en **TypeScript** y hecha para correr en **NodeJS**. La API está hecha para correr en un servidor Linux.

## Entorno.
Para la ejecución de la API, es necesario contar con una instalación de **MySQL** y **NodeJS** en el servidor. Estas dependencias ya deberían estar instaladas.

## Configuración de la base de datos y API.
Nota: Las credenciales de acceso al servidor deben de consultarse con el encargado del proyecto.

1. Si la base de datos no existe, el primer paso de configuración consiste en crearla. El script de esta se encuentra en ```src/database/database.sql```. Si esta es una creación en limpio de la base de datos (no contiene registros), es necesario crear los trimestres de este año. Si la API no se detiene hasta el siguiente año, los siguientes trimestres se crean de manera automática. La base de datos debe contar con el nombre **Servicio_Medicina**, el usuario **root** y la contraseña **jugodprro21**.
```
INSERT INTO trimestre (fecha_inicio, fecha_fin) VALUES
('2021-02-01', '2021-04-30'),
('2021-05-01', '2021-07-31'),
('2021-08-01', '2021-10-31'),
('2021-11-01', '2022-01-31'),
('2022-02-01', '2022-04-30'),
('2022-05-01', '2022-07-31'),
('2022-08-01', '2022-10-31'),
('2022-11-01', '2023-01-31');
```
2. Una vez creada la base de datos, es necesario clonar el repositorio y realizar cambios en algunos archivos:
	- Ir a la carpeta var para crear la ruta del proyecto ```var/www/```.
	- Borrar la versión anterior de la API (en caso de que la haya).
	- Clonar la nueva versión.
	- Realizar los siguientes cambios en el archivo de configuración (configuracion.ts):
    	- host: 0.0.0.0
    	- port: 443
    	- database: Servicio_Medicina
    	- database password: jugodprro21
    	- Agregar la clave de SIIAU (solicitarla al encargado del proyecto). 
	- Descargar las dependencias del proyecto con el comando ```npm i```.
    - Cambiar la ruta del servidor en el archivo API.ts de ```.use('/public')```; por ```.use('/api/public');```
    - En el archivo tsconfig.json cambiar la carpeta destino de **dist** a **build**.
    - Compilar el proyecto con el comando tsc.

## Ejecutar la API como un servicio.
Sin este paso, cada vez que se cierre la terminal o el servidor se reinicie, la API se detendrá. Para evitar esto, lo mejor es correrla como un servicio en el sistema operativo.

1. Crear un archivo .system: este paso solo es necesario si no existe este archivo en el servidor. Este archivo permite al sistema reconocer la API como un servicio y ejecutarlo aún cuando la terminal no esté abierta, así como iniciarlo automáticamente con el arranque del sistema. Para ver si este archivo ya está creado, revisa la ruta ```/etc/systemd/system```. Si ya está creado, no es necesario crearlo otra vez.
	- Copia el siguiente código en el archivo ```API.service``` en la ruta ```/etc/systemd/system```:
   
   	```    
	[Unit]
	Description= API-Reportes-Servicio-e-Internado

	[Service]
	ExecStart=/var/www/API-Reportes-Servicio-e-Internado/build/API.js
	Restart=always
	User=nobody
	Group=nogroup
	Environment=PATH=/usr/bin:/usr/local/bin
	Environment=NODE_ENV=production
	WorkingDirectory=/var/www/API-Reportes-Servicio-e-Internado/build

	[Install]
	WantedBy=multi-user.target
    ```

2. Copia el comando ```#!/usr/bin/env node``` justo en la primera línea del archivo API.js (**Ojo**, .js, no .ts. Ya debería estar compilado en build).
3. Añade el permiso de ejecución al archivo ```chmod +x API.js```.
4. Inicia el servicio con el comando ```sudo systemctl start API```.
5. Permite que el servicio comience en el arranque del sistema ```sudo systemctl enable API```.
6. **Extra**, puedes ver los logs del servicio con el comando ```journalctl -u API```.
