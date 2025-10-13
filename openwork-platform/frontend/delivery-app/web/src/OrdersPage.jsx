import React, { useState, useMemo } from 'react'
import Orders from './Orders'

export default function OrdersPage({ orders = [], onAccept = ()=>{}, onSelect = ()=>{}, selectedOrderId = null, user = null, onMarkDelivered = ()=>{} }){
  const [filter, setFilter] = useState('pending') // 'pending' | 'assigned' | 'delivered' | 'all'

  const counts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    assigned: orders.filter(o => o.status === 'accepted' || o.assignedTo).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    all: orders.length
  }), [orders])

  const filtered = useMemo(() => {
    if (filter === 'all') return orders
    if (filter === 'pending') return orders.filter(o => o.status === 'pending')
    if (filter === 'assigned') return orders.filter(o => o.status === 'accepted' || o.assignedTo)
    if (filter === 'delivered') return orders.filter(o => o.status === 'delivered')
    return orders
  }, [orders, filter])

  return (
    <div style={{display:'flex', flexDirection:'column', gap:10}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => setFilter('pending')} style={{padding:'6px 10px', borderRadius:8, background: filter==='pending' ? '#f0fdf4' : 'transparent', border: '1px solid #e6f4ea'}}>
            Pending ({counts.pending})
          </button>
          <button onClick={() => setFilter('assigned')} style={{padding:'6px 10px', borderRadius:8, background: filter==='assigned' ? '#fff7ed' : 'transparent', border: '1px solid #fde8d7'}}>
            Assigned ({counts.assigned})
          </button>
          <button onClick={() => setFilter('delivered')} style={{padding:'6px 10px', borderRadius:8, background: filter==='delivered' ? '#eef2ff' : 'transparent', border: '1px solid #e7e8ff'}}>
            Delivered ({counts.delivered})
          </button>
        </div>
        <div style={{fontSize:12, color:'#666'}}>Total: {counts.all}</div>
      </div>

      <div>
        <Orders orders={filtered} onAccept={onAccept} onSelect={onSelect} selectedOrderId={selectedOrderId} compact />
      </div>

      {filter === 'assigned' && selectedOrderId && (
        <div style={{marginTop:8}}>
          <button onClick={() => onMarkDelivered(selectedOrderId)} style={{background:'#0a7d2f', color:'#fff', padding:'8px 12px', borderRadius:8}}>Mark selected delivered</button>
        </div>
      )}
    </div>
  )
}
