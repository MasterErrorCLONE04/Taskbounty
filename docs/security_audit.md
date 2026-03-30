# Auditoría de Seguridad - TaskBounty (Reporte Crítico)

Tras realizar un análisis profundo de la arquitectura, componentes `Server Actions`, y la configuración de políticas en **Supabase**, se ha detectado una serie de **Backdoors y vulnerabilidades críticas** que comprometen por completo los fondos, las tareas y la privacidad del sistema.

A continuación el detalle de los hallazgos:

## 1. Vulnerabilidad Crítica Nivel de Base de Datos (Ausencia de RLS en Tablas Financieras y Sensibles)
**Severidad**: 🟥 CRÍTICA (Falla Estructural)

### Descripción
El componente central de la seguridad en Supabase es **Row Level Security (RLS)**. Revisando el `schema.sql`, se habilitó RLS únicamente para algunas tablas (`users`, `tasks`, `files`, `follows`, `comments`, `likes`). 
Sin embargo, **no se habilitó RLS** en las tablas más críticas de toda la plataforma:
- `balances` (Saldos)
- `payments` (Pagos)
- `withdrawals` (Retiros)
- `applications` (Postulaciones)
- `disputes` (Disputas)
- `messages` / `direct_messages` (Mensajes)
- `notifications`

### Impacto (Backdoor Directo)
Cualquier usuario, incluso visitantes no registrados, pueden tomar la llave pública (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) visible en el frontend, abrir la consola de su navegador, e inyectar código directamente a la base de datos REST.
**Ejemplo de ataque realizable en 1 minuto:**
```javascript
// Un usuario malicioso podría auto-asignarse millones de dólares ejecutando:
await supabase.from('balances').update({ available_balance: 9999999 }).eq('user_id', 'SU_ID');

// O robar saldo de otra persona:
await supabase.from('withdrawals').insert({ user_id: 'SU_ID', amount: 999, status: 'COMPLETED' });
```
**Solución requerida**: Habilitar RLS (`ALTER TABLE ENABLE ROW LEVEL SECURITY`) en **todas** las tablas y crear políticas estrictas. Por ejemplo, la tabla `balances` solo debería poder ser modificada por el *Service Role* del backend, no por roles anónimos o autenticados en el cliente.

---

## 2. Server Action Administrador Abierta al Público (`resolveDispute`)
**Ubicación**: `actions/disputes.ts` -> `resolveDispute()`
**Severidad**: 🟥 CRÍTICA

### Descripción
La función `resolveDispute` permite resolver una disputa moviendo el dinero retenido (`HELD`) del Escrow directo a los fondos disponibles del especialista (`release`) o retornándolos al cliente (`refund`). 
**El problema:** No hay absolutamente **ninguna verificación** en el código de que quien ejecuta el Server Action sea un administrador, o siquiera que esté logueado. No hay un `supabase.auth.getUser()` que bloquee la ejecución.

### Impacto
Cualquier usuario que inspeccione la red o adivine el endpoint del Server Action, puede pasar el `disputeId` de la base de datos (públicamente obtenible sin RLS) y ejecutar un reembolso (`refund`) o liberación forzosa sobre cualquier disputa ajena.

---

## 3. Discreción de Mensajería Comprometida
**Ubicación**: `actions/messages.ts` -> `getDirectMessages()` y `sendDirectMessage()`
**Severidad**: 🟧 ALTA

### Descripción
En los mensajes directos (DM), la función `getDirectMessages(conversationId)` solicita una conversación desde la base de datos. Sin embargo, en el controlador del backend **no se verifica que el usuario autenticado forme parte de la conversación** (`user.id === user1_id || user.id === user2_id`).

### Impacto
Sumado a que `direct_messages` no tiene RLS que lo impida, cualquier usuario puede enviar un `conversationId` aleatorio y leer el 100% de la historia de los mensajes privados entre otros dos usuarios, e incluso inyectar un mensaje haciéndose pasar por un envío anónimo conectándose directamente.

---

## 4. Fallos menores previstos/Detectados
*   **Gestión de `increaseBounty` MVP:** Tal como observamos antes, la acción artificial actual en `actions/tasks.ts` asume que el backend modificará directamente el saldo sin pasarela. Ahora sabemos cómo modificarla, pero debe estar atado al Webhook para evitar fraude.
*   **Posibles ataques de fuerza bruta:** Las acciones como `cancelTask` o `submitRating` están protegidas contra manipulaciones lógicas de la URL, sin embargo, con RLS ausente, alguien puede enviar calificaciones falsas directo vía REST.

## Conclusión y Próximos Pasos (Urgentes)
El desarrollo actual del software expone los saldos y privacidad a cualquier atacante trivial. 
**Paso Nº 1:** Modificar la base de datos y añadir políticas estrictas en el `schema.sql` de emergencia para cerrar la puerta REST.
**Paso Nº 2:** Reparar y auditar la función global en `actions/disputes.ts` junto a la de `actions/messages.ts`.
