import React from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { AstronavaA4ReportTemplate } from './AstronavaA4ReportTemplate';

interface PrintableKundliDossierProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
}

export const PrintableKundliDossier: React.FC<PrintableKundliDossierProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.com',
  servicesLine,
  contactLine,
}) => {
  return (
    <div id="printable-kundli-dossier" className="hidden print:block text-stone-900 bg-white">
      <AstronavaA4ReportTemplate
        kundliData={kundliData}
        brandName={brandName}
        websiteAddress={websiteAddress}
      />
    </div>
  );
};
