import { useInvestigation } from '@/hooks/useInvestigation';
import { CasePanel, EvidenceMap } from '@/features/investigation';

const InvestigationPage = () => {
  const {
    caseDetails,
    nodes,
    isEditing,
    setNodes,
    updateCase,
    toggleEditing,
    saveCase
  } = useInvestigation();

  return (
    <div className="space-y-8 animate-fade-in">
      <CasePanel 
        caseDetails={caseDetails}
        isEditing={isEditing}
        onUpdate={updateCase}
        onToggleEdit={toggleEditing}
        onSave={saveCase}
      />

      <EvidenceMap 
        nodes={nodes} 
        setNodes={setNodes} 
        lastUpdated={caseDetails.date}
      />
    </div>
  );
};

export default InvestigationPage;
