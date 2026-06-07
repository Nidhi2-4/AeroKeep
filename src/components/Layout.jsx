import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed inset-0 drifting-grid z-0 pointer-events-none"></div>
      <Navbar />
      <main className="ml-[240px] flex-1 p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}