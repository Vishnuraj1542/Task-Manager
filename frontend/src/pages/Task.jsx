import { useEffect, useState } from "react"
import api from "../api"
import { Link } from "react-router-dom"

export default function Tasks(){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  const [q,setQ]=useState({status:"",priority:"",ordering:"due_date"})

  const load=async()=>{
    setLoading(true)
    const p = new URLSearchParams()
    if(q.status) p.append("status", q.status)
    if(q.priority) p.append("priority", q.priority)
    if(q.ordering) p.append("ordering", q.ordering)
    const res = await api.get(`/tasks/?${p.toString()}`)
    setItems(res.data.results || res.data)
    setLoading(false)
  }
  useEffect(()=>{ load() }, [q])

  return (
    <div className="container p-3">
      <div className="d-flex gap-2 mb-3">
        <select className="form-select" value={q.status} onChange={e=>setQ({...q,status:e.target.value})}>
          <option value="">All status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="form-select" value={q.priority} onChange={e=>setQ({...q,priority:e.target.value})}>
          <option value="">All priority</option>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <select className="form-select" value={q.ordering} onChange={e=>setQ({...q,ordering:e.target.value})}>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="-created_at">Newest</option>
        </select>
        <a className="btn btn-outline-secondary" onClick={()=>{localStorage.removeItem("token"); location.href="/login"}}>Logout</a>
      </div>

      {loading? <div>Loading...</div> :
        <div className="list-group">
          {items.map(t=>
            <Link key={t.id} to={`/tasks/${t.id}`} className="list-group-item list-group-item-action">
              <b>{t.title}</b> — {t.status} · {t.priority} · due {t.due_date || "—"}
            </Link>
          )}
        </div>}
    </div>
  )
}
