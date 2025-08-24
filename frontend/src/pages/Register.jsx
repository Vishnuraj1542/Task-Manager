import { useState } from "react"
import api from "../api"

export default function Register(){
  const [f, setF] = useState({email:"", username:"", password:""})
  const [msg, setMsg] = useState("")
  const submit = async(e)=>{
    e.preventDefault()
    setMsg("")
    if(!f.email || !f.password) return setMsg("Email & password required")
    await api.post("/users/", {...f, role:"user"})
    setMsg("Registered! Now login.")
  }
  return (
    <div className="container p-4" style={{maxWidth:480}}>
      <h3>Register</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email" value={f.email} onChange={e=>setF({...f, email:e.target.value})}/>
        <input className="form-control mb-2" placeholder="Username" value={f.username} onChange={e=>setF({...f, username:e.target.value})}/>
        <input className="form-control mb-2" type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f, password:e.target.value})}/>
        <button className="btn btn-success w-100">Create</button>
      </form>
      <a href="/login">Back to login</a>
    </div>
  )
}
