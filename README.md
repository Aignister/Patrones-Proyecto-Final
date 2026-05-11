# Sistema de Seguridad Vehicular
**Instituto Tecnológico de Tijuana**
<img width="349" height="338" alt="image" src="https://github.com/user-attachments/assets/aca54ba8-5d29-4420-991f-1d09fb778e90" />

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

---

## Diagramas 

---

## Conclusión

Facade simplificó bastante la comunicación entre la vista y los subsistemas internos, ya que el controlador nunca tuvo que conocer los detalles de cada módulo por separado.

El patrón Memento resultó especialmente útil para manejar el historial.

Factory Method demostró ser una solución limpia para la creación de perfiles de seguridad
