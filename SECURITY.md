# Política de Seguridad de CyberType

La seguridad de las y los estudiantes, docentes y usuarios de CyberType es una prioridad. Dado que CyberType está diseñado principalmente para su uso en entornos escolares y con menores de edad, implementamos un modelo de **privacidad y seguridad por diseño**.

---

## 🔒 Modelo de Seguridad y Privacidad

1. **Sin Recolección de Datos Personales:**
   CyberType no solicita correos, contraseñas, nombres de alumnos ni credenciales. No existe base de datos de usuarios en la nube.
2. **Sin Tráfico de Red en Ejecución (100 % Offline):**
   La aplicación no realiza ninguna petición externa a internet. Todo el código, estilos, fuentes tipográficas y lógica de voz se procesan localmente en el dispositivo.
3. **Persistencia Local Segura:**
   El progreso (estrellas conseguidas, ejercicio actual y configuraciones de audio/tema) se almacena únicamente en el `localStorage` del navegador web o en el perfil de Electron de la máquina local.
4. **Aislamiento en la Aplicación de Escritorio (Electron):**
   El contenedor de Electron se distribuye con las siguientes protecciones reforzadas:
   - `nodeIntegration: false`
   - `contextIsolation: true`
   - `sandbox: true`
   - Bloqueo preventivo de navegación externa y apertura de nuevas ventanas no autorizadas.

---

## 🛡️ Versiones con Soporte de Seguridad

| Versión | Con Soporte de Seguridad |
| :--- | :---: |
| **2.4.x** | ✅ Sí |
| 2.3.x | ⚠️ Solo correcciones críticas |
| < 2.3.0 | ❌ No |

Recomendamos mantener siempre la versión más reciente disponible en las [Publicaciones de GitHub](https://github.com/neshack/cybertype/releases).

---

## 🚨 Cómo Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en CyberType:

1. **No abras un issue público.**
2. Utiliza la función de [Reporte de Vulnerabilidad Privada de GitHub](https://github.com/neshack/cybertype/security/advisories/new) en este repositorio, o bien:
3. Envía un correo electrónico a **neshack@gmail.com** con el asunto: `[Vulnerabilidad CyberType] Descripción breve`.
   - Incluye los pasos detallados para reproducir el problema.
   - Indica el sistema operativo, navegador y versión de CyberType utilizada.
   - Adjunta una prueba de concepto (PoC) si es seguro y relevante.

### Tiempos de respuesta esperados:
- **Confirmación inicial:** Menos de 48 horas.
- **Evaluación y remediación:** Se buscará resolver el problema y publicar una versión correctiva a la brevedad posible antes de cualquier divulgación pública coordinada.
