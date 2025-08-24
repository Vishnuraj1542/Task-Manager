import { useEffect, useState } from "react"
import api from "../api"
import { useParams } from "react-router-dom"

export default function TaskDetail(){
  const { id } = useParams()
  const [task,setTask]=useState(null)
  const [docs,setDocs]=useState([])

  const load = async ()=>{
    const t = await api.get(`/tasks/${id}/`)
    setTask(t.data)
    const d = await api.get(`/tasks/${id}/download/`)
    setDocs(d.data)
  }
  useEffect(()=>{ load() },[id])

  const upload = async (e)=>{
    const fd = new FormData()
    for(const f of e.target.files) fd.append("files", f)
    await api.post(`/tasks/${id}/upload/`, fd)
    await load()
  }

  if(!task) return <div className="container p-3">Loading...</div>
  return (
    <div className="container p-3">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Status: {task.status} | Priority: {task.priority} | Due: {task.due_date || "—"}</p>

      <div className="mb-3">
        <label className="form-label">Attach PDFs (max 3)</label>
        <input className="form-control" type="file" accept="application/pdf" multiple onChange={upload}/>
      </div>

      <h6>Documents</h6>
      <ul>
        {docs.map(d=>(
          <li key={d.id}><a href={d.file} target="_blank" rel="noreferrer">Open PDF</a></li>
        ))}
      </ul>

      <a href="/" className="btn btn-secondary mt-3">Back</a>
    </div>
  )
}
