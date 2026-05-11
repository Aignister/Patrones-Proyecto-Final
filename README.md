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

El sistema de seguridad vehicular es una aplicación web desarrollada con React que simula un sistema de configuración de seguridad vehicular orientado al transporte de menores. La idea principal es permitir que el conductor ajuste parámetros como la velocidad máxima, el bloqueo de puertas traseras, los sensores de proximidad y los cinturones de seguridad, todo desde un panel centralizado.

Se implementaron tres patrones Memento, Factory Method y Facade, junto con la arquitectura MVC como estructura base, Cada patrón cumple una función específica: Memento permite guardar y restaurar configuraciones anteriores, Factory Method facilita la creación de perfiles de seguridad predefinidos, y Facade actúa como punto de acceso unificado hacia los distintos subsistemas del vehículo.

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
Arquitectura MVC

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

---

## Conclusión

Facade simplificó bastante la comunicación entre la vista y los subsistemas internos, ya que el controlador nunca tuvo que conocer los detalles de cada módulo por separado.

El patrón Memento resultó especialmente útil para manejar el historial.

Factory Method demostró ser una solución limpia para la creación de perfiles de seguridad
