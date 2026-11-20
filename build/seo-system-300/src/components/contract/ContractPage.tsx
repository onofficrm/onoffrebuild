import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractWizardView } from './ContractWizardView';
import { ContractDetailView } from './ContractDetailView';
import { ContractCompleteView } from './ContractCompleteView';
import { studentPath } from '../../config/routes';

export type ContractSubTab = 'write' | 'view' | 'complete';

type ContractPageProps = {
  subTab?: ContractSubTab;
};

export const ContractPage: React.FC<ContractPageProps> = ({ subTab = 'write' }) => {
  const navigate = useNavigate();

  if (subTab === 'complete') {
    return <ContractCompleteView />;
  }

  if (subTab === 'view') {
    return <ContractDetailView />;
  }

  return (
    <ContractWizardView
      onSigned={() => {
        navigate(studentPath('contract', 'complete'));
      }}
    />
  );
};

export default ContractPage;
