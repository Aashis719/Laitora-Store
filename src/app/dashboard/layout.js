'use client'
const layout = ({children}) => {
  return (
    <div>
        <div>THis is the text from layout.js</div>
        <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

export default layout