# Sistema de Seguridad Vehicular
**Instituto Tecnológico de Tijuana**
<img width="344" height="339" alt="image" src="https://github.com/user-attachments/assets/48c1dfef-52b6-41f3-b110-7a8a28909abd" />


**Materia:** Patrones de Diseño  
**Docente:** Maribel Guerrero Luis  


**Equipo:**
- Torres Murillo Luis Enrique
- Mojica Fajardo Jose Angel
- Cortez Huerta Gonzalo
- Kevin Omar Alvarez Hernandez

---

## Introducción
 
El presente proyecto consiste en el desarrollo de una aplicación web orientada a la seguridad vehicular, específicamente diseñada para el transporte de menores. La plataforma, construida con React y Vite, permite al conductor configurar parámetros como el bloqueo de ventanas y puertas traseras, la restricción de velocidad máxima y el uso obligatorio del cinturón de seguridad, todo desde un panel centralizado con soporte para múltiples perfiles de usuario.
 
Se implementaron cuatro patrones: **Facade**, **Memento**, **Command** y **Prototype**, complementados con una arquitectura de dos niveles: **arquitectura por capas** como estructura organizacional del proyecto, y **MVC** como patrón arquitectónico de interacción, donde los *hooks* de React asumen el rol híbrido de controlador y modelo al coordinar el estado de la lógica de negocio con la sincronización de las vistas.
 

## Justificacion del Uso de los patrones

Prototype (Patrón Creacional) 

El patrón Prototype fue utilizado para la creación y duplicación de configuraciones de seguridad del vehículo. Este patrón permite generar nuevos objetos a partir de la clonación de configuraciones existentes, evitando la necesidad de construir cada configuración manualmente desde cero. 
Además, Prototype se integra correctamente con el resto de patrones, ya que las configuraciones clonadas pueden posteriormente ser almacenadas mediante Memento y administradas por el Facade.

Facade (Patrón Estructural) 

El patrón Facade fue seleccionado para simplificar la interacción entre la interfaz de usuario y los distintos subsistemas de seguridad del vehículo. 
Sin el patrón Facade, la interfaz tendría que comunicarse directamente con cada subsistema, generando alto acoplamiento y mayor complejidad.
Para resolver este problema se implementó una fachada central encargada de coordinar todas las operaciones del sistema de seguridad. De esta manera, la interfaz solo interactúa con una única clase responsable de ejecutar acciones complejas internamente.
El patrón Facade también mejora la compatibilidad entre patrones, ya que centraliza la comunicación con los objetos creados mediante Prototype y los estados administrados por Memento. 

Memento (Patrón de Comportamiento) 

El patrón Memento fue implementado para permitir el almacenamiento y restauración de configuraciones de seguridad previamente guardadas.
Dentro del sistema, el usuario puede modificar configuraciones del vehículo y posteriormente guardar “snapshots” del estado actual.

Command (Patrón de Comportamiento Adicional) 

El patrón Command fue utilizado para encapsular acciones del sistema como comandos independientes. Esto permitió separar las solicitudes realizadas por el usuario de la lógica real de ejecución. 
Command complementa correctamente al patrón Facade, ya que los comandos pueden utilizar la fachada como punto central de acceso al sistema.

Arquitectura MVC(Patron de Arquitectura)

La arquitectura MVC (Model-View-Controller) fue utilizada para organizar el sistema de manera estructurada y modular.
La separación de responsabilidades permitió dividir el proyecto en:
Model: manejo de datos, patrones y lógica del sistema.
View: componentes visuales e interfaz gráfica.
Controller: control de eventos y comunicación entre vistas y modelos.
Además, MVC facilita la integración de todos los patrones implementados, ya que cada uno puede ubicarse en una capa específica sin afectar directamente a las demás.

## Compatibilidad Entre los Patrones

Los patrones seleccionados presentan una alta compatibilidad debido a que cada uno resuelve un problema distinto dentro del sistema sin generar conflictos entre sí.
La interacción entre los patrones funciona de la siguiente manera:
Prototype genera configuraciones base de seguridad.
Facade coordina y aplica dichas configuraciones a los subsistemas.
Command encapsula las acciones ejecutadas por el usuario.
Memento almacena y restaura estados del sistema.
MVC organiza toda la arquitectura general de la aplicación.

---

## Diagramas 
Diagrama UML de clases
<img width="1400" height="2687" alt="Diagrama en blanco (13)" src="https://github.com/user-attachments/assets/8d2e0ca4-d327-46b0-a2c9-17c7c7ed79ff" />


Diagrama de procesos

<img width="740" height="2300" alt="Diagrama en blanco (14)" src="https://github.com/user-attachments/assets/a27b591a-2d91-413c-9fa8-baea00da5b44" />

---

## Conclusión - Gonzalo Cortez Huerta 22210761

El Facade, centraliza los componentes y cualquier cambio pequeño hubiera afectado un montón a los archivos.

El Command fue el que más sencillo para mi, tenemos las diferentes clases que modifican, activan o descativan los botones, activar o desactivar las ventanas, cinturones de seguridad, etc.

El Memento y el Prototype fueron más directos, pero igual importantes, sin ellos no habría forma limpia de guardar perfiles ni de copiar configuraciones entre usuarios.

 
## Conclusion - Luis Enrique Torres Murillo - 22210361

El programa como tal funciona de forma correcta con la implementacion de cada uno de estos diferentes patrones, cada uno funcion en base a la funcion especifica que se busca lograr dentro del programa,
los patrones de Memento y Command funcionan de forma que se mantiene el historial y un numero de configuraciones que el usuario puede guardar, mientras que Command facilita el tema del deshacer la configuracion
de forma sencilla, ya el patron de Prototype permite el copiar una configuracion de forma sencilla, y el de facade permite de forma sencilla la separacion de la interfaz de la parte logica del codigo delegando las llamadas a los patrones por medio de este, y el de arquitectura siendo el de capas y MVC por la estructuracion que se le dio al codigo. De forma de que todos los patrones funcionan de forma correcta juntos y hacen que el funcionamiento del programa sea el correcto.

## Conclusion - Jose Angel Mojica Fajardo - 22210322
En conclusión el patron facade nos ayuda a entender los simplificar sistemas dificles usando una clase que controle todo, eso hace que código sea mas fácil de entender.
En cuanto el prototype sirve para crear copias de los objetos sin tener que hacerlo desde cero. En lo que me parecio util por que el patron nos ahorra tiempo y facilita la reutilización de configuraciones
El comando organiza las acciones en objetos separados, por lo que es util a tener un código mas ordenado y flexible, también nos permite facilitar al ejecutar o deshacer acciones,
El patron memento Nos permite guardar y recuperar estados anteriores de un objeto. Es util para funciones como deshacer cambios sin afectar directamente el objeto principal.
El MVC separa la lógica, la interfaz y el control de aplicación. gracias a eso, el código queda mas ogranizado y es mas fácil de mantener.
En cuanto el patron de capas La Arquitectura se divide el sistema en partes con funciones especificas, esto ayuda a que el desarrollo sea mas ordenado y facilita hacer cambios sin afectar el sistema.

##Conclusion - Kevin Omar Alvarez Hernandez - 22210280
EL uso de varios patrones de diseño resulto muy util, en este programa para implementar varias funciones codidianas a una problematica comun , El uso de vehiculo de manera responsable,la seguridad de los pasajeros es muy importante, El patron memento se usa como un historial de perfiles, esto nos puede ayudar a saber cuales perfiles fueron los que usaron, El patron Facade oculta la complejidad, Command es para desacer acciones, Prototype para clonar las configuraciones de los perfiles y los ultimos 2 MVC y Arquitectura por capas, se encarga de la organizacion de la interfaz, logica, sonidos, y datos.
