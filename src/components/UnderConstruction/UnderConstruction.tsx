import { Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';

export const UnderConstruction: React.FC = () => {
  return (
    <Card className='shadow-xl'>
      <CardHeader>
        <CardTitle className='text-center text-3xl'>
          Hold on a second!
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4'>
        <Construction color='#e4ec75' size={350} strokeWidth={1.2} />
        <p className='text-lg'>
          This page is under construction, check back soon
        </p>
      </CardContent>
    </Card>
  );
};
