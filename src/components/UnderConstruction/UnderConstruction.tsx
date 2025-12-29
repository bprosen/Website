import { Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';

export const UnderConstruction: React.FC = () => {
  return (
    <Card className='shadow-xl'>
      <CardHeader>
        <CardTitle className='text-center text-xl'>Hold on a second!</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-6'>
        <Construction className='w-75 h-75 stroke-caution' />
        <p className='text-lg'>
          This page is under construction, please come back soon
        </p>
      </CardContent>
    </Card>
  );
};
