import React from 'react'

function openGoogleMapsDirections(lat, lng){
  if (!lat || !lng) return
  // try to get current location
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos => {
      const origin = `${pos.coords.latitude},${pos.coords.longitude}`
      const dest = `${lat},${lng}`
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`
      window.open(url, '_blank')
    }, err => {
      // fallback: open maps with destination only (device will use current location)
      const dest = `${lat},${lng}`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`
      window.open(url, '_blank')
    })
  } else {
    const dest = `${lat},${lng}`
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`
    window.open(url, '_blank')
  }
}

export default function Orders({ orders = [], onAccept = ()=>{}, onSelect = ()=>{}, selectedOrderId = null, compact = false }){
  if (orders.length === 0) return <div style={{padding:12}}>No pending orders</div>
  return (
    <div style={{display:'flex', flexDirection:'column', gap:8}}>
      {orders.map(o => (
        <div key={o.id} onClick={() => onSelect(o.id)} style={{background:'#fff', padding:12, borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow: o.id === selectedOrderId ? '0 8px 20px rgba(0,0,0,0.08)' : 'none', borderLeft: o.id === selectedOrderId ? '4px solid #12b76a' : '4px solid transparent', cursor:'pointer'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <strong>#{o.id}</strong> — {o.customer}
                <div style={{fontSize:12, color:'#666', marginTop:6}}>{o.address}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12, color: o.status === 'accepted' ? '#0a7d2f' : '#ff8a65'}}>{o.status === 'accepted' ? 'Accepted' : 'Pending'}</div>
                <div style={{fontSize:11, color:'#999', marginTop:6}}>ETA: 20-30 min</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:8, marginLeft:12}}>
            {o.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); onAccept(o.id) }} style={{background:'#0a7d2f', color:'#fff', border:'none', padding:'8px 10px', borderRadius:6}}>Accept</button>}
            <button onClick={(e) => { e.stopPropagation(); openGoogleMapsDirections(o.lat, o.lng) }} style={{background:'#fff', color:'#ff3b30', border:'1px solid #ff3b30', padding:'8px 10px', borderRadius:6}}>Navigate</button>
          </div>
        </div>
      ))}
    </div>
  )
}
