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

## Conclusión
 
El desarrollo de este sistema permitió verificar de manera práctica cómo los patrones de diseño contribuyen a la legibilidad, mantenibilidad y extensibilidad de una aplicación. Cada patrón cumplió una función claramente delimitada dentro del sistema.
 
El patrón **Facade** resultó fundamental para mantener el dashboard limpio y desacoplado: la vista nunca interactuó directamente con los comandos, el caretaker o el estado de configuración, sino exclusivamente a través de la interfaz de `SafetyFacade`, lo que simplificó las pruebas y la evolución futura del sistema.
 
El patrón **Memento**, distribuido correctamente entre sus tres roles (Originator, Memento y Caretaker), demostró ser una solución sólida para la gestión del historial de perfiles. La inmutabilidad del estado dentro de `SafetyMemento` garantizó que ninguna restauración pudiera comprometer snapshots anteriores, y la separación de responsabilidades entre guardar (Originator), custodiar (Caretaker) y representar (Memento) redujo el acoplamiento entre módulos.
 
El patrón **Command** añadió una capa de reversibilidad que hubiera sido difícil de implementar sin dicha estructura. Encapsular cada acción como un objeto independiente con estado previo permitió implementar el *undo* sin modificar la lógica de negocio central, y el `CommandInvoker` con tamaño máximo de pila evitó problemas de memoria en sesiones prolongadas.
 
El patrón **Prototype** resolvió de forma elegante el caso de uso de copiar configuraciones entre usuarios: en lugar de reconstruir manualmente el estado o acoplar los objetos `SafetyFacade` entre sí, el método `clone()` de `SafetyConfig` generó una copia independiente del estado activo, preservando el aislamiento por perfil.
 
En cuanto a la arquitectura, la división en capas (patrones → hooks → componentes → páginas) estableció una separación de responsabilidades clara y predecible. El enfoque **MVC** instrumentado mediante *hooks* de React resultó especialmente adecuado para este contexto: los hooks actuaron como controladores que orquestan la lógica del modelo y sincronizan el estado hacia las vistas.
 

