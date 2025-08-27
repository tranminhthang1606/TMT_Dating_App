import { FC } from 'react';

interface StructuredDataProps {
  type: 'WebApplication' | 'Organization' | 'WebSite' | 'FAQPage';
  data: any;
}

const StructuredData: FC<StructuredDataProps> = ({ type, data }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default StructuredData;
