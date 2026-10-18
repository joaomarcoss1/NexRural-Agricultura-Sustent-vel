import { useEffect, useState } from 'react'
import {
  LayoutDashboard, ShoppingCart, Receipt, Shirt, Boxes, FolderTree, Users, Wallet, UserCog, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { useStore } from './store/StoreContext'
import { can, openSession } from './store/model'
import { Logo } from './components/Logo'
import { Toasts } from './components/ui'
import { initials } from './utils/format'
import Setup from './pages/Setup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pdv from './pages/Pdv'
import Sales from './pages/Sales'
import Products from './pages/Products'
import Stock from './pages/Stock'
import Categories from './pages/Categories'
import Customers from './pages/Customers'
import Cash from './pages/Cash'
import UsersPage from './pages/Users'
import SettingsPage from './pages/Settings'

const ROUTES = [
  { id: 'inicio', label: 'Início', icon: LayoutDashboard, perm: 'dashboard', page: Dashboard },
  { id: 'pdv', label: 'Vender', icon: ShoppingCart, perm: 'pdv', page: Pdv, highlight: true },
  { id: 'vendas', label: 'Vendas', icon: Receipt, perm: 'sales', page: Sales },
  { id: 'caixa', label: 'Caixa', icon: Wallet, perm: 'cash', page: Cash },
  { id: 'produtos', label: 'Produtos', icon: Shirt, perm: 'products.view', page: Products, section: 'Catálogo' },
  { id: 'estoque', label: 'Estoque', icon: Boxes, perm: 'stock.view', page: Stock },
  { id: 'categorias', label: 'Categorias e marcas', icon: FolderTree, perm: 'categories', page: Categories },
  { id: 'clientes', label: 'Clientes', icon: Users, perm: 'customers', page: Customers },
  { id: 'usuarios', label: 'Usuários', icon: UserCog, perm: 'users', page: UsersPage, section: 'Administração' },
  { id: 'config', label: 'Configurações', icon: Settings, perm: 'settings', page: SettingsPage },
]

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'pdv'
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onHash = () => setRoute(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

export const navigate = (id) => {
  window.location.hash = `/${id}`
}

export default function App() {
  const { db, ready, user } = useStore()
  const route = useHashRoute()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [route])

  if (!ready) return <div className="boot"><Logo /></div>
  if (!db || !db.users.length) return (<><Setup /><Toasts /></>)
  if (!user) return (<><Login /><Toasts /></>)

  const allowed = ROUTES.filter((r) => can(user, r.perm))
  const current = allowed.find((r) => r.id === route) || allowed.find((r) => r.id === 'pdv') || allowed[0]
  const Page = current.page
  const session = openSession(db)

  return (
    <div className={`app ${current.id === 'pdv' ? 'app-pdv' : ''}`}>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand-block">
          <Logo />
        </div>
        <nav className="nav">
          {allowed.map((r) => (
            <div key={r.id}>
              {r.section && <div className="nav-section">{r.section}</div>}
              <a href={`#/${r.id}`} className={`nav-item ${current.id === r.id ? 'active' : ''} ${r.highlight ? 'nav-highlight' : ''}`}>
                <r.icon size={19} />
                <span>{r.label}</span>
                {r.id === 'caixa' && <span className={`dot ${session ? 'dot-on' : 'dot-off'}`} title={session ? 'Caixa aberto' : 'Caixa fechado'} />}
              </a>
            </div>
          ))}
        </nav>
        <UserCard />
      </aside>
      {menuOpen && <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />}
      <main className="main">
        <div className="mobile-bar">
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Logo compact />
          <strong className="mobile-title">{current.label}</strong>
        </div>
        <Page key={current.id} />
      </main>
      <Toasts />
    </div>
  )
}

function UserCard() {
  const { user, logout } = useStore()
  return (
    <div className="user-card">
      <div className="avatar">{initials(user.name)}</div>
      <div className="user-meta">
        <strong>{user.name}</strong>
        <span>{user.role === 'admin' ? 'Administrador' : 'Vendedor'}</span>
      </div>
      <button className="icon-btn" onClick={logout} title="Sair / trocar usuário" aria-label="Sair">
        <LogOut size={18} />
      </button>
    </div>
  )
}
