import { CharacterFormData, Skill, Equipment } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save } from 'lucide-react';

interface CharacterFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CharacterFormData;
  editingCharacter: { id: string; name: string } | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  updateFormField: <K extends keyof CharacterFormData>(field: K, value: CharacterFormData[K]) => void;
  updateStat: (stat: string, value: number) => void;
  updateMentalHealth: (field: string, value: number) => void;
  handleBooleanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhobias: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleManias: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePulpTalents: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addSkill: () => void;
  updateSkill: (index: number, field: keyof Skill, value: string | number) => void;
  removeSkill: (index: number) => void;
  addEquipment: () => void;
  updateEquipment: (index: number, field: keyof Equipment, value: string) => void;
  removeEquipment: (index: number) => void;
}

export function CharacterForm({
  isOpen,
  onClose,
  formData,
  editingCharacter,
  loading,
  onSubmit,
  updateFormField,
  updateStat,
  updateMentalHealth,
  handleBooleanChange,
  handlePhobias,
  handleManias,
  handlePulpTalents,
  addSkill,
  updateSkill,
  removeSkill,
  addEquipment,
  updateEquipment,
  removeEquipment,
}: CharacterFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            {editingCharacter ? `Editar ${editingCharacter.name}` : 'Criar Novo Investigador'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground mb-2">Nome</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-foreground mb-2">Ocupação</label>
              <Input
                type="text"
                value={formData.occupation}
                onChange={(e) => updateFormField('occupation', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-foreground mb-2">URL da Imagem</label>
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => updateFormField('image', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-foreground mb-2">História</label>
            <textarea
              value={formData.background}
              onChange={(e) => updateFormField('background', e.target.value)}
              className="w-full bg-input border border-border rounded-md p-2 text-foreground min-h-[100px] focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          
          {/* Stats */}
          <div>
            <h3 className="text-xl text-primary mb-4">Atributos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.stats).map(([stat, value]) => (
                <div key={stat}>
                  <label className="block text-foreground mb-2">{stat}</label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => updateStat(stat, parseInt(e.target.value))}
                    min={1}
                    max={99}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Health & Sanity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl text-primary mb-4">Saúde</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2">Ferimentos</label>
                  <Input
                    type="number"
                    value={formData.wounds}
                    onChange={(e) => updateFormField('wounds', parseInt(e.target.value))}
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Saúde Máxima</label>
                  <Input
                    type="number"
                    value={formData.maxHealth}
                    onChange={(e) => updateFormField('maxHealth', parseInt(e.target.value))}
                    min={1}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl text-primary mb-4">Sanidade</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2">Sanidade Atual</label>
                  <Input
                    type="number"
                    value={formData.mentalHealth.sanity}
                    onChange={(e) => updateMentalHealth('sanity', parseInt(e.target.value))}
                    min={0}
                    max={99}
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Sanidade Máxima</label>
                  <Input
                    type="number"
                    value={formData.mentalHealth.maxSanity}
                    onChange={(e) => updateMentalHealth('maxSanity', parseInt(e.target.value))}
                    min={1}
                    max={99}
                    required
                  />
                </div>
              </div>
              
              {/* Mental Health Checkboxes */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tempSanity"
                    name="tempSanity"
                    checked={formData.mentalHealth.tempSanity}
                    onChange={handleBooleanChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="tempSanity" className="text-foreground">Insanidade Temporária</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="indefiniteSanity"
                    name="indefiniteSanity"
                    checked={formData.mentalHealth.indefiniteSanity}
                    onChange={handleBooleanChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="indefiniteSanity" className="text-foreground">Insanidade Indefinida</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Phobias and Manias */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground mb-2">Fobias (separadas por vírgula)</label>
              <Input
                type="text"
                value={formData.mentalHealth.phobias.join(', ')}
                onChange={handlePhobias}
                placeholder="ex: Aranhas, Lugares escuros, Fogo"
              />
            </div>
            
            <div>
              <label className="block text-foreground mb-2">Manias (separadas por vírgula)</label>
              <Input
                type="text"
                value={formData.mentalHealth.manias.join(', ')}
                onChange={handleManias}
                placeholder="ex: Limpeza, Colecionismo"
              />
            </div>
          </div>
          
          {/* Skills */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-primary">Habilidades</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Habilidade
              </Button>
            </div>
            
            {formData.skills.map((skill, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-5">
                  <Input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Nome da habilidade"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={skill.value}
                    onChange={(e) => updateSkill(index, 'value', e.target.value)}
                    placeholder="Valor"
                    min={0}
                    max={99}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                    className="w-full bg-input border border-border rounded-md p-2 text-foreground h-10"
                    required
                  >
                    <option value="combat">Combate</option>
                    <option value="academic">Acadêmica</option>
                    <option value="pratical">Prática</option>
                    <option value="social">Social</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Equipment */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-primary">Equipamentos</h3>
              <Button type="button" variant="outline" size="sm" onClick={addEquipment}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Equipamento
              </Button>
            </div>
            
            {formData.equipment.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-4">
                  <Input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                    placeholder="Nome do item"
                    required
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                    placeholder="Descrição"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={item.type}
                    onChange={(e) => updateEquipment(index, 'type', e.target.value)}
                    className="w-full bg-input border border-border rounded-md p-2 text-foreground h-10"
                    required
                  >
                    <option value="weapon">Arma</option>
                    <option value="tool">Ferramenta</option>
                    <option value="book">Livro</option>
                    <option value="artifact">Artefato</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEquipment(index)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pulp Talents */}
          <div>
            <label className="block text-foreground mb-2">Talentos Pulp (separados por vírgula)</label>
            <Input
              type="text"
              value={formData.pulpTalents.join(', ')}
              onChange={handlePulpTalents}
              placeholder="ex: Saque Rápido, Conversa Fiada, Valentão"
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : editingCharacter ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
