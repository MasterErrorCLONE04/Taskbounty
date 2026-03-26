# Análisis y Documentación de Requerimientos (PRD) - TaskBounty

## 📊 Resumen General del Estado del Proyecto
TaskBounty es una plataforma de mercado freelance muy ambiciosa y visualmente pulida (Next.js 16, Supabase, Stripe, Tailwind CSS 4). El núcleo del sistema (tareas, chat en tiempo real emergente, estructura social y enrutamiento principal) está montado y tiene una arquitectura sólida basada en Server Components y Server Actions. Sin embargo, el proyecto sufre de un alcance (scope) excesivamente amplio para un MVP (Producto Mínimo Viable). Existen muchas características visuales que actualmente están usando datos estáticos (*hardcoded*) o simulados (*mocked*), lo que indica que el desarrollo frontal avanzó más rápido que las integraciones de la base de datos y la lógica de negocio final.

La prioridad actual debe ser solidificar el **flujo principal** (Publicar Tarea -> Aplicar -> Escrow -> Chat -> Entregar -> Pagar) y dejar las funcionalidades comunitarias/secundarias para versiones posteriores.

---

## 🏗️ 1. Funcionalidades que faltan por terminar (Pendientes / Mocked)
El análisis del código revela múltiples áreas "mockeadas" o con comentarios de TODO:
*   **Gráficos de Billetera (Wallet):** En `/app/wallet/page.tsx`, la distribución de ganancias mensual es un *mock* ya que asume datos de tareas completadas.
*   **Gestión de Perfiles y Estadísticas:** 
    *   Las estadísticas del perfil (`UserProfileCard.tsx`) están usando datos estáticos dependientes de una futura implementación en DB.
    *   Las **Certificaciones** (`CertificationsCard.tsx`) proporcionan una lista *hardcoded* temporal.
    *   La lógica de **Colaboradores Principales** (`profile.ts`) está simulada asumiendo usuarios con alta calificación.
*   **Métodos de Pago:** El componente de billetera (`PaymentMethodsList.tsx`) tiene la interfaz de MetaMask y "Web3 Wallet" maquetada pero sin funcionalidad de conexión Web3 real implementada.
*   **Notificaciones:** 
    *   La lógica para pestañas de notificaciones (`NotificationsFeed.tsx`) no filtra datos reales de la base de datos de manera óptima todavía.
    *   La acción de enviar notificación de aplicación a un cliente (`applications.ts`) solo tiene el comentario simulando la acción.
*   **Manejo de Archivos e Imágenes:** La subida de avatares para grupos (`CreateGroupModal.tsx`) todavía no se conecta a Supabase Storage.
*   **Suscripción Premium:** La ruta de la acción `upgradeToPremium` devuelve un éxito simulado o una redirección sin completar el flujo de Stripe Checkout para suscripciones.

---

## 🛠️ 2. Funcionalidades que se pueden mejorar
*   **El Chat y Sistema de Presencia:** Ya existe un sistema de mensajería (incluso flotante) prometedor usando *Supabase Realtime*, pero debe someterse a pruebas de estrés intensivas en el manejo de múltiples pestañas y control de estado fuera de línea para evitar degradación.
*   **El Blog:** Actualmente, `/app/blog/page.tsx` consiste en cientos de líneas de código React completamente estático. Se debe integrar un Headless CMS (como Sanity, Strapi o el mismo Supabase) para que el equipo de marketing pueda crear artículos sin requerir *commits* de código.
*   **Filtros de Búsqueda:** Mejorar la implementación real en la vista de Explorar para que soporte filtros combinados complejos contra la tabla de Supabase, en lugar de búsquedas parciales front-end.
*   **Disputas de Escrow:** El flujo de disputas está planteado en el README, pero se debe reforzar el panel de administración/soporte para la resolución manual de conflictos donde los fondos en Stripe se retienen.

---

## 🗑️ 3. Funcionalidades que se deberían eliminar (o posponer para V2)
Para garantizar un lanzamiento exitoso y con menos deuda técnica, el proyecto debería recortar "grasa" y enfocarse en su propuesta de valor. Se recomienda deshabilitar temporalmente o eliminar las siguientes rutas/características:
*   **Grupos y Eventos (`/app/groups`, `/app/events`):** Construir una comunidad es difícil. Actualmente, la página de eventos solo dice "Coming Soon" y crear grupos distrae del objetivo de conectar clientes con freelancers.
*   **Bolsa de Trabajo (`/app/jobs`):** Genera confusión con el modelo central de *tareas/bounties*. Si las "tareas" son entregables únicos, tener además "empleos" bifurca la liquidez del mercado temprano.
*   **Hashtags (`/app/hashtags`):** Es una funcionalidad social de bajo valor en la etapa inicial comparado con una buena categorización de tareas.
*   **Soporte Multi-Wallet Web3 (MetaMask, etc.):** El sistema ya soporta depósitos fiduciarios por Stripe. Añadir criptografía/Web3 simultáneamente triplica la carga legal, contable y de seguridad.

---

## 📝 Conclusión Estratégica
*Concéntrese en el dinero y el trabajo*. El objetivo a corto plazo de TaskBounty debe ser asegurar el flujo: **Registro → Depósito Stripe → Asignación de Tarea → Entrega Segura → Retiro del Freelancer.**  
Elimina (comenta/oculta) las páginas de eventos, grupos, hashtags, empleos, y el blog estático hasta que la transacción core genere el primer dólar de ingresos.
