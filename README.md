
 Feed Full Stack Project

Descripción:
Este es un Feed , desarrollado con tecnologías modernas tanto en el frontend como en el backend. Ofrece funcionalidades esenciales como autenticación segura, gestión de publicaciones, panel de administración, likes, comentarios y un flujo completo de interactividad.


---

❓¿Qué problema resuelve?

Este proyecto está diseñado para digitalizar la interaccion de las personas, permitiendo que las publicaciones lleguen a más personas sin necesidad de interaccion presencial. Automatiza el registro de usuarios, exhibe publicaciones y facilita interacciones desde cualquier dispositivo con conexión.


---

🚀 Funcionalidades principales

✅ Registro e inicio de sesión con hash de contraseña (bcrypt)

🖼️ Subida de publicaciones con imagen (Multer)

🏠 Home 

📦 Panel para subir publicaciones

🧠 Panel del administrador para controlar el sistema



---

⚙️ Tecnologías utilizadas

Frontend:

React.js

Tailwind CSS

React Router

Framer Motion (animaciones)


Backend:

Node.js

Express.js

MySQL

bcrypt (hash de contraseñas)

Multer (gestión de archivos/imágenes)

CORS (conexión segura entre servidores)



---

🔐 ¿Cómo funciona el hasheo de contraseñas?

1. El usuario completa un formulario en React (nombre, email, contraseña).


2. Se envía la información al backend mediante POST.


3. En el servidor, la contraseña se encripta usando bcrypt con 10 saltos (salt rounds).


4. Se guarda en la base de datos solo la contraseña encriptada, jamás la original.


5. Durante el login, la contraseña ingresada se compara con el hash de la base de datos usando bcrypt.compare.




---
¿Como Se Suben Publicaciones?
1. El Usuario Completa un formulario en React (Usuario_ID_Contenido,Imagen)
2. Se envia la informacion al backend mediante POST
3. En el servidor,  se toma la imagen con Multer, y se guarda en la Carpeta /uploads
4. Se guarda todo en la base de datos, con la imagen ingresada
5. Con esto subis una Publicacion Y Tenes Para dar like, y comentarios 

- - -

💡 Enfoque del Desarrollador

Programación modular y ordenada.

Pensamiento crítico para debugging eficiente.

Adaptabilidad a las necesidades reales del usuario.

UI dinámica e intuitiva, animada con Framer Motion.



---

👨‍💻 Desarrollado por:

AlanBenjaDev - Full Stack Developer


---

