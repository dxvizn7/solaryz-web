import { useState } from 'react';
import { Lock, Pencil, Trash2, Power, Plus, X, Check } from 'lucide-react';
import { SolaryzTable, type ColumnDef } from '../../../../components/SolaryzTable';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../types';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

// ── Color swatch ──────────────────────────────────────────────────────────────
function ColorSwatch({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-5 h-5 rounded-full border border-white/10 shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-white/50 text-xs font-mono">{color}</span>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
interface EditModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (name: string, color: string) => Promise<void | Category>;
}

function EditModal({ category, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState(category?.color ?? '#F2910A');
  const [saving, setSaving] = useState(false);

  if (!category) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(name, color);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">Editar Categoria</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F2910A]/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">
              Cor
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#F2910A]/60 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm bg-[#F2910A] text-white font-medium hover:bg-[#F2910A]/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check size={14} />
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => Promise<void | Category>;
}

function CreateModal({ open, onClose, onCreate }: CreateModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#F2910A');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate(name, color);
      setName('');
      setColor('#F2910A');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">Nova Categoria</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pets, Educação…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F2910A]/60 transition-colors placeholder:text-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Cor</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#F2910A]/60 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm bg-[#F2910A] text-white font-medium hover:bg-[#F2910A]/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus size={14} />
              {saving ? 'Criando…' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Confirm Delete ────────────────────────────────────────────────────────────
interface ConfirmDeleteProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function ConfirmDelete({ category, onClose, onConfirm }: ConfirmDeleteProps) {
  const [deleting, setDeleting] = useState(false);

  if (!category) return null;

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-semibold mb-2">Remover categoria</h3>
        <p className="text-white/50 text-sm mb-6">
          Tem certeza que deseja remover <span className="text-white font-medium">"{category.name}"</span>? Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-xl text-sm bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            {deleting ? 'Removendo…' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CategoryManagement() {
  const { categories, isLoading, error, createCategory, updateCategory, toggleActive, removeCategory } =
    useCategories();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const columns: ColumnDef<Category>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (row) => <span className="text-white/30 font-mono text-xs">#{row.id}</span>,
    },
    {
      key: 'name',
      label: 'Nome',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: row.color }}
          />
          <span className={row.is_active ? 'text-white/90' : 'text-white/30 line-through'}>
            {row.name}
          </span>
          {!row.is_active && (
            <span className="text-xs bg-white/5 text-white/30 px-1.5 py-0.5 rounded-full">
              Inativa
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'updated_at',
      label: 'Última alteração',
      render: (row) => (
        <span className="text-white/40 text-xs">{formatDate(row.updated_at)}</span>
      ),
    },
    {
      key: 'color',
      label: 'Cor da categoria',
      render: (row) => <ColorSwatch color={row.color} />,
    },
    {
      key: 'is_default',
      label: 'Responsável',
      render: (row) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${row.is_default
            ? 'bg-white/5 text-white/40'
            : 'bg-[#F2910A]/10 text-[#F2910A]'
            }`}
        >
          {row.is_default ? 'Sistema' : 'Usuário'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-semibold text-xl">Categorias</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Gerencie as categorias de gastos e receitas.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2910A] text-white text-sm font-medium hover:bg-[#F2910A]/90 transition-colors"
        >
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <SolaryzTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="Nenhuma categoria encontrada."
        renderActions={(row) =>
          row.is_default ? (
            <div className="flex items-center justify-end gap-1">
              <span className="text-white/20">
                <Lock size={14} />
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1">
              {/* Toggle ativo/inativo */}
              <button
                onClick={async () => {
                  setTogglingId(row.id);
                  try {
                    await toggleActive(row.id);
                  } finally {
                    setTogglingId(null);
                  }
                }}
                disabled={togglingId === row.id}
                title={row.is_active ? 'Inativar' : 'Ativar'}
                className={`p-1.5 rounded-lg transition-colors ${row.is_active
                  ? 'text-green-400 hover:bg-green-500/10'
                  : 'text-white/30 hover:bg-white/10'
                  } disabled:opacity-40`}
              >
                <Power size={14} />
              </button>

              {/* Editar */}
              <button
                onClick={() => setEditingCategory(row)}
                title="Editar"
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
              >
                <Pencil size={14} />
              </button>

              {/* Remover */}
              <button
                onClick={() => setDeletingCategory(row)}
                title="Remover"
                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        }
      />

      {/* Modais */}
      <EditModal
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={(name, color) => updateCategory(editingCategory!.id, { name, color })}
      />
      <ConfirmDelete
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => removeCategory(deletingCategory!.id)}
      />
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createCategory}
      />
    </div>
  );
}
