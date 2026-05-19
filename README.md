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

 

