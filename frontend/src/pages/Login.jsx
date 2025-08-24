import { useState } from "react"
import api from "../api"

export default function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const submit = async(e)=>{
    e.preventDefault()
    setErr("")
    try{
      const res = await api.post("/token/", { email, password })
      localStorage.setItem("token", res.data.access)
      window.location.href = "/"
    }catch(e){ setErr("Invalid credentials") }
  }
  return (
    <div className="container p-4" style={{maxWidth:440}}>
      <h3>Login</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <a href="/register">Register</a>
    </div>
  )
}