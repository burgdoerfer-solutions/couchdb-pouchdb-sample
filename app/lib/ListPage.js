import React from 'react'
import ReactDOM from 'react-dom'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import './shared/index.css'

PouchDB.plugin(PouchDBFind)

const div = document.createElement('div')
document.body.appendChild(div)

const pouchDB = (window.POUCHDB = new PouchDB('my-sample'))

ReactDOM.render(<ListPage />, div)

function ListPage() {
  const [{ isLoading, data, edits }, setState] = React.useState({
    isLoading: true,
    edits: {},
    data: null,
  })

  React.useEffect(() => {
    loadItems().then((data) => {
      setState((state) => ({
        ...state,
        isLoading: false,
        data,
      }))
    })
  }, [])

  React.useEffect(() => {
    setState((state) => ({ ...state, edits: {} }))
  }, [data])

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isLoading ? (
        <h1 className="text-lg">Daten werden geladen ...</h1>
      ) : data ? (
        <>
          <header>
            <button
              type="button"
              className="mr-2"
              onClick={async () => {
                setState((state) => ({ ...state, isLoading: true }))
                await save(edits)
                const data = await loadItems()
                setState((state) => ({
                  ...state,
                  isLoading: false,
                  edits: {},
                  data,
                }))
              }}
            >
              Speichern
            </button>
            <button
              type="button"
              onClick={() => {
                setState((state) => ({ ...state, isLoading: true }))
                pouchDB
                  .sync('http://admin:admin@localhost:8080/couchdb/sample')
                  .then(() => loadItems())
                  .then((data) => {
                    setState((state) => ({ ...state, isLoading: false, data }))
                  })
              }}
            >
              Synchronisieren
            </button>
          </header>
          <main>
            <h1>Zu tun</h1>
            <ul>
              {data.items.map((item) => (
                <li className="max-w-md" key={item._id}>
                  <input
                    className="mt-2"
                    type="text"
                    value={edits[item._id] ?? item.text}
                    onChange={(e) => {
                      setState((state) => ({
                        ...state,
                        edits: { ...state.edits, [item._id]: e.target.value },
                      }))
                    }}
                  />
                </li>
              ))}
            </ul>
          </main>
        </>
      ) : null}
    </div>
  )
}

async function loadItems() {
  const { docs } = await pouchDB.find({ selector: { type: 'sampleitem' } })
  return { items: docs }
}

async function save(edits) {
  for (const [id, text] of Object.entries(edits)) {
    const doc = await pouchDB.get(id)
    doc.text = text
    await pouchDB.put(doc)
  }
}
