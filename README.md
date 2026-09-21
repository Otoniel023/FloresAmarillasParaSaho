# Flores Amarillas para Saho 🌼

Regalo web para el Día de las Flores Amarillas (21 de septiembre): una página con animaciones,
una carta y un carrusel de fotos personalizado.

## Ver el sitio

No necesita instalación. Puedes:

- Abrir `index.html` directamente en el navegador, o
- Servirlo localmente, por ejemplo con `npx serve .` o `python3 -m http.server`, y abrir la URL que indique.

## Cómo agregar las fotos

1. Copia tus fotos dentro de la carpeta `fotos/` (cualquier formato: `.jpg`, `.png`, `.webp`...).
2. Abre `js/main.js` y edita el arreglo `CONFIG.photos` al inicio del archivo, agregando la ruta y,
   si quieres, una frase para cada una:

   ```js
   const CONFIG = {
     novia: "Saho", // <- pon aquí su nombre
     photos: [
       { src: "fotos/1.jpg", caption: "Nuestra primera foto juntos" },
       { src: "fotos/2.jpg", caption: "Ese viaje que no olvidamos" },
       // agrega tantas como quieras
     ],
   };
   ```

3. Guarda y recarga la página. El carrusel se genera automáticamente a partir de esa lista.

El carrusel está diseñado para que **cualquier tipo de foto** (vertical, horizontal, clara u oscura)
se vea bien enmarcada: cada tarjeta usa un fondo desenfocado tomado de la misma foto como "backdrop",
así siempre hay buen contraste sin recortar la imagen original.

## Estructura

```
index.html        Página principal
css/styles.css     Estilos y animaciones
js/main.js         Lógica: pétalos animados, scroll reveal, carrusel, sorpresa
fotos/             Aquí van tus fotos
```

## Personalizar el texto

En `index.html` puedes editar libremente la carta ("Una cartita para ti") y el mensaje sorpresa
al final de la página, dentro de las secciones `#carta` y `#sorpresa`.
