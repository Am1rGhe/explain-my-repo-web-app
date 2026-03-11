'use client'
import React, { useState } from "react";

export default function Home(){
  // inputs variables
  const [repoUrl, setRepoUrl] = useState("");
  const [question, setQuestion] = useState("");
  // result 
  const [result , setResult] = useState<string | null>(null);

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const res = await fetch('api/explain',{
      method: "POST",
      headers: {"Content-type" : "application/json"},
      body: JSON.stringify({repoUrl, question})
    });
    const data = await res.json();
    
    // write the result in the result input 
    setResult(JSON.stringify(data,null,2));
  }
  return(
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Test Explain API</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" >Repo URL</label>
          <input type="text" 
            value={repoUrl}
            onChange={(e)=>setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" >Questions</label>
          <textarea 
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          placeholder="What do you want to know"
          className="w-full border rounded px-3 py-2"
          rows={2}
          />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded cursor-pointer border rounded ">
          Send

        </button>
      </form>
      {result && (
        <pre className="mt-4 p-4 bg-zinc-400 rounded text-sm overflow-auto">
          {result}
        </pre>
      )}


    </div>
  )
}