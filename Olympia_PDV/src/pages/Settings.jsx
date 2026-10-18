import { useRef, useState } from 'react'
import { Store, Printer, CreditCard, ShieldAlert, Database, ImagePlus, Download, Upload } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { PAYMENT_METHODS, openSession } from '../store/model'
import { PageHeader, Field, Switch, Segmented, MoneyInput } from '../components/ui'
import { resizeImage } from '../utils/image'
import { printHtml, receiptHtml } from '../utils/print'
import { isoDateInput } from '../utils/format'

export default function SettingsPage() {
  const { db, update, replaceDb, toast, logout } = useStore()
  const [s, setS] = useState(db.settings)
  const logoRef = useRef(null)
  const importRef = useRef(null)
  const set = (k) => (e) => setS((x) => ({ ...x, [k]: e.target.value }))
  const setV = (k) => (v) => setS((x) => ({ ...x, [k]: v }))
  const dirty = JSON.stringify(s) !== JSON.stringify(db.settings)

  function save() {
    if (!s.enabledMethods.length) return toast('Deixe pelo menos uma forma de pagamento ativa.', 'error')
    update((d) => {
      // nextSaleNumber/nextProductCode podem ter mudado desde que a tela abriu.
      d.settings = { ...s, nextSaleNumber: d.settings.nextSaleNumber, nextProductCode: d.settings.nextProductCode }
    })
    toast('Configurações salvas.')
  }

  async function onLogo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const logo = await resizeImage(file, 400, 0.9)
    setS((x) => ({ ...x, logo }))
    e.target.value = ''
  }

  function testPrint() {
    const demo = {
      number: 0, date: new Date().toISOString(), userId: null, customerName: 'Cliente teste', customerPhone: '',
      items: [{ name: 'Produto de teste', variantLabel: 'Preto / M', sku: 'OLY0000-PRE-M', qty: 2, price: 99.9, total: 199.8 }],
      subtotal: 199.8, discount: { type: 'R$', value: 10, amount: 10 }, deliveryFee: 0, total: 189.8,
      payments: [{ method: 'pix', amount: 89.8 }, { method: 'dinheiro', amount: 100, received: 100 }], change: 0, delivery: null, status: 'concluida',
    }
    printHtml(receiptHtml(demo, { ...db, settings: s }), s.receiptWidth, 'Teste de impressão')
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(db)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `olympia-pdv-backup-${isoDateInput()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    toast('Backup baixado.')
  }

  function importBackup(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data.users) || !Array.isArray(data.products) || !data.settings) throw new Error()
        if (!window.confirm('Restaurar este backup? Todos os dados atuais serão substituídos.')) return
        replaceDb(data)
        toast('Backup restaurado.')
        logout()
      } catch {
        toast('Arquivo de backup inválido.', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function clearSales() {
    if (openSession(db)) return toast('Feche o caixa antes.', 'error')
    const typed = window.prompt('Isto apaga TODAS as vendas, caixas e movimentações de estoque (produtos, clientes e usuários ficam). Digite APAGAR para confirmar.')
    if (typed !== 'APAGAR') return
    update((d) => {
      d.sales = []
      d.cashSessions = []
      d.cashMoves = []
      d.stockMoves = []
      d.settings.nextSaleNumber = 1
    })
    toast('Movimentos apagados.')
  }

  function resetAll() {
    const typed = window.prompt('Isto apaga TUDO e volta para a configuração inicial. Faça um backup antes. Digite APAGAR TUDO para confirmar.')
    if (typed !== 'APAGAR TUDO') return
    replaceDb(null)
    logout()
  }

  const toggleMethod = (id) => setS((x) => ({ ...x, enabledMethods: x.enabledMethods.includes(id) ? x.enabledMethods.filter((m) => m !== id) : [...x.enabledMethods, id] }))

  return (
    <div className="page settings">
      <PageHeader
        title="Configurações"
        actions={<button className="btn btn-primary" onClick={save} disabled={!dirty}>Salvar alterações</button>}
      />

      <section className="card pad">
        <h3 className="card-title"><Store size={18} /> Dados da loja (aparecem no cupom)</h3>
        <div className="settings-logo">
          <button type="button" className="photo-drop photo-drop-sm" onClick={() => logoRef.current?.click()}>
            {s.logo ? <img src={s.logo} alt="Logo" /> : (<><ImagePlus size={22} /><span>Logo</span></>)}
          </button>
          <div>
            <p className="muted small">Logo para o cupom (impresso em preto e branco). PNG com fundo branco funciona melhor.</p>
            {s.logo && <button className="btn btn-ghost btn-sm" onClick={() => setS((x) => ({ ...x, logo: null }))}>Remover logo</button>}
          </div>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={onLogo} />
        </div>
        <div className="form-grid">
          <Field label="Nome da loja"><input value={s.storeName} onChange={set('storeName')} /></Field>
          <Field label="Razão social"><input value={s.legalName} onChange={set('legalName')} /></Field>
          <Field label="CNPJ"><input value={s.cnpj} onChange={set('cnpj')} /></Field>
          <Field label="Telefone / WhatsApp"><input value={s.phone} onChange={set('phone')} /></Field>
          <Field label="Instagram"><input value={s.instagram} onChange={set('instagram')} /></Field>
          <Field label="Endereço"><input value={s.address} onChange={set('address')} /></Field>
          <Field label="Mensagem no rodapé do cupom" className="col-span-2"><input value={s.receiptFooter} onChange={set('receiptFooter')} /></Field>
        </div>
      </section>

      <section className="card pad">
        <h3 className="card-title"><Printer size={18} /> Impressão</h3>
        <Field label="Formato do cupom">
          <Segmented value={s.receiptWidth} onChange={setV('receiptWidth')} options={[{ value: '58mm', label: 'Térmica 58mm' }, { value: '80mm', label: 'Térmica 80mm' }, { value: 'A4', label: 'Folha A4' }]} />
        </Field>
        <Switch checked={s.autoPrint} onChange={setV('autoPrint')} label="Imprimir automaticamente ao finalizar a venda" description="O pedido é sempre salvo no histórico; isto só abre a impressão na hora." />
        <Switch checked={s.printDeliveryCopy} onChange={setV('printDeliveryCopy')} label="Imprimir via de entrega junto (vendas com entrega)" />
        <button className="btn btn-outline btn-sm mt" onClick={testPrint}><Printer size={16} /> Imprimir cupom de teste</button>
      </section>

      <section className="card pad">
        <h3 className="card-title"><CreditCard size={18} /> Vendas e pagamentos</h3>
        <Field label="Formas de pagamento aceitas">
          <div className="option-row">
            {PAYMENT_METHODS.map((m) => (
              <button key={m.id} type="button" className={`chip ${s.enabledMethods.includes(m.id) ? 'active' : ''}`} onClick={() => toggleMethod(m.id)}>{m.label}</button>
            ))}
          </div>
        </Field>
        <div className="form-grid">
          <Field label="Máximo de parcelas no crédito">
            <select value={s.maxInstallments} onChange={(e) => setS((x) => ({ ...x, maxInstallments: Number(e.target.value) }))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}x</option>)}
            </select>
          </Field>
          <Field label="Desconto máximo do vendedor (%)" hint="Acima disso, pede senha do administrador.">
            <input inputMode="numeric" value={s.sellerMaxDiscount} onChange={(e) => setS((x) => ({ ...x, sellerMaxDiscount: Number(e.target.value.replace(/\D/g, '')) || 0 }))} />
          </Field>
          <Field label="Taxa de entrega padrão">
            <MoneyInput value={s.defaultDeliveryFee} onChange={setV('defaultDeliveryFee')} />
          </Field>
          <Field label="Alerta de estoque baixo (até quantas peças)">
            <input inputMode="numeric" value={s.lowStockThreshold} onChange={(e) => setS((x) => ({ ...x, lowStockThreshold: Number(e.target.value.replace(/\D/g, '')) || 0 }))} />
          </Field>
        </div>
        <Switch checked={s.allowNegativeStock} onChange={setV('allowNegativeStock')} label="Permitir vender sem estoque" description="Útil se o estoque ainda não foi todo cadastrado. O saldo fica negativo." />
      </section>

      <section className="card pad">
        <h3 className="card-title"><Database size={18} /> Backup dos dados</h3>
        <p className="muted small">
          Os dados ficam salvos neste navegador/computador. Baixe um backup com frequência (ex.: toda semana) e guarde no Google Drive ou pen drive.
        </p>
        <div className="option-row">
          <button className="btn btn-dark" onClick={exportBackup}><Download size={16} /> Baixar backup</button>
          <button className="btn btn-outline" onClick={() => importRef.current?.click()}><Upload size={16} /> Restaurar backup</button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} />
        </div>
      </section>

      <section className="card pad danger-zone">
        <h3 className="card-title"><ShieldAlert size={18} /> Zona de cuidado</h3>
        <div className="option-row">
          <button className="btn btn-ghost btn-danger-text" onClick={clearSales}>Apagar vendas e movimentos (manter cadastros)</button>
          <button className="btn btn-ghost btn-danger-text" onClick={resetAll}>Apagar tudo e recomeçar</button>
        </div>
      </section>
    </div>
  )
}
