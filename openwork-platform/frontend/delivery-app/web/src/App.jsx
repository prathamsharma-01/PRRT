import React, { useMemo, useState, useEffect } from 'react'
import { Header, Banner, Footer } from '../../../shared-ui/src/index.jsx'
import LoginCard from '../../../shared-ui/src/LoginCard.jsx'
import Orders from './Orders'
import OrdersPage from './OrdersPage'
import DeliveryMap from './DeliveryMap'

const SAMPLE_ORDERS = [
  { id: 101, customer: 'Asha', address: 'MG Road, Bengaluru', lat: 12.9716, lng: 77.5946 },
  { id: 102, customer: 'Ravi', address: 'Bandra, Mumbai', lat: 19.0544, lng: 72.8408 },
  { id: 103, customer: 'Sima', address: 'Connaught Place, Delhi', lat: 28.6329, lng: 77.2195 }
]

export default function App(){
  // maintain orders in state so Accept can modify status
  const [orders, setOrders] = useState(() => {
    try {
      const raw = window.localStorage.getItem('delivery_orders_v1')
      if (raw) return JSON.parse(raw)
    } catch(e){}
    // initialize with status pending
    return SAMPLE_ORDERS.map(o => ({ ...o, status: 'pending' }))
  })
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  // simple delivery person auth (persisted in localStorage)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('delivery_user')) } catch(e) { return null }
  })

  useEffect(() => {
    try { window.localStorage.setItem('delivery_orders_v1', JSON.stringify(orders)) } catch(e){}
  }, [orders])

  function acceptOrder(orderId){
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted', assignedTo: user ? user.name : 'unknown' } : o))
    setSelectedOrderId(orderId)
  }

  function selectOrder(orderId){
    setSelectedOrderId(orderId)
  }

  return (
    <div>
      <Header />
      <div style={{maxWidth:1100, margin:'0 auto', padding:16}}>
        <Banner />
        {!user ? (
          <div style={{display:'flex', gap:16, marginTop:18}}>
            <div style={{flex:1}}>
              <LoginCard onLogin={(u) => { setUser(u); try { window.localStorage.setItem('delivery_user', JSON.stringify(u)) } catch(e){} }} />
            </div>
          </div>
        ) : (
          <div style={{display:'flex', gap:16, marginTop:18, alignItems:'stretch', position:'relative'}}>
            <div style={{flex:1, minHeight: '72vh', borderRadius:12, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.08)', position:'relative'}}>
              {/* pending orders header */}
              <div style={{position:'absolute', left:12, top:12, zIndex:1200, background:'rgba(255,255,255,0.9)', padding:'8px 12px', borderRadius:8, boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
                <strong>Pending Orders</strong>
                <div style={{fontSize:12, color:'#666'}}>You have {orders.filter(o => o.status === 'pending').length} pending</div>
              </div>
              <DeliveryMap orders={orders} selectedOrderId={selectedOrderId} />
              {/* sticky footer for delivery person */}
              <div style={{position:'absolute', left:12, right:12, bottom:12, zIndex:1200}}>
                <div style={{background:'#fff', padding:12, borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 10px 30px rgba(0,0,0,0.08)'}}>
                  <div>
                    {selectedOrderId ? (
                      (() => { const o = orders.find(x => x.id === selectedOrderId); return o ? (<div><strong>#{o.id}</strong> — {o.customer}<div style={{fontSize:12, color:'#666'}}>{o.address}</div></div>) : null })()
                    ) : (
                      <div style={{color:'#666'}}>No order selected</div>
                    )}
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button style={{background:'#0a7d2f', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8}}>Call</button>
                    <button style={{background:'#ff3b30', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8}}>Mark delivered</button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{width:360, display:'flex', flexDirection:'column', gap:12, height: '72vh'}}>
              <div style={{background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 6px 18px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', flex:1}}>
                <div style={{background:'#12b76a', color:'#fff', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontWeight:700}}>Tasks</div>
                  <div style={{display:'flex', gap:8}}>
                    <button onClick={() => { setUser(null); window.localStorage.removeItem('delivery_user') }} style={{background:'transparent', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', padding:'6px 10px', borderRadius:8}}>Sign out</button>
                  </div>
                </div>
                <div style={{padding:12, overflowY:'auto'}}>
                  <OrdersPage orders={orders} onAccept={acceptOrder} onSelect={selectOrder} selectedOrderId={selectedOrderId} user={user} onMarkDelivered={(id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'delivered' } : o))} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
