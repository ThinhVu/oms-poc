## Concept

Publisher: 
Each store will have 1 exchange define by store_id.
Message will be publish to specified topic and broadcast to every queue which listen to this topic

Consumer: 
Each device will create 1 queue "{store_id}.{device_id}" which listen specified topic (order, reservation, setting, ...) in store.


Example:

Publisher:
publish exchange, topic, data

publish 's1', 'order', { action: 'create', data: {...} }
publish 's1', 'order', { action: 'cancel', data: {...} }
publish 's1', 'order', { action: 'updateOrderStatus', data: {...} }

Consumer:
consume exchange, queue, topic, data

consume 's1', 's1.pos1', 'order', { action: 'updateOrderStatus', data: {...} }
consume 's1', 's1.gsms1', 'order', { action: 'updateOrderStatus', data: {...} }
consume 's1', 's1.loyalty1', 'order', { action: 'updateOrderStatus', data: {...} }
consume 's1', 's1.delivery', 'order', { action: 'updateOrderStatus', data: {...} }

